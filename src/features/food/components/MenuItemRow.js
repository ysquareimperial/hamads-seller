import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, Switch, Text, View } from 'react-native';

import { colors } from '@/theme';
import { formatNaira } from '@/utils/format';

import { styles } from './MenuItemRow.styles';

export function MenuItemRow({ item, categoryLabel, onPress, onToggle, toggling = false }) {
    return (<Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.card, !item.is_available && styles.unavailable, pressed && styles.pressed]}>
      <View style={styles.thumb}>
        {item.image_url ? (<Image source={{ uri: item.image_url }} style={styles.image} contentFit="cover" transition={150}/>) : (<Ionicons name="fast-food-outline" size={24} color={colors.disabled}/>)}
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.price}>{formatNaira(item.price)}</Text>
        <Text style={styles.meta} numberOfLines={1}>
          {[categoryLabel, item.prep_minutes ? `${item.prep_minutes} min` : null, item.is_available ? null : 'Unavailable'].filter(Boolean).join(' · ')}
        </Text>
      </View>
      <Switch accessibilityLabel={`${item.name} available`} value={item.is_available} onValueChange={onToggle} disabled={toggling} trackColor={{ true: colors.primary, false: colors.border }} thumbColor={colors.surface}/>
    </Pressable>);
}
