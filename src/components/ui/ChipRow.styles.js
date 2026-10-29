import { StyleSheet } from '@/theme/themedStyleSheet';
import { spacing } from '@/theme';

export const styles = StyleSheet.create(() => ({
    scroll: { flexGrow: 0 },
    row: { gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
}));
