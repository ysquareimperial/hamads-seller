import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, radius, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    wrapper: { gap: spacing.md },
    option: { gap: 6, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.background },
    optionTop: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
    flex: { flex: 1 },
    remove: { padding: spacing.md },
    label: { ...typography.label, color: colors.textMuted, marginTop: spacing.xs },
    add: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xs },
    addText: { ...typography.bodyStrong, color: colors.primary },
    hint: { ...typography.caption, color: colors.textMuted },
    error: { ...typography.caption, color: colors.danger },
}));
