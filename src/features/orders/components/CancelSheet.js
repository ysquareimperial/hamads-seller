import { useState } from 'react';
import { View } from 'react-native';

import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { ChipRow } from '@/components/ui/ChipRow';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { TextField } from '@/components/ui/TextField';

import { styles } from './sheet.styles';

const QUICK_REASONS = ['Out of stock', 'Cannot deliver to this address', 'Pricing error'].map((r) => ({ value: r, label: r }));

export function CancelSheet({ visible, onClose, onSubmit, submitting, error }) {
    const [reason, setReason] = useState('');
    const [fieldError, setFieldError] = useState(null);
    const submit = () => {
        if (reason.trim().length < 3) {
            setFieldError('Give the customer a short reason (at least 3 characters).');
            return;
        }
        onSubmit(reason.trim());
    };
    return (<BottomSheet visible={visible} title="Cancel this order?" onClose={onClose}>
      <View style={styles.form}>
        <View style={styles.bleed}>
          <ChipRow options={QUICK_REASONS} value={reason} onChange={(r) => {
            setReason(r);
            setFieldError(null);
        }}/>
        </View>
        <TextField label="Reason" placeholder="The customer will see this" autoCapitalize="sentences" multiline maxLength={255} value={reason} onChangeText={(t) => {
            setReason(t);
            setFieldError(null);
        }} error={fieldError} editable={!submitting}/>
        <ErrorMessage message={error}/>
        <Button title="Cancel order" variant="danger" onPress={submit} loading={submitting}/>
      </View>
    </BottomSheet>);
}
