import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';

import { useRefreshStore } from '@/store/refreshStore';
import { getErrorMessage } from '@/utils/getErrorMessage';

import { productCache } from '../productCache';
import { keyFromImageUrl, uploadProductImages } from '../services/imageUpload';
import { productService } from '../services/productService';
import { categoryOptions } from '../utils/productStatus';
import { buildRows, fromServerVariants, MAX_VARIANTS, optionNamesOf, variantInput, variantPatch } from '../utils/variants';

const EMPTY = {
    name: '',
    description: '',
    categoryId: null,
    brandId: null,
    price: '',
    compareAt: '',
    stock: '',
    tags: [],
    isActive: true,
    images: [],
    hasVariants: false,
    options: [{ name: '', values: [] }],
    rowsByKey: {},
};

const toMoneyInput = (v) => (v === null || v === undefined || v === '' ? '' : String(Number(v)));
/** Keeps digits and one dot; strips commas/spaces typed by the user. */
const cleanMoney = (text) => {
    const stripped = text.replace(/[^\d.]/g, '');
    const [whole, ...rest] = stripped.split('.');
    return rest.length ? `${whole}.${rest.join('').slice(0, 2)}` : whole;
};

const fromProduct = (product, detail) => {
    const variants = detail?.variants ?? [];
    const names = detail?.option_names ?? product?.option_names ?? [];
    const hasVariants = !!(detail?.has_variants ?? product?.has_variants) && names.length > 0;
    const v = hasVariants ? fromServerVariants(names, variants) : { options: [{ name: '', values: [] }], rowsByKey: {} };
    return {
    hasVariants,
    options: v.options,
    rowsByKey: v.rowsByKey,
    name: detail?.name ?? product?.name ?? '',
    description: detail?.description ?? '',
    categoryId: detail?.category_id ?? null,
    brandId: detail?.brand_id ?? null,
    price: toMoneyInput(detail?.price ?? product?.price),
    compareAt: toMoneyInput(detail?.compare_at_price ?? product?.compare_at_price),
    stock: String(detail?.stock_quantity ?? product?.stock_quantity ?? ''),
    tags: detail?.tag_names ?? [],
    isActive: product?.is_active ?? true,
    images: (detail?.image_urls ?? product?.image_urls ?? []).map((uri, i) => ({ id: `existing-${i}`, uri, kind: 'existing' })),
    };
};

const sameImages = (a, b) => a.length === b.length && a.every((img, i) => img.uri === b[i].uri);
const sameTags = (a, b) => a.length === b.length && a.every((t, i) => t === b[i]);

