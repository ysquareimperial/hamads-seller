import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, radius, shadows, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    card: {
        gap: 6,
        padding: spacing.lg,
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: 'transparent',
        ...shadows.card,
    },
    cardNew: { borderColor: colors.warning },
    pressed: { opacity: 0.85 },
    top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    id: { ...typography.bodyStrong, color: colors.textMuted },
    customer: { ...typography.section, color: colors.text },
    items: { ...typography.caption, color: colors.textMuted },
    bottom: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.xs },
    fulfil: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: radius.pill,
        backgroundColor: colors.primarySoft,
    },
    fulfilText: { fontSize: 12, fontWeight: '700', color: colors.primary },
    time: { flex: 1, ...typography.caption, color: colors.textMuted },
    total: { ...typography.price, color: colors.text },
}));
