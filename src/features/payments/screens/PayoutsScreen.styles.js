import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, radius, shadows, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    list: { padding: spacing.lg, flexGrow: 1 },
    sep: { height: spacing.md },
    card: { gap: 4, padding: spacing.lg, backgroundColor: colors.surface, borderRadius: radius.lg, ...shadows.card },
    top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    amount: { ...typography.heading, color: colors.text },
    meta: { ...typography.caption, color: colors.textMuted },
    failure: { ...typography.caption, color: colors.danger },
    link: { ...typography.bodyStrong, fontSize: 14, color: colors.primary, marginTop: spacing.xs },
}));
