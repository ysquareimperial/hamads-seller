import { StyleSheet } from '@/theme/themedStyleSheet';
import { colors } from '@/theme';

export const styles = StyleSheet.create(() => ({
    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
        minWidth: 18,
        height: 18,
        paddingHorizontal: 4,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.danger,
        borderWidth: 2,
        borderColor: colors.background,
    },
    badgeText: { fontSize: 10, fontWeight: '800', color: '#FFFFFF' },
}));
