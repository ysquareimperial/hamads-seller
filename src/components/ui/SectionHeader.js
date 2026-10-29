import { Pressable, Text, View } from 'react-native';

import { styles } from './SectionHeader.styles';

export function SectionHeader({ title, actionLabel, onAction }) {
    return (<View style={styles.row}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      {actionLabel && onAction ? (<Pressable accessibilityRole="button" onPress={onAction} hitSlop={8}>
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>) : null}
    </View>);
}
