import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    scroll: { padding: spacing.lg, gap: spacing.lg },
    current: { gap: 2 },
    label: { ...typography.label, color: colors.textMuted },
    link: { ...typography.section, color: colors.primary },
}));
