import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { TextField } from '@/components/ui/TextField';
import { authService } from '@/features/auth/services/authService';
import { validateRequired } from '@/features/auth/utils/validation';
import { useAuthStore } from '@/store/authStore';
import { useBusinessStore } from '@/store/businessStore';
import { colors } from '@/theme';
import { getErrorMessage } from '@/utils/getErrorMessage';

import { BUSINESS } from './businessConfig';
import { styles } from './StoreSetupScreen.styles';

const POINTS = [
    { icon: 'cube-outline', text: 'List products that keep: clothes, gadgets, beauty, home goods.' },
    { icon: 'git-branch-outline', text: 'Separate from your Food Shop, with its own products and orders.' },
    { icon: 'shield-checkmark-outline', text: 'Each product is reviewed by Hamads before it goes live.' },
];

export function StoreSetupScreen() {
    const seller = useAuthStore((s) => s.seller);
    const setSeller = useAuthStore((s) => s.setSeller);
    const addBusiness = useBusinessStore((s) => s.addBusiness);
    const [brandName, setBrandName] = useState(seller?.brand_name ?? '');
    const [address, setAddress] = useState(seller?.business_address ?? '');
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState(null);
    const [saving, setSaving] = useState(false);

    const open = async () => {
        const next = {
            brandName: validateRequired(brandName, 'Enter your store or brand name.'),
            address: validateRequired(address, 'Enter your business address.', 3),
        };
        setErrors(next);
        setSubmitError(null);
        if (next.brandName || next.address) return;
        setSaving(true);
        try {
            const p = {};
            if (brandName.trim() !== seller?.brand_name) p.brand_name = brandName.trim();
            if (address.trim() !== seller?.business_address) p.business_address = address.trim();
            if (Object.keys(p).length) setSeller(await authService.updateMe(p));
            await addBusiness('store');
            router.replace('/store');
        }
        catch (e) {
            setSubmitError(getErrorMessage(e));
        }
        finally {
            setSaving(false);
        }
    };

    return (<SafeScreen edges={['top', 'bottom']}>
      <ScreenHeader title={`Open your ${BUSINESS.store.name}`}/>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Card>
            <View style={styles.introTop}>
              <View style={styles.introIcon}>
                <Ionicons name={BUSINESS.store.icon} size={24} color={colors.textOnPrimary}/>
              </View>
              <Text style={styles.introText}>{BUSINESS.store.tagline}</Text>
            </View>
            {POINTS.map((p) => (<View key={p.text} style={styles.point}>
                <Ionicons name={p.icon} size={18} color={colors.primary}/>
                <Text style={styles.pointText}>{p.text}</Text>
              </View>))}
          </Card>
          <Card>
            <Text style={styles.cardTitle}>Store details</Text>
            <TextField label="Store / brand name" placeholder="e.g. Amina Fabrics" autoCapitalize="words" maxLength={150} value={brandName} onChangeText={setBrandName} error={errors.brandName} editable={!saving}/>
            <TextField label="Business address" placeholder="Shop 12, Kantin Kwari Market, Kano" autoCapitalize="sentences" maxLength={500} value={address} onChangeText={setAddress} error={errors.address} editable={!saving}/>
            <Text style={styles.hint}>These are your seller profile details and also show on your account.</Text>
          </Card>
          <ErrorMessage message={submitError}/>
        </ScrollView>
        <View style={styles.footer}>
          <Button title="Open my store" onPress={open} loading={saving}/>
        </View>
      </KeyboardAvoidingView>
    </SafeScreen>);
}
