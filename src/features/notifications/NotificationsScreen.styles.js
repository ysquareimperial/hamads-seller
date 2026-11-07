import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, radius, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    list: { padding: spacing.lg, flexGrow: 1 },
    separator: { height: spacing.sm },
    footer: { paddingVertical: spacing.lg },
    row: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, padding: spacing.lg, borderRadius: radius.lg, backgroundColor: colors.surface },
    rowUnread: { backgroundColor: colors.primarySoft },
    icon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft },
    iconUnread: { backgroundColor: colors.primary },
    text: { flex: 1, gap: 2 },
    title: { ...typography.bodyStrong, color: colors.text, fontWeight: '500' },
    titleUnread: { fontWeight: '700' },
    body: { ...typography.caption, color: colors.textMuted },
    time: { ...typography.caption, fontSize: 12, color: colors.textMuted, marginTop: 2 },
    dot: { width: 8, height: 8, borderRadius: 4, marginTop: 6, backgroundColor: colors.primary },
    readAll: { ...typography.bodyStrong, fontSize: 14, color: colors.primary },
}));
