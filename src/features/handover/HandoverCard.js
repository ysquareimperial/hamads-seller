import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { colors } from '@/theme';
import { formatDateTime, formatMinor, formatPhone, shortId } from '@/utils/format';

import { canSwitch, HANDOVER, itemsLine, jobInstruction, jobStatus } from './handoverStatus';
import { styles } from './HandoverCard.styles';

/**
 * One order's handover to the Hamads warehouse.
 * `showOrder` adds the order number and items (used in the list, not on the order page).
 */
export function HandoverCard({ job, onSwitch, switching = false, onOpenOrder, showOrder = false }) {
    const status = jobStatus(job.status);
    const method = HANDOVER[job.method];
    const other = job.method === 'rider_pickup' ? 'seller_dropoff' : 'rider_pickup';
    const instruction = jobInstruction(job);
    return (<View style={styles.card}>
      <View style={styles.top}>
        {showOrder ? (<Pressable accessibilityRole="button" disabled={!onOpenOrder} onPress={onOpenOrder} style={styles.orderLink}>
            <Text style={styles.order}>{`Order #${shortId(job.seller_order_id)}`}</Text>
            {onOpenOrder ? <Ionicons name="chevron-forward" size={14} color={colors.textMuted}/> : null}
          </Pressable>) : (<Text style={styles.title}>Hamads delivery</Text>)}
        <StatusBadge text={status.text} tone={status.tone}/>
      </View>

      {showOrder ? (<Text style={styles.meta} numberOfLines={2}>{`${formatDateTime(job.created_at)} · ${itemsLine(job.items)}`}</Text>) : null}

      <View style={styles.methodRow}>
        <View style={styles.method}>
          <Ionicons name={method?.icon ?? 'help-circle-outline'} size={16} color={colors.primary}/>
          <Text style={styles.methodText}>{method?.label ?? 'Not chosen yet'}</Text>
        </View>
        {job.method === 'rider_pickup' ? (<Text style={styles.fee}>{job.pickup_fee_minor ? `Pickup fee ${formatMinor(job.pickup_fee_minor)}` : 'No pickup fee'}</Text>) : job.method === 'seller_dropoff' ? (<Text style={styles.fee}>Free</Text>) : null}
      </View>

      {instruction ? <Text style={styles.instruction}>{instruction}</Text> : null}

      {job.rider_phone && ['rider_assigned', 'collected'].includes(job.status) ? (<Pressable accessibilityRole="button" onPress={() => Linking.openURL(`tel:${job.rider_phone}`)} style={styles.call}>
          <Ionicons name="call-outline" size={16} color={colors.primary}/>
          <Text style={styles.callText}>{`${job.rider_name ?? 'Rider'} · ${formatPhone(job.rider_phone)}`}</Text>
        </Pressable>) : null}

      {canSwitch(job) && onSwitch ? (<Button compact variant="secondary" icon={HANDOVER[other].icon} title={job.method ? `Switch to: ${HANDOVER[other].label}` : 'Rider pickup'} loading={switching} onPress={() => onSwitch(job, job.method ? other : 'rider_pickup')}/>) : null}
      {canSwitch(job) && onSwitch && !job.method ? (<Button compact variant="secondary" icon={HANDOVER.seller_dropoff.icon} title="I'll drop it off" disabled={switching} onPress={() => onSwitch(job, 'seller_dropoff')}/>) : null}
    </View>);
}
