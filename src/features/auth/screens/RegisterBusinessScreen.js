import { Redirect } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { TextField } from '@/components/ui/TextField';
import { BUSINESS } from '@/features/business/businessConfig';
import { UsernameField } from '@/features/username/UsernameField';

import { AuthHeader } from '../components/AuthHeader';
import { BusinessOption } from '../components/BusinessOption';
import { StepIndicator } from '../components/StepIndicator';
import { useBusinessDetailsForm } from '../hooks/useBusinessDetailsForm';
import { useRegistrationStore } from '../registrationStore';
import { authStyles as styles } from './auth.styles';

const ACCOUNT_TYPES = [
    { value: 'individual', label: 'Individual' },
    { value: 'company', label: 'Company' },
];

/** Step 4: pick Online Store or Food Shop and fill its details. Creates the account. */
export function RegisterBusinessScreen() {
    const phone = useRegistrationStore((s) => s.phone);
    const email = useRegistrationStore((s) => s.email);
    const personal = useRegistrationStore((s) => s.personal);
    if (!phone) return <Redirect href="/register/phone"/>;
    if (!email) return <Redirect href="/register/email"/>;
    if (!personal) return <Redirect href="/register/details"/>;
    return <BusinessForm />;
}

function BusinessForm() {
    const form = useBusinessDetailsForm();
    const { kind, values, setField, errors, isFood } = form;
    const editable = !form.isSubmitting;

    return (<ScreenContainer>
      <StepIndicator step={4}/>
      <AuthHeader icon="briefcase" title="What are you opening?" subtitle="Pick one to start. You can add the other later from the same account."/>

      <View style={styles.form}>
        <View accessibilityRole="radiogroup" style={styles.form}>
          <BusinessOption config={BUSINESS.store} selected={kind === 'store'} onPress={() => form.setKind('store')}/>
          <BusinessOption config={BUSINESS.food} selected={kind === 'food'} onPress={() => form.setKind('food')}/>
        </View>
        {errors.kind ? <ErrorMessage message={errors.kind}/> : null}

        {kind ? (<>
            <Text style={styles.sectionLabel}>{isFood ? 'FOOD SHOP' : 'STORE'}</Text>
            <SegmentedControl label="Account type" options={ACCOUNT_TYPES} value={values.accountType} onChange={setField('accountType')}/>
            {isFood ? (<>
                <TextField label="Shop name" placeholder="e.g. Mama Amina's Kitchen" autoCapitalize="words" value={values.shopName} onChangeText={setField('shopName')} error={errors.shopName} editable={editable}/>
                <TextField label="Pickup address" placeholder="Shop 4, Zoo Road, Kano" autoCapitalize="sentences" value={values.pickupAddress} onChangeText={setField('pickupAddress')} error={errors.pickupAddress} hint="Where riders and customers collect orders. You can pin it on a map later." editable={editable}/>
                <View style={styles.row}>
                  <View style={styles.rowItem}>
                    <TextField label="LGA" placeholder="Nassarawa" autoCapitalize="words" value={values.lga} onChangeText={setField('lga')} error={errors.lga} editable={editable}/>
                  </View>
                  <View style={styles.rowItem}>
                    <TextField label="Usual prep (min)" placeholder="20" keyboardType="number-pad" maxLength={3} value={values.prepMinutes} onChangeText={setField('prepMinutes')} error={errors.prepMinutes} editable={editable}/>
                  </View>
                </View>
              </>) : (<>
                <TextField label={values.accountType === 'company' ? 'Company / brand name' : 'Store / brand name'} placeholder="e.g. Amina Fabrics" autoCapitalize="words" value={values.brandName} onChangeText={setField('brandName')} error={errors.brandName} editable={editable}/>
                <TextField label="Business address" placeholder="Shop 12, Kantin Kwari Market, Kano" autoCapitalize="sentences" value={values.location} onChangeText={setField('location')} error={errors.location} editable={editable}/>
              </>)}
            <UsernameField value={values.username} onChange={setField('username')} check={form.usernameCheck} error={errors.username} editable={editable}/>

            <ErrorMessage message={form.submitError}/>
            <Button title={`Create account & ${BUSINESS[kind].short}`} onPress={form.submit} loading={form.isSubmitting}/>
          </>) : null}
      </View>
    </ScreenContainer>);
}
