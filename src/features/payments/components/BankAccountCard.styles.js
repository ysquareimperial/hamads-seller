import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, radius, shadows, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    card: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg, backgroundColor: colors.surface, borderRadius: radius.lg, ...shadows.card },
    icon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft },
    body: { flex: 1, gap: 2 },
    bank: { ...typography.bodyStrong, color: colors.text },
    name: { ...typography.caption, color: colors.textMuted },
    badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xs },
    recheck: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.xs },
    recheckText: { ...typography.caption, fontWeight: '700', color: colors.primary },
}));
