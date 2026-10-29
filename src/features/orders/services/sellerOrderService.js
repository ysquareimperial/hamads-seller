import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { cleanParams } from '@/utils/format';

export const sellerOrderService = {
    /** Returns { items, total, limit, offset }. */
    async list({ status, limit, offset }) {
        const { data } = await apiClient.get(endpoints.orders.root, { params: cleanParams({ status, limit, offset }) });
        return data;
    },
    async get(id) {
        const { data } = await apiClient.get(endpoints.orders.item(id));
        return data;
    },
    /** awaiting_fulfillment -> processing */
    async process(id) {
        const { data } = await apiClient.post(endpoints.orders.process(id));
        return data;
    },
    /** processing -> shipped. Both fields optional. */
    async ship(id, { tracking_number, carrier_name }) {
        const { data } = await apiClient.post(endpoints.orders.ship(id), {
            tracking_number: tracking_number || null,
            carrier_name: carrier_name || null,
        });
        return data;
    },
    async cancel(id, reason) {
        const { data } = await apiClient.post(endpoints.orders.cancel(id), { reason });
        return data;
    },
    /** Count for one status, via a 1-item page. */
    async count(status) {
        const { data } = await apiClient.get(endpoints.orders.root, { params: cleanParams({ status, limit: 1, offset: 0 }) });
        return data.total ?? 0;
    },
};
