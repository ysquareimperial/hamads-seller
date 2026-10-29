import { authService } from '@/features/auth/services/authService';

/** SellerMe.sells: 'products' | 'food' | 'both' */
export const sellsProducts = (sells) => sells === 'products' || sells === 'both';
export const sellsFood = (sells) => sells === 'food' || sells === 'both';

/** Adds a business to `sells` ('products' + food => 'both'). Returns the updated seller, or null if unchanged. */
export async function addToSells(seller, kind) {
    if (!seller) return null;
    const has = kind === 'store' ? sellsProducts(seller.sells) : sellsFood(seller.sells);
    if (has) return null;
    const next = seller.sells ? 'both' : kind === 'store' ? 'products' : 'food';
    return authService.updateMe({ sells: next });
}
