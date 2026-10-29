import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    wrapper: { gap: 6 },
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    ok: { ...typography.caption, color: colors.success, fontWeight: '600' },
    bad: { ...typography.caption, color: colors.danger, flex: 1 },
    muted: { ...typography.caption, color: colors.textMuted },
    hint: { ...typography.caption, color: colors.textMuted },
}));
