import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { NoticeBanner } from '@/components/ui/NoticeBanner';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { TextField } from '@/components/ui/TextField';
import { FOOD_PREP_MAX, FOOD_PREP_MIN } from '@/config';
import { useRegistrationStore } from '@/features/auth/registrationStore';
import { BUSINESS } from '@/features/business/businessConfig';
import { useAuthStore } from '@/store/authStore';
import { useBusinessStore } from '@/store/businessStore';
import { colors } from '@/theme';
import { getErrorMessage } from '@/utils/getErrorMessage';

import { foodVendorService } from '../services/foodVendorService';
import { styles } from './FoodShopFormScreen.styles';

const POINTS = [
    { icon: 'git-branch-outline', text: 'Runs separately from your Online Store, with its own menu and orders.' },
    { icon: 'bicycle-outline', text: 'Customers order for delivery by Hamads riders, or pickup from you.' },
    { icon: 'shield-checkmark-outline', text: 'Reviewed by Hamads before customers can see it.' },
];

const fromVendor = (v) => ({
    displayName: v.display_name ?? '',
    description: v.description ?? '',
    pickupAddress: v.pickup_address ?? '',
    lga: v.lga ?? '',
    prepMinutes: String(v.default_prep_minutes ?? 20),
    latitude: v.latitude ?? null,
    longitude: v.longitude ?? null,
});

