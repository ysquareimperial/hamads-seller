import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { AppState } from 'react-native';

import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { useRefreshStore } from '@/store/refreshStore';

import { notificationRoute } from './notificationRoute';
import { notificationsService } from './notificationsService';
import { registerForPush } from './push';

let lastHandled = null;

/** Push payload -> the shape notificationRoute expects ({ type, data }). */
const fromPush = (notification) => {
    const data = notification.request.content.data ?? {};
    return { type: data.type ?? data.notification_type ?? '', data };
};

/** Refetch whichever lists the notification is about. */
function refreshFor(type) {
    const t = String(type ?? '');
    const r = useRefreshStore.getState();
    if (/food|planned/.test(t)) r.bumpFoodOrders();
    if (/order|pickup|market/.test(t) && !/food|planned/.test(t)) r.bumpOrders();
}

function openFromPush(response) {
    const id = response.notification.request.identifier;
    if (lastHandled === id) return;
    lastHandled = id;
    const n = fromPush(response.notification);
    const notificationId = n.data.notification_id ?? n.data.id;
    if (notificationId) notificationsService.markRead(notificationId).then(useNotificationStore.getState().setUnread).catch(() => { });
    const route = notificationRoute(n);
    if (route) router.push(route);
}

/**
 * While signed in: registers this phone for pushes, keeps the bell count fresh,
 * refreshes lists when a push arrives, and opens the right screen when one is tapped.
 */
export function usePushNotifications() {
    const status = useAuthStore((s) => s.status);

    useEffect(() => {
        if (status !== 'authenticated') return undefined;
        void registerForPush();
        void useNotificationStore.getState().refresh();

        const received = Notifications.addNotificationReceivedListener((notification) => {
            void useNotificationStore.getState().refresh();
            refreshFor(fromPush(notification).type);
        });
        const tapped = Notifications.addNotificationResponseReceivedListener(openFromPush);
        const tokenChanged = Notifications.addPushTokenListener(() => void registerForPush());
        const appState = AppState.addEventListener('change', (state) => {
            if (state === 'active') void useNotificationStore.getState().refresh();
        });

        // App opened by tapping a push while it was closed.
        const launch = Notifications.getLastNotificationResponse();
        if (launch) setTimeout(() => openFromPush(launch), 300);

        return () => {
            received.remove();
            tapped.remove();
            tokenChanged.remove();
            appState.remove();
        };
    }, [status]);
}
