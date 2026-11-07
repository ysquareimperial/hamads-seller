import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { uploadSingleImage } from '@/api/s3Upload';
import { cleanParams } from '@/utils/format';

const F = endpoints.food;

export const foodVendorService = {
    /** VendorOut, or null when this seller has no food shop yet (404). */
    async getProfile() {
        try {
            const { data } = await apiClient.get(F.profile);
            return data;
        }
        catch (error) {
            if (error.response?.status === 404) return null;
            throw error;
        }
    },
    /** Creates the shop the first time, updates it after. Only sent fields change. */
    async saveProfile(payload) {
        const { data } = await apiClient.put(F.profile, payload);
        return data;
    },
    async setOpen(is_open) {
        const { data } = await apiClient.put(F.status, { is_open });
        return data;
    },
    async categories() {
        const { data } = await apiClient.get(F.categories);
        return data;
    },

    async listItems() {
        const { data } = await apiClient.get(F.items);
        return data;
    },
    async createItem(payload) {
        const { data } = await apiClient.post(F.items, payload);
        return data;
    },
    async updateItem(id, payload) {
        const { data } = await apiClient.patch(F.item(id), payload);
        return data;
    },
    async deleteItem(id) {
        await apiClient.delete(F.item(id));
    },
    async setAvailability(id, is_available) {
        const { data } = await apiClient.put(F.itemAvailability(id), { is_available });
        return data;
    },
    /** Uploads one picked image and resolves to its image_key. */
    uploadItemImage(image) {
        return uploadSingleImage(image, async (content_type) => (await apiClient.post(F.itemImageUploadUrl, { content_type })).data);
    },

    /** Dish schedule: { availability_mode, weekdays, preorder_quantity, sameday_quantity, dates, + upcoming day rows with *_sold }. */
    async itemSchedule(id) {
        const { data } = await apiClient.get(F.itemSchedule(id));
        return data;
    },
    /** { availability_mode: every_day|weekdays|dates, weekdays: [0..6] (0=Mon), preorder_quantity, sameday_quantity, dates: [{ day, preorder_quantity }] }. Null quantity = no limit. */
    async saveItemSchedule(id, payload) {
        const { data } = await apiClient.put(F.itemSchedule(id), payload);
        return data;
    },
    /** One day's limits for a dish (null = the dish's usual). 409 if lower than already ordered. */
    async setDayLimit(id, date, payload) {
        const { data } = await apiClient.put(F.itemDay(id, date), payload);
        return data;
    },
    /** Hours planned orders can be delivered in: { window_start_hour, window_end_hour }. */
    async saveScheduleSettings(payload) {
        const { data } = await apiClient.put(F.scheduleSettings, payload);
        return data;
    },
    /** Per day for the next `days`: order_count, items ("12 x Jollof rice"), windows. */
    async plan(days = 7) {
        const { data } = await apiClient.get(F.plan, { params: { days } });
        return data;
    },

    /** Paid orders, newest first. Returns { items } (the API has no total). */
    async listOrders({ status, limit, offset }) {
        const { data } = await apiClient.get(F.orders, { params: cleanParams({ status, limit, offset }) });
        return { items: data };
    },
    async accept(id, prep_minutes) {
        const { data } = await apiClient.post(F.accept(id), prep_minutes ? { prep_minutes } : {});
        return data;
    },
    async reject(id, reason) {
        const { data } = await apiClient.post(F.reject(id), { reason });
        return data;
    },
    async markReady(id) {
        const { data } = await apiClient.post(F.ready(id));
        return data;
    },
    async completePickup(id, code) {
        const { data } = await apiClient.post(F.completePickup(id), { code });
        return data;
    },
};
