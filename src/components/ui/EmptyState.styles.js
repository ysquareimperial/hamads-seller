import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, radius, shadows, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    container: { alignItems: 'center', justifyContent: 'center', padding: spacing.xxl, gap: spacing.sm },
    iconTile: {
        width: 68,
        height: 68,
        borderRadius: radius.xl,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface,
        marginBottom: spacing.sm,
        ...shadows.card,
    },
    title: { ...typography.heading, fontSize: 18, color: colors.text, textAlign: 'center' },
    message: { ...typography.subtitle, color: colors.textMuted, textAlign: 'center' },
    action: { alignSelf: 'stretch', marginTop: spacing.lg },
}));
