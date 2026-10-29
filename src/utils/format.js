/** Formats a decimal string/number from the API as Naira, e.g. "12500.00" -> "₦12,500". */
export function formatNaira(value) {
    const amount = Number(value);
    if (!Number.isFinite(amount)) return '';
    const hasKobo = Math.round(amount * 100) % 100 !== 0;
    const [whole, kobo] = amount.toFixed(hasKobo ? 2 : 0).split('.');
    const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `₦${grouped}${kobo ? `.${kobo}` : ''}`;
}

export function shortId(id) {
    return String(id ?? '').slice(0, 8).toUpperCase();
}

/** "awaiting_fulfillment" -> "Awaiting fulfillment" */
export function statusLabel(status) {
    const text = String(status ?? '').replace(/_/g, ' ').trim();
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : 'Unknown';
}

export function formatDate(iso) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateTime(iso) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    return `${formatDate(iso)}, ${date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
}

/** Drops empty values so they are not sent as query params. */
export function cleanParams(params) {
    return Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''));
}

/** +2348012345678 -> +234 801 234 5678 */
export function formatPhone(phone) {
    const match = /^\+234(\d{3})(\d{3})(\d{4})$/.exec(phone ?? '');
    return match ? `+234 ${match[1]} ${match[2]} ${match[3]}` : phone ?? '';
}

/** Minor units (kobo) from the payments API -> "₦12,500". */
export const formatMinor = (minor) => formatNaira((Number(minor) || 0) / 100);
