import { useEffect, useState } from 'react';

import { foodVendorService } from '../services/foodVendorService';

let cached = null;

/** [{ key, label }] from GET /food/categories, cached for the session. */
export function useFoodCategories() {
    const [categories, setCategories] = useState(cached ?? []);
    useEffect(() => {
        if (cached) return undefined;
        let active = true;
        foodVendorService.categories().then((data) => {
            cached = data;
            if (active) setCategories(data);
        }).catch(() => { });
        return () => {
            active = false;
        };
    }, []);
    const labelOf = (key) => categories.find((c) => c.key === key)?.label ?? key;
    return { categories, labelOf };
}
