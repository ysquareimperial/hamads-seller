import { useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { ChipRow } from '@/components/ui/ChipRow';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingView } from '@/components/ui/LoadingView';
import { NoticeBanner } from '@/components/ui/NoticeBanner';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useBusinessStore } from '@/store/businessStore';
import { useRefreshStore } from '@/store/refreshStore';
import { colors } from '@/theme';

import { foodVendorService } from '../services/foodVendorService';
import { dayLabel, hourLabel, planDays, planItemText, planWindow } from '../utils/schedule';
import { styles } from './PlanScreen.styles';

const RANGES = [
    { value: 7, label: 'Next 7 days' },
    { value: 3, label: '3 days' },
    { value: 1, label: 'Today' },
];

/** GET /food/vendor/plan: what to cook, per day and delivery window. */
export function PlanScreen() {
    const vendor = useBusinessStore((s) => s.vendor);
    const version = useRefreshStore((s) => s.foodOrders);
    const [days, setDays] = useState(7);
    const { data, loading, error, reload } = useAsyncData(() => foodVendorService.plan(days), [days, version]);
    const [refreshing, setRefreshing] = useState(false);

    const refresh = async () => {
        setRefreshing(true);
        await reload({ silent: true });
        setRefreshing(false);
    };

    const list = planDays(data);
    const hasHours = vendor?.window_start_hour !== undefined && vendor?.window_start_hour !== null;

    let body;
    if (loading && !data) body = <LoadingView />;
    else if (error && !data) body = <ErrorState message={error} onRetry={() => reload()}/>;
    else {
        const busy = list.filter((d) => (d.order_count ?? 0) > 0);
        body = (<ScrollView contentContainerStyle={styles.scroll} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]}/>}>
          {hasHours ? (<Text style={styles.hint}>{`Planned orders are delivered between ${hourLabel(vendor.window_start_hour)} and ${hourLabel(vendor.window_end_hour)}. Change this in Shop settings.`}</Text>) : (<NoticeBanner message="Set your planned-order hours in Shop settings so customers can pick a delivery window."/>)}
          {busy.length ? busy.map((d) => (<Card key={d.date ?? d.day}>
              <View style={styles.dayTop}>
                <Text style={styles.day}>{dayLabel(d.date ?? d.day)}</Text>
                <Text style={styles.count}>{`${d.order_count} order${d.order_count === 1 ? '' : 's'}`}</Text>
              </View>
              {(d.items ?? []).length ? (<View style={styles.items}>
                  {d.items.map((i, idx) => (<Text key={idx} style={styles.item}>{planItemText(i)}</Text>))}
                </View>) : null}
              {(d.windows ?? []).length ? (<View style={styles.windows}>
                  {d.windows.map((raw, idx) => {
                    const w = planWindow(raw);
                    return (<View key={idx} style={styles.window}>
                        <Text style={styles.windowLabel}>{w.label}</Text>
                        {w.count !== null ? <Text style={styles.windowCount}>{`${w.count} order${w.count === 1 ? '' : 's'}`}</Text> : null}
                        {w.items.length ? <Text style={styles.windowItems}>{w.items.map(planItemText).join(', ')}</Text> : null}
                      </View>);
                })}
                </View>) : null}
            </Card>)) : (<EmptyState icon="calendar-outline" title="Nothing planned yet" message="When customers order for a later day, what to cook shows up here."/>)}
        </ScrollView>);
    }

    return (<SafeScreen>
      <ScreenHeader title="Plan" subtitle="Planned orders by day" showBack={false}/>
      <ChipRow options={RANGES} value={days} onChange={setDays}/>
      {body}
    </SafeScreen>);
}
