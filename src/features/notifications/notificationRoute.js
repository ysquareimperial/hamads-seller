/**
 * Where tapping a notification goes. Uses `data.screen` when the backend sets it,
 * then known ids in `data`, then the type. Returns null when there's nowhere specific.
 */
export function notificationRoute(n) {
    const d = n.data ?? {};
    const type = String(n.type ?? '');
    if (d.screen === 'market_pickups' || type.startsWith('pickup_')) return '/store/pickups';
    if (d.seller_order_id) return `/store/orders/${d.seller_order_id}`;
    if (d.food_order_id) return `/food/orders/${d.food_order_id}`;
    // Planned food orders (planned_order, planned_order_today, planned_order_start).
    if (type.startsWith('planned_order')) return d.order_id ? `/food/orders/${d.order_id}` : '/food/plan';
    if (type.startsWith('food') && d.order_id) return `/food/orders/${d.order_id}`;
    if (/payout|wallet|payment/.test(type)) return '/payments';
    if (/product/.test(type) && d.product_id) return `/store/products/${d.product_id}`;
    return null;
}

const ICONS = [
    [/planned/, 'calendar-outline'],
    [/pickup|rider/, 'bicycle-outline'],
    [/order/, 'receipt-outline'],
    [/payout|wallet|payment/, 'wallet-outline'],
    [/product|approv|reject/, 'pricetags-outline'],
    [/food|vendor/, 'restaurant-outline'],
];
export const notificationIcon = (type) => ICONS.find(([re]) => re.test(String(type ?? '')))?.[1] ?? 'notifications-outline';
