import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, radius, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    container: { gap: spacing.md, marginBottom: spacing.lg },
    top: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    back: { padding: spacing.xs, marginLeft: -spacing.xs },
    count: { ...typography.label, color: colors.textMuted },
    bars: { flexDirection: 'row', gap: spacing.sm },
    bar: { flex: 1, height: 4, borderRadius: radius.pill, backgroundColor: colors.border },
    barDone: { backgroundColor: colors.primary },
}));
