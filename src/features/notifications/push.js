import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { colors } from '@/theme';

const TOKEN_KEY = 'push.expo_token';
export const ANDROID_CHANNEL = 'orders';

// Show pushes as banners even while the app is open.
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

const projectId = () => Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId ?? null;

/** Expo Go on Android can't receive remote pushes (needs a development or store build). */
const pushUnsupported = () => Platform.OS === 'web'
    || !Device.isDevice
    || (Platform.OS === 'android' && Constants.executionEnvironment === ExecutionEnvironment.StoreClient);

/**
 * Asks permission, gets this phone's Expo push token and saves it on the server
 * (POST /notifications/devices). Call after every login / app start. Never throws.
 */
export async function registerForPush() {
    if (pushUnsupported()) return null;
    try {
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL, {
                name: 'Orders and updates',
                // eslint-disable-next-line import/namespace -- re-exported enum the linter can't see
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: colors.primary,
                sound: 'default',
            });
        }
        let { status } = await Notifications.getPermissionsAsync();
        if (status !== 'granted') ({ status } = await Notifications.requestPermissionsAsync());
        if (status !== 'granted') return null;
        const id = projectId();
        if (!id) return null;
        const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId: id });
        await apiClient.post(endpoints.notifications.devices, { token, platform: Platform.OS === 'ios' ? 'ios' : 'android' });
        await SecureStore.setItemAsync(TOKEN_KEY, token).catch(() => { });
        return token;
    }
    catch (e) {
        if (__DEV__) console.warn('[push] registration failed:', e?.message ?? e);
        return null;
    }
}

/** Stops pushes to this phone (POST /notifications/devices/remove). Call before logging out. Never throws. */
export async function unregisterPush() {
    try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (!token) return;
        await apiClient.post(endpoints.notifications.removeDevice, { token });
        await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
    catch {
        // best-effort
    }
}
