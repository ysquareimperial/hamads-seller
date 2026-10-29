import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, radius, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    card: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg, borderRadius: radius.lg },
    open: { backgroundColor: colors.successSoft },
    closed: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
    dot: { width: 12, height: 12, borderRadius: 6 },
    dotOpen: { backgroundColor: colors.success },
    dotClosed: { backgroundColor: colors.disabled },
    text: { flex: 1, gap: 2 },
    title: { ...typography.section, color: colors.text },
    subtitle: { ...typography.caption, color: colors.textMuted },
}));
