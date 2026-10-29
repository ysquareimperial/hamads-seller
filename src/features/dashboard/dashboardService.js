import { productService } from '@/features/products/services/productService';
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
    const [toFulfil, processing, shipped, recent, products, inReview] = await Promise.all([
        settle(sellerOrderService.count('awaiting_fulfillment'), null),
        settle(sellerOrderService.count('processing'), null),
        settle(sellerOrderService.count('shipped'), null),
        sellerOrderService.list({ limit: 5, offset: 0 }), // let this one fail the screen
        settle(productService.listMine({ limit: CAP, offset: 0 }), null),
        settle(productService.listMine({ is_approved: false, limit: CAP, offset: 0 }), null),
    ]);
    const countOf = (page) => (page ? { value: page.items.length, capped: page.items.length >= CAP } : null);
    const lowStock = products ? products.items.filter((p) => p.is_active && p.stock_quantity <= 3).length : null;
    return {
        orders: { toFulfil, processing, shipped, total: recent.total ?? 0 },
        recent: recent.items ?? [],
        products: countOf(products),
        inReview: countOf(inReview),
        lowStock,
    };
}
