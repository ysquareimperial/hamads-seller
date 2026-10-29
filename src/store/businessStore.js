import { create } from 'zustand';

import { addToSells, sellsProducts } from '@/features/business/sells';
import { foodVendorService } from '@/features/food/services/foodVendorService';
import { getErrorMessage } from '@/utils/getErrorMessage';

import { useAuthStore } from './authStore';

/**
 * Which businesses this seller runs.
 * - storeEnabled: SellerMe.sells includes products.
 * - vendor: GET /food/vendor/profile, null when no food shop exists yet.
 */
export const useBusinessStore = create((set, get) => ({
    status: 'idle', // idle | loading | ready | error
    storeEnabled: false,
    vendor: null,
    error: null,

    load: async () => {
        if (get().status === 'idle') set({ status: 'loading', error: null });
        const [sellerResult, vendorResult] = await Promise.allSettled([
            useAuthStore.getState().loadSeller(),
            foodVendorService.getProfile(),
        ]);
        const seller = (sellerResult.status === 'fulfilled' && sellerResult.value) || useAuthStore.getState().seller;
        const storeEnabled = sellsProducts(seller?.sells);

        if (vendorResult.status === 'rejected') {
            set((s) => ({ status: s.status === 'ready' ? 'ready' : 'error', storeEnabled, error: getErrorMessage(vendorResult.reason) }));
            return;
        }
        set({ status: 'ready', storeEnabled, vendor: vendorResult.value, error: null });
    },

    /** Records that this seller now also sells `kind` ('store' | 'food'). */
    addBusiness: async (kind) => {
        const updated = await addToSells(useAuthStore.getState().seller, kind);
        if (updated) useAuthStore.getState().setSeller(updated);
        if (kind === 'store') set({ storeEnabled: true });
    },

    setVendor: (vendor) => set({ vendor }),

    reset: () => set({ status: 'idle', storeEnabled: false, vendor: null, error: null }),
}));

// Signing out (or an expired session) clears what we knew about this seller's businesses.
useAuthStore.subscribe((state, prev) => {
    if (prev.status === 'authenticated' && state.status !== 'authenticated') useBusinessStore.getState().reset();
});
