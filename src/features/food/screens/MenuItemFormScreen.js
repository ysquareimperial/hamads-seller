import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Switch, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ErrorState } from '@/components/ui/ErrorState';
import { IconButton } from '@/components/ui/IconButton';
import { LoadingView } from '@/components/ui/LoadingView';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SelectField } from '@/components/ui/SelectField';
import { TextField } from '@/components/ui/TextField';
import { FOOD_PREP_MAX, FOOD_PREP_MIN } from '@/config';
import { useBusinessStore } from '@/store/businessStore';
import { useRefreshStore } from '@/store/refreshStore';
import { colors } from '@/theme';
import { getErrorMessage } from '@/utils/getErrorMessage';

import { SinglePhotoPicker } from '../components/SinglePhotoPicker';
import { foodItemCache } from '../foodCache';
import { useFoodCategories } from '../hooks/useFoodCategories';
import { foodVendorService } from '../services/foodVendorService';
import { styles } from './MenuItemFormScreen.styles';

const EMPTY = { name: '', description: '', category: null, price: '', prepMinutes: '', isAvailable: true, photo: null };

const fromItem = (item) => ({
    name: item.name,
    description: item.description ?? '',
    category: item.category,
    price: String(Number(item.price)),
    prepMinutes: item.prep_minutes ? String(item.prep_minutes) : '',
    isAvailable: item.is_available,
    photo: item.image_url ? { uri: item.image_url, kind: 'existing' } : null,
});

const cleanMoney = (text) => {
    const stripped = text.replace(/[^\d.]/g, '');
    const [whole, ...rest] = stripped.split('.');
    return rest.length ? `${whole}.${rest.join('').slice(0, 2)}` : whole;
};

