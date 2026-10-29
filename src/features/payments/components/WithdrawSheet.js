import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { SelectField } from '@/components/ui/SelectField';
import { TextField } from '@/components/ui/TextField';
import { formatMinor } from '@/utils/format';

import { styles } from './WithdrawSheet.styles';

const accountLabel = (a) => `${a.bank_name ?? a.bank_code} ••••${a.account_number_last4}`;

export function WithdrawSheet({ visible, onClose, availableMinor, accounts, onSubmit, submitting, error }) {
    const fallback = accounts.find((a) => a.is_default)?.id ?? accounts[0]?.id ?? null;
    const [accountId, setAccountId] = useState(null);
    const [amount, setAmount] = useState('');
    const [fieldError, setFieldError] = useState(null);
    const selectedId = accountId ?? fallback;

    const submit = () => {
        const minor = Math.round(Number(amount) * 100);
        if (!(minor > 0)) return setFieldError('Enter an amount.');
        if (minor > availableMinor) return setFieldError(`You can withdraw up to ${formatMinor(availableMinor)}.`);
        if (!selectedId) return setFieldError('Add a bank account first.');
        setFieldError(null);
        return onSubmit(selectedId, minor);
    };

    return (<BottomSheet visible={visible} title="Withdraw" onClose={onClose}>
      <View style={styles.form}>
        <Text style={styles.hint}>{`Available: ${formatMinor(availableMinor)}`}</Text>
        <TextField label="Amount" prefix="₦" placeholder="0" keyboardType="decimal-pad" value={amount} onChangeText={(t) => {
            setAmount(t.replace(/[^\d.]/g, ''));
            setFieldError(null);
        }} error={fieldError} editable={!submitting}/>
        <Pressable accessibilityRole="button" onPress={() => setAmount(String(availableMinor / 100))} style={styles.all}>
          <Text style={styles.allText}>Withdraw everything</Text>
        </Pressable>
        {accounts.length > 1 ? (<SelectField label="To" options={accounts.map((a) => ({ value: a.id, label: accountLabel(a) }))} value={selectedId} onChange={setAccountId}/>) : accounts[0] ? <Text style={styles.hint}>{`To ${accountLabel(accounts[0])} · ${accounts[0].account_name}`}</Text> : null}
        <ErrorMessage message={error}/>
        <Button title="Withdraw" icon="arrow-up-circle-outline" onPress={submit} loading={submitting}/>
      </View>
    </BottomSheet>);
}
