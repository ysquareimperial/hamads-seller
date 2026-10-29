import { useState } from 'react';
import { ActivityIndicator, Switch, Text, View } from 'react-native';

import { useAuthStore } from '@/store/authStore';
import { useBusinessStore } from '@/store/businessStore';
import { colors } from '@/theme';
import { getErrorMessage } from '@/utils/getErrorMessage';

import { foodVendorService } from '../services/foodVendorService';
import { styles } from './OpenStatusToggle.styles';

/** The shop's open/closed switch. Customers only see open shops. */
export function OpenStatusToggle() {
    const vendor = useBusinessStore((s) => s.vendor);
    const setVendor = useBusinessStore((s) => s.setVendor);
    const sellerApproved = useAuthStore((s) => !!s.seller?.is_approved);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const toggle = async (next) => {
        setSaving(true);
        setError(null);
        setVendor({ ...vendor, is_open: next });
        try {
            setVendor(await foodVendorService.setOpen(next));
        }
        catch (e) {
            setVendor({ ...vendor, is_open: !next });
            setError(getErrorMessage(e));
        }
        finally {
            setSaving(false);
        }
    };

    const open = vendor.is_open;
    // Opening needs both the seller account and the shop approved; closing is always allowed.
    const canOpen = sellerApproved && vendor.is_approved;
    const locked = !open && !canOpen;
    return (<View style={[styles.card, open ? styles.open : styles.closed]}>
      <View style={[styles.dot, open ? styles.dotOpen : styles.dotClosed]}/>
      <View style={styles.text}>
        <Text style={styles.title}>{open ? "You're open" : "You're closed"}</Text>
        <Text style={styles.subtitle}>
          {error ?? (open ? 'Customers can see your shop and order now.' : locked ? 'You can open once Hamads approves your account and shop.' : 'Customers can’t see or order from your shop.')}
        </Text>
      </View>
      {saving ? <ActivityIndicator color={colors.primary}/> : null}
      <Switch accessibilityLabel="Shop open" value={open} onValueChange={toggle} disabled={saving || locked} trackColor={{ true: colors.success, false: colors.border }} thumbColor={colors.surface}/>
    </View>);
}
