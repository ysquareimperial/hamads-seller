export const ORDER_FILTERS = [
    { value: null, label: 'All' },
    { value: 'awaiting_fulfillment', label: 'To fulfil' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
];

export const ORDER_STATUS_TEXT = {
    awaiting_fulfillment: 'To fulfil',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
};

/** Progress steps shown on the order detail timeline. */
export const ORDER_STEPS = [
    { status: 'awaiting_fulfillment', label: 'Order placed', at: 'created_at' },
    { status: 'processing', label: 'Processing', at: null },
    { status: 'shipped', label: 'Shipped', at: 'shipped_at' },
    { status: 'delivered', label: 'Delivered', at: 'delivered_at' },
];

export const stepIndex = (status) => ORDER_STEPS.findIndex((s) => s.status === status);

export const canCancel = (status) => status === 'awaiting_fulfillment' || status === 'processing';
