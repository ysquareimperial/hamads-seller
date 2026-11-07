import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';

import { ChipRow } from '@/components/ui/ChipRow';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { IconButton } from '@/components/ui/IconButton';
import { LoadingView } from '@/components/ui/LoadingView';
import { NoticeBanner } from '@/components/ui/NoticeBanner';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { usePagedList } from '@/hooks/usePagedList';
import { useRefreshStore } from '@/store/refreshStore';
import { colors } from '@/theme';

import { HandoverCard } from './HandoverCard';
import { handoverService } from './handoverService';
import { PICKUP_FILTERS } from './handoverStatus';
import { styles } from './PickupsScreen.styles';
import { useSwitchHandover } from './useSwitchHandover';

/** GET /seller/market/pickups: how each paid order reaches the Hamads warehouse. */
export function PickupsScreen() {
    const [status, setStatus] = useState(null);
    const version = useRefreshStore((s) => s.orders);
    const list = usePagedList((page) => handoverService.pickups({ status, ...page }), [status, version]);
    const { switchTo, switchingId } = useSwitchHandover((updated) => list.setItems((items) => items.map((j) => (j.id === updated.id ? updated : j))));

    let body;
    if (list.status === 'loading') body = <LoadingView />;
    else if (list.status === 'error') body = <ErrorState message={list.error} onRetry={list.reload}/>;
    else {
        body = (<FlatList data={list.items} keyExtractor={(j) => j.id} contentContainerStyle={styles.list} ListHeaderComponent={<View style={styles.header}>
              <NoticeBanner tone="info" message="Hamads delivers every order to your customers. Get each paid order to our warehouse: a rider collects it, or you drop it off."/>
            </View>} renderItem={({ item }) => (<HandoverCard job={item} showOrder onOpenOrder={() => router.push(`/store/orders/${item.seller_order_id}`)} onSwitch={switchTo} switching={switchingId === item.id}/>)} ItemSeparatorComponent={() => <View style={styles.separator}/>} onEndReached={list.loadMore} onEndReachedThreshold={0.4} refreshControl={<RefreshControl refreshing={list.refreshing} onRefresh={list.refresh} tintColor={colors.primary} colors={[colors.primary]}/>} ListFooterComponent={list.loadingMore ? <ActivityIndicator style={styles.footer} color={colors.primary}/> : null} ListEmptyComponent={<EmptyState icon="cube-outline" title="Nothing to hand over" message={status ? 'Orders with this status show here.' : 'Paid orders show here with how they reach the warehouse.'}/>}/>);
    }

    return (<SafeScreen edges={['top', 'bottom']}>
      <ScreenHeader title="Handover" subtitle={list.total !== null ? `${list.total} orders` : undefined} right={<IconButton icon="settings-outline" accessibilityLabel="Handover setting" onPress={() => router.push('/store/handover')}/>}/>
      <ChipRow options={PICKUP_FILTERS} value={status} onChange={setStatus}/>
      {body}
    </SafeScreen>);
}
