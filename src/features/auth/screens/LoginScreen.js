import { Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { PhoneField } from '@/components/ui/PhoneField';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { TextField } from '@/components/ui/TextField';

import { AuthHeader } from '../components/AuthHeader';
import { AuthTabs } from '../components/AuthTabs';
import { useLoginForm } from '../hooks/useLoginForm';
import { authStyles as styles } from './auth.styles';

export function LoginScreen() {
    const form = useLoginForm();
    return (<ScreenContainer>
      <AuthHeader title="Seller Centre" subtitle="One login for your Online Store and Food Shop."/>
      <AuthTabs active="login"/>

      <View style={styles.form}>
        <PhoneField value={form.phone} onChangeText={form.setPhone} error={form.errors.phone} editable={!form.isSubmitting}/>
        <TextField label="Password" placeholder="Your password" isPassword autoComplete="current-password" textContentType="password" value={form.password} onChangeText={form.setPassword} error={form.errors.password} editable={!form.isSubmitting} returnKeyType="go" onSubmitEditing={form.submit}/>
        <ErrorMessage message={form.submitError}/>
        <Button title="Log in" onPress={form.submit} loading={form.isSubmitting}/>
      </View>
      <Text style={styles.footer}>New seller? Tap Sign up to open a store or food shop.</Text>
    </ScreenContainer>);
}
