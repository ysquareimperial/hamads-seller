import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { colors } from '@/theme';

import { Button } from './Button';
import { styles } from './ErrorState.styles';

export function ErrorState({ message, onRetry, title = "Couldn't load this" }) {
    return (<View style={styles.container}>
      <View style={styles.iconTile}>
        <Ionicons name="cloud-offline-outline" size={28} color={colors.danger}/>
      </View>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {onRetry ? (<View style={styles.action}>
          <Button title="Try again" variant="secondary" onPress={onRetry}/>
        </View>) : null}
    </View>);
}
