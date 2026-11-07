import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingView } from '@/components/ui/LoadingView';
import { NoticeBanner } from '@/components/ui/NoticeBanner';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { TextField } from '@/components/ui/TextField';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useRefreshStore } from '@/store/refreshStore';
import { colors } from '@/theme';
import { getErrorMessage } from '@/utils/getErrorMessage';

import { DayLimitSheet } from '../components/DayLimitSheet';
import { foodItemCache } from '../foodCache';
import { foodVendorService } from '../services/foodVendorService';
import { AVAILABILITY_MODES, dayLabel, isoDay, qtyOrNull, qtyText, soldOf, upcomingRows, WEEKDAYS } from '../utils/schedule';
import { styles } from './DishScheduleScreen.styles';

const NEXT_DAYS = Array.from({ length: 14 }, (_, i) => isoDay(i + 1));

const fromSchedule = (s) => ({
    mode: s?.availability_mode ?? 'every_day',
    weekdays: s?.weekdays ?? [],
    pre: qtyText(s?.preorder_quantity),
    same: qtyText(s?.sameday_quantity),
    // day -> per-date planned limit text
    dates: Object.fromEntries((s?.dates ?? []).map((d) => [d.day ?? d.date, qtyText(d.preorder_quantity)])),
});

/** GET/PUT /food/vendor/items/{id}/schedule plus per-day limits. */
export function DishScheduleScreen() {
    const { id } = useLocalSearchParams();
    const item = foodItemCache.get(id);
    const bumpFoodItems = useRefreshStore((s) => s.bumpFoodItems);
    const { data, loading, error, reload, setData } = useAsyncData(() => foodVendorService.itemSchedule(id), [id]);
    const [form, setForm] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [saved, setSaved] = useState(false);
    const [dayRow, setDayRow] = useState(null);
    const [daySaving, setDaySaving] = useState(false);
    const [dayError, setDayError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    // Form starts from the server values; edits are kept until saved.
    const values = form ?? fromSchedule(data);
    const update = (patch) => {
        setForm({ ...values, ...patch });
        setSaved(false);
    };
    const toggleWeekday = (d) => update({ weekdays: values.weekdays.includes(d) ? values.weekdays.filter((x) => x !== d) : [...values.weekdays, d].sort() });
    const toggleDate = (day) => {
        const next = { ...values.dates };
        if (day in next) delete next[day];
        else next[day] = '';
        update({ dates: next });
    };

    const validate = () => {
        if (values.mode === 'weekdays' && !values.weekdays.length) return 'Pick at least one day of the week.';
        if (values.mode === 'dates' && !Object.keys(values.dates).length) return 'Pick at least one date.';
        return null;
    };

    const save = async () => {
        const invalid = validate();
        setSaveError(invalid);
        if (invalid) return;
        setSaving(true);
        try {
            const payload = {
                availability_mode: values.mode,
                weekdays: values.mode === 'weekdays' ? values.weekdays : [],
                preorder_quantity: qtyOrNull(values.pre),
                sameday_quantity: qtyOrNull(values.same),
                dates: values.mode === 'dates' ? Object.entries(values.dates).sort().map(([day, q]) => ({ day, preorder_quantity: qtyOrNull(q) })) : [],
            };
            const result = await foodVendorService.saveItemSchedule(id, payload);
            if (result && typeof result === 'object') setData(result);
            else await reload({ silent: true });
            setForm(null);
            setSaved(true);
            bumpFoodItems();
        }
        catch (e) {
            setSaveError(getErrorMessage(e));
        }
        finally {
            setSaving(false);
        }
    };

    const saveDay = async (limits) => {
        setDaySaving(true);
        setDayError(null);
        try {
            await foodVendorService.setDayLimit(id, dayRow.day ?? dayRow.date, limits);
            setDayRow(null);
            await reload({ silent: true });
        }
        catch (e) {
            setDayError(getErrorMessage(e));
        }
        finally {
            setDaySaving(false);
        }
    };

    const refresh = async () => {
        setRefreshing(true);
        setForm(null);
        await reload({ silent: true });
        setRefreshing(false);
    };

    const header = <ScreenHeader title="Schedule & limits" subtitle={item?.name}/>;
    if (loading && !data) {
        return (<SafeScreen edges={['top', 'bottom']}>
        {header}
        <LoadingView />
      </SafeScreen>);
    }
    if (error && !data) {
        return (<SafeScreen edges={['top', 'bottom']}>
        {header}
        <ErrorState message={error} onRetry={() => reload()}/>
      </SafeScreen>);
    }

    const rows = upcomingRows(data);

    return (<SafeScreen edges={['top', 'bottom']}>
      {header}
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]}/>}>
          <NoticeBanner tone="info" message="Customers can order this dish for today, or plan it for another day (up to 7 days ahead, closing at midnight). Blank limits mean no limit."/>

          <Card>
            <SegmentedControl label="Sold on" options={AVAILABILITY_MODES} value={values.mode} onChange={(mode) => update({ mode })}/>

            {values.mode === 'weekdays' ? (<View style={styles.chips}>
                {WEEKDAYS.map((label, d) => (<Chip key={label} label={label} selected={values.weekdays.includes(d)} onPress={() => toggleWeekday(d)}/>))}
              </View>) : null}

            {values.mode === 'dates' ? (<>
                <Text style={styles.label}>TAP THE DATES IT’S SOLD</Text>
                <View style={styles.chips}>
                  {NEXT_DAYS.map((day) => (<Chip key={day} label={dayLabel(day)} selected={day in values.dates} onPress={() => toggleDate(day)}/>))}
                </View>
                {Object.keys(values.dates).sort().map((day) => (<View key={day} style={styles.dateRow}>
                    <Text style={styles.dateLabel}>{dayLabel(day)}</Text>
                    <View style={styles.dateInput}>
                      <TextField label="Planned limit" placeholder="Usual" keyboardType="number-pad" value={values.dates[day]} onChangeText={(t) => update({ dates: { ...values.dates, [day]: t.replace(/\D/g, '') } })}/>
                    </View>
                  </View>))}
              </>) : null}
          </Card>

          <Card>
            <Text style={styles.cardTitle}>Daily limits</Text>
            <View style={styles.row}>
              <View style={styles.rowItem}>
                <TextField label="Planned orders / day" placeholder="No limit" keyboardType="number-pad" value={values.pre} onChangeText={(t) => update({ pre: t.replace(/\D/g, '') })}/>
              </View>
              <View style={styles.rowItem}>
                <TextField label="Same-day orders / day" placeholder="No limit" keyboardType="number-pad" value={values.same} onChangeText={(t) => update({ same: t.replace(/\D/g, '') })}/>
              </View>
            </View>
            <Text style={styles.hint}>Planned = ordered in advance for that day. Same-day = ordered on the day.</Text>
          </Card>

          <ErrorMessage message={saveError}/>
          {saved ? <NoticeBanner tone="success" message="Schedule saved."/> : null}
          <Button title="Save schedule" onPress={save} loading={saving} disabled={!form}/>

          <View style={styles.section}>
            <Text style={styles.cardTitle}>Upcoming days</Text>
            {rows.length ? rows.map((r) => (<Pressable key={r.day ?? r.date} accessibilityRole="button" onPress={() => {
                    setDayError(null);
                    setDayRow(r);
                }} style={styles.dayRow}>
                <Text style={styles.dayName}>{dayLabel(r.day ?? r.date)}</Text>
                <View style={styles.dayStats}>
                  <Text style={styles.dayStat}>{`Planned ${soldOf(r.preorder_sold, r.preorder_quantity)}`}</Text>
                  <Text style={styles.dayStat}>{`Same-day ${soldOf(r.sameday_sold, r.sameday_quantity)}`}</Text>
                </View>
                <Text style={styles.change}>Change</Text>
              </Pressable>)) : (<Text style={styles.hint}>Days this dish is sold show here with what’s been ordered.</Text>)}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <DayLimitSheet key={dayRow ? dayRow.day ?? dayRow.date : 'none'} row={dayRow} onClose={() => setDayRow(null)} onSubmit={saveDay} submitting={daySaving} error={dayError}/>
    </SafeScreen>);
}
