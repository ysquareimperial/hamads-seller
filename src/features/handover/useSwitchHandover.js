import { useState } from 'react';
import { Alert } from 'react-native';

import { useRefreshStore } from '@/store/refreshStore';
import { getErrorMessage } from '@/utils/getErrorMessage';

import { handoverService } from './handoverService';
import { HANDOVER, PICKUP_FEE_RULE } from './handoverStatus';

/** Confirm-then-switch for one order's handover. Calls onUpdated(job) on success. */
export function useSwitchHandover(onUpdated) {
    const [switchingId, setSwitchingId] = useState(null);
    const bumpOrders = useRefreshStore((s) => s.bumpOrders);

    const run = async (job, method) => {
        setSwitchingId(job.id);
        try {
            const updated = await handoverService.switchMethod(job.id, method);
            onUpdated(updated);
            bumpOrders();
        }
        catch (e) {
            Alert.alert("Couldn't change handover", getErrorMessage(e));
        }
        finally {
            setSwitchingId(null);
        }
    };

    const switchTo = (job, method) => {
        const message = method === 'rider_pickup'
            ? `A Hamads rider will collect this order. Pickup fee: ${PICKUP_FEE_RULE}.`
            : "You'll bring this order to the Hamads warehouse yourself. No fee.";
        Alert.alert(HANDOVER[method].label, message, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Confirm', onPress: () => void run(job, method) },
        ]);
    };

    return { switchTo, switchingId };
}
