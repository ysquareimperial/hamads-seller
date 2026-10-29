import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, radius, shadows, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    track: {
        flexDirection: 'row',
        padding: spacing.xs,
        borderRadius: radius.lg,
        backgroundColor: colors.primarySoft,
        marginBottom: spacing.lg,
    },
    tab: {
        flex: 1,
        minHeight: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius.md,
    },
    tabActive: { backgroundColor: colors.surface, ...shadows.card },
    label: { ...typography.button, fontSize: 15, color: colors.textMuted },
    labelActive: { color: colors.text },
}));
