import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, radius, shadows, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        padding: spacing.lg,
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        ...shadows.card,
    },
    pressed: { opacity: 0.85 },
    iconTile: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primarySoft,
    },
    body: { flex: 1, gap: 4 },
    top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
    id: { ...typography.bodyStrong, color: colors.text },
    meta: { ...typography.caption, color: colors.textMuted },
    total: { ...typography.price, color: colors.text },
}));
