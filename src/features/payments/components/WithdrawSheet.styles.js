import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    form: { gap: spacing.md, paddingBottom: spacing.sm },
    hint: { ...typography.subtitle, color: colors.textMuted },
    all: { alignSelf: 'flex-start' },
    allText: { ...typography.bodyStrong, color: colors.primary },
}));
