import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { colors } from '@/theme';

import { Button } from './Button';
import { styles } from './EmptyState.styles';

export function EmptyState({ icon = 'sparkles-outline', title, message, actionLabel, onAction }) {
    return (<View style={styles.container}>
      <View style={styles.iconTile}>
        <Ionicons name={icon} size={30} color={colors.primary}/>
      </View>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionLabel && onAction ? (<View style={styles.action}>
          <Button title={actionLabel} onPress={onAction}/>
        </View>) : null}
    </View>);
}
