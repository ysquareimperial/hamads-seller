import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { useAuthStore } from '@/store/authStore';
import { colors } from '@/theme';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    return (<ThemeProvider>
      <AppShell />
    </ThemeProvider>);
}

function AppShell() {
    const { scheme } = useTheme();
    const status = useAuthStore((s) => s.status);
    const restoreSession = useAuthStore((s) => s.restoreSession);

    useEffect(() => {
        void restoreSession();
    }, [restoreSession]);

    useEffect(() => {
        if (status !== 'loading') void SplashScreen.hideAsync();
    }, [status]);

    if (status === 'loading') return null;

    // key={scheme} remounts the navigator so every screen re-reads the live palette.
    return (<>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'}/>
      <Stack key={scheme} screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}/>
    </>);
}
