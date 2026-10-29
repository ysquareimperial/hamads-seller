import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, radius, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    flex: { flex: 1 },
    scroll: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
    introTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    introIcon: { width: 44, height: 44, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
    introText: { flex: 1, ...typography.bodyStrong, color: colors.text },
    point: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
    pointText: { flex: 1, ...typography.caption, color: colors.textMuted },
    cardTitle: { ...typography.section, color: colors.text },
    locate: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        padding: spacing.md,
        borderRadius: radius.md,
        backgroundColor: colors.primarySoft,
    },
    locatePinned: { backgroundColor: colors.successSoft },
    locateText: { flex: 1, gap: 2 },
    locateTitle: { ...typography.bodyStrong, color: colors.primary },
    locateTitlePinned: { color: colors.success },
    locateHint: { ...typography.caption, color: colors.textMuted },
    hint: { ...typography.caption, color: colors.textMuted },
    footer: { padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.background },
}));
