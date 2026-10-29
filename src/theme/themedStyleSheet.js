import { StyleSheet as RNStyleSheet } from 'react-native';

import { getColorScheme } from './colors';

/**
 * Drop-in replacement for StyleSheet in *.styles.js files.
 * `StyleSheet.create(() => ({ ... }))` takes a factory that is evaluated lazily,
 * once per colour scheme, so `colors.x` inside it follows light/dark mode.
 */
function create(factory) {
    const cache = {};
    return new Proxy({}, {
        get(_target, key) {
            const scheme = getColorScheme();
            if (!cache[scheme]) cache[scheme] = RNStyleSheet.create(factory());
            return cache[scheme][key];
        },
    });
}

export const StyleSheet = {
    hairlineWidth: RNStyleSheet.hairlineWidth,
    absoluteFill: RNStyleSheet.absoluteFill,
    flatten: RNStyleSheet.flatten,
    create,
};
