import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { colors } from '@/theme';

import { styles } from './TextField.styles';

export function TextField({ label, error, hint, prefix, isPassword = false, onFocus, onBlur, ...inputProps }) {
    const [focused, setFocused] = useState(false);
    const [hidden, setHidden] = useState(true);
    const multiline = !!inputProps.multiline;
    return (<View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.field, multiline && styles.fieldMultiline, focused && styles.focused, !!error && styles.errored]}>
        {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}
        <TextInput {...inputProps} accessibilityLabel={label} placeholderTextColor={colors.disabled} secureTextEntry={isPassword && hidden} autoCapitalize={inputProps.autoCapitalize ?? 'none'} textAlignVertical={multiline ? 'top' : 'center'} onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
        }} onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
        }} style={[styles.input, multiline && styles.inputMultiline]}/>
        {isPassword ? (<Pressable accessibilityRole="button" accessibilityLabel={hidden ? 'Show password' : 'Hide password'} hitSlop={12} onPress={() => setHidden((h) => !h)} style={styles.toggle}>
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.textMuted}/>
          </Pressable>) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>);
}
