import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from 'react-native';

import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingView } from '@/components/ui/LoadingView';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { usePagedList } from '@/hooks/usePagedList';
import { useNotificationStore } from '@/store/notificationStore';
import { colors } from '@/theme';
import { formatDateTime } from '@/utils/format';

import { notificationIcon, notificationRoute } from './notificationRoute';
import { notificationsService } from './notificationsService';
import { styles } from './NotificationsScreen.styles';

/** GET /notifications: the bell list, newest first. Tapping marks read and opens the related screen. */
export function NotificationsScreen() {
    const setUnread = useNotificationStore((s) => s.setUnread);
    const [markingAll, setMarkingAll] = useState(false);
    const list = usePagedList(async (page) => {
        const res = await notificationsService.list(page);
        setUnread(res.unread_count ?? 0);
        return res;
    }, []);

    const open = async (n) => {
        if (!n.read_at) {
            list.setItems((items) => items.map((x) => (x.id === n.id ? { ...x, read_at: new Date().toISOString() } : x)));
            notificationsService.markRead(n.id).then(setUnread).catch(() => { });
        }
        const route = notificationRoute(n);
        if (route) router.push(route);
    };

    const readAll = async () => {
        setMarkingAll(true);
        try {
            setUnread(await notificationsService.markAllRead());
            const now = new Date().toISOString();
            list.setItems((items) => items.map((x) => ({ ...x, read_at: x.read_at ?? now })));
        }
        catch {
            // leave as is
        }
        finally {
            setMarkingAll(false);
        }
    };

    const hasUnread = list.items.some((n) => !n.read_at);

    let body;
    if (list.status === 'loading') body = <LoadingView />;
    else if (list.status === 'error') body = <ErrorState message={list.error} onRetry={list.reload}/>;
    else {
        body = (<FlatList data={list.items} keyExtractor={(n) => n.id} contentContainerStyle={styles.list} ItemSeparatorComponent={() => <View style={styles.separator}/>} onEndReached={list.loadMore} onEndReachedThreshold={0.4} refreshControl={<RefreshControl refreshing={list.refreshing} onRefresh={list.refresh} tintColor={colors.primary} colors={[colors.primary]}/>} ListFooterComponent={list.loadingMore ? <ActivityIndicator style={styles.footer} color={colors.primary}/> : null} ListEmptyComponent={<EmptyState icon="notifications-outline" title="No notifications yet" message="New orders, pickups and payouts show up here."/>} renderItem={({ item }) => {
                const unread = !item.read_at;
                return (<Pressable accessibilityRole="button" onPress={() => open(item)} style={[styles.row, unread && styles.rowUnread]}>
                <View style={[styles.icon, unread && styles.iconUnread]}>
                  <Ionicons name={notificationIcon(item.type)} size={20} color={unread ? colors.textOnPrimary : colors.primary}/>
                </View>
                <View style={styles.text}>
                  <Text style={[styles.title, unread && styles.titleUnread]}>{item.title}</Text>
                  {item.body ? <Text style={styles.body}>{item.body}</Text> : null}
                  <Text style={styles.time}>{formatDateTime(item.created_at)}</Text>
                </View>
                {unread ? <View style={styles.dot}/> : null}
              </Pressable>);
            }}/>);
    }

    return (<SafeScreen edges={['top', 'bottom']}>
      <ScreenHeader title="Notifications" right={hasUnread ? (<Pressable accessibilityRole="button" onPress={readAll} disabled={markingAll} hitSlop={8}>
            <Text style={styles.readAll}>{markingAll ? 'Marking…' : 'Mark all read'}</Text>
          </Pressable>) : null}/>
      {body}
    </SafeScreen>);
}
