import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { IconButton } from '@/components/ui/IconButton';
import { useNotificationStore } from '@/store/notificationStore';

import { styles } from './BellButton.styles';

/** Bell with the unread count; opens /notifications. */
export function BellButton() {
    const unread = useNotificationStore((s) => s.unread);
    return (<View>
      <IconButton icon={unread ? 'notifications' : 'notifications-outline'} accessibilityLabel={unread ? `Notifications, ${unread} unread` : 'Notifications'} onPress={() => router.push('/notifications')}/>
      {unread > 0 ? (<View style={styles.badge} pointerEvents="none">
          <Text style={styles.badgeText}>{unread > 99 ? '99+' : unread}</Text>
        </View>) : null}
    </View>);
}
