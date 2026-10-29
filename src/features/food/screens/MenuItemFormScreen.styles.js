import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    flex: { flex: 1 },
    scroll: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
    row: { flexDirection: 'row', gap: spacing.md },
    rowItem: { flex: 1 },
    hint: { ...typography.caption, color: colors.textMuted },
    cardTitle: { ...typography.section, color: colors.text },
    switchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    switchText: { flex: 1, gap: 2 },
    footer: { padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.background },
}));
