import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, radius, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    flex: { flex: 1 },
    scroll: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
    cardTitle: { ...typography.section, color: colors.text },
    row: { flexDirection: 'row', gap: spacing.md },
    rowItem: { flex: 1 },
    hint: { ...typography.caption, color: colors.textMuted },
    statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    statusLabel: { ...typography.label, color: colors.textMuted },
    switchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    switchText: { flex: 1, gap: 2 },
    variantsTop: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
    bulk: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    bulkField: {
        flexGrow: 1,
        flexBasis: '45%',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.background,
        overflow: 'hidden',
    },
    bulkInput: { flex: 1, minHeight: 40, paddingHorizontal: spacing.sm, ...typography.caption, fontSize: 14, color: colors.text },
    bulkButton: { paddingHorizontal: spacing.md, alignSelf: 'stretch', justifyContent: 'center', backgroundColor: colors.primarySoft },
    bulkButtonText: { ...typography.caption, fontWeight: '700', color: colors.primary },
    footer: {
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.background,
    },
}));
