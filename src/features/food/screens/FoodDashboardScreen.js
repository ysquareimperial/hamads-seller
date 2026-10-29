import { router } from 'expo-router';
import { useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { IconButton } from '@/components/ui/IconButton';
import { LoadingView } from '@/components/ui/LoadingView';
import { NoticeBanner } from '@/components/ui/NoticeBanner';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FOOD_ORDERS_POLL_MS } from '@/config';
import { BUSINESS } from '@/features/business/businessConfig';
import { StatTile } from '@/features/dashboard/StatTile';
import { useAsyncData } from '@/hooks/useAsyncData';
import { usePolling } from '@/hooks/usePolling';
import { useBusinessStore } from '@/store/businessStore';
import { useRefreshStore } from '@/store/refreshStore';
import { colors } from '@/theme';

import { FoodOrderCard } from '../components/FoodOrderCard';
import { OpenStatusToggle } from '../components/OpenStatusToggle';
import { foodItemCache, foodOrderCache } from '../foodCache';
import { foodVendorService } from '../services/foodVendorService';
import { ACTIVE_FOOD_STATUSES } from '../utils/foodStatus';
import { styles } from './FoodDashboardScreen.styles';

async function loadFoodDashboard() {
    const [orders, items] = await Promise.all([
        foodVendorService.listOrders({ limit: 50, offset: 0 }),
        foodVendorService.listItems(),
    ]);
    foodOrderCache.put(orders.items);
    foodItemCache.put(items);
    const count = (s) => orders.items.filter((o) => o.status === s).length;
    return {
        newOrders: count('paid'),
        preparing: count('preparing'),
        ready: count('ready'),
        active: orders.items.filter((o) => ACTIVE_FOOD_STATUSES.includes(o.status)).slice(0, 8),
        items: items.length,
        available: items.filter((i) => i.is_available).length,
    };
}

export function FoodDashboardScreen() {
    const vendor = useBusinessStore((s) => s.vendor);
    const loadBusiness = useBusinessStore((s) => s.load);
    const ordersVersion = useRefreshStore((s) => s.foodOrders);
    const itemsVersion = useRefreshStore((s) => s.foodItems);
    const { data, loading, error, reload } = useAsyncData(loadFoodDashboard, [ordersVersion, itemsVersion]);
    const [refreshing, setRefreshing] = useState(false);

    usePolling(() => reload({ silent: true }), FOOD_ORDERS_POLL_MS);

    const refresh = async () => {
        setRefreshing(true);
        await Promise.all([reload({ silent: true }), loadBusiness()]);
        setRefreshing(false);
    };

    return (<SafeScreen>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.kind}>{BUSINESS.food.name.toUpperCase()}</Text>
          <Text style={styles.shop} numberOfLines={1}>{vendor.display_name}</Text>
        </View>
        <IconButton icon="settings-outline" accessibilityLabel="Shop settings" onPress={() => router.push('/food/settings')}/>
        <IconButton icon="swap-horizontal" accessibilityLabel="Switch business" onPress={() => router.dismissTo('/')}/>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]}/>}>
        {!vendor.is_approved ? (<NoticeBanner title="Shop under review" message="Build your menu now. Customers will see your shop once Hamads approves it."/>) : null}

        <OpenStatusToggle />

        {loading && !data ? (<LoadingView />) : error && !data ? (<ErrorState message={error} onRetry={() => reload()}/>) : data ? (<>
            <View style={styles.grid}>
              <StatTile icon="notifications-outline" tone={data.newOrders ? 'warning' : 'primary'} label="New orders" value={data.newOrders} onPress={() => router.navigate('/food/orders')}/>
              <StatTile icon="flame-outline" label="Preparing" value={data.preparing} onPress={() => router.navigate('/food/orders')}/>
              <StatTile icon="checkmark-circle-outline" label="Ready" value={data.ready} onPress={() => router.navigate('/food/orders')}/>
              <StatTile icon="fast-food-outline" tone={data.items && !data.available ? 'danger' : 'primary'} label="Items available" value={`${data.available}/${data.items}`} onPress={() => router.navigate('/food/menu')}/>
            </View>

            <View style={styles.actions}>
              <View style={styles.action}>
                <Button title="Add menu item" icon="add" compact onPress={() => router.push('/food/menu/new')}/>
              </View>
              <View style={styles.action}>
                <Button title="All orders" variant="secondary" icon="bag-handle-outline" compact onPress={() => router.navigate('/food/orders')}/>
              </View>
            </View>

            <View style={styles.section}>
              <SectionHeader title="Needs attention" actionLabel={data.active.length ? 'See all' : undefined} onAction={() => router.navigate('/food/orders')}/>
              {data.active.length ? (data.active.map((order) => (<FoodOrderCard key={order.id} order={order} onPress={() => router.push(`/food/orders/${order.id}`)}/>))) : data.items === 0 ? (<EmptyState icon="fast-food-outline" title="Add your first item" message="Customers can only order what's on your menu." actionLabel="Add menu item" onAction={() => router.push('/food/menu/new')}/>) : (<EmptyState icon="cafe-outline" title="No active orders" message={vendor.is_open ? 'New paid orders show up here automatically.' : 'Open your shop to start receiving orders.'}/>)}
            </View>
          </>) : null}
      </ScrollView>
    </SafeScreen>);
}
