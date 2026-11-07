import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingView } from '@/components/ui/LoadingView';
import { NoticeBanner } from '@/components/ui/NoticeBanner';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useAsyncData } from '@/hooks/useAsyncData';
import { colors } from '@/theme';
import { getErrorMessage } from '@/utils/getErrorMessage';

import { handoverService } from './handoverService';
import { PICKUP_FEE_RULE } from './handoverStatus';
import { styles } from './HandoverSettingsScreen.styles';

const OPTIONS = [
    { value: 'rider_pickup', icon: 'bicycle', title: 'A Hamads rider collects my orders', body: `Pickup fee: ${PICKUP_FEE_RULE}.` },
    { value: 'seller_dropoff', icon: 'walk', title: 'I bring my orders to the warehouse', body: 'Free. You drop each paid order at the Hamads warehouse.' },
];

/** GET/PUT /seller/market/settings: the default handover for every new paid order. */
export function HandoverSettingsScreen() {
    const { data, loading, error, reload, setData } = useAsyncData(() => handoverService.settings(), []);
    const [saving, setSaving] = useState(null);
    const [saveError, setSaveError] = useState(null);

    const choose = async (value) => {
        if (value === data?.default_handover || saving) return;
        setSaving(value);
        setSaveError(null);
        try {
            setData(await handoverService.saveSettings(value));
        }
        catch (e) {
            setSaveError(getErrorMessage(e));
        }
        finally {
            setSaving(null);
        }
    };

    return (<SafeScreen edges={['top', 'bottom']}>
      <ScreenHeader title="Order handover"/>
      {loading && !data ? (<LoadingView />) : error && !data ? (<ErrorState message={error} onRetry={() => reload()}/>) : (<ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.intro}>Hamads delivers every order to your customers. How should your paid orders get to our warehouse?</Text>
          <View style={styles.options} accessibilityRole="radiogroup">
            {OPTIONS.map((o) => {
                const selected = data.default_handover === o.value;
                return (<Pressable key={o.value} accessibilityRole="radio" accessibilityState={{ selected }} onPress={() => choose(o.value)} style={[styles.option, selected && styles.selected]}>
                  <View style={[styles.icon, selected && styles.iconSelected]}>
                    <Ionicons name={o.icon} size={22} color={selected ? colors.textOnPrimary : colors.primary}/>
                  </View>
                  <View style={styles.text}>
                    <Text style={styles.title}>{o.title}</Text>
                    <Text style={styles.body}>{o.body}</Text>
                  </View>
                  {saving === o.value ? (<ActivityIndicator color={colors.primary}/>) : (<Ionicons name={selected ? 'radio-button-on' : 'radio-button-off'} size={22} color={selected ? colors.primary : colors.disabled}/>)}
                </Pressable>);
            })}
          </View>
          <ErrorMessage message={saveError}/>
          <NoticeBanner tone="info" message="This applies to new paid orders automatically. You can still change any single order from Handover until a rider is assigned."/>
        </ScrollView>)}
    </SafeScreen>);
}