/** Create the food shop (/setup/food) or edit it (/food/settings). */
export function FoodShopFormScreen() {
    const vendor = useBusinessStore((s) => s.vendor);
    const setVendor = useBusinessStore((s) => s.setVendor);
    const addBusiness = useBusinessStore((s) => s.addBusiness);
    const seller = useAuthStore((s) => s.seller);
    const draft = useRegistrationStore((s) => s.foodDraft);
    const clearDraft = useRegistrationStore((s) => s.setFoodDraft);
    const isEdit = !!vendor;

    const [startValues] = useState(() => (isEdit ? fromVendor(vendor) : {
        ...fromVendor({ default_prep_minutes: 20 }),
        ...(draft ? fromVendor({ ...draft, default_prep_minutes: draft.default_prep_minutes ?? 20 }) : { pickupAddress: seller?.business_address ?? '' }),
    }));
    const initial = useRef(startValues);
    const [values, setValues] = useState(startValues);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [locating, setLocating] = useState(false);
    const [locationError, setLocationError] = useState(null);

    const setField = (key) => (value) => {
        setValues((v) => ({ ...v, [key]: key === 'prepMinutes' ? value.replace(/\D/g, '') : value }));
        if (errors[key]) setErrors((e) => ({ ...e, [key]: null }));
    };

    const pinLocation = async () => {
        setLocating(true);
        setLocationError(null);
        try {
            const permission = await Location.requestForegroundPermissionsAsync();
            if (!permission.granted) {
                setLocationError('Location permission was denied. You can still type your address.');
                return;
            }
            const { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            let place = null;
            try {
                [place] = await Location.reverseGeocodeAsync({ latitude: coords.latitude, longitude: coords.longitude });
            }
            catch {
                // address lookup is a bonus
            }
            setValues((v) => ({
                ...v,
                latitude: Number(coords.latitude.toFixed(6)),
                longitude: Number(coords.longitude.toFixed(6)),
                pickupAddress: v.pickupAddress || [place?.name, place?.street, place?.city].filter(Boolean).join(', '),
                lga: v.lga || place?.subregion || place?.district || place?.city || '',
            }));
        }
        catch {
            setLocationError("Couldn't get your location. Check that location is turned on.");
        }
        finally {
            setLocating(false);
        }
    };

    const validate = () => {
        const prep = Number(values.prepMinutes);
        const next = {
            displayName: values.displayName.trim().length < 2 ? 'Enter your shop name.' : null,
            pickupAddress: values.pickupAddress.trim().length < 5 ? 'Enter the address riders and customers collect from.' : null,
            lga: values.lga.trim().length < 2 ? 'Enter your LGA.' : null,
            prepMinutes: !Number.isInteger(prep) || prep < FOOD_PREP_MIN || prep > FOOD_PREP_MAX ? `Enter ${FOOD_PREP_MIN}–${FOOD_PREP_MAX} minutes.` : null,
        };
        setErrors(next);
        return !Object.values(next).some(Boolean);
    };

    const buildPayload = () => {
        const full = {
            display_name: values.displayName.trim(),
            description: values.description.trim() || null,
            pickup_address: values.pickupAddress.trim(),
            lga: values.lga.trim(),
            default_prep_minutes: Number(values.prepMinutes),
            latitude: values.latitude,
            longitude: values.longitude,
        };
        if (!isEdit) return full;
        const was = initial.current;
        const p = {};
        if (full.display_name !== was.displayName) p.display_name = full.display_name;
        if ((full.description ?? '') !== was.description) p.description = full.description;
        if (full.pickup_address !== was.pickupAddress) p.pickup_address = full.pickup_address;
        if (full.lga !== was.lga) p.lga = full.lga;
        if (values.prepMinutes !== was.prepMinutes) p.default_prep_minutes = full.default_prep_minutes;
        if (values.latitude !== was.latitude || values.longitude !== was.longitude) {
            p.latitude = full.latitude;
            p.longitude = full.longitude;
        }
        return p;
    };

    const save = async () => {
        if (saving) return;
        setSubmitError(null);
        if (!validate()) return;
        const payload = buildPayload();
        if (isEdit && Object.keys(payload).length === 0) {
            router.back();
            return;
        }
        setSaving(true);
        try {
            const saved = await foodVendorService.saveProfile(payload);
            setVendor(saved);
            if (!isEdit) await addBusiness('food').catch(() => { });
            clearDraft(null);
            if (isEdit) router.back();
            else router.replace('/food');
        }
        catch (error) {
            setSubmitError(getErrorMessage(error));
        }
        finally {
            setSaving(false);
        }
    };

    const pinned = values.latitude !== null && values.longitude !== null;

    return (<SafeScreen edges={['top', 'bottom']}>
      <ScreenHeader title={isEdit ? 'Shop settings' : `Set up your ${BUSINESS.food.name}`}/>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {!isEdit ? (<Card>
              <View style={styles.introTop}>
                <View style={styles.introIcon}>
                  <Ionicons name={BUSINESS.food.icon} size={24} color={colors.textOnPrimary}/>
                </View>
                <Text style={styles.introText}>{BUSINESS.food.tagline}</Text>
              </View>
              {POINTS.map((p) => (<View key={p.text} style={styles.point}>
                  <Ionicons name={p.icon} size={18} color={colors.primary}/>
                  <Text style={styles.pointText}>{p.text}</Text>
                </View>))}
            </Card>) : null}
          {isEdit && !vendor.is_approved ? (<NoticeBanner title="Under review" message="Your shop becomes visible to customers once Hamads approves it."/>) : null}

          <Card>
            <Text style={styles.cardTitle}>Shop</Text>
            <TextField label="Shop name" placeholder="e.g. Mama Amina's Kitchen" autoCapitalize="words" maxLength={150} value={values.displayName} onChangeText={setField('displayName')} error={errors.displayName} editable={!saving}/>
            <TextField label="Description (optional)" placeholder="What you sell, specialities, opening hours…" autoCapitalize="sentences" multiline maxLength={500} value={values.description} onChangeText={setField('description')} editable={!saving}/>
            <TextField label="Usual prep time (minutes)" placeholder="20" keyboardType="number-pad" maxLength={3} value={values.prepMinutes} onChangeText={setField('prepMinutes')} error={errors.prepMinutes} hint="Used when an item has no prep time of its own." editable={!saving}/>
          </Card>

          <Card>
            <Text style={styles.cardTitle}>Pickup location</Text>
            <Pressable accessibilityRole="button" onPress={pinLocation} disabled={locating || saving} style={[styles.locate, pinned && styles.locatePinned]}>
              <Ionicons name={pinned ? 'location' : 'locate-outline'} size={20} color={pinned ? colors.success : colors.primary}/>
              <View style={styles.locateText}>
                <Text style={[styles.locateTitle, pinned && styles.locateTitlePinned]}>
                  {locating ? 'Getting your location…' : pinned ? 'Location pinned' : 'Use my current location'}
                </Text>
                <Text style={styles.locateHint}>
                  {pinned ? `${values.latitude}, ${values.longitude} · Tap to update` : 'Helps riders find you. Stand at your shop when you tap.'}
                </Text>
              </View>
            </Pressable>
            {locationError ? <Text style={styles.error}>{locationError}</Text> : null}
            <TextField label="Pickup address" placeholder="Shop 4, Zoo Road, Kano" autoCapitalize="sentences" maxLength={500} value={values.pickupAddress} onChangeText={setField('pickupAddress')} error={errors.pickupAddress} editable={!saving}/>
            <TextField label="LGA" placeholder="e.g. Nassarawa" autoCapitalize="words" maxLength={100} value={values.lga} onChangeText={setField('lga')} error={errors.lga} editable={!saving}/>
          </Card>

          <ErrorMessage message={submitError}/>
        </ScrollView>
        <View style={styles.footer}>
          <Button title={isEdit ? 'Save changes' : `Create ${BUSINESS.food.name}`} onPress={save} loading={saving}/>
        </View>
      </KeyboardAvoidingView>
    </SafeScreen>);
}
