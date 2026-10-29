import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, radius, shadows, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        padding: spacing.md,
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        ...shadows.card,
    },
    pressed: { opacity: 0.85 },
    thumb: {
        width: 72,
        height: 72,
        borderRadius: radius.md,
        overflow: 'hidden',
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: { width: '100%', height: '100%' },
    body: { flex: 1, gap: 4 },
    name: { ...typography.bodyStrong, color: colors.text },
    priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm },
    price: { ...typography.price, color: colors.text },
    compare: { ...typography.caption, color: colors.textMuted, textDecorationLine: 'line-through' },
    metaRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.sm },
    meta: { ...typography.caption, color: colors.textMuted },
    metaDanger: { color: colors.danger, fontWeight: '600' },
}));
