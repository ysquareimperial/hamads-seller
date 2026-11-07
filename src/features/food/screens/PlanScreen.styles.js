import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, radius, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    scroll: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl, flexGrow: 1 },
    hint: { ...typography.caption, color: colors.textMuted },
    dayTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    day: { ...typography.section, color: colors.text },
    count: { ...typography.bodyStrong, color: colors.primary },
    items: { gap: 2 },
    item: { ...typography.body, color: colors.text },
    windows: { gap: spacing.sm },
    window: { gap: 2, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.primarySoft },
    windowLabel: { ...typography.bodyStrong, color: colors.primary },
    windowCount: { ...typography.caption, color: colors.text },
    windowItems: { ...typography.caption, color: colors.textMuted },
}));
