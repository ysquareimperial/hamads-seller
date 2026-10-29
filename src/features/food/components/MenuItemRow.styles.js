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
    unavailable: { opacity: 0.6 },
    pressed: { opacity: 0.85 },
    thumb: {
        width: 64,
        height: 64,
        borderRadius: radius.md,
        overflow: 'hidden',
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: { width: '100%', height: '100%' },
    body: { flex: 1, gap: 2 },
    name: { ...typography.bodyStrong, color: colors.text },
    price: { ...typography.price, color: colors.text },
    meta: { ...typography.caption, color: colors.textMuted },
}));
