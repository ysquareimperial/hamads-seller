import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    list: { padding: spacing.lg, paddingTop: spacing.sm, flexGrow: 1 },
    separator: { height: spacing.md },
    sectionTitle: { ...typography.label, color: colors.textMuted, paddingTop: spacing.md, paddingBottom: spacing.sm },
}));
