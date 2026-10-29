import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/theme';

import { OptionSheet } from './OptionSheet';
import { styles } from './TextField.styles';
import { styles as own } from './SelectField.styles';

/**
 * Looks like a TextField; opens an OptionSheet. options: [{ value, label }].
 * Pass `allowClear` to offer a "None" row for optional fields.
 */
export function SelectField({ label, value, options, onChange, placeholder = 'Select', error, hint, searchable, allowClear = false, disabled = false }) {
    const [open, setOpen] = useState(false);
    const selected = options.find((o) => o.value === value);
    return (<View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={label} disabled={disabled} onPress={() => setOpen(true)} style={[styles.field, !!error && styles.errored, disabled && own.disabled]}>
        <Text style={[own.value, !selected && own.placeholder]} numberOfLines={1}>
          {selected?.label ?? placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.textMuted}/>
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
      <OptionSheet visible={open} title={label} options={allowClear ? [{ value: null, label: 'None' }, ...options] : options} selected={value} searchable={searchable ?? options.length > 8} onSelect={(v) => {
            onChange(v);
            setOpen(false);
        }} onClose={() => setOpen(false)}/>
    </View>);
}
