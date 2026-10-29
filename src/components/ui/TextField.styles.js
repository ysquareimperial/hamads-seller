import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, radius, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    wrapper: { gap: 6 },
    label: { ...typography.label, color: colors.textMuted },
    field: {
        minHeight: 48,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        paddingHorizontal: spacing.lg,
        gap: spacing.sm,
    },
    fieldMultiline: { alignItems: 'flex-start', paddingVertical: spacing.sm },
    focused: { borderColor: colors.borderFocus, borderWidth: 1.5 },
    errored: { borderColor: colors.danger },
    prefix: { ...typography.body, fontWeight: '700', color: colors.text },
    input: {
        flex: 1,
        ...typography.body,
        color: colors.text,
        paddingVertical: spacing.sm,
        includeFontPadding: false,
    },
    inputMultiline: { minHeight: 110 },
    toggle: { padding: spacing.xs },
    error: { ...typography.caption, color: colors.danger },
    hint: { ...typography.caption, color: colors.textMuted },
}));
