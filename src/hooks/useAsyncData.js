import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { getErrorMessage } from '@/utils/getErrorMessage';

/**
 * Runs `fetcher` on mount and whenever `deps` change.
 * Returns { data, loading, error, reload, setData }. Stale responses are ignored.
 */
export function useAsyncData(fetcher, deps = []) {
    const [state, setState] = useState({ data: null, loading: true, error: null });
    const requestId = useRef(0);
    const fetcherRef = useRef(fetcher);
    useLayoutEffect(() => {
        fetcherRef.current = fetcher;
    });

    const run = useCallback(async ({ silent = false } = {}) => {
        const id = ++requestId.current;
        if (!silent) setState((s) => ({ ...s, loading: true, error: null }));
        try {
            const data = await fetcherRef.current();
            if (id === requestId.current) setState({ data, loading: false, error: null });
        }
        catch (error) {
            if (id === requestId.current) setState((s) => ({ ...s, loading: false, error: getErrorMessage(error) }));
        }
    }, []);

    useEffect(() => {
        void run();
        return () => {
            requestId.current += 1;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    const setData = useCallback((updater) => {
        setState((s) => ({ ...s, data: typeof updater === 'function' ? updater(s.data) : updater }));
    }, []);

    return { ...state, reload: run, setData };
}
