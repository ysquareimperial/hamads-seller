import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, radius, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    list: {},
    step: { flexDirection: 'row', gap: spacing.md, minHeight: 44 },
    rail: { alignItems: 'center', width: 20 },
    dot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },
    dotDone: { backgroundColor: colors.primary, borderColor: colors.primary },
    line: { flex: 1, width: 2, backgroundColor: colors.border, marginVertical: 2 },
    lineDone: { backgroundColor: colors.primary },
    stepText: { flex: 1, paddingBottom: spacing.md },
    label: { ...typography.bodyStrong, color: colors.text },
    labelPending: { color: colors.textMuted, fontWeight: '400' },
    time: { ...typography.caption, color: colors.textMuted },
    cancelled: { flexDirection: 'row', gap: spacing.sm, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.dangerSoft },
    cancelText: { flex: 1, gap: 2 },
    cancelTitle: { ...typography.bodyStrong, color: colors.danger },
    cancelReason: { ...typography.caption, color: colors.text },
}));
