import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    flex: { flex: 1 },
    scroll: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
    cardTitle: { ...typography.section, color: colors.text },
    switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    switchLabel: { ...typography.bodyStrong, color: colors.text },
}));
