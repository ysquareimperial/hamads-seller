import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, radius, spacing } from '@/theme';

export const styles = StyleSheet.create(() => ({
    row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
    box: {
        flex: 1,
        height: 56,
        maxWidth: 56,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },
    boxFilled: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
    boxActive: { borderColor: colors.primary, borderWidth: 2 },
    boxError: { borderColor: colors.danger },
    digit: { fontSize: 22, fontWeight: '700', color: colors.primary },
    hiddenInput: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, opacity: 0.02 },
}));
