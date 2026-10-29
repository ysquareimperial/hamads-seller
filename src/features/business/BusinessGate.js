import { Redirect } from 'expo-router';
import { useEffect } from 'react';

import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingView } from '@/components/ui/LoadingView';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { useBusinessStore } from '@/store/businessStore';

/**
 * Wraps a business's navigator. Loads business state when opened directly
 * (deep link / relaunch) and sends sellers who haven't set it up to setup.
 */
export function BusinessGate({ kind, children }) {
    const status = useBusinessStore((s) => s.status);
    const storeEnabled = useBusinessStore((s) => s.storeEnabled);
    const vendor = useBusinessStore((s) => s.vendor);
    const error = useBusinessStore((s) => s.error);
    const load = useBusinessStore((s) => s.load);

    useEffect(() => {
        if (status === 'idle') void load();
    }, [status, load]);

    if (status === 'idle' || status === 'loading') {
        return (<SafeScreen>
        <LoadingView />
      </SafeScreen>);
    }
    const active = kind === 'store' ? storeEnabled : !!vendor;
    if (!active && status === 'error' && kind === 'food') {
        return (<SafeScreen>
        <ErrorState message={error} onRetry={load}/>
      </SafeScreen>);
    }
    if (!active) return <Redirect href={`/setup/${kind}`}/>;
    return children;
}
