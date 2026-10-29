import { isAxiosError } from 'axios';

const FALLBACK = 'Something went wrong. Please try again.';

/** Turns any thrown value into a message safe to show to a user. */
export const getErrorMessage = (error) => {
    if (!isAxiosError(error)) return error?.userMessage ?? FALLBACK;
    if (error.code === 'ECONNABORTED') {
        return 'The request timed out. Check your connection and try again.';
    }
    if (!error.response) {
        return 'Cannot reach the server. Check your connection and try again.';
    }
    const detail = error.response.data?.detail;
    if (typeof detail === 'string' && detail.trim()) return detail;
    if (Array.isArray(detail) && detail.length > 0) {
        const first = detail[0];
        const field = first.loc?.[first.loc.length - 1];
        if (first.msg) return typeof field === 'string' ? `${field.replace(/_/g, ' ')}: ${first.msg}` : first.msg;
    }
    if (error.response.status >= 500) return 'The server had a problem. Please try again shortly.';
    return FALLBACK;
};
