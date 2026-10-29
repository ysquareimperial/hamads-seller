import { useState } from 'react';
import { View } from 'react-native';

import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { ChipRow } from '@/components/ui/ChipRow';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { TextField } from '@/components/ui/TextField';

import { styles } from './sheet.styles';

const QUICK = ['Item sold out', 'Kitchen too busy', 'Closing soon'].map((r) => ({ value: r, label: r }));

export function RejectSheet({ visible, onClose, onSubmit, submitting, error }) {
    const [reason, setReason] = useState('');
    const [fieldError, setFieldError] = useState(null);
    const update = (t) => {
        setReason(t);
        setFieldError(null);
    };
    const submit = () => {
        if (reason.trim().length < 3) {
            setFieldError('Give the customer a short reason (at least 3 characters).');
            return;
        }
        onSubmit(reason.trim());
    };
    return (<BottomSheet visible={visible} title="Reject this order?" onClose={onClose}>
      <View style={styles.form}>
        <View style={styles.bleed}>
          <ChipRow options={QUICK} value={reason} onChange={update}/>
        </View>
        <TextField label="Reason" placeholder="The customer will see this" autoCapitalize="sentences" multiline maxLength={255} value={reason} onChangeText={update} error={fieldError} editable={!submitting}/>
        <ErrorMessage message={error}/>
        <Button title="Reject order" variant="danger" onPress={submit} loading={submitting}/>
      </View>
    </BottomSheet>);
}
