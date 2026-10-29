import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, spacing, typography } from '@/theme';

export const authStyles = StyleSheet.create(() => ({
    form: { gap: spacing.md },
    row: { flexDirection: 'row', gap: spacing.md },
    rowItem: { flex: 1 },
    footer: { ...typography.caption, color: colors.textMuted, textAlign: 'center', marginTop: spacing.lg },
    sectionLabel: { ...typography.label, color: colors.textMuted, marginTop: spacing.sm },
}));
