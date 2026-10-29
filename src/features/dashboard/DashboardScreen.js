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
import { SellerOrderCard } from '@/features/orders/components/SellerOrderCard';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useAuthStore } from '@/store/authStore';
import { useRefreshStore } from '@/store/refreshStore';
import { colors } from '@/theme';

import { BUSINESS } from '@/features/business/businessConfig';

import { loadDashboard } from './dashboardService';
import { styles } from './DashboardScreen.styles';
import { StatTile } from './StatTile';

const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
};

const countText = (c) => (c ? `${c.value}${c.capped ? '+' : ''}` : null);

export function DashboardScreen() {
    const seller = useAuthStore((s) => s.seller);
    const loadSeller = useAuthStore((s) => s.loadSeller);
    const productsVersion = useRefreshStore((s) => s.products);
    const ordersVersion = useRefreshStore((s) => s.orders);
    const { data, loading, error, reload } = useAsyncData(loadDashboard, [productsVersion, ordersVersion]);
    const [refreshing, setRefreshing] = useState(false);

    const refresh = async () => {
        setRefreshing(true);
        await Promise.all([reload({ silent: true }), loadSeller()]);
        setRefreshing(false);
    };

    return (<SafeScreen>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.hello}>{`${greeting()}${seller?.first_name ? `, ${seller.first_name}` : ''}`}</Text>
          <Text style={styles.store} numberOfLines={1}>{seller?.brand_name ?? 'Your store'}</Text>
          <Text style={styles.kind}>{BUSINESS.store.name}</Text>
        </View>
        <IconButton icon="swap-horizontal" accessibilityLabel="Switch business" onPress={() => router.dismissTo('/')}/>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]}/>}>
        {seller && !seller.is_approved ? (<NoticeBanner title="Store under review" message="Hamads is reviewing your store. You can add products now — they go live once your store and each product are approved."/>) : null}

        {loading && !data ? (<LoadingView />) : error && !data ? (<ErrorState message={error} onRetry={() => reload()}/>) : data ? (<>
            <View style={styles.grid}>
              <StatTile icon="time-outline" tone={data.orders.toFulfil ? 'warning' : 'primary'} label="To fulfil" value={data.orders.toFulfil} onPress={() => router.navigate('/store/orders')}/>
              <StatTile icon="cube-outline" label="Processing" value={data.orders.processing} onPress={() => router.navigate('/store/orders')}/>
              <StatTile icon="paper-plane-outline" label="Shipped" value={data.orders.shipped} onPress={() => router.navigate('/store/orders')}/>
              <StatTile icon="pricetags-outline" label="Products" value={countText(data.products)} onPress={() => router.navigate('/store/products')}/>
              <StatTile icon="hourglass-outline" tone={data.inReview?.value ? 'warning' : 'primary'} label="In review" value={countText(data.inReview)} onPress={() => router.navigate('/store/products')}/>
              <StatTile icon="alert-circle-outline" tone={data.lowStock ? 'danger' : 'primary'} label="Low stock (≤3)" value={data.lowStock} onPress={() => router.navigate('/store/products')}/>
            </View>

            <View style={styles.actions}>
              <View style={styles.action}>
                <Button title="Add product" icon="add" compact onPress={() => router.push('/store/products/new')}/>
              </View>
              <View style={styles.action}>
                <Button title="View orders" variant="secondary" icon="receipt-outline" compact onPress={() => router.navigate('/store/orders')}/>
              </View>
            </View>

            <View style={styles.section}>
              <SectionHeader title="Recent orders" actionLabel={data.recent.length ? 'See all' : undefined} onAction={() => router.navigate('/store/orders')}/>
              {data.recent.length ? (data.recent.map((order) => (<SellerOrderCard key={order.id} order={order} onPress={() => router.push(`/store/orders/${order.id}`)}/>))) : (<EmptyState icon="receipt-outline" title="No orders yet" message="New orders from customers will show up here."/>)}
            </View>
          </>) : null}
      </ScrollView>
    </SafeScreen>);
}
