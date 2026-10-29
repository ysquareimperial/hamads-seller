import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, radius, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    card: { gap: spacing.sm, padding: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
    cardError: { borderColor: colors.danger },
    off: { opacity: 0.6 },
    top: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    label: { flex: 1, ...typography.bodyStrong, color: colors.text },
    offText: { ...typography.caption, color: colors.textMuted },
    fields: { flexDirection: 'row', gap: spacing.sm },
    field: { flex: 1, gap: 2 },
    fieldLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.4, color: colors.textMuted },
    input: {
        minHeight: 40,
        paddingHorizontal: spacing.sm,
        borderRadius: radius.sm,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.background,
        ...typography.body,
        fontSize: 15,
        color: colors.text,
    },
    error: { ...typography.caption, color: colors.danger },
}));
