import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, radius, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    wrapper: { gap: 6 },
    label: { ...typography.label, color: colors.textMuted },
    field: {
        minHeight: 48,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: spacing.sm,
        padding: spacing.sm,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        borderRadius: radius.pill,
        backgroundColor: colors.primarySoft,
    },
    tagText: { ...typography.caption, fontWeight: '600', color: colors.primary },
    input: { flexGrow: 1, minWidth: 120, ...typography.body, color: colors.text, paddingVertical: 6 },
    suggestions: { gap: spacing.sm },
    suggestion: {
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },
    suggestionText: { ...typography.caption, color: colors.textMuted },
    hint: { ...typography.caption, color: colors.textMuted },
}));
