import { useState } from 'react';
import { Text, View } from 'react-native';

import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { ChipRow } from '@/components/ui/ChipRow';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { TextField } from '@/components/ui/TextField';
import { FOOD_PREP_MAX, FOOD_PREP_MIN } from '@/config';

import { styles } from './sheet.styles';

const QUICK = [10, 15, 20, 30, 45, 60].map((m) => ({ value: m, label: `${m} min` }));

export function AcceptSheet({ visible, defaultMinutes, onClose, onSubmit, submitting, error }) {
    const [minutes, setMinutes] = useState(String(defaultMinutes ?? 20));
    const [fieldError, setFieldError] = useState(null);
    const submit = () => {
        const n = Number(minutes);
        if (!Number.isInteger(n) || n < FOOD_PREP_MIN || n > FOOD_PREP_MAX) {
            setFieldError(`Enter ${FOOD_PREP_MIN}–${FOOD_PREP_MAX} minutes.`);
            return;
        }
        onSubmit(n);
    };
    return (<BottomSheet visible={visible} title="Accept order" onClose={onClose}>
      <View style={styles.form}>
        <Text style={styles.hint}>How long until it’s ready? The customer sees this estimate.</Text>
        <View style={styles.bleed}>
          <ChipRow options={QUICK} value={Number(minutes)} onChange={(m) => {
            setMinutes(String(m));
            setFieldError(null);
        }}/>
        </View>
        <TextField label="Prep time (minutes)" keyboardType="number-pad" maxLength={3} value={minutes} onChangeText={(t) => {
            setMinutes(t.replace(/\D/g, ''));
            setFieldError(null);
        }} error={fieldError} editable={!submitting}/>
        <ErrorMessage message={error}/>
        <Button title="Accept and start preparing" icon="checkmark" onPress={submit} loading={submitting}/>
      </View>
    </BottomSheet>);
}
