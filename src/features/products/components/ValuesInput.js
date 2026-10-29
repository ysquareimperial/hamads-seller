import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { colors } from '@/theme';

import { styles } from './TagInput.styles';

/** Chips for option values (keeps case). Comma or return adds; tap a chip to remove it. */
export function ValuesInput({ values, onChange, placeholder, editable = true, lockedValues = [] }) {
    const [draft, setDraft] = useState('');
    const add = (raw) => {
        const parts = raw.split(',').map((p) => p.trim()).filter(Boolean);
        const next = [...values];
        parts.forEach((p) => {
            if (!next.some((v) => v.toLowerCase() === p.toLowerCase())) next.push(p);
        });
        if (next.length !== values.length) onChange(next);
        setDraft('');
    };
    return (<View style={styles.field}>
      {values.map((v) => {
            const locked = lockedValues.includes(v);
            return (<Pressable key={v} accessibilityRole="button" accessibilityLabel={locked ? v : `Remove ${v}`} disabled={!editable} onPress={() => onChange(values.filter((x) => x !== v))} style={styles.tag}>
            <Text style={styles.tagText}>{v}</Text>
            <Ionicons name="close" size={14} color={colors.primary}/>
          </Pressable>);
        })}
      <TextInput value={draft} onChangeText={(t) => (t.includes(',') ? add(t) : setDraft(t))} onSubmitEditing={() => add(draft)} onBlur={() => draft && add(draft)} blurOnSubmit={false} editable={editable} placeholder={values.length ? 'Add another' : placeholder} placeholderTextColor={colors.disabled} returnKeyType="done" style={styles.input}/>
    </View>);
}
