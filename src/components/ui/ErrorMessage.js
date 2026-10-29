import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { colors } from '@/theme';

import { styles } from './ErrorMessage.styles';

export function ErrorMessage({ message }) {
    if (!message) return null;
    return (<View style={styles.box} accessibilityRole="alert">
      <Ionicons name="alert-circle" size={18} color={colors.danger}/>
      <Text style={styles.text}>{message}</Text>
    </View>);
}
