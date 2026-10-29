import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from './SafeScreen.styles';

/**
 * Full-bleed screen shell (no padding, no scroll) for list-based screens.
 * Tab screens use the default top-only edge because the tab bar covers the bottom inset.
 */
export function SafeScreen({ children, edges = ['top'], style }) {
    return (<SafeAreaView style={[styles.safe, style]} edges={edges}>
      {children}
    </SafeAreaView>);
}
