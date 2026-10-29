import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/theme';

import { styles } from './BusinessOption.styles';

export function BusinessOption({ config, selected, onPress }) {
    return (<Pressable accessibilityRole="radio" accessibilityState={{ selected }} onPress={onPress} style={[styles.card, selected && styles.selected]}>
      <View style={[styles.icon, selected && styles.iconSelected]}>
        <Ionicons name={config.icon} size={24} color={selected ? colors.textOnPrimary : colors.primary}/>
      </View>
      <View style={styles.text}>
        <Text style={styles.title}>{config.name}</Text>
        <Text style={styles.body}>{config.tagline}</Text>
        <Text style={styles.hint}>{config.signupHint}</Text>
      </View>
      <Ionicons name={selected ? 'radio-button-on' : 'radio-button-off'} size={22} color={selected ? colors.primary : colors.disabled}/>
    </Pressable>);
}
