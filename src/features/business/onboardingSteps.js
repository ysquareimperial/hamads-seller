/**
 * Where each onboarding step should send the seller. The backend owns the step
 * keys, so they're matched loosely; unknown or waiting steps return null (not tappable).
 */
export function stepRoute(key, { vendor, storeEnabled }) {
    const k = String(key ?? '').toLowerCase();
    if (/approv|review/.test(k)) return null;
    if (/email|phone|verify/.test(k)) return null;
    if (/username|link/.test(k)) return '/profile/username';
    if (/bank|payout|payment/.test(k)) return '/payments/bank';
    if (/avatar|photo|picture|profile/.test(k)) return '/profile';
    if (/menu|food_item|item/.test(k)) return vendor ? '/food/menu/new' : '/setup/food';
    if (/food|shop|vendor|kitchen/.test(k)) return vendor ? '/food/settings' : '/setup/food';
    if (/product|store|catalog/.test(k)) return storeEnabled ? '/store/products/new' : '/setup/store';
    return null;
}
