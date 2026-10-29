import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/theme';

import { styles } from './StatTile.styles';

export function StatTile({ icon, label, value, tone = 'primary', onPress }) {
    const tint = tone === 'warning' ? colors.warning : tone === 'danger' ? colors.danger : colors.primary;
    return (<Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.tile, pressed && styles.pressed]}>
      <View style={[styles.iconTile, styles[tone]]}>
        <Ionicons name={icon} size={18} color={tint}/>
      </View>
      <Text style={styles.value}>{value ?? '–'}</Text>
      <Text style={styles.label} numberOfLines={1}>{label}</Text>
    </Pressable>);
}
