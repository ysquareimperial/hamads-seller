import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { PAGE_SIZE } from '@/config';
import { getErrorMessage } from '@/utils/getErrorMessage';

/**
 * Offset-paginated list. `fetchPage({ limit, offset })` must resolve to
 * `{ items, total? }`. Without `total`, a short page means the end was reached.
 * Refetches from the top whenever `deps` change.
 */
export function usePagedList(fetchPage, deps = [], pageSize = PAGE_SIZE) {
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(null);
    const [status, setStatus] = useState('loading'); // loading | ready | error
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const requestId = useRef(0);
    const fetchRef = useRef(fetchPage);
    useLayoutEffect(() => {
        fetchRef.current = fetchPage;
    });

    const load = useCallback(async (mode, offset) => {
        const id = ++requestId.current;
        if (mode === 'initial') {
            setStatus('loading');
            setError(null);
        }
        if (mode === 'refresh') setRefreshing(true);
        if (mode === 'more') setLoadingMore(true);
        try {
            const page = await fetchRef.current({ limit: pageSize, offset });
            if (id !== requestId.current) return;
            const next = page.items ?? [];
            setItems((prev) => (offset === 0 ? next : [...prev, ...next]));
            setTotal(typeof page.total === 'number' ? page.total : null);
            setHasMore(typeof page.total === 'number' ? offset + next.length < page.total : next.length === pageSize);
            setStatus('ready');
        }
        catch (e) {
            if (id !== requestId.current) return;
            setError(getErrorMessage(e));
            if (mode === 'initial' || mode === 'refresh') setStatus('error');
        }
        finally {
            if (id === requestId.current) {
                setRefreshing(false);
                setLoadingMore(false);
            }
        }
    }, [pageSize]);

    useEffect(() => {
        void load('initial', 0);
        return () => {
            requestId.current += 1;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    const refresh = useCallback(() => load('refresh', 0), [load]);
    /** Background refetch (polling): no spinner, keeps the list on error. */
    const refreshSilently = useCallback(() => load('silent', 0), [load]);
    const reload = useCallback(() => load('initial', 0), [load]);
    const loadMore = useCallback(() => {
        if (!hasMore || loadingMore || status !== 'ready') return;
        void load('more', items.length);
    }, [hasMore, loadingMore, status, items.length, load]);

    return { items, setItems, total, status, error, refreshing, loadingMore, hasMore, refresh, refreshSilently, reload, loadMore };
}
