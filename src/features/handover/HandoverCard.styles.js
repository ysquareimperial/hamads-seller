import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, radius, shadows, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    card: { gap: spacing.sm, padding: spacing.lg, backgroundColor: colors.surface, borderRadius: radius.lg, ...shadows.card },
    top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
    title: { ...typography.section, color: colors.text },
    orderLink: { flexDirection: 'row', alignItems: 'center', gap: 2 },
    order: { ...typography.bodyStrong, color: colors.text },
    meta: { ...typography.caption, color: colors.textMuted },
    methodRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
    method: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: spacing.md,
        paddingVertical: 4,
        borderRadius: radius.pill,
        backgroundColor: colors.primarySoft,
    },
    methodText: { ...typography.caption, fontWeight: '700', color: colors.primary },
    fee: { ...typography.caption, color: colors.textMuted },
    instruction: { ...typography.subtitle, color: colors.text },
    call: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    callText: { ...typography.bodyStrong, fontSize: 14, color: colors.primary },
}));
