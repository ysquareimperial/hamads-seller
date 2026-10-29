import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, radius, shadows, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    tile: {
        flexBasis: '47%',
        flexGrow: 1,
        gap: 4,
        padding: spacing.lg,
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        ...shadows.card,
    },
    pressed: { opacity: 0.85 },
    iconTile: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xs },
    primary: { backgroundColor: colors.primarySoft },
    warning: { backgroundColor: colors.warningSoft },
    danger: { backgroundColor: colors.dangerSoft },
    value: { fontSize: 24, fontWeight: '800', color: colors.text },
    label: { ...typography.caption, color: colors.textMuted },
}));
