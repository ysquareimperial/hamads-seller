import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, typography } from '@/theme';

export const styles = StyleSheet.create(() => ({
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    title: { ...typography.section, color: colors.text },
    action: { ...typography.bodyStrong, color: colors.primary },
}));
