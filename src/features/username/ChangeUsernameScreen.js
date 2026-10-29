import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { LoadingView } from '@/components/ui/LoadingView';
import { NoticeBanner } from '@/components/ui/NoticeBanner';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { authService } from '@/features/auth/services/authService';
import { useAuthStore } from '@/store/authStore';
import { getErrorMessage } from '@/utils/getErrorMessage';

import { storeLinkLabel } from './username';
import { UsernameField } from './UsernameField';
import { styles } from './ChangeUsernameScreen.styles';
import { useUsernameCheck } from './useUsernameCheck';

export function ChangeUsernameScreen() {
    const seller = useAuthStore((s) => s.seller);
    if (!seller) {
        return (<SafeScreen edges={['top', 'bottom']}>
        <ScreenHeader title="Store username"/>
        <LoadingView />
      </SafeScreen>);
    }
    return <ChangeUsernameForm seller={seller}/>;
}

function ChangeUsernameForm({ seller }) {
    const setSeller = useAuthStore((s) => s.setSeller);
    const [username, setUsername] = useState(seller.username ?? '');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const check = useUsernameCheck(username, seller.username);
    const left = seller.username_changes_left ?? 0;
    const changed = username !== seller.username;
    const canSave = left > 0 && changed && check.status === 'available';

    const save = () => {
        const after = left - 1;
        Alert.alert('Change username?', `Links to ${storeLinkLabel(seller.username)} will stop working. You'll have ${after} change${after === 1 ? '' : 's'} left.`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Change',
                onPress: async () => {
                    setSaving(true);
                    setError(null);
                    try {
                        setSeller(await authService.changeUsername(username));
                        router.back();
                    }
                    catch (e) {
                        setError(getErrorMessage(e));
                    }
                    finally {
                        setSaving(false);
                    }
                },
            },
        ]);
    };

    return (<SafeScreen edges={['top', 'bottom']}>
      <ScreenHeader title="Store username"/>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {left > 0 ? (<NoticeBanner tone="info" message={`You can change your username ${left} more time${left === 1 ? '' : 's'}. Old links stop working when you do.`}/>) : (<NoticeBanner message="You've used all your username changes."/>)}
        <Card>
          <View style={styles.current}>
            <Text style={styles.label}>CURRENT LINK</Text>
            <Text style={styles.link} selectable>{storeLinkLabel(seller.username)}</Text>
          </View>
          <UsernameField label="New username" value={username} onChange={setUsername} check={check} editable={left > 0 && !saving}/>
        </Card>
        <ErrorMessage message={error}/>
        <Button title="Save username" onPress={save} loading={saving} disabled={!canSave}/>
      </ScrollView>
    </SafeScreen>);
}
