import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, radius, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    box: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.sm,
        padding: spacing.md,
        borderRadius: radius.md,
    },
    warning: { backgroundColor: colors.warningSoft },
    info: { backgroundColor: colors.primarySoft },
    success: { backgroundColor: colors.successSoft },
    body: { flex: 1, gap: 2 },
    title: { ...typography.bodyStrong, color: colors.text },
    text: { ...typography.caption, color: colors.text },
}));
