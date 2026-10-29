import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
    headerText: { flex: 1 },
    kind: { ...typography.label, color: colors.primary },
    shop: { ...typography.title, fontSize: 24, color: colors.text },
    scroll: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
    actions: { flexDirection: 'row', gap: spacing.md },
    action: { flex: 1 },
    section: { gap: spacing.md },
}));
