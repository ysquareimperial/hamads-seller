import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, radius, shadows, spacing, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    card: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.md,
        padding: spacing.lg,
        borderRadius: radius.lg,
        borderWidth: 1.5,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },
    selected: { borderColor: colors.primary, ...shadows.card },
    icon: { width: 44, height: 44, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft },
    iconSelected: { backgroundColor: colors.primary },
    text: { flex: 1, gap: 2 },
    title: { ...typography.section, color: colors.text },
    body: { ...typography.caption, color: colors.text },
    hint: { ...typography.caption, color: colors.textMuted },
}));
