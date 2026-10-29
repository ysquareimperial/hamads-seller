import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors, shadows } from '@/theme';

export const styles = StyleSheet.create(() => ({
    button: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface,
        ...shadows.card,
    },
    primary: { backgroundColor: colors.primary, ...shadows.button },
    pressed: { opacity: 0.8 },
}));
