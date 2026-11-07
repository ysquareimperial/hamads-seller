import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, radius, shadows, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    scroll: { padding: spacing.lg, gap: spacing.lg },
    intro: { ...typography.subtitle, color: colors.textMuted },
    options: { gap: spacing.md },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        padding: spacing.lg,
        borderRadius: radius.lg,
        borderWidth: 1.5,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },
    selected: { borderColor: colors.primary, ...shadows.card },
    icon: { width: 44, height: 44, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft },
    iconSelected: { backgroundColor: colors.primary },
    text: { flex: 1, gap: 2 },
    title: { ...typography.bodyStrong, color: colors.text },
    body: { ...typography.caption, color: colors.textMuted },
}));
