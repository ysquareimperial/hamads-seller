import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { colors } from '@/theme';
import { formatDateTime } from '@/utils/format';

import { ORDER_STEPS, stepIndex } from '../utils/orderStatus';
import { styles } from './OrderTimeline.styles';

export function OrderTimeline({ order }) {
    if (order.status === 'cancelled') {
        return (<View style={styles.cancelled}>
        <Ionicons name="close-circle" size={20} color={colors.danger}/>
        <View style={styles.cancelText}>
          <Text style={styles.cancelTitle}>{`Cancelled${order.cancelled_at ? ` · ${formatDateTime(order.cancelled_at)}` : ''}`}</Text>
          {order.cancellation_reason ? <Text style={styles.cancelReason}>{order.cancellation_reason}</Text> : null}
        </View>
      </View>);
    }
    const current = stepIndex(order.status);
    return (<View style={styles.list}>
      {ORDER_STEPS.map((step, i) => {
            const done = i <= current;
            const last = i === ORDER_STEPS.length - 1;
            const at = step.at ? order[step.at] : null;
            return (<View key={step.status} style={styles.step}>
            <View style={styles.rail}>
              <View style={[styles.dot, done && styles.dotDone]}>
                {done ? <Ionicons name="checkmark" size={12} color={colors.textOnPrimary}/> : null}
              </View>
              {!last ? <View style={[styles.line, i < current && styles.lineDone]}/> : null}
            </View>
            <View style={styles.stepText}>
              <Text style={[styles.label, !done && styles.labelPending]}>{step.label}</Text>
              {done && at ? <Text style={styles.time}>{formatDateTime(at)}</Text> : null}
            </View>
          </View>);
        })}
    </View>);
}
