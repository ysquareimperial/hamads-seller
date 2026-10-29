import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, radius, shadows, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    container: { gap: spacing.xs, marginBottom: spacing.lg },
    logo: {
        width: 52,
        height: 52,
        borderRadius: radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        marginBottom: spacing.sm,
        ...shadows.button,
    },
    title: { ...typography.title, color: colors.text },
    subtitle: { ...typography.subtitle, color: colors.textMuted },
}));
