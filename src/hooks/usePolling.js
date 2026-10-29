import { useFocusEffect } from 'expo-router';
import { useCallback, useLayoutEffect, useRef } from 'react';
import { AppState } from 'react-native';

/** Calls `fn` every `ms` while the screen is focused and the app is in the foreground. */
export function usePolling(fn, ms) {
    const fnRef = useRef(fn);
    useLayoutEffect(() => {
        fnRef.current = fn;
    });

    useFocusEffect(useCallback(() => {
        const timer = setInterval(() => {
            if (AppState.currentState === 'active') void fnRef.current();
        }, ms);
        return () => clearInterval(timer);
    }, [ms]));
}
