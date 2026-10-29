import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, radius, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    container: { alignItems: 'center', justifyContent: 'center', padding: spacing.xxl, gap: spacing.sm },
    iconTile: {
        width: 56,
        height: 56,
        borderRadius: radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.dangerSoft,
        marginBottom: spacing.xs,
    },
    title: { ...typography.section, color: colors.text, textAlign: 'center' },
    message: { ...typography.subtitle, color: colors.textMuted, textAlign: 'center' },
    action: { alignSelf: 'stretch', marginTop: spacing.md },
}));
