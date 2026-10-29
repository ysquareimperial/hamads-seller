import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { colors } from '@/theme';

import { styles } from './Button.styles';

/** variant: primary | secondary | danger. `icon` is an Ionicons name. */
export function Button({ title, onPress, variant = 'primary', loading = false, disabled = false, icon, compact = false }) {
    const inactive = disabled || loading;
    const filled = variant === 'primary' || variant === 'danger';
    const tint = filled ? colors.textOnPrimary : colors.text;
    return (<Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityState={{ disabled: inactive, busy: loading }} disabled={inactive} onPress={onPress} style={({ pressed }) => [
            styles.base,
            compact && styles.compact,
            styles[variant],
            pressed && styles.pressed,
            inactive && (filled ? styles.disabled : styles.disabledSecondary),
        ]}>
      {loading ? (<ActivityIndicator color={filled ? colors.textOnPrimary : colors.primary}/>) : (<View style={styles.content}>
          {icon ? <Ionicons name={icon} size={18} color={tint}/> : null}
          <Text style={[styles.label, filled ? styles.labelFilled : styles.labelSecondary]}>{title}</Text>
        </View>)}
    </Pressable>);
}
