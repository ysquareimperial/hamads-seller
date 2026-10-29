import { OTP_LENGTH, PASSWORD_MIN_LENGTH } from '@/config';

const COUNTRY_CODE = '234';
// Nigerian mobile number without the leading 0, e.g. 8012345678
const NATIONAL_PATTERN = /^[789]\d{9}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Digits after +234. Accepts 08012345678, 8012345678, 2348012345678 or +2348012345678;
 * a single leading 0 is dropped.
 */
export const nationalNumber = (value) => {
    let digits = value.replace(/\D/g, '');
    if (digits.startsWith(COUNTRY_CODE) && digits.length > 10) digits = digits.slice(COUNTRY_CODE.length);
    return digits.replace(/^0/, '');
};

/** International format sent to the backend, e.g. +2348012345678 */
export const normalizePhone = (value) => `+${COUNTRY_CODE}${nationalNumber(value)}`;

export const normalizeEmail = (value) => value.trim().toLowerCase();

export const validatePhone = (value) => {
    const national = nationalNumber(value);
    if (!national) return 'Enter your phone number.';
    if (!NATIONAL_PATTERN.test(national)) return 'Enter a valid Nigerian number, e.g. 0801 234 5678.';
    return null;
};

export const validateEmail = (value) => {
    if (!value.trim()) return 'Enter your email address.';
    if (!EMAIL_PATTERN.test(value.trim())) return 'Enter a valid email address.';
    return null;
};

export const validatePassword = (value) => {
    if (!value) return 'Enter your password.';
    if (value.length < PASSWORD_MIN_LENGTH) return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
    return null;
};

export const validateRequired = (value, message, min = 2) => {
    const text = value.trim();
    if (!text) return message;
    if (text.length < min) return `Must be at least ${min} characters.`;
    return null;
};

export const validateOtp = (value, length = OTP_LENGTH) => value.length === length ? null : `Enter the ${length}-digit code.`;

/** "12/05/1995" while typing: keeps digits and inserts slashes. */
export const maskDate = (value) => {
    const d = value.replace(/\D/g, '').slice(0, 8);
    if (d.length <= 2) return d;
    if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
    return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
};

/** "DD/MM/YYYY" -> "YYYY-MM-DD", or null if it isn't a real past date. */
export const toIsoDate = (value) => {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
    if (!match) return null;
    const [, dd, mm, yyyy] = match;
    const date = new Date(Date.UTC(Number(yyyy), Number(mm) - 1, Number(dd)));
    const valid = date.getUTCFullYear() === Number(yyyy) && date.getUTCMonth() === Number(mm) - 1 && date.getUTCDate() === Number(dd);
    if (!valid || date > new Date() || Number(yyyy) < 1900) return null;
    return `${yyyy}-${mm}-${dd}`;
};

export const validateDob = (value) => {
    if (!value) return 'Enter your date of birth.';
    return toIsoDate(value) ? null : 'Enter a valid date as DD/MM/YYYY.';
};

/**
 * Dev stand-in: pulls a code out of a request-otp response.
 * Checks common keys first, then any standalone 6-digit run in the payload.
 */
export const extractOtp = (response, length = OTP_LENGTH) => {
    if (!response) return null;
    if (typeof response === 'object') {
        const direct = response.code ?? response.otp ?? response.dev_code ?? response.otp_code;
        if (direct && new RegExp(`^\\d{${length}}$`).test(String(direct))) return String(direct);
    }
    const text = typeof response === 'string' ? response : JSON.stringify(response);
    return text.match(new RegExp(`(?<!\\d)\\d{${length}}(?!\\d)`))?.[0] ?? null;
};
