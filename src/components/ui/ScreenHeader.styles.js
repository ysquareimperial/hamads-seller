import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, shadows, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        gap: spacing.md,
        minHeight: 56,
    },
    back: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface,
        ...shadows.card,
    },
    titles: { flex: 1 },
    title: { ...typography.heading, color: colors.text },
    subtitle: { ...typography.caption, color: colors.textMuted },
    right: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
}));
