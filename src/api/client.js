import { create as createAxios, isAxiosError } from 'axios';

import { API_URL } from '@/config';
import { tokenStorage } from '@/features/auth/services/tokenStorage';

import { endpoints } from './endpoints';
import { attachApiLogger } from './logger';

const TIMEOUT_MS = 30_000; // hosted backend can cold-start

export const apiClient = createAxios({
    baseURL: API_URL,
    timeout: TIMEOUT_MS,
    headers: { 'Content-Type': 'application/json' },
});

// Bare instance for refresh: no interceptors, so it can't loop.
const refreshClient = createAxios({ baseURL: API_URL, timeout: TIMEOUT_MS });

attachApiLogger(apiClient, 'API');
attachApiLogger(refreshClient, 'API refresh');

let onSessionExpired = () => { };
export const setSessionExpiredHandler = (handler) => {
    onSessionExpired = handler;
};

// Public auth calls: never send a Bearer token, never try to refresh on 401.
const AUTH_PATHS = [
    endpoints.auth.login,
    endpoints.auth.phoneRequestOtp,
    endpoints.auth.phoneVerifyOtp,
    endpoints.auth.emailRequestOtp,
    endpoints.auth.emailVerifyOtp,
    endpoints.auth.completeRegistration,
    endpoints.auth.refresh,
    endpoints.auth.logout,
];
const isAuthPath = (url) => !!url && AUTH_PATHS.some((p) => url.includes(p));

apiClient.interceptors.request.use((config) => {
    const tokens = tokenStorage.get();
    if (tokens && !isAuthPath(config.url)) {
        config.headers.set('Authorization', `Bearer ${tokens.access_token}`);
    }
    return config;
});

// The refresh token rotates: the old one dies on use. Share one in-flight call.
let refreshPromise = null;
const refreshAccessToken = async () => {
    const current = tokenStorage.get();
    if (!current) throw new Error('No refresh token');
    const { data } = await refreshClient.post(endpoints.auth.refresh, {
        refresh_token: current.refresh_token,
    });
    await tokenStorage.save(data);
    return data.access_token;
};

apiClient.interceptors.response.use((response) => response, async (error) => {
    const original = error.config;
    if (error.response?.status !== 401 ||
        !original ||
        original._retried ||
        isAuthPath(original.url) ||
        !tokenStorage.get()) {
        return Promise.reject(error);
    }
    original._retried = true;
    try {
        refreshPromise ??= refreshAccessToken().finally(() => {
            refreshPromise = null;
        });
        const accessToken = await refreshPromise;
        original.headers.set('Authorization', `Bearer ${accessToken}`);
        return apiClient(original);
    }
    catch (refreshError) {
        // Only drop the session when the server rejected the refresh token.
        if (isAxiosError(refreshError) && refreshError.response) {
            onSessionExpired();
        }
        return Promise.reject(error);
    }
});
