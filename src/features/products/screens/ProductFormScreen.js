import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ErrorState } from '@/components/ui/ErrorState';
import { IconButton } from '@/components/ui/IconButton';
import { LoadingView } from '@/components/ui/LoadingView';
import { NoticeBanner } from '@/components/ui/NoticeBanner';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SelectField } from '@/components/ui/SelectField';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TextField } from '@/components/ui/TextField';
import { colors } from '@/theme';

import { ImagePickerGrid } from '../components/ImagePickerGrid';
import { OptionsEditor } from '../components/OptionsEditor';
import { VariantRow } from '../components/VariantRow';
import { TagInput } from '../components/TagInput';
import { useProductForm } from '../hooks/useProductForm';
import { productStatus } from '../utils/productStatus';
import { styles } from './ProductFormScreen.styles';

export function ProductFormScreen() {
    const { id } = useLocalSearchParams();
    const form = useProductForm(id);
    const { values, setField, errors } = form;
    const busy = form.saving || form.deleting;

    const header = (<ScreenHeader title={form.isEdit ? 'Edit product' : 'New product'} right={form.isEdit ? (<IconButton icon="trash-outline" accessibilityLabel="Delete product" onPress={form.confirmDelete}/>) : null}/>);

    if (form.loading) {
        return (<SafeScreen edges={['top', 'bottom']}>
        {header}
        <LoadingView />
      </SafeScreen>);
    }
    if (form.loadError) {
        return (<SafeScreen edges={['top', 'bottom']}>
        {header}
        <ErrorState message={form.loadError}/>
      </SafeScreen>);
    }

    const status = form.product ? productStatus(form.product) : null;

    return (<SafeScreen edges={['top', 'bottom']}>
      {header}
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {!form.isEdit ? (<NoticeBanner tone="info" message="New products are reviewed by Hamads before they appear in the store."/>) : null}
          {form.isEdit && status ? (<View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Status</Text>
              <StatusBadge text={status.label} tone={status.tone}/>
            </View>) : null}

          <Card>
            <ImagePickerGrid images={values.images} onChange={setField('images')} error={errors.images} disabled={busy}/>
          </Card>

          <Card>
            <Text style={styles.cardTitle}>Details</Text>
            <TextField label="Product name" placeholder="e.g. Premium Ankara fabric, 6 yards" autoCapitalize="sentences" maxLength={200} value={values.name} onChangeText={setField('name')} error={errors.name} editable={!busy}/>
            <TextField label="Description" placeholder="Material, size, colours, what's in the box…" autoCapitalize="sentences" multiline maxLength={5000} value={values.description} onChangeText={setField('description')} editable={!busy}/>
            <SelectField label="Category" placeholder="Choose a category" options={form.options.categories} value={values.categoryId} onChange={setField('categoryId')} error={errors.categoryId} disabled={busy}/>
            <SelectField label="Brand (optional)" placeholder="No brand" options={form.options.brands} value={values.brandId} onChange={setField('brandId')} allowClear disabled={busy}/>
          </Card>

          <Card>
            <View style={styles.switchRow}>
              <View style={styles.switchText}>
                <Text style={styles.cardTitle}>Options & variants</Text>
                <Text style={styles.hint}>{form.variantsLocked ? 'This product has options. Each variant has its own price and stock.' : 'Turn on if it comes in sizes, colours or other choices.'}</Text>
              </View>
              <Switch accessibilityLabel="Has options" value={values.hasVariants} onValueChange={setField('hasVariants')} disabled={busy || form.variantsLocked} trackColor={{ true: colors.primary, false: colors.border }} thumbColor={colors.surface}/>
            </View>
            {values.hasVariants ? (<OptionsEditor options={values.options} onChange={setField('options')} namesLocked={form.variantsLocked} editable={!busy} error={errors.options}/>) : null}
          </Card>

          <Card>
            <Text style={styles.cardTitle}>{values.hasVariants ? 'Pricing' : 'Pricing & stock'}</Text>
            {values.hasVariants ? (<TextField label="Base price" prefix="₦" placeholder="0" keyboardType="decimal-pad" value={values.price} onChangeText={setField('price')} error={errors.price} editable={!busy}/>) : (<View style={styles.row}>
                <View style={styles.rowItem}>
                  <TextField label="Price" prefix="₦" placeholder="0" keyboardType="decimal-pad" value={values.price} onChangeText={setField('price')} error={errors.price} editable={!busy}/>
                </View>
                <View style={styles.rowItem}>
                  <TextField label="Compare-at price" prefix="₦" placeholder="Optional" keyboardType="decimal-pad" value={values.compareAt} onChangeText={setField('compareAt')} error={errors.compareAt} editable={!busy}/>
                </View>
              </View>)}
            <Text style={styles.hint}>{values.hasVariants ? 'Used for any variant without its own price. Set compare-at (crossed-out) prices on each variant below.' : 'Compare-at shows as a crossed-out original price.'}</Text>
            {!values.hasVariants ? (<TextField label="Quantity in stock" placeholder="0" keyboardType="number-pad" value={values.stock} onChangeText={setField('stock')} error={errors.stock} editable={!busy}/>) : null}
          </Card>

          {values.hasVariants && form.rows.length ? (<Card>
              <View style={styles.variantsTop}>
                <Text style={styles.cardTitle}>{`Variants (${form.rows.filter((r) => r.isActive).length})`}</Text>
                <Text style={styles.hint}>{`${form.rows.filter((r) => r.isActive).reduce((n, r) => n + (Number(r.stock) || 0), 0)} in stock`}</Text>
              </View>
              <BulkApply onApply={form.applyToAll} disabled={busy}/>
              {form.rows.map((row) => (<VariantRow key={row.key} row={row} onChange={form.setRow} basePrice={values.price} error={errors.rows?.[row.key]} editable={!busy}/>))}
            </Card>) : null}

          <Card>
            <TagInput tags={values.tags} onChange={setField('tags')} suggestions={form.suggestions} editable={!busy}/>
          </Card>

          {form.isEdit ? (<Card>
              <View style={styles.switchRow}>
                <View style={styles.switchText}>
                  <Text style={styles.cardTitle}>Show in store</Text>
                  <Text style={styles.hint}>Turn off to hide this product without deleting it.</Text>
                </View>
                <Switch value={values.isActive} onValueChange={setField('isActive')} disabled={busy} trackColor={{ true: colors.primary, false: colors.border }} thumbColor={colors.surface}/>
              </View>
            </Card>) : null}

          <ErrorMessage message={form.submitError}/>
        </ScrollView>
        <View style={styles.footer}>
          <Button title={form.saveLabel} onPress={form.save} loading={form.saving && !form.saveLabel.startsWith('Uploading')} disabled={busy}/>
        </View>
      </KeyboardAvoidingView>
    </SafeScreen>);
}

/** Fill price, compare-at or stock on every variant at once. */
function BulkApply({ onApply, disabled }) {
    return (<View style={styles.bulk}>
      <BulkField field="price" placeholder="Price for all" money onApply={onApply} disabled={disabled}/>
      <BulkField field="compareAt" placeholder="Compare-at for all" money onApply={onApply} disabled={disabled}/>
      <BulkField field="stock" placeholder="Stock for all" onApply={onApply} disabled={disabled}/>
    </View>);
}

function BulkField({ field, placeholder, money = false, onApply, disabled }) {
    const [value, setValue] = useState('');
    return (<View style={styles.bulkField}>
      <TextInput value={value} onChangeText={(t) => setValue(money ? t.replace(/[^\d.]/g, '') : t.replace(/\D/g, ''))} keyboardType={money ? 'decimal-pad' : 'number-pad'} placeholder={placeholder} placeholderTextColor={colors.disabled} editable={!disabled} style={styles.bulkInput}/>
      <Pressable accessibilityRole="button" disabled={disabled || !value} onPress={() => onApply(field, value)} style={styles.bulkButton}>
        <Text style={styles.bulkButtonText}>Apply</Text>
      </Pressable>
    </View>);
}
