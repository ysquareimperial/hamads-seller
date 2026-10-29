import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, RefreshControl, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingView } from '@/components/ui/LoadingView';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useAsyncData } from '@/hooks/useAsyncData';
import { colors } from '@/theme';
import { formatDateTime, formatMinor } from '@/utils/format';
import { getErrorMessage } from '@/utils/getErrorMessage';

import { BankAccountCard } from '../components/BankAccountCard';
import { WithdrawSheet } from '../components/WithdrawSheet';
import { isCredit } from '../paymentStatus';
import { paymentsService } from '../services/paymentsService';
import { styles } from './WalletScreen.styles';

async function loadWallet() {
    const [wallet, accounts, transactions] = await Promise.all([
        paymentsService.wallet(),
        paymentsService.bankAccounts(),
        paymentsService.transactions(),
    ]);
    return { wallet, accounts, transactions };
}

export function WalletScreen() {
    const { data, loading, error, reload } = useAsyncData(loadWallet, []);
    const [refreshing, setRefreshing] = useState(false);
    const [withdrawing, setWithdrawing] = useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [withdrawError, setWithdrawError] = useState(null);

    const refresh = async () => {
        setRefreshing(true);
        await reload({ silent: true });
        setRefreshing(false);
    };

    const withdraw = async (accountId, minor) => {
        setWithdrawing(true);
        setWithdrawError(null);
        try {
            const payout = await paymentsService.withdraw(accountId, minor);
            setSheetOpen(false);
            await reload({ silent: true });
            Alert.alert('Withdrawal requested', `${formatMinor(payout.net_amount_minor)} is on its way${payout.fee_minor ? ` (fee ${formatMinor(payout.fee_minor)})` : ''}.`);
        }
        catch (e) {
            setWithdrawError(getErrorMessage(e));
        }
        finally {
            setWithdrawing(false);
        }
    };

    const header = <ScreenHeader title="Payments" right={null}/>;
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

    const { wallet, accounts, transactions } = data;
    const main = accounts.find((a) => a.is_default) ?? accounts[0];

    return (<SafeScreen edges={['top', 'bottom']}>
      {header}
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]}/>}>
        <View style={styles.balance}>
          <Text style={styles.balanceLabel}>Available</Text>
          <Text style={styles.balanceValue}>{formatMinor(wallet.available_minor)}</Text>
          <View style={styles.subRow}>
            <View style={styles.sub}>
              <Text style={styles.subLabel}>On hold</Text>
              <Text style={styles.subValue}>{formatMinor(wallet.pending_minor)}</Text>
            </View>
            <View style={styles.sub}>
              <Text style={styles.subLabel}>Locked</Text>
              <Text style={styles.subValue}>{formatMinor(wallet.locked_minor)}</Text>
            </View>
          </View>
          <Text style={styles.balanceHint}>Money from each order is held for a short time, then paid to your bank automatically.</Text>
        </View>

        <View style={styles.actions}>
          <View style={styles.action}>
            <Button title="Withdraw" icon="arrow-up-circle-outline" compact onPress={() => {
            setWithdrawError(null);
            setSheetOpen(true);
        }} disabled={!main || !(wallet.available_minor > 0)}/>
          </View>
          <View style={styles.action}>
            <Button title="Payouts" variant="secondary" icon="time-outline" compact onPress={() => router.push('/payments/payouts')}/>
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Bank account" actionLabel={accounts.length ? 'Manage' : undefined} onAction={() => router.push('/payments/bank')}/>
          {main ? (<BankAccountCard account={main} onPress={() => router.push('/payments/bank')}/>) : (<Card>
              <View style={styles.noBank}>
                <Ionicons name="business-outline" size={22} color={colors.primary}/>
                <Text style={styles.noBankText}>Add the bank account your earnings should be paid into.</Text>
              </View>
              <Button title="Add bank account" icon="add" compact onPress={() => router.push('/payments/bank')}/>
            </Card>)}
        </View>

        <View style={styles.section}>
          <SectionHeader title="Transactions"/>
          {transactions.length ? (<Card style={styles.list}>
              {transactions.slice(0, 50).map((t, i) => {
                const credit = isCredit(t);
                return (<View key={t.id} style={[styles.tx, i > 0 && styles.txBorder]}>
                    <View style={[styles.txIcon, credit ? styles.txIn : styles.txOut]}>
                      <Ionicons name={credit ? 'arrow-down' : 'arrow-up'} size={14} color={credit ? colors.success : colors.danger}/>
                    </View>
                    <View style={styles.txText}>
                      <Text style={styles.txDesc} numberOfLines={2}>{t.description}</Text>
                      <Text style={styles.txMeta}>{`${formatDateTime(t.created_at)} · ${t.entry_type.replace(/_/g, ' ')}`}</Text>
                    </View>
                    <Text style={[styles.txAmount, credit ? styles.txAmountIn : styles.txAmountOut]}>{`${credit ? '+' : '−'}${formatMinor(t.amount_minor)}`}</Text>
                  </View>);
            })}
            </Card>) : (<EmptyState icon="receipt-outline" title="No transactions yet" message="Earnings from your orders will show here."/>)}
        </View>
      </ScrollView>

      <WithdrawSheet visible={sheetOpen} onClose={() => setSheetOpen(false)} availableMinor={wallet.available_minor} accounts={accounts} onSubmit={withdraw} submitting={withdrawing} error={withdrawError}/>
    </SafeScreen>);
}
