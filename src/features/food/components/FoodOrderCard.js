import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { StatusBadge } from '@/components/ui/StatusBadge';
import { colors } from '@/theme';
import { formatNaira, shortId } from '@/utils/format';

import { foodStatusMeta, FULFILMENT, itemsSummary, timeAgo } from '../utils/foodStatus';
import { styles } from './FoodOrderCard.styles';

export function FoodOrderCard({ order, onPress }) {
    const status = foodStatusMeta(order.status);
    const fulfil = FULFILMENT[order.fulfilment] ?? FULFILMENT.delivery;
    const isNew = order.status === 'paid';
    return (<Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.card, isNew && styles.cardNew, pressed && styles.pressed]}>
      <View style={styles.top}>
        <Text style={styles.id}>{`#${shortId(order.id)}`}</Text>
        <StatusBadge text={status.text} tone={status.tone}/>
      </View>
      <Text style={styles.customer} numberOfLines={1}>{order.customer_name}</Text>
      <Text style={styles.items} numberOfLines={2}>{itemsSummary(order.items)}</Text>
      <View style={styles.bottom}>
        <View style={styles.fulfil}>
          <Ionicons name={fulfil.icon} size={14} color={colors.primary}/>
          <Text style={styles.fulfilText}>{fulfil.label}</Text>
        </View>
        <Text style={styles.time}>{timeAgo(order.created_at)}</Text>
        <Text style={styles.total}>{formatNaira(order.subtotal)}</Text>
      </View>
    </Pressable>);
}
