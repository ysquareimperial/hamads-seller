import { Switch, Text, TextInput, View } from 'react-native';

import { colors } from '@/theme';

import { styles } from './VariantRow.styles';

const cleanMoney = (text) => {
    const stripped = text.replace(/[^\d.]/g, '');
    const [whole, ...rest] = stripped.split('.');
    return rest.length ? `${whole}.${rest.join('').slice(0, 2)}` : whole;
};

/** One combination: price, stock, SKU, and on/off. */
export function VariantRow({ row, onChange, basePrice, error, editable = true }) {
    const set = (patch) => onChange(row.key, patch);
    return (<View style={[styles.card, !row.isActive && styles.off, !!error && styles.cardError]}>
      <View style={styles.top}>
        <Text style={styles.label} numberOfLines={1}>{row.label}</Text>
        {row.id && !row.isActive ? <Text style={styles.offText}>Off</Text> : null}
        <Switch accessibilityLabel={`${row.label} on sale`} value={row.isActive} onValueChange={(isActive) => set({ isActive })} disabled={!editable} trackColor={{ true: colors.primary, false: colors.border }} thumbColor={colors.surface}/>
      </View>
      {row.isActive ? (<>
          <View style={styles.fields}>
            <Field label="PRICE ₦" value={row.price} onChangeText={(t) => set({ price: cleanMoney(t) })} keyboardType="decimal-pad" placeholder={basePrice ? String(basePrice) : '0'} editable={editable}/>
            <Field label="COMPARE-AT ₦" value={row.compareAt} onChangeText={(t) => set({ compareAt: cleanMoney(t) })} keyboardType="decimal-pad" placeholder="Optional" editable={editable}/>
          </View>
          <View style={styles.fields}>
            <Field label="STOCK" value={row.stock} onChangeText={(t) => set({ stock: t.replace(/\D/g, '') })} keyboardType="number-pad" placeholder="0" editable={editable}/>
            <Field label="SKU" value={row.sku} onChangeText={(sku) => set({ sku })} autoCapitalize="characters" placeholder="Optional" maxLength={80} editable={editable}/>
          </View>
        </>) : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>);
}

function Field({ label, ...input }) {
    return (<View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput {...input} placeholderTextColor={colors.disabled} style={styles.input}/>
    </View>);
}
