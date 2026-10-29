import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';

import { ChipRow } from '@/components/ui/ChipRow';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingView } from '@/components/ui/LoadingView';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { FOOD_ORDERS_POLL_MS } from '@/config';
import { usePagedList } from '@/hooks/usePagedList';
import { usePolling } from '@/hooks/usePolling';
import { useRefreshStore } from '@/store/refreshStore';
import { colors } from '@/theme';

import { FoodOrderCard } from '../components/FoodOrderCard';
import { foodOrderCache } from '../foodCache';
import { foodVendorService } from '../services/foodVendorService';
import { FOOD_ORDER_FILTERS } from '../utils/foodStatus';
import { styles } from './FoodOrdersScreen.styles';

export function FoodOrdersScreen() {
    const [status, setStatus] = useState(null);
    const version = useRefreshStore((s) => s.foodOrders);
    const list = usePagedList(async (page) => {
        const result = await foodVendorService.listOrders({ status, ...page });
        foodOrderCache.put(result.items);
        return result;
    }, [status, version]);

    usePolling(list.refreshSilently, FOOD_ORDERS_POLL_MS);

    let body;
    if (list.status === 'loading') body = <LoadingView />;
    else if (list.status === 'error') body = <ErrorState message={list.error} onRetry={list.reload}/>;
    else {
        body = (<FlatList data={list.items} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} renderItem={({ item }) => (<FoodOrderCard order={item} onPress={() => router.push(`/food/orders/${item.id}`)}/>)} ItemSeparatorComponent={() => <View style={styles.separator}/>} onEndReached={list.loadMore} onEndReachedThreshold={0.4} refreshControl={<RefreshControl refreshing={list.refreshing} onRefresh={list.refresh} tintColor={colors.primary} colors={[colors.primary]}/>} ListFooterComponent={list.loadingMore ? <ActivityIndicator style={styles.footer} color={colors.primary}/> : null} ListEmptyComponent={<EmptyState icon="bag-handle-outline" title="No orders here" message={status ? 'Orders with this status show here.' : 'Paid orders show up here automatically.'}/>}/>);
    }

    return (<SafeScreen>
      <ScreenHeader title="Orders" subtitle="Updates automatically" showBack={false}/>
      <ChipRow options={FOOD_ORDER_FILTERS} value={status} onChange={setStatus}/>
      {body}
    </SafeScreen>);
}
