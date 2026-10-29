import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { StatusBadge } from '@/components/ui/StatusBadge';
import { colors } from '@/theme';
import { formatDateTime, formatNaira, shortId } from '@/utils/format';

import { ORDER_STATUS_TEXT } from '../utils/orderStatus';
import { styles } from './SellerOrderCard.styles';

export function SellerOrderCard({ order, onPress }) {
    const items = order.item_count === 1 ? '1 item' : `${order.item_count} items`;
    return (<Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.iconTile}>
        <Ionicons name="receipt-outline" size={20} color={colors.primary}/>
      </View>
      <View style={styles.body}>
        <View style={styles.top}>
          <Text style={styles.id}>{`#${shortId(order.id)}`}</Text>
          <StatusBadge status={order.status} text={ORDER_STATUS_TEXT[order.status]}/>
        </View>
        <Text style={styles.meta}>{`${formatDateTime(order.created_at)} · ${items}`}</Text>
        <Text style={styles.total}>{formatNaira(order.subtotal)}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.disabled}/>
    </Pressable>);
}
