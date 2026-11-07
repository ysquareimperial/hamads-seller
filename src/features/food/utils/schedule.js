// Helpers for planned orders and dish schedules. Dates are YYYY-MM-DD (Nigerian calendar day);
// weekdays are 0=Mon..6=Sun; window_hour is the hour a one-hour window starts (14 = 14:00-15:00).

export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const AVAILABILITY_MODES = [
    { value: 'every_day', label: 'Every day' },
    { value: 'weekdays', label: 'Some days' },
    { value: 'dates', label: 'Set dates' },
];

const pad = (n) => String(n).padStart(2, '0');

/** Local YYYY-MM-DD, `offset` days from today. */
export function isoDay(offset = 0) {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** "2026-11-14" -> "Fri 14 Nov" (parsed as a calendar day, not UTC). */
export function dayLabel(day) {
    const [y, m, d] = String(day ?? '').split('-').map(Number);
    if (!y || !m || !d) return String(day ?? '');
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

export const hourLabel = (h) => `${pad(h)}:00`;
export const windowLabel = (h) => `${hourLabel(h)}–${hourLabel((Number(h) + 1) % 24)}`;

/** Accepts the order's fulfilment_window / window_start+end / window_hour, whichever the API sends. */
export function orderWindowLabel(order) {
    const w = order.fulfilment_window;
    if (typeof w === 'string' && w) return w.replace('-', '–');
    if (w && typeof w === 'object') {
        if (w.window_hour !== undefined) return windowLabel(w.window_hour);
        if (w.start && w.end) return `${timeOf(w.start)}–${timeOf(w.end)}`;
    }
    if (order.window_start && order.window_end) return `${timeOf(order.window_start)}–${timeOf(order.window_end)}`;
    if (order.window_hour !== undefined && order.window_hour !== null) return windowLabel(order.window_hour);
    return null;
}

const timeOf = (v) => {
    if (/^\d{1,2}:\d{2}/.test(String(v))) return String(v).slice(0, 5);
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? String(v) : d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

/** "Planned for Fri 14 Nov, 12:00–13:00", or null for a same-day order. */
export function plannedLabel(order) {
    if (!order.scheduled_date) return null;
    const w = orderWindowLabel(order);
    return `Planned for ${dayLabel(order.scheduled_date)}${w ? `, ${w}` : ''}`;
}

/** Short schedule summary for a menu row. */
export function scheduleSummary(item) {
    if (item.availability_mode === 'weekdays' && Array.isArray(item.weekdays) && item.weekdays.length) {
        return item.weekdays.length === 7 ? null : [...item.weekdays].sort().map((d) => WEEKDAYS[d]).join(', ');
    }
    if (item.availability_mode === 'dates') return 'Set dates only';
    return null;
}

/** "3 / 12" or "3 / no limit". */
export const soldOf = (sold, limit) => `${sold ?? 0} / ${limit === null || limit === undefined ? 'no limit' : limit}`;

/** Quantity input -> API value: '' means no limit (null). */
export const qtyOrNull = (text) => (text === '' || text === null || text === undefined ? null : Number(text));
export const qtyText = (v) => (v === null || v === undefined ? '' : String(v));

/** Upcoming day rows from GET .../schedule (key name tolerant). */
export const upcomingRows = (schedule) => schedule?.days ?? schedule?.upcoming ?? schedule?.upcoming_days ?? [];

/** Plan days from GET /food/vendor/plan (array or { days }). */
export const planDays = (plan) => (Array.isArray(plan) ? plan : plan?.days ?? plan?.plan ?? []);

/** Plan item -> "12 x Jollof rice" (string or { name, quantity }). */
export const planItemText = (i) => (typeof i === 'string' ? i : `${i.quantity ?? i.count ?? ''} x ${i.name ?? i.item_name ?? ''}`.trim());

/** Plan window -> { label, count, items } (number, { window_hour, order_count, items } or string). */
export function planWindow(w) {
    if (typeof w === 'number') return { label: windowLabel(w), count: null, items: [] };
    if (typeof w === 'string') return { label: w, count: null, items: [] };
    const hour = w.window_hour ?? w.hour;
    return {
        label: hour !== undefined ? windowLabel(hour) : w.label ?? '',
        count: w.order_count ?? w.count ?? null,
        items: w.items ?? [],
    };
}
