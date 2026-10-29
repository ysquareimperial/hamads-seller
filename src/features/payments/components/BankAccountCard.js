import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { StatusBadge } from '@/components/ui/StatusBadge';
import { colors } from '@/theme';

import { accountStatus, SQUAD_OK } from '../paymentStatus';
import { styles } from './BankAccountCard.styles';

export function BankAccountCard({ account, onPress, onRecheck, rechecking = false }) {
    const status = accountStatus(account.status);
    const squadNeedsCheck = account.squad_check && !SQUAD_OK.includes(String(account.squad_check).toLowerCase());
    return (<Pressable accessibilityRole={onPress ? 'button' : undefined} onPress={onPress} disabled={!onPress} style={styles.card}>
      <View style={styles.icon}>
        <Ionicons name="business-outline" size={20} color={colors.primary}/>
      </View>
      <View style={styles.body}>
        <Text style={styles.bank} numberOfLines={1}>{`${account.bank_name ?? account.bank_code} ••••${account.account_number_last4}`}</Text>
        <Text style={styles.name} numberOfLines={1}>{account.account_name}</Text>
        <View style={styles.badges}>
          <StatusBadge text={status.text} tone={status.tone}/>
          {account.is_default ? <StatusBadge text="Default" tone="primary"/> : null}
        </View>
        {squadNeedsCheck && onRecheck ? (<Pressable accessibilityRole="button" onPress={onRecheck} disabled={rechecking} style={styles.recheck}>
            <Ionicons name="refresh" size={14} color={colors.primary}/>
            <Text style={styles.recheckText}>{rechecking ? 'Checking…' : `Re-check payouts (${String(account.squad_check).replace(/_/g, ' ')})`}</Text>
          </Pressable>) : null}
      </View>
      {onPress ? <Ionicons name="chevron-forward" size={18} color={colors.disabled}/> : null}
    </Pressable>);
}
