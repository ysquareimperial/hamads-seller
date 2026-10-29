import { Stack } from 'expo-router';

import { BusinessGate } from '@/features/business/BusinessGate';
import { colors } from '@/theme';

export default function StoreLayout() {
    return (<BusinessGate kind="store">
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}/>
    </BusinessGate>);
}
