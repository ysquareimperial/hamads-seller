export const FOOD_ORDER_FILTERS = [
    { value: null, label: 'All' },
    { value: 'paid', label: 'New' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready', label: 'Ready' },
    { value: 'on_the_way', label: 'On the way' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
];

const META = {
    pending_payment: { text: 'Awaiting payment', tone: 'neutral' },
    paid: { text: 'New order', tone: 'warning' },
    preparing: { text: 'Preparing', tone: 'primary' },
    ready: { text: 'Ready', tone: 'success' },
    on_the_way: { text: 'On the way', tone: 'primary' },
    completed: { text: 'Completed', tone: 'success' },
    cancelled: { text: 'Cancelled', tone: 'danger' },
};

export const foodStatusMeta = (status) => META[status] ?? { text: status, tone: 'neutral' };

/** Orders the shop still has to act on. */
export const ACTIVE_FOOD_STATUSES = ['paid', 'preparing', 'ready'];

export const FULFILMENT = {
    delivery: { label: 'Delivery', icon: 'bicycle' },
    pickup: { label: 'Pickup', icon: 'walk' },
};

export const itemsSummary = (items = []) => items.map((i) => `${i.quantity}× ${i.name}`).join(', ');

export function timeAgo(iso) {
    const ms = Date.now() - new Date(iso).getTime();
    if (!Number.isFinite(ms)) return '';
    const min = Math.round(ms / 60000);
    if (min < 1) return 'just now';
    if (min < 60) return `${min} min ago`;
    const h = Math.round(min / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.round(h / 24)}d ago`;
}

export function clockTime(iso) {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}
