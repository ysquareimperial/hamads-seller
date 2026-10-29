import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';

import { ChipRow } from '@/components/ui/ChipRow';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingView } from '@/components/ui/LoadingView';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { usePagedList } from '@/hooks/usePagedList';
import { useRefreshStore } from '@/store/refreshStore';
import { colors } from '@/theme';

import { SellerOrderCard } from '../components/SellerOrderCard';
import { sellerOrderService } from '../services/sellerOrderService';
import { ORDER_FILTERS } from '../utils/orderStatus';
import { styles } from './OrdersScreen.styles';

export function OrdersScreen() {
    const [status, setStatus] = useState(null);
    const version = useRefreshStore((s) => s.orders);
    const list = usePagedList((page) => sellerOrderService.list({ status, ...page }), [status, version]);

    let body;
    if (list.status === 'loading') body = <LoadingView />;
    else if (list.status === 'error') body = <ErrorState message={list.error} onRetry={list.reload}/>;
    else {
        body = (<FlatList data={list.items} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} renderItem={({ item }) => (<SellerOrderCard order={item} onPress={() => router.push(`/store/orders/${item.id}`)}/>)} ItemSeparatorComponent={() => <View style={styles.separator}/>} onEndReached={list.loadMore} onEndReachedThreshold={0.4} refreshControl={<RefreshControl refreshing={list.refreshing} onRefresh={list.refresh} tintColor={colors.primary} colors={[colors.primary]}/>} ListFooterComponent={list.loadingMore ? <ActivityIndicator style={styles.footer} color={colors.primary}/> : null} ListEmptyComponent={<EmptyState icon="receipt-outline" title="No orders here" message={status ? 'Orders with this status show here.' : 'When customers buy your products, orders show up here.'}/>}/>);
    }

    return (<SafeScreen>
      <ScreenHeader title="Orders" subtitle={list.total !== null ? `${list.total} total` : undefined} showBack={false}/>
      <ChipRow options={ORDER_FILTERS} value={status} onChange={setStatus}/>
      {body}
    </SafeScreen>);
}
