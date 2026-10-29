import * as SecureStore from 'expo-secure-store';

const ACCESS_KEY = 'seller.access_token';
const REFRESH_KEY = 'seller.refresh_token';

// In-memory cache so the HTTP client never awaits SecureStore per request.
let cache = null;

export const tokenStorage = {
    /** Synchronous read for the HTTP client. Call `load()` once at startup. */
    get() {
        return cache;
    },
    async load() {
        const [access, refresh] = await Promise.all([
            SecureStore.getItemAsync(ACCESS_KEY),
            SecureStore.getItemAsync(REFRESH_KEY),
        ]);
        cache = access && refresh ? { access_token: access, refresh_token: refresh } : null;
        return cache;
    },
    async save(tokens) {
        cache = { access_token: tokens.access_token, refresh_token: tokens.refresh_token };
        await Promise.all([
            SecureStore.setItemAsync(ACCESS_KEY, tokens.access_token),
            SecureStore.setItemAsync(REFRESH_KEY, tokens.refresh_token),
        ]);
    },
    async clear() {
        cache = null;
        await Promise.all([
            SecureStore.deleteItemAsync(ACCESS_KEY),
            SecureStore.deleteItemAsync(REFRESH_KEY),
        ]);
    },
};
