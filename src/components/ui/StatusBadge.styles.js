import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, radius, spacing } from '@/theme';

export const styles = StyleSheet.create(() => ({
    badge: { alignSelf: 'flex-start', paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radius.pill },
    text: { fontSize: 12, fontWeight: '700' },
    neutral: { backgroundColor: colors.border },
    neutralText: { color: colors.textMuted },
    primary: { backgroundColor: colors.primarySoft },
    primaryText: { color: colors.primaryDark },
    success: { backgroundColor: colors.successSoft },
    successText: { color: colors.success },
    danger: { backgroundColor: colors.dangerSoft },
    dangerText: { color: colors.danger },
    warning: { backgroundColor: colors.warningSoft },
    warningText: { color: colors.warning },
}));
