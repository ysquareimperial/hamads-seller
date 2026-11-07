export const HANDOVER = {
    rider_pickup: { label: 'Rider pickup', icon: 'bicycle', short: 'A Hamads rider collects it' },
    seller_dropoff: { label: 'You drop off', icon: 'walk', short: 'You bring it to the warehouse' },
};

const STATUS = {
    awaiting_seller: { text: 'Choose handover', tone: 'warning' },
    awaiting_rider: { text: 'Finding a rider', tone: 'warning' },
    rider_assigned: { text: 'Rider coming', tone: 'primary' },
    collected: { text: 'Collected', tone: 'success' },
    dropoff_expected: { text: 'Drop it off', tone: 'warning' },
    at_warehouse: { text: 'At warehouse', tone: 'success' },
    cancelled: { text: 'Cancelled', tone: 'danger' },
};
export const jobStatus = (s) => STATUS[s] ?? { text: String(s ?? '').replace(/_/g, ' '), tone: 'neutral' };

export const PICKUP_FILTERS = [
    { value: null, label: 'All' },
    { value: 'dropoff_expected', label: 'To drop off' },
    { value: 'awaiting_rider', label: 'Finding rider' },
    { value: 'rider_assigned', label: 'Rider coming' },
    { value: 'collected', label: 'Collected' },
    { value: 'at_warehouse', label: 'At warehouse' },
    { value: 'cancelled', label: 'Cancelled' },
];

/** The seller can switch handover (and cancel) only until a rider is assigned. */
export const canSwitch = (job) => ['awaiting_seller', 'awaiting_rider', 'dropoff_expected'].includes(job?.status);

/** What the seller should do now, in one line. */
export function jobInstruction(job) {
    switch (job.status) {
        case 'awaiting_seller':
            return 'Choose how this order reaches the Hamads warehouse.';
        case 'awaiting_rider':
            return "We're finding a rider to collect this order. Keep it packed and ready.";
        case 'rider_assigned':
            return job.rider_name ? `${job.rider_name} is coming to collect this order. Have it packed.` : 'A rider is coming to collect this order. Have it packed.';
        case 'collected':
            return 'The rider has collected this order. It is on its way to the warehouse.';
        case 'dropoff_expected':
            return job.warehouse_address ? `Bring this order to ${job.warehouse_name ?? 'the warehouse'}: ${job.warehouse_address}.` : 'Bring this order to the Hamads warehouse.';
        case 'at_warehouse':
            return 'Received at the warehouse. Hamads delivers it to the customer.';
        case 'cancelled':
            return job.note ? `Cancelled: ${job.note}` : 'This handover was cancelled.';
        default:
            return null;
    }
}

export const itemsLine = (items = []) => items.map((i) => `${i.quantity}× ${i.product_name}${i.variant_label ? ` (${i.variant_label})` : ''}`).join(', ');

/** Pickup fee rule shown to sellers (from the backend's warehouse plan). */
export const PICKUP_FEE_RULE = '20% of the items, at most ₦1,000, taken from your earnings';
