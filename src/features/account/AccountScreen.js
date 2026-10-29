import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useSegments } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';

import { AppearanceSetting } from '@/components/ui/AppearanceSetting';
import { Card } from '@/components/ui/Card';
import { LoadingView } from '@/components/ui/LoadingView';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { BUSINESS } from '@/features/business/businessConfig';
import { useAuthStore } from '@/store/authStore';
import { useBusinessStore } from '@/store/businessStore';
import { colors } from '@/theme';

import { styles } from './AccountScreen.styles';

const initialsOf = (s) => `${s.first_name?.[0] ?? ''}${s.last_name?.[0] ?? ''}`.toUpperCase() || '?';

function MenuRow({ icon, label, hint, onPress, right, border }) {
    return (<Pressable accessibilityRole="button" onPress={onPress} style={[styles.row, border && styles.rowBorder]}>
      <View style={styles.iconTile}>
        <Ionicons name={icon} size={20} color={colors.primary}/>
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        {hint ? <Text style={styles.rowHint} numberOfLines={1}>{hint}</Text> : null}
      </View>
      {right ?? <Ionicons name="chevron-forward" size={18} color={colors.disabled}/>}
    </Pressable>);
}

/** Shared Account tab for both the Online Store and the Food Shop. */
export function AccountScreen() {
    const segments = useSegments();
    const inFood = segments.includes('food');
    const seller = useAuthStore((s) => s.seller);
    const loadSeller = useAuthStore((s) => s.loadSeller);
    const logout = useAuthStore((s) => s.logout);
    const storeEnabled = useBusinessStore((s) => s.storeEnabled);
    const vendor = useBusinessStore((s) => s.vendor);
    const loadBusiness = useBusinessStore((s) => s.load);
    const [refreshing, setRefreshing] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const refresh = async () => {
        setRefreshing(true);
        await Promise.all([loadSeller(), loadBusiness()]);
        setRefreshing(false);
    };

    const confirmLogout = () => {
        Alert.alert('Log out?', 'This logs you out of both your Online Store and Food Shop.', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Log out',
                style: 'destructive',
                onPress: async () => {
                    setLoggingOut(true);
                    try {
                        await logout();
                    }
                    finally {
                        setLoggingOut(false);
                    }
                },
            },
        ]);
    };

    const other = inFood ? BUSINESS.store : BUSINESS.food;
    const otherActive = inFood ? storeEnabled : !!vendor;
    const goOther = () => {
        router.dismissTo('/');
        router.push(otherActive ? `/${other.key}` : `/setup/${other.key}`);
    };

    return (<SafeScreen>
      <ScreenHeader title="Account" subtitle={inFood ? BUSINESS.food.name : BUSINESS.store.name} showBack={false}/>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]}/>}>
        {!seller ? (<LoadingView />) : (<Pressable accessibilityRole="button" onPress={() => router.push('/profile')} style={styles.hero}>
            <View style={styles.avatar}>
              {seller.profile_image_url ? (<Image source={{ uri: seller.profile_image_url }} style={styles.avatarImage} contentFit="cover"/>) : (<Text style={styles.avatarText}>{initialsOf(seller)}</Text>)}
            </View>
            <View style={styles.heroText}>
              <Text style={styles.brand} numberOfLines={1}>{inFood && vendor ? vendor.display_name : seller.brand_name}</Text>
              <Text style={styles.name} numberOfLines={1}>{`${seller.first_name} ${seller.last_name}`}</Text>
              <View style={styles.badges}>
                {inFood && vendor ? (<StatusBadge tone={vendor.is_approved ? 'success' : 'warning'} text={vendor.is_approved ? 'Shop approved' : 'Shop under review'}/>) : (<StatusBadge tone={seller.is_approved ? 'success' : 'warning'} text={seller.is_approved ? 'Approved seller' : 'Under review'}/>)}
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.disabled}/>
          </Pressable>)}

        <View style={styles.menu}>
          <MenuRow icon="person-circle-outline" label="Edit profile" hint="Name, photo, brand, address" onPress={() => router.push('/profile')}/>
          {inFood ? (<MenuRow border icon="settings-outline" label="Shop settings" hint="Name, pickup location, prep time" onPress={() => router.push('/food/settings')}/>) : null}
          <MenuRow border icon="wallet-outline" label="Payments" hint="Wallet, bank account, payouts" onPress={() => router.push('/payments')}/>
          <MenuRow border icon="eye-outline" label="Preview your public store" hint={seller?.username ? `@${seller.username}` : undefined} onPress={() => router.push('/store-preview')}/>
          <MenuRow border icon={other.icon} label={otherActive ? `Go to ${other.name}` : `Open a ${other.name}`} hint={otherActive ? 'Switch business' : other.tagline} onPress={goOther}/>
          <MenuRow border icon="swap-horizontal" label="All businesses" onPress={() => router.dismissTo('/')}/>
        </View>

        <Card>
          <AppearanceSetting />
        </Card>

        <Pressable accessibilityRole="button" disabled={loggingOut} onPress={confirmLogout} style={styles.logout}>
          {loggingOut ? <ActivityIndicator color={colors.danger}/> : <Ionicons name="log-out-outline" size={20} color={colors.danger}/>}
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </ScrollView>
    </SafeScreen>);
}
