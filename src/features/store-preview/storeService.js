import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';

/** Public store page data — exactly what customers see at the seller's link. */
export const storeService = {
    async profile(username) {
        const { data } = await apiClient.get(endpoints.stores.profile(username));
        return data;
    },
    async products(username, page = 1, page_size = 40) {
        const { data } = await apiClient.get(endpoints.stores.products(username), { params: { page, page_size } });
        return data;
    },
    async food(username) {
        const { data } = await apiClient.get(endpoints.stores.food(username));
        return data;
    },
};
