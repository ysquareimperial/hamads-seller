import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { cleanParams } from '@/utils/format';

export const productService = {
    /** Seller's own products, including unapproved and inactive. Returns { items }. */
    async listMine({ is_active, is_approved, limit, offset }) {
        const { data } = await apiClient.get(endpoints.catalog.myProducts, {
            params: cleanParams({ is_active, is_approved, limit, offset }),
        });
        return { items: data };
    },
    /** Seller's own product with all variants (including removed ones), approved or not. */
    async get(id) {
        const { data } = await apiClient.get(endpoints.catalog.myProduct(id));
        return data;
    },
    /** Turns a plain product into one with options, e.g. ["Size", "Color"]. */
    async setOptions(id, option_names) {
        const { data } = await apiClient.put(endpoints.catalog.options(id), { option_names });
        return data;
    },
    async addVariant(id, payload) {
        const { data } = await apiClient.post(endpoints.catalog.variants(id), payload);
        return data;
    },
    async updateVariant(id, variantId, payload) {
        const { data } = await apiClient.patch(endpoints.catalog.variant(id, variantId), payload);
        return data;
    },
    async removeVariant(id, variantId) {
        await apiClient.delete(endpoints.catalog.variant(id, variantId));
    },
    async create(payload) {
        const { data } = await apiClient.post(endpoints.catalog.products, payload);
        return data;
    },
    /** PATCH: only the fields present in `payload` are changed. */
    async update(id, payload) {
        const { data } = await apiClient.patch(endpoints.catalog.product(id), payload);
        return data;
    },
    async remove(id) {
        await apiClient.delete(endpoints.catalog.product(id));
    },
    async categories() {
        const { data } = await apiClient.get(endpoints.catalog.categories);
        return data;
    },
    async brands() {
        const { data } = await apiClient.get(endpoints.catalog.brands);
        return data;
    },
    async popularTags(limit = 30) {
        const { data } = await apiClient.get(endpoints.catalog.tags, { params: { limit } });
        return data;
    },
};
