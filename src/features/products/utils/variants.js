export const MAX_OPTIONS = 3;
export const MAX_VARIANTS = 100;

/** Stable key for one combination, in option-name order: "Size=42|Color=Black". */
export const comboKey = (options, names) => names.map((n) => `${n}=${options[n] ?? ''}`).join('|');

export const comboLabel = (options, names) => names.map((n) => options[n]).join(' / ');

/** Every combination of the option values, e.g. 2 sizes × 3 colours = 6 option maps. */
export function cartesian(options) {
    const usable = options.filter((o) => o.name.trim() && o.values.length);
    if (!usable.length) return [];
    return usable.reduce((acc, opt) => acc.flatMap((combo) => opt.values.map((v) => ({ ...combo, [opt.name.trim()]: v }))), [{}]);
}

export const optionNamesOf = (options) => options.map((o) => o.name.trim()).filter(Boolean);

export const emptyRow = (options) => ({ id: null, options, price: '', compareAt: '', stock: '', sku: '', isActive: true });

/** Rows to show: one per combination, reusing what the seller already typed or what the server has. */
export function buildRows(options, rowsByKey) {
    const names = optionNamesOf(options);
    return cartesian(options).map((combo) => {
        const key = comboKey(combo, names);
        return { key, label: comboLabel(combo, names), ...(rowsByKey[key] ?? emptyRow(combo)), options: combo };
    });
}

const money = (v) => (v === null || v === undefined || v === '' ? '' : String(Number(v)));

/** Server variants -> { options, rowsByKey } for the form. Option values are the union across all variants. */
export function fromServerVariants(optionNames, variants) {
    const options = optionNames.map((name) => ({
        name,
        values: [...new Set(variants.map((v) => v.options?.[name]).filter(Boolean))],
    }));
    const rowsByKey = {};
    variants.forEach((v) => {
        rowsByKey[comboKey(v.options, optionNames)] = {
            id: v.id,
            options: v.options,
            price: money(v.price),
            compareAt: money(v.compare_at_price),
            stock: String(v.stock_quantity ?? ''),
            sku: v.sku ?? '',
            isActive: v.is_active,
            original: v,
        };
    });
    return { options, rowsByKey };
}

/** Payload for POST .../variants or an entry in ProductCreateRequest.variants. */
export const variantInput = (row) => ({
    options: row.options,
    stock_quantity: Number(row.stock),
    ...(row.price ? { price: row.price } : {}),
    ...(row.compareAt ? { compare_at_price: row.compareAt } : {}),
    ...(row.sku.trim() ? { sku: row.sku.trim() } : {}),
});

/** Changed fields only, for PATCH .../variants/{id}. */
export function variantPatch(row) {
    const o = row.original;
    const p = {};
    if (row.price !== money(o.price) && row.price) p.price = row.price;
    if (row.compareAt !== money(o.compare_at_price)) p.compare_at_price = row.compareAt || null;
    if (row.stock !== String(o.stock_quantity)) p.stock_quantity = Number(row.stock);
    if (row.sku.trim() !== (o.sku ?? '')) p.sku = row.sku.trim() || null;
    if (row.isActive !== o.is_active) p.is_active = row.isActive;
    return p;
}
