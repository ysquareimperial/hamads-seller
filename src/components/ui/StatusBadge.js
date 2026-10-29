import { Text, View } from 'react-native';

import { statusLabel } from '@/utils/format';

import { styles } from './StatusBadge.styles';

const TONES = {
    awaiting_fulfillment: 'warning',
    processing: 'primary',
    shipped: 'primary',
    delivered: 'success',
    completed: 'success',
    approved: 'success',
    active: 'success',
    pending: 'warning',
    cancelled: 'danger',
    inactive: 'neutral',
};

/** `tone` overrides the status lookup: neutral | primary | success | warning | danger */
export function StatusBadge({ status, text, tone }) {
    const resolved = tone ?? TONES[String(status).toLowerCase()] ?? 'neutral';
    return (<View style={[styles.badge, styles[resolved]]}>
      <Text style={[styles.text, styles[`${resolved}Text`]]}>{text ?? statusLabel(status)}</Text>
    </View>);
}
