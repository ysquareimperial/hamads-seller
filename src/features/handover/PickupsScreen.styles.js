import { StyleSheet } from '@/theme/themedStyleSheet';
import { spacing } from '@/theme';

export const styles = StyleSheet.create(() => ({
    list: { padding: spacing.lg, paddingTop: spacing.sm, flexGrow: 1 },
    header: { marginBottom: spacing.md },
    separator: { height: spacing.md },
    footer: { paddingVertical: spacing.lg },
}));
