import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';

import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { IconButton } from '@/components/ui/IconButton';
import { LoadingView } from '@/components/ui/LoadingView';
import { NoticeBanner } from '@/components/ui/NoticeBanner';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { shareStore, storeLinkLabel } from '@/features/username/username';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/theme';
import { formatNaira } from '@/utils/format';

import { storeService } from './storeService';
import { styles } from './StorePreviewScreen.styles';

const TAB_LABEL = { products: 'Products', food: 'Food' };

/** GET /stores/{username}: what customers see at the seller's public link. */
export function StorePreviewScreen() {
    const seller = useAuthStore((s) => s.seller);
    const username = seller?.username;
    const { data: store, loading, error, reload } = useAsyncData(() => (username ? storeService.profile(username) : Promise.resolve(null)), [username]);
    const [tab, setTab] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const refresh = async () => {
        setRefreshing(true);
        await reload({ silent: true });
        setRefreshing(false);
    };

    const header = (<ScreenHeader title="Public store" subtitle={username ? storeLinkLabel(username) : undefined} right={username ? <IconButton icon="share-social-outline" accessibilityLabel="Share" onPress={() => shareStore(username, seller.brand_name)}/> : null}/>);

    if (!username || (loading && !store)) {
        return (<SafeScreen edges={['top', 'bottom']}>
        {header}
        <LoadingView />
      </SafeScreen>);
    }
    if (error && !store) {
        return (<SafeScreen edges={['top', 'bottom']}>
        {header}
        <ErrorState message={error} onRetry={() => reload()}/>
      </SafeScreen>);
    }

    const tabs = store.tabs ?? [];
    const active = tab ?? store.default_tab ?? tabs[0] ?? null;

    return (<SafeScreen edges={['top', 'bottom']}>
      {header}
      <ScrollView contentContainerStyle={styles.scroll} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]}/>}>
        <NoticeBanner tone="info" message="This is what customers see at your link. Only approved, active items appear."/>

        <View style={styles.hero}>
          <View style={styles.avatar}>
            {store.picture_url ? <Image source={{ uri: store.picture_url }} style={styles.avatarImage} contentFit="cover"/> : <Ionicons name="storefront" size={26} color={colors.textOnPrimary}/>}
          </View>
          <View style={styles.heroText}>
            <Text style={styles.name}>{store.name}</Text>
            <Text style={styles.handle}>{`@${store.username}`}</Text>
          </View>
        </View>

        {tabs.length > 1 ? (<SegmentedControl options={tabs.map((t) => ({ value: t, label: TAB_LABEL[t] ?? t }))} value={active} onChange={setTab}/>) : null}

        {!tabs.length ? (<EmptyState icon="eye-off-outline" title="Nothing to show yet" message="Your store appears here once you have approved products or an approved food shop."/>) : null}

        {active === 'products' && store.products ? (<View style={styles.grid}>
            {store.products.items.length ? store.products.items.map((p) => (<View key={p.id} style={styles.tile}>
                <View style={styles.tileImage}>
                  {p.thumbnail_url ? <Image source={{ uri: p.thumbnail_url }} style={styles.image} contentFit="cover"/> : <Ionicons name="image-outline" size={24} color={colors.disabled}/>}
                </View>
                <Text style={styles.tileName} numberOfLines={2}>{p.name}</Text>
                <Text style={styles.tilePrice}>{formatNaira(p.price)}</Text>
              </View>)) : <EmptyState icon="pricetags-outline" title="No live products" message="Approved products show here."/>}
            {store.products.total > store.products.items.length ? (<Text style={styles.more}>{`+ ${store.products.total - store.products.items.length} more`}</Text>) : null}
          </View>) : null}

        {active === 'food' && store.food ? (<View style={styles.food}>
            <View style={styles.shopRow}>
              <View style={[styles.dot, store.food.shop.is_open ? styles.dotOpen : styles.dotClosed]}/>
              <Text style={styles.shopText}>{`${store.food.shop.is_open ? 'Open' : 'Closed'} · ${store.food.pickup_address}`}</Text>
            </View>
            {store.food.items.length ? store.food.items.map((i) => (<View key={i.id} style={[styles.foodRow, !i.is_available && styles.unavailable]}>
                <View style={styles.foodImage}>
                  {i.image_url ? <Image source={{ uri: i.image_url }} style={styles.image} contentFit="cover"/> : <Ionicons name="fast-food-outline" size={20} color={colors.disabled}/>}
                </View>
                <View style={styles.foodText}>
                  <Text style={styles.tileName} numberOfLines={1}>{i.name}</Text>
                  {i.description ? <Text style={styles.foodDesc} numberOfLines={2}>{i.description}</Text> : null}
                </View>
                <Text style={styles.tilePrice}>{formatNaira(i.price)}</Text>
              </View>)) : <EmptyState icon="fast-food-outline" title="Menu is empty" message="Items you add show here."/>}
          </View>) : null}
      </ScrollView>
    </SafeScreen>);
}
