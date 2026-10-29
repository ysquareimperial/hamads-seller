import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
    },
    headerText: { flex: 1 },
    hello: { ...typography.caption, color: colors.textMuted },
    store: { ...typography.title, fontSize: 24, color: colors.text },
    kind: { ...typography.label, color: colors.primary },
    scroll: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
    actions: { flexDirection: 'row', gap: spacing.md },
    action: { flex: 1 },
    section: { gap: spacing.md },
}));
