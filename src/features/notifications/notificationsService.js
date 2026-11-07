import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';

const N = endpoints.notifications;

export const notificationsService = {
    /** { items, total, limit, offset, unread_count } */
    async list({ limit = 20, offset = 0, unread_only = false } = {}) {
        const { data } = await apiClient.get(N.list, { params: { limit, offset, unread_only } });
        return data;
    },
    async unreadCount() {
        const { data } = await apiClient.get(N.unreadCount);
        return data.unread_count ?? 0;
    },
    async markRead(id) {
        const { data } = await apiClient.post(N.read(id));
        return data.unread_count ?? 0;
    },
    async markAllRead() {
        const { data } = await apiClient.post(N.readAll);
        return data.unread_count ?? 0;
    },
};
