import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    form: { gap: spacing.md, paddingBottom: spacing.sm },
    bleed: { marginHorizontal: -spacing.xl },
    hint: { ...typography.subtitle, color: colors.textMuted },
}));
