import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, spacing } from '@/theme';

export const styles = StyleSheet.create(() => ({
    safe: { flex: 1, backgroundColor: colors.background },
    flex: { flex: 1 },
    content: { flexGrow: 1, padding: spacing.xl },
}));
