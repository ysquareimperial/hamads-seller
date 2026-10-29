import { ActivityIndicator, View } from 'react-native';

import { colors } from '@/theme';

import { styles } from './LoadingView.styles';

export function LoadingView() {
    return (<View style={styles.container} accessibilityRole="progressbar">
      <ActivityIndicator size="large" color={colors.primary}/>
    </View>);
}
