import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, radius, shadows, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    card: { gap: spacing.sm, padding: spacing.lg, backgroundColor: colors.surface, borderRadius: radius.xl, ...shadows.card },
    top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    title: { ...typography.section, color: colors.text },
    count: { ...typography.bodyStrong, color: colors.primary },
    bar: { height: 6, borderRadius: radius.pill, backgroundColor: colors.primarySoft, overflow: 'hidden', marginBottom: spacing.xs },
    fill: { height: '100%', borderRadius: radius.pill, backgroundColor: colors.primary },
    step: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: 6 },
    stepText: { flex: 1, gap: 1 },
    stepTitle: { ...typography.body, color: colors.text },
    stepDone: { color: colors.textMuted, textDecorationLine: 'line-through' },
    stepNext: { fontWeight: '700', color: colors.primary },
    blocked: { ...typography.caption, color: colors.textMuted },
}));
