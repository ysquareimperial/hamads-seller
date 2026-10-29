export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? '';
if (!API_URL && __DEV__) {
    console.warn('EXPO_PUBLIC_API_URL is not set. Add it to .env');
}
// Dev stand-in: the request-otp endpoints may return the code in their response.
// When a code is found it is filled in for you. Set to false once real SMS/email delivery is live.
export const OTP_FROM_RESPONSE = true;
export const OTP_LENGTH = 6;
export const OTP_RESEND_SECONDS = 60;
export const PASSWORD_MIN_LENGTH = 8;
export const PAGE_SIZE = 20;
export const MAX_PRODUCT_IMAGES = 10;
export const MAX_PRODUCT_TAGS = 20;
// Food orders are time-sensitive: lists refresh in the background this often while open.
export const FOOD_ORDERS_POLL_MS = 20_000;
export const FOOD_PREP_MIN = 5;
export const FOOD_PREP_MAX = 180;
export const FOOD_PICKUP_CODE_LENGTH = 4;
// Public store links: <base>/<username>. Set EXPO_PUBLIC_STORE_URL in .env once the web domain is live.
export const STORE_URL = (process.env.EXPO_PUBLIC_STORE_URL ?? '').replace(/\/$/, '');
export const USERNAME_MIN = 3;
export const USERNAME_MAX = 30;
// Prints every API request/response to the Metro terminal. Dev builds only.
export const LOG_API = __DEV__;
