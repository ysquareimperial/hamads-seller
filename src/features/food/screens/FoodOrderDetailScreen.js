import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Linking, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingView } from '@/components/ui/LoadingView';
import { NoticeBanner } from '@/components/ui/NoticeBanner';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { FOOD_ORDERS_POLL_MS } from '@/config';
import { usePolling } from '@/hooks/usePolling';
import { useBusinessStore } from '@/store/businessStore';
import { useRefreshStore } from '@/store/refreshStore';
import { colors } from '@/theme';
import { formatNaira, formatPhone, shortId } from '@/utils/format';
import { getErrorMessage } from '@/utils/getErrorMessage';

import { AcceptSheet } from '../components/AcceptSheet';
import { PickupCodeSheet } from '../components/PickupCodeSheet';
import { RejectSheet } from '../components/RejectSheet';
import { foodOrderCache } from '../foodCache';
import { foodVendorService } from '../services/foodVendorService';
import { clockTime, foodStatusMeta, FULFILMENT, timeAgo } from '../utils/foodStatus';
import { styles } from './FoodOrderDetailScreen.styles';

const call = (phone) => Linking.openURL(`tel:${phone}`);

/** What the shop sees under the status, per stage. */
function stageNotice(order) {
    const pickup = order.fulfilment === 'pickup';
    switch (order.status) {
        case 'paid':
            return { tone: 'warning', text: 'New paid order. Accept it to start preparing, or reject it.' };
        case 'preparing':
            return { tone: 'info', text: order.estimated_ready_at ? `Ready by ${clockTime(order.estimated_ready_at)}. Mark it ready when it's packed.` : "Mark it ready when it's packed." };
        case 'ready':
            if (pickup) return { tone: 'success', text: 'Waiting for the customer. Ask for their 4-digit code when they arrive.' };
            return order.rider ? { tone: 'success', text: `${order.rider.first_name} is coming to pick this up.` } : { tone: 'info', text: 'Waiting for Hamads to assign a rider.' };
        case 'on_the_way':
            return { tone: 'info', text: order.rider ? `Out for delivery with ${order.rider.first_name}.` : 'Out for delivery.' };
        case 'completed':
            return { tone: 'success', text: pickup ? 'Collected by the customer.' : 'Delivered to the customer.' };
        default:
            return null;
    }
}

