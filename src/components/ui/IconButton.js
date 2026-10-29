import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

import { colors } from '@/theme';

import { styles } from './IconButton.styles';

export function IconButton({ icon, onPress, accessibilityLabel, tone = 'default' }) {
    return (<Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={onPress} hitSlop={8} style={({ pressed }) => [styles.button, tone === 'primary' && styles.primary, pressed && styles.pressed]}>
      <Ionicons name={icon} size={20} color={tone === 'primary' ? colors.textOnPrimary : colors.text}/>
    </Pressable>);
}
