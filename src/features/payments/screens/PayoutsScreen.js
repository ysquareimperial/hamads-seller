import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';

import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingView } from '@/components/ui/LoadingView';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useAsyncData } from '@/hooks/useAsyncData';
import { colors } from '@/theme';
import { formatDateTime, formatMinor, shortId } from '@/utils/format';

import { payoutStatus } from '../paymentStatus';
import { paymentsService } from '../services/paymentsService';
import { styles } from './PayoutsScreen.styles';

const orderRoute = (p) => (p.seller_order_id ? `/store/orders/${p.seller_order_id}` : p.food_order_id ? `/food/orders/${p.food_order_id}` : null);

export function PayoutsScreen() {
    const { data, loading, error, reload } = useAsyncData(() => paymentsService.payouts(), []);
    const [refreshing, setRefreshing] = useState(false);
    const refresh = async () => {
        setRefreshing(true);
        await reload({ silent: true });
        setRefreshing(false);
    };

    let body;
    if (loading && !data) body = <LoadingView />;
    else if (error && !data) body = <ErrorState message={error} onRetry={() => reload()}/>;
    else {
        body = (<FlatList data={data} keyExtractor={(p) => p.id} contentContainerStyle={styles.list} ItemSeparatorComponent={() => <View style={styles.sep}/>} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]}/>} ListEmptyComponent={<EmptyState icon="time-outline" title="No payouts yet" message="Payouts to your bank will show here."/>} renderItem={({ item }) => {
                const status = payoutStatus(item.status);
                const route = orderRoute(item);
                return (<View style={styles.card}>
                <View style={styles.top}>
                  <Text style={styles.amount}>{formatMinor(item.net_amount_minor)}</Text>
                  <StatusBadge text={status.text} tone={status.tone}/>
                </View>
                <Text style={styles.meta}>{`${formatDateTime(item.created_at)} · Ref ${item.reference}`}</Text>
                {item.fee_minor ? <Text style={styles.meta}>{`${formatMinor(item.requested_amount_minor)} − ${formatMinor(item.fee_minor)} fee`}</Text> : null}
                {item.failure_reason ? <Text style={styles.failure}>{item.failure_reason}</Text> : null}
                {route ? (<Pressable accessibilityRole="button" onPress={() => router.push(route)}>
                    <Text style={styles.link}>{`${item.food_order_id ? 'Food order' : 'Order'} #${shortId(item.seller_order_id ?? item.food_order_id)}`}</Text>
                  </Pressable>) : null}
              </View>);
            }}/>);
    }

    return (<SafeScreen edges={['top', 'bottom']}>
      <ScreenHeader title="Payouts"/>
      {body}
    </SafeScreen>);
}