export function FoodOrderDetailScreen() {
    const { id } = useLocalSearchParams();
    const vendor = useBusinessStore((s) => s.vendor);
    const bumpFoodOrders = useRefreshStore((s) => s.bumpFoodOrders);
    const [order, setOrder] = useState(() => foodOrderCache.get(id));
    const [loading, setLoading] = useState(!order);
    const [loadError, setLoadError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [sheet, setSheet] = useState(null); // accept | reject | pickup
    const [action, setAction] = useState(null);
    const [actionError, setActionError] = useState(null);

    // No GET-one endpoint: refetch recent orders and pick this one out.
    const fetchLatest = useCallback(async () => {
        const { items } = await foodVendorService.listOrders({ limit: 100, offset: 0 });
        foodOrderCache.put(items);
        const found = items.find((o) => o.id === id);
        if (found) setOrder(found);
        return found;
    }, [id]);

    useEffect(() => {
        if (order) return;
        fetchLatest().then((found) => {
            if (!found) setLoadError("Couldn't find this order.");
        }).catch((e) => setLoadError(getErrorMessage(e))).finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    usePolling(() => fetchLatest().catch(() => { }), FOOD_ORDERS_POLL_MS);

    const refresh = async () => {
        setRefreshing(true);
        try {
            await fetchLatest();
        }
        catch {
            // keep what we have
        }
        setRefreshing(false);
    };

    const run = async (name, fn) => {
        setAction(name);
        setActionError(null);
        try {
            const updated = await fn();
            foodOrderCache.put([updated]);
            setOrder(updated);
            bumpFoodOrders();
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

    const markReady = () => {
        Alert.alert('Mark as ready?', order.fulfilment === 'pickup' ? 'The customer will be told to come and collect.' : 'A rider will be sent to collect it.', [
            { text: 'Not yet', style: 'cancel' },
            { text: 'Ready', onPress: () => void run('ready', () => foodVendorService.markReady(id)) },
        ]);
    };

    const openSheet = (name) => {
        setActionError(null);
        setSheet(name);
    };

    const header = <ScreenHeader title={order ? `Order #${shortId(order.id)}` : 'Order'} subtitle={order ? `Placed ${timeAgo(order.created_at)}` : undefined}/>;

    if (loading || (!order && loadError)) {
        return (<SafeScreen edges={['top', 'bottom']}>
        {header}
        {loading ? <LoadingView /> : <ErrorState message={loadError}/>}
      </SafeScreen>);
    }

    const status = foodStatusMeta(order.status);
    const fulfil = FULFILMENT[order.fulfilment] ?? FULFILMENT.delivery;
    const notice = stageNotice(order);
    const canHandOver = order.status === 'ready' && order.fulfilment === 'pickup';
    const hasActions = order.status === 'paid' || order.status === 'preparing' || canHandOver;

    return (<SafeScreen edges={['top', 'bottom']}>
      {header}
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]}/>}>
        <View style={styles.statusRow}>
          <StatusBadge text={status.text} tone={status.tone}/>
          <View style={styles.fulfil}>
            <Ionicons name={fulfil.icon} size={16} color={colors.primary}/>
            <Text style={styles.fulfilText}>{fulfil.label}</Text>
          </View>
          <Text style={styles.total}>{formatNaira(order.subtotal)}</Text>
        </View>

        {notice ? <NoticeBanner tone={notice.tone} message={notice.text}/> : null}

        {order.note ? (<View style={styles.note}>
            <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.warning}/>
            <View style={styles.noteText}>
              <Text style={styles.noteLabel}>Customer note</Text>
              <Text style={styles.noteBody}>{order.note}</Text>
            </View>
          </View>) : null}

        <Card>
          <Text style={styles.cardTitle}>Items</Text>
          {order.items.map((item, i) => (<View key={`${item.item_id}-${i}`} style={[styles.itemRow, i > 0 && styles.itemBorder]}>
              <Text style={styles.qty}>{`${item.quantity}×`}</Text>
              <View style={styles.itemText}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemMeta}>{formatNaira(item.unit_price)}</Text>
              </View>
              <Text style={styles.itemTotal}>{formatNaira(item.line_total)}</Text>
            </View>))}
          <View style={[styles.itemRow, styles.itemBorder]}>
            <Text style={styles.subtotalLabel}>Subtotal</Text>
            <Text style={styles.subtotal}>{formatNaira(order.subtotal)}</Text>
          </View>
        </Card>

        <Card>
          <Text style={styles.cardTitle}>Customer</Text>
          <Text style={styles.person}>{order.customer_name}</Text>
          <Pressable accessibilityRole="button" onPress={() => call(order.customer_phone)} style={styles.call}>
            <Ionicons name="call-outline" size={18} color={colors.primary}/>
            <Text style={styles.callText}>{formatPhone(order.customer_phone)}</Text>
          </Pressable>
        </Card>

        {order.rider ? (<Card>
            <Text style={styles.cardTitle}>Rider</Text>
            <Text style={styles.person}>{order.rider.first_name}</Text>
            <Text style={styles.itemMeta}>{[order.rider.vehicle_type, order.rider.plate_number].filter(Boolean).join(' · ')}</Text>
            <Pressable accessibilityRole="button" onPress={() => call(order.rider.phone_number)} style={styles.call}>
              <Ionicons name="call-outline" size={18} color={colors.primary}/>
              <Text style={styles.callText}>{formatPhone(order.rider.phone_number)}</Text>
            </Pressable>
          </Card>) : null}
      </ScrollView>

      {hasActions ? (<View style={styles.footer}>
          {order.status === 'paid' ? (<>
              <Button title="Accept order" icon="checkmark" onPress={() => openSheet('accept')} disabled={!!action}/>
              <Button title="Reject" variant="secondary" compact onPress={() => openSheet('reject')} disabled={!!action}/>
            </>) : null}
          {order.status === 'preparing' ? (<Button title="Mark as ready" icon="checkmark-circle-outline" onPress={markReady} loading={action === 'ready'} disabled={!!action}/>) : null}
          {canHandOver ? (<Button title="Enter pickup code" icon="keypad-outline" onPress={() => openSheet('pickup')} disabled={!!action}/>) : null}
        </View>) : null}

      <AcceptSheet visible={sheet === 'accept'} defaultMinutes={vendor?.default_prep_minutes} onClose={() => setSheet(null)} submitting={action === 'accept'} error={actionError} onSubmit={(m) => run('accept', () => foodVendorService.accept(id, m))}/>
      <RejectSheet visible={sheet === 'reject'} onClose={() => setSheet(null)} submitting={action === 'reject'} error={actionError} onSubmit={(r) => run('reject', () => foodVendorService.reject(id, r))}/>
      <PickupCodeSheet visible={sheet === 'pickup'} onClose={() => setSheet(null)} submitting={action === 'pickup'} error={actionError} onSubmit={(c) => run('pickup', () => foodVendorService.completePickup(id, c))}/>
    </SafeScreen>);
}
