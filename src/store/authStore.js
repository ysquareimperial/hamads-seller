import { create } from 'zustand';

import { setSessionExpiredHandler } from '@/api/client';
import { authService } from '@/features/auth/services/authService';
import { tokenStorage } from '@/features/auth/services/tokenStorage';

export const useAuthStore = create((set, get) => ({
    status: 'loading', // loading | authenticated | signedOut
    seller: null, // GET /auth/seller/me

    restoreSession: async () => {
        try {
            const tokens = await tokenStorage.load();
            set({ status: tokens ? 'authenticated' : 'signedOut' });
            if (tokens) void get().loadSeller();
        }
        catch {
            set({ status: 'signedOut' });
        }
    },

    /** Fetches the seller profile. Returns it, or null on failure. */
    loadSeller: async () => {
        try {
            const seller = await authService.me();
            set({ seller });
            return seller;
        }
        catch {
            return null;
        }
    },

    /** `seller` may be passed when the caller already fetched it. */
    completeSignIn: async (tokens, seller = null) => {
        await tokenStorage.save(tokens);
        set({ status: 'authenticated', seller });
        if (!seller) void get().loadSeller();
    },

    setSeller: (seller) => set({ seller }),

    logout: async () => {
        const tokens = tokenStorage.get();
        try {
            if (tokens) await authService.logout({ refresh_token: tokens.refresh_token });
        }
        catch {
            // Logout is best-effort server-side; always clear locally.
        }
        await tokenStorage.clear();
        set({ status: 'signedOut', seller: null });
    },
}));

// If the refresh token is rejected, end the session locally.
setSessionExpiredHandler(() => {
    void tokenStorage.clear();
    useAuthStore.setState({ status: 'signedOut', seller: null });
});
