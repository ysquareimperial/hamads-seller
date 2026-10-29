import { Redirect, Stack } from 'expo-router';

import { useAuthStore } from '@/store/authStore';
import { colors } from '@/theme';

export default function AppLayout() {
    const status = useAuthStore((s) => s.status);
    if (status !== 'authenticated') return <Redirect href="/login"/>;
    return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}/>;
}
