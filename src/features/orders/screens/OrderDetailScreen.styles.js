import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    scroll: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
    statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    total: { ...typography.heading, color: colors.text },
    cardTitle: { ...typography.section, color: colors.text },
    tracking: { gap: 2, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
    trackingText: { ...typography.caption, color: colors.text },
    itemRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
    itemBorder: { borderTopWidth: 1, borderTopColor: colors.border },
    itemText: { flex: 1, gap: 2 },
    itemName: { ...typography.bodyStrong, color: colors.text },
    variant: { ...typography.caption, color: colors.primary, fontWeight: '600' },
    itemMeta: { ...typography.caption, color: colors.textMuted },
    itemTotal: { ...typography.bodyStrong, color: colors.text },
    subtotalLabel: { flex: 1, ...typography.bodyStrong, color: colors.textMuted },
    subtotal: { ...typography.price, color: colors.text },
    recipient: { ...typography.bodyStrong, color: colors.text },
    address: { ...typography.subtitle, color: colors.textMuted },
    call: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingTop: spacing.sm },
    callText: { ...typography.bodyStrong, color: colors.primary },
    footer: {
        padding: spacing.lg,
        gap: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.background,
    },
}));
