import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';

const post = async (url, payload) => (await apiClient.post(url, payload)).data;

export const authService = {
    login: (payload) => post(endpoints.auth.login, payload),
    requestPhoneOtp: (phone_number) => post(endpoints.auth.phoneRequestOtp, { phone_number }),
    verifyPhoneOtp: (phone_number, code) => post(endpoints.auth.phoneVerifyOtp, { phone_number, code }),
    requestEmailOtp: (email) => post(endpoints.auth.emailRequestOtp, { email }),
    verifyEmailOtp: (email, code) => post(endpoints.auth.emailVerifyOtp, { email, code }),
    /** Returns { access_token, refresh_token }. */
    completeRegistration: (payload) => post(endpoints.auth.completeRegistration, payload),
    async me() {
        const { data } = await apiClient.get(endpoints.auth.me);
        return data;
    },
    /** PATCH: only fields sent are changed. */
    async updateMe(payload) {
        const { data } = await apiClient.patch(endpoints.auth.me, payload);
        return data;
    },
    async avatarUploadUrl(content_type) {
        const { data } = await apiClient.post(endpoints.auth.avatarUploadUrl, { content_type });
        return data;
    },
    /** { username, available, reason } — public, call while the seller types. */
    async usernameAvailable(username) {
        const { data } = await apiClient.get(endpoints.auth.usernameAvailable, { params: { username } });
        return data;
    },
    /** Allowed a limited number of times (SellerMe.username_changes_left): old links stop working. */
    async changeUsername(username) {
        const { data } = await apiClient.put(endpoints.auth.username, { username });
        return data;
    },
    async onboarding() {
        const { data } = await apiClient.get(endpoints.onboarding);
        return data;
    },
    async logout(payload) {
        await apiClient.post(endpoints.auth.logout, payload);
    },
};
