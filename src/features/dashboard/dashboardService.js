import { productService } from '@/features/products/services/productService';
import { handoverService } from '@/features/handover/handoverService';
import { sellerOrderService } from '@/features/orders/services/sellerOrderService';

const CAP = 100; // product list has no total; counts are capped at one page

const settle = async (promise, fallback) => {
    try {
        return await promise;
    }
    catch {
        return fallback;
    }
};

/** Everything the dashboard shows, fetched in parallel. Individual failures degrade to null. */
export async function loadDashboard() {
    const [toFulfil, jobs, recent, products, inReview] = await Promise.all([
        settle(sellerOrderService.count('awaiting_fulfillment'), null),
        settle(handoverService.pickups({ limit: 100, offset: 0 }), null),
        sellerOrderService.list({ limit: 5, offset: 0 }), // let this one fail the screen
        settle(productService.listMine({ limit: CAP, offset: 0 }), null),
        settle(productService.listMine({ is_approved: false, limit: CAP, offset: 0 }), null),
    ]);
    const countOf = (page) => (page ? { value: page.items.length, capped: page.items.length >= CAP } : null);
    const lowStock = products ? products.items.filter((p) => p.is_active && p.stock_quantity <= 3).length : null;
    return {
        orders: { toFulfil, total: recent.total ?? 0 },
        // Handover to the Hamads warehouse (sellers never deliver to buyers).
        handover: jobs ? {
            toDropOff: jobs.items.filter((j) => j.status === 'dropoff_expected').length,
            riderComing: jobs.items.filter((j) => j.status === 'awaiting_rider' || j.status === 'rider_assigned').length,
        } : null,
        recent: recent.items ?? [],
        products: countOf(products),
        inReview: countOf(inReview),
        lowStock,
    };
}
