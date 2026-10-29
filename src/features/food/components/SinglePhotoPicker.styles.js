import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, radius, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    wrapper: { gap: 6 },
    label: { ...typography.label, color: colors.textMuted },
    box: {
        aspectRatio: 4 / 3,
        borderRadius: radius.lg,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        backgroundColor: colors.primarySoft,
    },
    empty: { borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.primary },
    image: { width: '100%', height: '100%' },
    addText: { ...typography.bodyStrong, color: colors.primary },
    hint: { ...typography.caption, color: colors.textMuted },
}));
