import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';

import { uploadSingleImage } from '@/api/s3Upload';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { LoadingView } from '@/components/ui/LoadingView';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TextField } from '@/components/ui/TextField';
import { authService } from '@/features/auth/services/authService';
import { shareStore, storeLinkLabel } from '@/features/username/username';
import { validateRequired } from '@/features/auth/utils/validation';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/theme';
import { formatPhone, statusLabel } from '@/utils/format';
import { getErrorMessage } from '@/utils/getErrorMessage';

import { styles } from './EditProfileScreen.styles';

const initialsOf = (s) => `${s.first_name?.[0] ?? ''}${s.last_name?.[0] ?? ''}`.toUpperCase() || '?';

export function EditProfileScreen() {
    const seller = useAuthStore((s) => s.seller);
    if (!seller) {
        return (<SafeScreen edges={['top', 'bottom']}>
        <ScreenHeader title="Profile"/>
        <LoadingView />
      </SafeScreen>);
    }
    return <EditProfileForm seller={seller}/>;
}

function EditProfileForm({ seller }) {
    const setSeller = useAuthStore((s) => s.setSeller);
    const logout = useAuthStore((s) => s.logout);
    const [values, setValues] = useState({
        firstName: seller.first_name,
        lastName: seller.last_name,
        brandName: seller.brand_name,
        address: seller.business_address,
    });
    const [photo, setPhoto] = useState(null); // newly picked { uri, mimeType }
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const setField = (key) => (v) => {
        setValues((s) => ({ ...s, [key]: v }));
        if (errors[key]) setErrors((e) => ({ ...e, [key]: null }));
    };

    const pickPhoto = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8 });
        if (!result.canceled) setPhoto({ uri: result.assets[0].uri, mimeType: result.assets[0].mimeType });
    };

    const save = async () => {
        const next = {
            firstName: validateRequired(values.firstName, 'Enter your first name.', 1),
            lastName: validateRequired(values.lastName, 'Enter your last name.', 1),
            brandName: validateRequired(values.brandName, 'Enter your brand name.'),
            address: validateRequired(values.address, 'Enter your business address.', 3),
        };
        setErrors(next);
        setSubmitError(null);
        if (Object.values(next).some(Boolean)) return;
        setSaving(true);
        try {
            const p = {};
            if (values.firstName.trim() !== seller.first_name) p.first_name = values.firstName.trim();
            if (values.lastName.trim() !== seller.last_name) p.last_name = values.lastName.trim();
            if (values.brandName.trim() !== seller.brand_name) p.brand_name = values.brandName.trim();
            if (values.address.trim() !== seller.business_address) p.business_address = values.address.trim();
            if (photo) p.profile_image_key = await uploadSingleImage(photo, authService.avatarUploadUrl);
            if (Object.keys(p).length) setSeller(await authService.updateMe(p));
            router.back();
        }
        catch (e) {
            setSubmitError(getErrorMessage(e));
        }
        finally {
            setSaving(false);
        }
    };

    const confirmLogout = () => {
        Alert.alert('Log out?', 'This logs you out of both your Online Store and Food Shop.', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Log out',
                style: 'destructive',
                onPress: async () => {
                    setLoggingOut(true);
                    try {
                        await logout();
                    }
                    finally {
                        setLoggingOut(false);
                    }
                },
            },
        ]);
    };

    const avatarUri = photo?.uri ?? seller.profile_image_url;

    return (<SafeScreen edges={['top', 'bottom']}>
      <ScreenHeader title="Profile"/>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.avatarWrap}>
            <Pressable accessibilityRole="button" accessibilityLabel="Change profile photo" onPress={pickPhoto} disabled={saving} style={styles.avatar}>
              {avatarUri ? (<Image source={{ uri: avatarUri }} style={styles.avatarImage} contentFit="cover"/>) : (<Text style={styles.avatarText}>{initialsOf(seller)}</Text>)}
              <View style={styles.avatarBadge}>
                <Ionicons name="camera" size={14} color={colors.textOnPrimary}/>
              </View>
            </Pressable>
            <StatusBadge tone={seller.is_approved ? 'success' : 'warning'} text={seller.is_approved ? 'Approved seller' : 'Under review'}/>
          </View>

          {seller.username ? (<Card>
              <Text style={styles.cardTitle}>Store link</Text>
              <View style={styles.readRow}>
                <Ionicons name="link-outline" size={18} color={colors.primary}/>
                <Text style={styles.linkValue} numberOfLines={1} selectable>{storeLinkLabel(seller.username)}</Text>
              </View>
              <View style={styles.linkActions}>
                <Pressable accessibilityRole="button" onPress={() => shareStore(seller.username, seller.brand_name)} style={styles.linkAction}>
                  <Ionicons name="share-social-outline" size={16} color={colors.primary}/>
                  <Text style={styles.linkActionText}>Share</Text>
                </Pressable>
                <Pressable accessibilityRole="button" onPress={() => router.push('/store-preview')} style={styles.linkAction}>
                  <Ionicons name="eye-outline" size={16} color={colors.primary}/>
                  <Text style={styles.linkActionText}>Preview</Text>
                </Pressable>
                <Pressable accessibilityRole="button" onPress={() => router.push('/profile/username')} style={styles.linkAction}>
                  <Ionicons name="create-outline" size={16} color={colors.primary}/>
                  <Text style={styles.linkActionText}>{`Change (${seller.username_changes_left ?? 0} left)`}</Text>
                </Pressable>
              </View>
            </Card>) : null}

          <Card>
            <Text style={styles.cardTitle}>You</Text>
            <View style={styles.row}>
              <View style={styles.rowItem}>
                <TextField label="First name" autoCapitalize="words" maxLength={100} value={values.firstName} onChangeText={setField('firstName')} error={errors.firstName} editable={!saving}/>
              </View>
              <View style={styles.rowItem}>
                <TextField label="Last name" autoCapitalize="words" maxLength={100} value={values.lastName} onChangeText={setField('lastName')} error={errors.lastName} editable={!saving}/>
              </View>
            </View>
          </Card>

          <Card>
            <Text style={styles.cardTitle}>Business</Text>
            <TextField label="Brand name" autoCapitalize="words" maxLength={150} value={values.brandName} onChangeText={setField('brandName')} error={errors.brandName} editable={!saving}/>
            <TextField label="Business address" autoCapitalize="sentences" maxLength={500} value={values.address} onChangeText={setField('address')} error={errors.address} editable={!saving}/>
            <Text style={styles.hint}>{`Account type: ${statusLabel(seller.account_type)}. Your Food Shop name and pickup address are set in Food Shop settings.`}</Text>
          </Card>

          <Card>
            <Text style={styles.cardTitle}>Login details</Text>
            <View style={styles.readRow}>
              <Ionicons name="call-outline" size={18} color={colors.textMuted}/>
              <Text style={styles.readValue}>{formatPhone(seller.phone_number)}</Text>
              <StatusBadge tone={seller.is_phone_verified ? 'success' : 'warning'} text={seller.is_phone_verified ? 'Verified' : 'Not verified'}/>
            </View>
            <View style={styles.readRow}>
              <Ionicons name="mail-outline" size={18} color={colors.textMuted}/>
              <Text style={styles.readValue} numberOfLines={1}>{seller.email}</Text>
              <StatusBadge tone={seller.is_email_verified ? 'success' : 'warning'} text={seller.is_email_verified ? 'Verified' : 'Not verified'}/>
            </View>
          </Card>

          <ErrorMessage message={submitError}/>

          <Pressable accessibilityRole="button" disabled={loggingOut} onPress={confirmLogout} style={styles.logout}>
            {loggingOut ? <ActivityIndicator color={colors.danger}/> : <Ionicons name="log-out-outline" size={20} color={colors.danger}/>}
            <Text style={styles.logoutText}>Log out</Text>
          </Pressable>
        </ScrollView>
        <View style={styles.footer}>
          <Button title={photo && saving ? 'Uploading photo…' : 'Save changes'} onPress={save} loading={saving && !photo} disabled={saving}/>
        </View>
      </KeyboardAvoidingView>
    </SafeScreen>);
}