export function MenuItemFormScreen() {
    const { id } = useLocalSearchParams();
    const isEdit = !!id;
    const vendor = useBusinessStore((s) => s.vendor);
    const bumpFoodItems = useRefreshStore((s) => s.bumpFoodItems);
    const { categories } = useFoodCategories();
    const cached = isEdit ? foodItemCache.get(id) : null;

    const [startValues] = useState(() => (cached ? fromItem(cached) : EMPTY));
    const initial = useRef(startValues);
    const [values, setValues] = useState(startValues);
    const [loading, setLoading] = useState(isEdit && !cached);
    const [loadError, setLoadError] = useState(null);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // No single-item endpoint: fall back to the list when opened without a cached row.
    useEffect(() => {
        if (!isEdit || cached) return undefined;
        let active = true;
        foodVendorService.listItems().then((list) => {
            if (!active) return;
            foodItemCache.put(list);
            const item = list.find((i) => i.id === id);
            if (item) {
                initial.current = fromItem(item);
                setValues(initial.current);
            }
            else setLoadError('This item no longer exists.');
        }).catch((e) => active && setLoadError(getErrorMessage(e))).finally(() => active && setLoading(false));
        return () => {
            active = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const setField = (key) => (value) => {
        const next = key === 'price' ? cleanMoney(value) : key === 'prepMinutes' ? value.replace(/\D/g, '') : value;
        setValues((v) => ({ ...v, [key]: next }));
        if (errors[key]) setErrors((e) => ({ ...e, [key]: null }));
    };

    const validate = () => {
        const prep = values.prepMinutes === '' ? null : Number(values.prepMinutes);
        const next = {
            name: values.name.trim().length < 2 ? 'Enter the item name.' : null,
            category: !values.category ? 'Choose a category.' : null,
            price: !(Number(values.price) > 0) ? 'Enter a price greater than 0.' : null,
            prepMinutes: prep !== null && (prep < FOOD_PREP_MIN || prep > FOOD_PREP_MAX) ? `Enter ${FOOD_PREP_MIN}–${FOOD_PREP_MAX} minutes, or leave blank.` : null,
        };
        setErrors(next);
        return !Object.values(next).some(Boolean);
    };

    const imageKey = async () => (values.photo?.kind === 'new' ? foodVendorService.uploadItemImage(values.photo) : undefined);

    const save = async () => {
        if (saving) return;
        setSubmitError(null);
        if (!validate()) return;
        setSaving(true);
        try {
            const prep = values.prepMinutes === '' ? null : Number(values.prepMinutes);
            let saved;
            if (!isEdit) {
                const key = await imageKey();
                saved = await foodVendorService.createItem({
                    name: values.name.trim(),
                    description: values.description.trim() || null,
                    category: values.category,
                    price: values.price,
                    prep_minutes: prep,
                    is_available: values.isAvailable,
                    ...(key ? { image_key: key } : {}),
                });
            }
            else {
                const was = initial.current;
                const p = {};
                if (values.name.trim() !== was.name) p.name = values.name.trim();
                if (values.description.trim() !== was.description) p.description = values.description.trim() || null;
                if (values.category !== was.category) p.category = values.category;
                if (values.price !== was.price) p.price = values.price;
                if (values.prepMinutes !== was.prepMinutes) p.prep_minutes = prep;
                if (values.isAvailable !== was.isAvailable) p.is_available = values.isAvailable;
                if (values.photo?.uri !== was.photo?.uri) p.image_key = values.photo ? await imageKey() : null;
                saved = Object.keys(p).length ? await foodVendorService.updateItem(id, p) : null;
            }
            if (saved) {
                foodItemCache.put([saved]);
                bumpFoodItems();
            }
            router.back();
        }
        catch (error) {
            setSubmitError(getErrorMessage(error));
        }
        finally {
            setSaving(false);
        }
    };

    const confirmDelete = () => {
        Alert.alert('Delete item?', 'It will be removed from your menu.', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    setDeleting(true);
                    try {
                        await foodVendorService.deleteItem(id);
                        foodItemCache.remove(id);
                        bumpFoodItems();
                        router.back();
                    }
                    catch (e) {
                        setSubmitError(getErrorMessage(e));
                    }
                    finally {
                        setDeleting(false);
                    }
                },
            },
        ]);
    };

    const busy = saving || deleting;
    const header = (<ScreenHeader title={isEdit ? 'Edit item' : 'New menu item'} right={isEdit ? <IconButton icon="trash-outline" accessibilityLabel="Delete item" onPress={confirmDelete}/> : null}/>);

    if (loading || loadError) {
        return (<SafeScreen edges={['top', 'bottom']}>
        {header}
        {loading ? <LoadingView /> : <ErrorState message={loadError}/>}
      </SafeScreen>);
    }

    return (<SafeScreen edges={['top', 'bottom']}>
      {header}
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Card>
            <SinglePhotoPicker value={values.photo} onChange={setField('photo')} hint="A clear, bright photo sells food best." disabled={busy}/>
          </Card>

          <Card>
            <TextField label="Item name" placeholder="e.g. Jollof rice with chicken" autoCapitalize="sentences" maxLength={150} value={values.name} onChangeText={setField('name')} error={errors.name} editable={!busy}/>
            <TextField label="Description (optional)" placeholder="Portion size, sides, spice level…" autoCapitalize="sentences" multiline maxLength={1000} value={values.description} onChangeText={setField('description')} editable={!busy}/>
            <SelectField label="Category" placeholder="Choose a category" options={categories.map((c) => ({ value: c.key, label: c.label }))} value={values.category} onChange={setField('category')} error={errors.category} disabled={busy}/>
          </Card>

          <Card>
            <View style={styles.row}>
              <View style={styles.rowItem}>
                <TextField label="Price" prefix="₦" placeholder="0" keyboardType="decimal-pad" value={values.price} onChangeText={setField('price')} error={errors.price} editable={!busy}/>
              </View>
              <View style={styles.rowItem}>
                <TextField label="Prep time (min)" placeholder={String(vendor?.default_prep_minutes ?? 20)} keyboardType="number-pad" maxLength={3} value={values.prepMinutes} onChangeText={setField('prepMinutes')} error={errors.prepMinutes} editable={!busy}/>
              </View>
            </View>
            <Text style={styles.hint}>{`Leave prep time blank to use your shop default (${vendor?.default_prep_minutes ?? 20} min).`}</Text>
          </Card>

          <Card>
            <View style={styles.switchRow}>
              <View style={styles.switchText}>
                <Text style={styles.cardTitle}>Available now</Text>
                <Text style={styles.hint}>Turn off when it sells out. You can switch it from the menu too.</Text>
              </View>
              <Switch value={values.isAvailable} onValueChange={setField('isAvailable')} disabled={busy} trackColor={{ true: colors.primary, false: colors.border }} thumbColor={colors.surface}/>
            </View>
          </Card>

          <ErrorMessage message={submitError}/>
        </ScrollView>
        <View style={styles.footer}>
          <Button title={isEdit ? 'Save changes' : 'Add to menu'} onPress={save} loading={saving} disabled={deleting}/>
        </View>
      </KeyboardAvoidingView>
    </SafeScreen>);
}
