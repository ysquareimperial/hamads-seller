import * as SecureStore from 'expo-secure-store';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, useColorScheme } from 'react-native';

import { setColorScheme } from './colors';

const STORAGE_KEY = 'appearance_preference';
const PREFERENCES = ['system', 'light', 'dark'];

const ThemeContext = createContext({
    scheme: 'light',
    preference: 'system',
    setPreference: () => { },
});

export function ThemeProvider({ children }) {
    const [preference, setPreferenceState] = useState('system');
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let active = true;
        SecureStore.getItemAsync(STORAGE_KEY)
            .then((saved) => {
                if (active && PREFERENCES.includes(saved)) setPreferenceState(saved);
            })
            .catch(() => { })
            .finally(() => {
                if (active) setReady(true);
            });
        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        // Android's native module rejects null, so 'unspecified' means "follow the system".
        Appearance.setColorScheme(preference === 'system' ? 'unspecified' : preference);
    }, [preference]);

    const systemScheme = useColorScheme();
    const scheme = preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;

    setColorScheme(scheme);

    const setPreference = useCallback((next) => {
        if (!PREFERENCES.includes(next)) return;
        setPreferenceState(next);
        SecureStore.setItemAsync(STORAGE_KEY, next).catch(() => { });
    }, []);

    const value = useMemo(() => ({ scheme, preference, setPreference }), [scheme, preference, setPreference]);

    if (!ready) return null;

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