export function useProductForm(productId) {
    const isEdit = !!productId;
    const cached = isEdit ? productCache.get(productId) : null;
    const bumpProducts = useRefreshStore((s) => s.bumpProducts);

    // Edit always waits for the seller detail (variants, category, tags); the cached row only fills the header.
    const [startValues] = useState(EMPTY);
    const [values, setValues] = useState(startValues);
    const initial = useRef(startValues);
    const [product, setProduct] = useState(cached);
    const [lookups, setLookups] = useState({ categories: [], brands: [], tags: [] });
    const [loading, setLoading] = useState(isEdit);
    const [loadError, setLoadError] = useState(null);
    // Option names can only be set while a product has no variants on the server.
    const [variantsLocked, setVariantsLocked] = useState(false);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [progress, setProgress] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const inFlight = useRef(false);

    useEffect(() => {
        let active = true;
        Promise.allSettled([productService.categories(), productService.brands(), productService.popularTags()]).then(([c, b, t]) => {
            if (!active) return;
            setLookups({
                categories: c.status === 'fulfilled' ? c.value : [],
                brands: b.status === 'fulfilled' ? b.value : [],
                tags: t.status === 'fulfilled' ? t.value : [],
            });
        });
        if (isEdit) {
            productService.get(productId).then((detail) => {
                if (!active) return;
                // The detail has no is_active/is_approved; those come from the list row.
                const base = { ...detail, ...(cached ?? {}) };
                const next = fromProduct(base, detail);
                initial.current = next;
                setValues(next);
                setVariantsLocked(next.hasVariants);
                setProduct((p) => p ?? { ...detail, is_active: true, is_approved: false });
            }).catch((error) => {
                if (active) setLoadError(getErrorMessage(error));
            }).finally(() => {
                if (active) setLoading(false);
            });
        }
        return () => {
            active = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId]);

    const setField = (key) => (value) => {
        const next = key === 'price' || key === 'compareAt' ? cleanMoney(value) : key === 'stock' ? value.replace(/\D/g, '') : value;
        setValues((v) => ({ ...v, [key]: next }));
        if (errors[key]) setErrors((e) => ({ ...e, [key]: null }));
    };

    const rows = useMemo(() => (values.hasVariants ? buildRows(values.options, values.rowsByKey) : []), [values.hasVariants, values.options, values.rowsByKey]);

    /** Edits one variant row (kept by key, so values survive option changes). */
    const setRow = (key, patch) => {
        setValues((v) => {
            const current = v.rowsByKey[key] ?? rows.find((r) => r.key === key);
            return { ...v, rowsByKey: { ...v.rowsByKey, [key]: { ...current, ...patch } } };
        });
        if (errors.rows?.[key]) setErrors((e) => ({ ...e, rows: { ...e.rows, [key]: null } }));
    };

    /** "Apply to all" for price or stock across every row that's on. */
    const applyToAll = (field, value) => {
        setValues((v) => {
            const next = { ...v.rowsByKey };
            rows.filter((r) => r.isActive).forEach((r) => {
                next[r.key] = { ...(v.rowsByKey[r.key] ?? r), [field]: value };
            });
            return { ...v, rowsByKey: next };
        });
        setErrors((e) => ({ ...e, rows: {} }));
    };

    const validate = () => {
        const price = Number(values.price);
        const hasBase = values.price !== '' && price > 0;
        const compare = values.compareAt === '' ? null : Number(values.compareAt);
        const next = {
            name: values.name.trim().length < 2 ? 'Enter a product name (at least 2 characters).' : null,
            categoryId: !values.categoryId ? 'Choose a category.' : null,
            price: !values.price || !(price > 0) ? (values.hasVariants ? 'Enter a base price greater than 0.' : 'Enter a price greater than 0.') : null,
            // With variants, compare-at lives on each variant (the API rejects it on the product).
            compareAt: !values.hasVariants && compare !== null && !(hasBase && compare > price) ? 'Must be higher than the selling price, or leave blank.' : null,
            stock: !values.hasVariants && values.stock === '' ? 'Enter how many you have in stock.' : null,
            images: values.images.length === 0 ? 'Add at least one photo.' : null,
            options: null,
            rows: {},
        };
        if (values.hasVariants) {
            const names = optionNamesOf(values.options);
            const filled = values.options.filter((o) => o.name.trim() || o.values.length);
            if (!names.length) next.options = 'Name at least one option, e.g. Size.';
            else if (filled.some((o) => !o.name.trim() || !o.values.length)) next.options = 'Each option needs a name and at least one value.';
            else if (new Set(names.map((n) => n.toLowerCase())).size !== names.length) next.options = 'Option names must be different.';
            else if (rows.length > MAX_VARIANTS) next.options = `That makes ${rows.length} combinations. The limit is ${MAX_VARIANTS}.`;
            else if (!rows.some((r) => r.isActive)) next.options = 'Turn on at least one variant.';
            rows.filter((r) => r.isActive).forEach((r) => {
                if (r.stock === '') next.rows[r.key] = 'Enter stock.';
                else if (!r.price && !hasBase) next.rows[r.key] = 'Enter a price, or set a base price above.';
                else if (r.price && !(Number(r.price) > 0)) next.rows[r.key] = 'Price must be greater than 0.';
                else if (r.compareAt && !(Number(r.compareAt) > Number(r.price || values.price))) next.rows[r.key] = 'Compare-at must be higher than the price, or leave it blank.';
            });
        }
        setErrors(next);
        const { rows: rowErrors, ...rest } = next;
        return !Object.values(rest).some(Boolean) && !Object.values(rowErrors).some(Boolean);
    };

    const buildImageKeys = async () => {
        const fresh = values.images.filter((img) => img.kind === 'new');
        if (fresh.length) setProgress({ done: 0, total: fresh.length });
        const keys = await uploadProductImages(fresh, (done, total) => setProgress({ done, total }));
        let k = 0;
        return values.images.map((img) => (img.kind === 'new' ? keys[k++] : keyFromImageUrl(img.uri)));
    };

    const createPayload = async () => ({
        name: values.name.trim(),
        description: values.description.trim() || null,
        category_id: values.categoryId,
        brand_id: values.brandId,
        price: values.price,
        ...(values.hasVariants ? {
            option_names: optionNamesOf(values.options),
            variants: rows.filter((r) => r.isActive).map(variantInput),
        } : { compare_at_price: values.compareAt || null, stock_quantity: Number(values.stock) }),
        image_keys: await buildImageKeys(),
        tag_names: values.tags,
    });

    /** Brings server variants in line with the rows: set options, add, change, remove. */
    const syncVariants = async () => {
        const was = initial.current;
        if (!values.hasVariants) return;
        if (!was.hasVariants) await productService.setOptions(productId, optionNamesOf(values.options));
        const keep = new Set();
        for (const row of rows) {
            if (row.id) {
                keep.add(row.id);
                const patch = variantPatch(row);
                if (Object.keys(patch).length) await productService.updateVariant(productId, row.id, patch);
            }
            else if (row.isActive) {
                await productService.addVariant(productId, variantInput(row));
            }
        }
        // Combinations whose values were removed from the options.
        const removed = Object.values(was.rowsByKey).filter((r) => r.id && r.isActive && !keep.has(r.id));
        for (const r of removed) await productService.removeVariant(productId, r.id);
    };

    /** Only changed fields, so PATCH leaves the rest untouched. */
    const updatePayload = async () => {
        const was = initial.current;
        const p = {};
        if (values.name.trim() !== was.name) p.name = values.name.trim();
        if (values.description.trim() !== was.description) p.description = values.description.trim() || null;
        if (values.categoryId && values.categoryId !== was.categoryId) p.category_id = values.categoryId;
        if (values.brandId !== was.brandId) p.brand_id = values.brandId;
        if (values.price !== was.price && values.price) p.price = values.price;
        if (!values.hasVariants && values.compareAt !== was.compareAt) p.compare_at_price = values.compareAt || null;
        if (!values.hasVariants && values.stock !== was.stock) p.stock_quantity = Number(values.stock);
        if (!sameTags(values.tags, was.tags)) p.tag_names = values.tags;
        if (values.isActive !== was.isActive) p.is_active = values.isActive;
        if (!sameImages(values.images, was.images)) p.image_keys = await buildImageKeys();
        return p;
    };

    const save = async () => {
        if (inFlight.current) return;
        setSubmitError(null);
        if (!validate()) return;
        inFlight.current = true;
        setSaving(true);
        try {
            if (isEdit) {
                const payload = await updatePayload();
                if (Object.keys(payload).length > 0) {
                    const updated = await productService.update(productId, payload);
                    productCache.put([updated]);
                }
                await syncVariants();
            }
            else {
                const created = await productService.create(await createPayload());
                productCache.put([created]);
            }
            bumpProducts();
            router.back();
        }
        catch (error) {
            setSubmitError(getErrorMessage(error));
        }
        finally {
            inFlight.current = false;
            setSaving(false);
            setProgress(null);
        }
    };

    const confirmDelete = () => {
        Alert.alert('Delete product?', 'It will be removed from your store. This cannot be undone.', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    setDeleting(true);
                    try {
                        await productService.remove(productId);
                        productCache.remove(productId);
                        bumpProducts();
                        router.back();
                    }
                    catch (error) {
                        setSubmitError(getErrorMessage(error));
                    }
                    finally {
                        setDeleting(false);
                    }
                },
            },
        ]);
    };

    const options = useMemo(() => ({
        categories: categoryOptions(lookups.categories),
        brands: lookups.brands.map((b) => ({ value: b.id, label: b.name })).sort((a, b) => a.label.localeCompare(b.label)),
    }), [lookups]);

    const saveLabel = progress ? `Uploading photos ${progress.done}/${progress.total}…` : isEdit ? 'Save changes' : 'Submit for review';

    return {
        isEdit,
        product,
        values,
        setField,
        errors,
        submitError,
        options,
        suggestions: lookups.tags,
        loading,
        loadError,
        rows,
        setRow,
        applyToAll,
        variantsLocked,
        saving,
        saveLabel,
        save,
        deleting,
        confirmDelete,
    };
}
