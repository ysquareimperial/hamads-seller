/** Single display status for a seller's product. */
export function productStatus(product) {
    if (!product.is_active) return { key: 'inactive', label: 'Hidden', tone: 'neutral' };
    if (!product.is_approved) return { key: 'pending', label: 'In review', tone: 'warning' };
    return { key: 'approved', label: 'Live', tone: 'success' };
}

export const PRODUCT_FILTERS = [
    { value: 'all', label: 'All', params: {} },
    { value: 'live', label: 'Live', params: { is_active: true, is_approved: true } },
    { value: 'review', label: 'In review', params: { is_approved: false } },
    { value: 'hidden', label: 'Hidden', params: { is_active: false } },
];

/** Flattens categories into "Parent › Child" options, sorted by label. */
export function categoryOptions(categories = []) {
    const byId = new Map(categories.map((c) => [c.id, c]));
    const pathOf = (c, seen = new Set()) => {
        if (!c.parent_id || seen.has(c.id) || !byId.has(c.parent_id)) return c.name;
        seen.add(c.id);
        return `${pathOf(byId.get(c.parent_id), seen)} › ${c.name}`;
    };
    return categories
        .map((c) => ({ value: c.id, label: pathOf(c) }))
        .sort((a, b) => a.label.localeCompare(b.label));
}
