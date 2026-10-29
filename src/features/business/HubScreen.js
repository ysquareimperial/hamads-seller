import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';

import { IconButton } from '@/components/ui/IconButton';
import { NoticeBanner } from '@/components/ui/NoticeBanner';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { authService } from '@/features/auth/services/authService';
import { paymentsService } from '@/features/payments/services/paymentsService';
import { shareStore, storeLinkLabel } from '@/features/username/username';
import { useAsyncData } from '@/hooks/useAsyncData';
import { foodVendorService } from '@/features/food/services/foodVendorService';
import { sellerOrderService } from '@/features/orders/services/sellerOrderService';
import { useAuthStore } from '@/store/authStore';
import { useBusinessStore } from '@/store/businessStore';
import { colors } from '@/theme';
import { formatMinor } from '@/utils/format';

import { BUSINESS } from './businessConfig';
import { BusinessCard } from './BusinessCard';
import { OnboardingCard } from './OnboardingCard';
import { styles } from './HubScreen.styles';

const initialsOf = (s) => `${s?.first_name?.[0] ?? ''}${s?.last_name?.[0] ?? ''}`.toUpperCase() || '?';
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

export function HubScreen() {
    const seller = useAuthStore((s) => s.seller);
    const loadSeller = useAuthStore((s) => s.loadSeller);
    const { status, storeEnabled, vendor, error, load } = useBusinessStore();
    const [refreshing, setRefreshing] = useState(false);

    // Counts per business, setup checklist and wallet balance.
    const { data: counts, reload: reloadCounts } = useAsyncData(async () => {
        const [toFulfil, newFood, onboarding, wallet] = await Promise.allSettled([
            storeEnabled ? sellerOrderService.count('awaiting_fulfillment') : Promise.resolve(null),
            vendor ? foodVendorService.listOrders({ status: 'paid', limit: 50, offset: 0 }).then((r) => r.items.length) : Promise.resolve(null),
            authService.onboarding(),
            paymentsService.wallet(),
        ]);
        const val = (r) => (r.status === 'fulfilled' ? r.value : null);
        return { toFulfil: val(toFulfil), newFood: val(newFood), onboarding: val(onboarding), wallet: val(wallet) };
    }, [storeEnabled, vendor?.id]);

    // Re-check every time the hub comes back into view (e.g. after finishing setup).
    useFocusEffect(useCallback(() => {
        void load();
        void reloadCounts({ silent: true });
    }, [load, reloadCounts]));

    const refresh = async () => {
        setRefreshing(true);
        await Promise.all([load(), loadSeller(), reloadCounts({ silent: true })]);
        setRefreshing(false);
    };

    const loading = status === 'idle' || status === 'loading';

    const storeBadges = [seller?.is_approved ? { text: 'Approved', tone: 'success' } : { text: 'Under review', tone: 'warning' }];
    const foodBadges = vendor ? [
        vendor.is_approved ? { text: 'Approved', tone: 'success' } : { text: 'Under review', tone: 'warning' },
        vendor.is_open ? { text: 'Open', tone: 'success' } : { text: 'Closed', tone: 'neutral' },
    ] : [];

    return (<SafeScreen>
      <View style={styles.header}>
        <View style={styles.avatar}>
          {seller?.profile_image_url ? (<Image source={{ uri: seller.profile_image_url }} style={styles.avatarImage} contentFit="cover"/>) : (<Text style={styles.avatarText}>{initialsOf(seller)}</Text>)}
        </View>
        <View style={styles.headerText}>
          <Text style={styles.hello}>Welcome back</Text>
          <Text style={styles.name} numberOfLines={1}>{seller ? `${seller.first_name} ${seller.last_name}` : ' '}</Text>
        </View>
        <IconButton icon="person-outline" accessibilityLabel="Profile" onPress={() => router.push('/profile')}/>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]}/>}>
        <View style={styles.intro}>
          <Text style={styles.title}>Your businesses</Text>
          <Text style={styles.subtitle}>One account, two ways to sell. Pick where you want to work.</Text>
        </View>

        {seller?.username ? (<View style={styles.linkBar}>
            <Ionicons name="link" size={18} color={colors.primary}/>
            <Pressable accessibilityRole="button" onPress={() => router.push('/store-preview')} style={styles.linkTextWrap}>
              <Text style={styles.linkText} numberOfLines={1}>{storeLinkLabel(seller.username)}</Text>
              <Text style={styles.linkHint}>Your public store · Tap to preview</Text>
            </Pressable>
            <IconButton icon="share-social-outline" accessibilityLabel="Share store link" onPress={() => shareStore(seller.username, seller.brand_name)}/>
          </View>) : null}

        <OnboardingCard onboarding={counts?.onboarding} vendor={vendor} storeEnabled={storeEnabled}/>

        {status === 'error' && error ? <NoticeBanner message={`${error} Pull down to try again.`}/> : null}

        <BusinessCard config={BUSINESS.store} active={storeEnabled} loading={loading} title={seller?.brand_name} badges={storeBadges} highlight={counts?.toFulfil ? `${plural(counts.toFulfil, 'order')} to fulfil` : null} onPress={() => router.push(storeEnabled ? '/store' : '/setup/store')}/>

        <BusinessCard config={BUSINESS.food} active={!!vendor} loading={loading} title={vendor?.display_name} badges={foodBadges} highlight={counts?.newFood ? `${plural(counts.newFood, 'new order')}` : null} onPress={() => router.push(vendor ? '/food' : '/setup/food')}/>

        <Pressable accessibilityRole="button" onPress={() => router.push('/payments')} style={styles.money}>
          <View style={styles.moneyIcon}>
            <Ionicons name="wallet-outline" size={22} color={colors.primary}/>
          </View>
          <View style={styles.moneyText}>
            <Text style={styles.moneyLabel}>Payments</Text>
            <Text style={styles.moneyValue}>{counts?.wallet ? `${formatMinor(counts.wallet.available_minor)} available` : 'Wallet, bank account & payouts'}</Text>
            {counts?.wallet?.pending_minor ? (<Text style={styles.moneyHint}>{`${formatMinor(counts.wallet.pending_minor)} on hold`}</Text>) : null}
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.disabled}/>
        </Pressable>
      </ScrollView>
    </SafeScreen>);
}
