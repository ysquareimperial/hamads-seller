import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, radius, shadows, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    base: {
        minHeight: 54,
        borderRadius: radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    compact: { minHeight: 44, borderRadius: radius.md, paddingHorizontal: spacing.lg },
    content: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    primary: { backgroundColor: colors.primary, ...shadows.button },
    danger: { backgroundColor: colors.danger },
    secondary: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    pressed: { opacity: 0.85 },
    disabled: { backgroundColor: colors.disabled, shadowOpacity: 0, elevation: 0 },
    disabledSecondary: { opacity: 0.5 },
    label: { ...typography.button },
    labelFilled: { color: colors.textOnPrimary },
    labelSecondary: { color: colors.text },
}));
