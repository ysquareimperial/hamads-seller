import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingView } from '@/components/ui/LoadingView';
import { NoticeBanner } from '@/components/ui/NoticeBanner';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useRefreshStore } from '@/store/refreshStore';
import { colors } from '@/theme';
import { formatNaira, formatPhone, shortId } from '@/utils/format';
import { getErrorMessage } from '@/utils/getErrorMessage';

import { CancelSheet } from '../components/CancelSheet';
import { OrderTimeline } from '../components/OrderTimeline';
import { ShipSheet } from '../components/ShipSheet';
import { sellerOrderService } from '../services/sellerOrderService';
import { canCancel, ORDER_STATUS_TEXT } from '../utils/orderStatus';
import { styles } from './OrderDetailScreen.styles';

const addressLines = (s) => [
    `${s.house_number} ${s.street}`.trim(),
    s.landmark ? `Near ${s.landmark}` : null,
    [s.lga, s.state].filter(Boolean).join(', '),
    s.country,
].filter(Boolean);

export function OrderDetailScreen() {
    const { id } = useLocalSearchParams();
    const bumpOrders = useRefreshStore((s) => s.bumpOrders);
    const { data: order, loading, error, reload, setData } = useAsyncData(() => sellerOrderService.get(id), [id]);
    const [refreshing, setRefreshing] = useState(false);
    const [sheet, setSheet] = useState(null); // 'ship' | 'cancel'
    const [action, setAction] = useState(null); // in-flight action name
    const [actionError, setActionError] = useState(null);

    const run = async (name, fn) => {
        setAction(name);
        setActionError(null);
        try {
            const updated = await fn();
            setData(updated);
            bumpOrders();
            setSheet(null);
        }
        catch (e) {
            const message = getErrorMessage(e);
            setActionError(message);
            if (!sheet) Alert.alert("Couldn't update order", message);
        }
        finally {
            setAction(null);
        }
    };

    const startProcessing = () => {
        Alert.alert('Start processing?', 'Let the customer know you are preparing this order.', [
            { text: 'Not yet', style: 'cancel' },
            { text: 'Start', onPress: () => void run('process', () => sellerOrderService.process(id)) },
        ]);
    };

    const openSheet = (name) => {
        setActionError(null);
        setSheet(name);
    };

    const refresh = async () => {
        setRefreshing(true);
        await reload({ silent: true });
        setRefreshing(false);
    };

    const header = <ScreenHeader title={order ? `Order #${shortId(order.id)}` : 'Order'} subtitle={order ? `Customer order #${shortId(order.order_id)}` : undefined}/>;

    if (loading && !order) {
        return (<SafeScreen edges={['top', 'bottom']}>
        {header}
        <LoadingView />
      </SafeScreen>);
    }
    if (error && !order) {
        return (<SafeScreen edges={['top', 'bottom']}>
        {header}
        <ErrorState message={error} onRetry={() => reload()}/>
      </SafeScreen>);
    }

    const shipping = order.shipping;
    const showActions = order.status === 'awaiting_fulfillment' || order.status === 'processing';

    return (<SafeScreen edges={['top', 'bottom']}>
      {header}
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]}/>}>
        <View style={styles.statusRow}>
          <StatusBadge status={order.status} text={ORDER_STATUS_TEXT[order.status]}/>
          <Text style={styles.total}>{formatNaira(order.subtotal)}</Text>
        </View>

        {order.status === 'shipped' ? (<NoticeBanner tone="info" message="Waiting for the customer to confirm delivery."/>) : null}

        <Card>
          <OrderTimeline order={order}/>
          {order.carrier_name || order.tracking_number ? (<View style={styles.tracking}>
              {order.carrier_name ? <Text style={styles.trackingText}>{`Carrier: ${order.carrier_name}`}</Text> : null}
              {order.tracking_number ? <Text style={styles.trackingText} selectable>{`Tracking: ${order.tracking_number}`}</Text> : null}
            </View>) : null}
        </Card>

        <Card>
          <Text style={styles.cardTitle}>{`Items (${order.item_count})`}</Text>
          {order.items.map((item, i) => (<View key={`${item.product_id}-${i}`} style={[styles.itemRow, i > 0 && styles.itemBorder]}>
              <View style={styles.itemText}>
                <Text style={styles.itemName} numberOfLines={2}>{item.product_name}</Text>
                {item.variant_label ? <Text style={styles.variant}>{item.variant_label}</Text> : null}
                <Text style={styles.itemMeta}>{`${item.quantity} × ${formatNaira(item.unit_price)}`}</Text>
              </View>
              <Text style={styles.itemTotal}>{formatNaira(item.line_total)}</Text>
            </View>))}
          <View style={[styles.itemRow, styles.itemBorder]}>
            <Text style={styles.subtotalLabel}>Subtotal</Text>
            <Text style={styles.subtotal}>{formatNaira(order.subtotal)}</Text>
          </View>
        </Card>

        {shipping ? (<Card>
            <Text style={styles.cardTitle}>Deliver to</Text>
            <Text style={styles.recipient}>{shipping.recipient_name}</Text>
            {addressLines(shipping).map((line) => (<Text key={line} style={styles.address}>{line}</Text>))}
            <Pressable accessibilityRole="button" onPress={() => Linking.openURL(`tel:${shipping.phone_number}`)} style={styles.call}>
              <Ionicons name="call-outline" size={18} color={colors.primary}/>
              <Text style={styles.callText}>{formatPhone(shipping.phone_number)}</Text>
            </Pressable>
          </Card>) : null}
      </ScrollView>

      {showActions ? (<View style={styles.footer}>
          {order.status === 'awaiting_fulfillment' ? (<Button title="Start processing" icon="cube-outline" onPress={startProcessing} loading={action === 'process'} disabled={!!action}/>) : (<Button title="Mark as shipped" icon="paper-plane-outline" onPress={() => openSheet('ship')} disabled={!!action}/>)}
          {canCancel(order.status) ? (<Button title="Cancel order" variant="secondary" compact onPress={() => openSheet('cancel')} disabled={!!action}/>) : null}
        </View>) : null}

      <ShipSheet visible={sheet === 'ship'} onClose={() => setSheet(null)} submitting={action === 'ship'} error={actionError} onSubmit={(body) => run('ship', () => sellerOrderService.ship(id, body))}/>
      <CancelSheet visible={sheet === 'cancel'} onClose={() => setSheet(null)} submitting={action === 'cancel'} error={actionError} onSubmit={(reason) => run('cancel', () => sellerOrderService.cancel(id, reason))}/>
    </SafeScreen>);
}
