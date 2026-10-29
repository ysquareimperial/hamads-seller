import { create } from 'zustand';

/**
 * Version counters bumped after a write so lists elsewhere refetch.
 * e.g. saving a product bumps `products`, and the Products tab + Dashboard reload.
 */
export const useRefreshStore = create((set) => ({
    products: 0,
    orders: 0,
    foodItems: 0,
    foodOrders: 0,
    bumpFoodItems: () => set((s) => ({ foodItems: s.foodItems + 1 })),
    bumpFoodOrders: () => set((s) => ({ foodOrders: s.foodOrders + 1 })),
    bumpProducts: () => set((s) => ({ products: s.products + 1 })),
    bumpOrders: () => set((s) => ({ orders: s.orders + 1 })),
}));
