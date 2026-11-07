import { useState } from 'react';
import { Text, View } from 'react-native';

import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { TextField } from '@/components/ui/TextField';

import { dayLabel, qtyOrNull, qtyText } from '../utils/schedule';
import { styles } from './sheet.styles';

/** PUT /food/vendor/items/{id}/days/{date}: one day's limits. Blank = the dish's usual limit. */
export function DayLimitSheet({ row, onClose, onSubmit, submitting, error }) {
    const [pre, setPre] = useState(qtyText(row?.preorder_quantity));
    const [same, setSame] = useState(qtyText(row?.sameday_quantity));
    return (<BottomSheet visible={!!row} title={row ? `Limits for ${dayLabel(row.day ?? row.date)}` : ''} onClose={onClose}>
      <View style={styles.form}>
        <Text style={styles.hint}>Leave blank to use this dish’s usual limit. You can’t go below what’s already ordered.</Text>
        <TextField label={`Planned orders (${row?.preorder_sold ?? 0} sold)`} placeholder="Usual" keyboardType="number-pad" value={pre} onChangeText={(t) => setPre(t.replace(/\D/g, ''))} editable={!submitting}/>
        <TextField label={`Same-day orders (${row?.sameday_sold ?? 0} sold)`} placeholder="Usual" keyboardType="number-pad" value={same} onChangeText={(t) => setSame(t.replace(/\D/g, ''))} editable={!submitting}/>
        <ErrorMessage message={error}/>
        <Button title="Save limits" onPress={() => onSubmit({ preorder_quantity: qtyOrNull(pre), sameday_quantity: qtyOrNull(same) })} loading={submitting}/>
      </View>
    </BottomSheet>);
}
