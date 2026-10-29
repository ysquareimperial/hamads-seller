import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, RefreshControl, ScrollView, Switch, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingView } from '@/components/ui/LoadingView';
import { NoticeBanner } from '@/components/ui/NoticeBanner';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SelectField } from '@/components/ui/SelectField';
import { TextField } from '@/components/ui/TextField';
import { useAsyncData } from '@/hooks/useAsyncData';
import { colors } from '@/theme';
import { getErrorMessage } from '@/utils/getErrorMessage';

import { BankAccountCard } from '../components/BankAccountCard';
import { paymentsService } from '../services/paymentsService';
import { styles } from './BankAccountsScreen.styles';

export function BankAccountsScreen() {
    const { data: accounts, loading, error, reload, setData } = useAsyncData(() => paymentsService.bankAccounts(), []);
    const [banks, setBanks] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [adding, setAdding] = useState(false);
    const [rechecking, setRechecking] = useState(null);

    useEffect(() => {
        paymentsService.banks().then(setBanks).catch(() => { });
    }, []);

    const refresh = async () => {
        setRefreshing(true);
        await reload({ silent: true });
        setRefreshing(false);
    };

    const recheck = async (account) => {
        setRechecking(account.id);
        try {
            const updated = await paymentsService.recheckSquad(account.id);
            setData((list) => list.map((a) => (a.id === account.id ? updated : a)));
        }
        catch (e) {
            Alert.alert("Couldn't re-check", getErrorMessage(e));
        }
        finally {
            setRechecking(null);
        }
    };

    const showForm = adding || (accounts && accounts.length === 0);

    return (<SafeScreen edges={['top', 'bottom']}>
      <ScreenHeader title="Bank accounts"/>
      {loading && !accounts ? (<LoadingView />) : error && !accounts ? (<ErrorState message={error} onRetry={() => reload()}/>) : (<KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]}/>}>
            <NoticeBanner tone="info" message="Earnings from both your Online Store and Food Shop are paid into your default account."/>
            {accounts.map((a) => (<BankAccountCard key={a.id} account={a} onRecheck={() => recheck(a)} rechecking={rechecking === a.id}/>))}
            {showForm ? (<AddBankForm banks={banks} isFirst={accounts.length === 0} onCancel={accounts.length ? () => setAdding(false) : null} onAdded={(acct) => {
                setData((list) => [...list.map((a) => (acct.is_default ? { ...a, is_default: false } : a)), acct]);
                setAdding(false);
            }}/>) : (<Button title="Add another account" variant="secondary" icon="add" onPress={() => setAdding(true)}/>)}
          </ScrollView>
        </KeyboardAvoidingView>)}
    </SafeScreen>);
}

function AddBankForm({ banks, isFirst, onCancel, onAdded }) {
    const [bankCode, setBankCode] = useState(null);
    const [number, setNumber] = useState('');
    const [isDefault, setIsDefault] = useState(true);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState(null);
    const [saving, setSaving] = useState(false);

    const save = async () => {
        const next = {
            bank: !bankCode ? 'Choose your bank.' : null,
            number: number.length !== 10 ? 'Enter your 10-digit account number (NUBAN).' : null,
        };
        setErrors(next);
        setSubmitError(null);
        if (next.bank || next.number) return;
        setSaving(true);
        try {
            const bank = banks.find((b) => b.code === bankCode);
            const created = await paymentsService.addBankAccount({
                bank_code: bankCode,
                bank_name: bank?.name ?? null,
                account_number: number,
                is_default: isFirst || isDefault,
            });
            onAdded(created);
        }
        catch (e) {
            setSubmitError(getErrorMessage(e));
        }
        finally {
            setSaving(false);
        }
    };

    return (<Card>
      <Text style={styles.cardTitle}>Add bank account</Text>
      <SelectField label="Bank" placeholder={banks.length ? 'Choose your bank' : 'Loading banks…'} options={banks.map((b) => ({ value: b.code, label: b.name }))} value={bankCode} onChange={(v) => {
            setBankCode(v);
            setErrors((e) => ({ ...e, bank: null }));
        }} error={errors.bank} searchable disabled={saving || !banks.length}/>
      <TextField label="Account number" placeholder="0123456789" keyboardType="number-pad" maxLength={10} value={number} onChangeText={(t) => {
            setNumber(t.replace(/\D/g, ''));
            setErrors((e) => ({ ...e, number: null }));
        }} error={errors.number} hint="We confirm the account name with your bank." editable={!saving}/>
      {!isFirst ? (<View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Use for payouts</Text>
          <Switch value={isDefault} onValueChange={setIsDefault} disabled={saving} trackColor={{ true: colors.primary, false: colors.border }} thumbColor={colors.surface}/>
        </View>) : null}
      <ErrorMessage message={submitError}/>
      <Button title="Save account" onPress={save} loading={saving}/>
      {onCancel ? <Button title="Cancel" variant="secondary" compact onPress={onCancel} disabled={saving}/> : null}
    </Card>);
}
