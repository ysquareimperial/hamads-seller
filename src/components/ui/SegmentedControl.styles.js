import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, radius, shadows, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    container: { gap: 6 },
    title: { ...typography.label, color: colors.textMuted },
    track: {
        flexDirection: 'row',
        padding: spacing.xs,
        borderRadius: radius.lg,
        backgroundColor: colors.primarySoft,
    },
    trackError: { borderWidth: 1, borderColor: colors.danger },
    option: {
        flex: 1,
        minHeight: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius.md,
    },
    optionSelected: { backgroundColor: colors.surface, ...shadows.card },
    label: { ...typography.bodyStrong, fontSize: 14, color: colors.textMuted },
    labelSelected: { color: colors.text },
    error: { ...typography.caption, color: colors.danger },
}));
