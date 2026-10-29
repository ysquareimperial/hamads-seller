import { useState } from 'react';
import { View } from 'react-native';

import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { TextField } from '@/components/ui/TextField';

import { styles } from './sheet.styles';

export function ShipSheet({ visible, onClose, onSubmit, submitting, error }) {
    const [carrier, setCarrier] = useState('');
    const [tracking, setTracking] = useState('');
    return (<BottomSheet visible={visible} title="Mark as shipped" onClose={onClose}>
      <View style={styles.form}>
        <TextField label="Carrier (optional)" placeholder="e.g. GIG Logistics, own rider" autoCapitalize="words" maxLength={100} value={carrier} onChangeText={setCarrier} editable={!submitting}/>
        <TextField label="Tracking number (optional)" placeholder="e.g. GIG123456" autoCapitalize="characters" maxLength={100} value={tracking} onChangeText={setTracking} editable={!submitting}/>
        <ErrorMessage message={error}/>
        <Button title="Confirm shipment" icon="paper-plane-outline" onPress={() => onSubmit({ carrier_name: carrier.trim(), tracking_number: tracking.trim() })} loading={submitting}/>
      </View>
    </BottomSheet>);
}
