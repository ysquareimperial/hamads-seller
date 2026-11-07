import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { cleanParams } from '@/utils/format';

const M = endpoints.market;

/**
 * Hamads delivery: sellers never deliver to buyers. Each paid order goes to the warehouse,
 * either collected by a Hamads rider (pickup fee from earnings) or dropped off by the seller (free).
 */
export const handoverService = {
    /** { default_handover: 'rider_pickup' | 'seller_dropoff' } */
    async settings() {
        const { data } = await apiClient.get(M.settings);
        return data;
    },
    async saveSettings(default_handover) {
        const { data } = await apiClient.put(M.settings, { default_handover });
        return data;
    },
    /** { items: JobOut[], total } */
    async pickups({ status, limit, offset }) {
        const { data } = await apiClient.get(M.pickups, { params: cleanParams({ status, limit, offset }) });
        return data;
    },
    /** Switch one order's handover. Allowed until a rider is assigned. */
    async switchMethod(jobId, method) {
        const { data } = await apiClient.post(M.handover(jobId), { method });
        return data;
    },
    /** The pickup job for one seller order (no direct lookup endpoint, so searches recent jobs). */
    async forOrder(sellerOrderId) {
        const { items } = await handoverService.pickups({ limit: 100, offset: 0 });
        return items.find((j) => j.seller_order_id === sellerOrderId) ?? null;
    },
};
