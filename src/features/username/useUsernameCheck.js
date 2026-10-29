import { useEffect, useState } from 'react';

import { USERNAME_MIN } from '@/config';
import { authService } from '@/features/auth/services/authService';

const DEBOUNCE_MS = 450;

/**
 * Live availability while typing.
 * status: idle | short | checking | available | taken | error. `current` is treated as available (unchanged).
 */
export function useUsernameCheck(username, current = null) {
    const [result, setResult] = useState({ status: 'idle', reason: null, for: '' });

    useEffect(() => {
        if (!username || username === current) return undefined;
        if (username.length < USERNAME_MIN) return undefined;
        let active = true;
        const timer = setTimeout(async () => {
            setResult({ status: 'checking', reason: null, for: username });
            try {
                const r = await authService.usernameAvailable(username);
                if (active) setResult({ status: r.available ? 'available' : 'taken', reason: r.reason ?? null, for: username });
            }
            catch {
                if (active) setResult({ status: 'error', reason: null, for: username });
            }
        }, DEBOUNCE_MS);
        return () => {
            active = false;
            clearTimeout(timer);
        };
    }, [username, current]);

    if (!username) return { status: 'idle', reason: null };
    if (username === current) return { status: 'current', reason: null };
    if (username.length < USERNAME_MIN) return { status: 'short', reason: `At least ${USERNAME_MIN} characters.` };
    if (result.for !== username) return { status: 'checking', reason: null };
    return result;
}
