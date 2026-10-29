import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    value: { flex: 1, ...typography.body, color: colors.text },
    placeholder: { color: colors.disabled },
    disabled: { opacity: 0.6 },
}));
