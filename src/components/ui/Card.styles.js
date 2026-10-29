import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, radius, shadows, spacing } from '@/theme';

export const styles = StyleSheet.create(() => ({
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.lg,
        gap: spacing.md,
        ...shadows.card,
    },
}));
