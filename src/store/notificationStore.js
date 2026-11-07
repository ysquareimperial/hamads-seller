import { create } from 'zustand';

import { notificationsService } from '@/features/notifications/notificationsService';

import { useAuthStore } from './authStore';

/** Unread count for the bell badge. Refreshed on hub focus and after reading. */
export const useNotificationStore = create((set) => ({
    unread: 0,
    refresh: async () => {
        try {
            set({ unread: await notificationsService.unreadCount() });
        }
        catch {
            // keep the last value
        }
    },
    setUnread: (unread) => set({ unread }),
}));

useAuthStore.subscribe((state, prev) => {
    if (prev.status === 'authenticated' && state.status !== 'authenticated') useNotificationStore.setState({ unread: 0 });
});
