import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { colors } from '@/theme';

import { styles } from './NoticeBanner.styles';

/** tone: warning | info | success */
export function NoticeBanner({ message, title, tone = 'warning', icon }) {
    const iconName = icon ?? (tone === 'success' ? 'checkmark-circle' : 'information-circle');
    const iconColor = tone === 'success' ? colors.success : tone === 'info' ? colors.primary : colors.warning;
    return (<View style={[styles.box, styles[tone]]}>
      <Ionicons name={iconName} size={20} color={iconColor}/>
      <View style={styles.body}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>);
}
