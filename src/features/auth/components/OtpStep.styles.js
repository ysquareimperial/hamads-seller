import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    form: { gap: spacing.md },
    sentRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
    sentText: { flex: 1, ...typography.subtitle, color: colors.textMuted },
    sentTarget: { color: colors.text, fontWeight: '700' },
    label: { ...typography.label, color: colors.textMuted },
    link: { ...typography.bodyStrong, color: colors.primary },
    muted: { ...typography.caption, color: colors.textMuted },
    resendRow: { alignItems: 'center', paddingVertical: spacing.sm },
}));
