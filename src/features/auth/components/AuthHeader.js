import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { colors } from '@/theme';

import { styles } from './AuthHeader.styles';

export function AuthHeader({ title, subtitle, icon = 'storefront' }) {
    return (<View style={styles.container}>
      <View style={styles.logo}>
        <Ionicons name={icon} size={28} color={colors.textOnPrimary}/>
      </View>
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>);
}
