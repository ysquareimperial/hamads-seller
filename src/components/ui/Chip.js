import { Pressable, Text } from 'react-native';

import { styles } from './Chip.styles';

export function Chip({ label, selected = false, onPress }) {
    return (<Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={[styles.chip, selected && styles.chipSelected]}>
      <Text style={[styles.label, selected && styles.labelSelected]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>);
}
