import { useState } from 'react';
import { Text, View } from 'react-native';

import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { OtpInput } from '@/components/ui/OtpInput';
import { FOOD_PICKUP_CODE_LENGTH } from '@/config';

import { styles } from './sheet.styles';

export function PickupCodeSheet({ visible, onClose, onSubmit, submitting, error }) {
    const [code, setCode] = useState('');
    const complete = code.length === FOOD_PICKUP_CODE_LENGTH;
    return (<BottomSheet visible={visible} title="Hand over order" onClose={onClose}>
      <View style={styles.form}>
        <Text style={styles.hint}>Ask the customer for the 4-digit pickup code on their app.</Text>
        <OtpInput value={code} onChange={setCode} length={FOOD_PICKUP_CODE_LENGTH} hasError={!!error} editable={!submitting} autoFocus/>
        <ErrorMessage message={error}/>
        <Button title="Confirm handover" icon="checkmark-done" onPress={() => onSubmit(code)} loading={submitting} disabled={!complete}/>
      </View>
    </BottomSheet>);
}
