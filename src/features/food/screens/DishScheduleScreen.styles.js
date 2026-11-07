import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, radius, shadows, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    flex: { flex: 1 },
    scroll: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
    cardTitle: { ...typography.section, color: colors.text },
    label: { ...typography.label, color: colors.textMuted },
    hint: { ...typography.caption, color: colors.textMuted },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    row: { flexDirection: 'row', gap: spacing.md },
    rowItem: { flex: 1 },
    dateRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.md },
    dateLabel: { width: 96, ...typography.bodyStrong, color: colors.text, paddingBottom: spacing.md },
    dateInput: { flex: 1 },
    section: { gap: spacing.sm },
    dayRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        padding: spacing.lg,
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        ...shadows.card,
    },
    dayName: { width: 90, ...typography.bodyStrong, color: colors.text },
    dayStats: { flex: 1, gap: 2 },
    dayStat: { ...typography.caption, color: colors.textMuted },
    change: { ...typography.bodyStrong, fontSize: 14, color: colors.primary },
}));
