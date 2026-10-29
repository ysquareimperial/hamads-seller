import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, radius, shadows, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    card: {
        gap: spacing.md,
        padding: spacing.lg,
        backgroundColor: colors.surface,
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.card,
    },
    inactive: { opacity: 0.55, borderStyle: 'dashed', borderColor: colors.primary, shadowOpacity: 0, elevation: 0 },
    pressed: { opacity: 0.85 },
    top: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    iconTile: {
        width: 52,
        height: 52,
        borderRadius: radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primarySoft,
    },
    iconTileActive: { backgroundColor: colors.primary },
    titles: { flex: 1, gap: 2 },
    kind: { ...typography.label, color: colors.primary },
    title: { ...typography.heading, color: colors.text },
    tagline: { ...typography.caption, color: colors.textMuted },
    footer: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.sm },
    highlight: { ...typography.bodyStrong, color: colors.text },
    setup: { paddingTop: spacing.xs },
    setupText: { ...typography.bodyStrong, color: colors.primary },
}));
