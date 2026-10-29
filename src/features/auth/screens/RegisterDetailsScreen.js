import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { TextField } from '@/components/ui/TextField';

import { AuthHeader } from '../components/AuthHeader';
import { StepIndicator } from '../components/StepIndicator';
import { useRegistrationStore } from '../registrationStore';
import { maskDate, validateDob, validatePassword, validateRequired } from '../utils/validation';
import { authStyles as styles } from './auth.styles';

/** Step 3: who the seller is. Nothing is sent yet; the account is created on the business step. */
export function RegisterDetailsScreen() {
    const phone = useRegistrationStore((s) => s.phone);
    const email = useRegistrationStore((s) => s.email);
    if (!phone) return <Redirect href="/register/phone"/>;
    if (!email) return <Redirect href="/register/email"/>;
    return <PersonalForm />;
}

function PersonalForm() {
    const saved = useRegistrationStore((s) => s.personal);
    const setPersonal = useRegistrationStore((s) => s.setPersonal);
    const [values, setValues] = useState(() => ({
        firstName: saved?.firstName ?? '',
        lastName: saved?.lastName ?? '',
        dob: saved?.dob ?? '',
        password: saved?.password ?? '',
        confirmPassword: saved?.password ?? '',
    }));
    const [errors, setErrors] = useState({});

    const setField = (key) => (value) => {
        setValues((v) => ({ ...v, [key]: key === 'dob' ? maskDate(value) : value }));
        if (errors[key]) setErrors((e) => ({ ...e, [key]: null }));
    };

    const next = () => {
        const e = {
            firstName: validateRequired(values.firstName, 'Enter your first name.'),
            lastName: validateRequired(values.lastName, 'Enter your last name.'),
            dob: validateDob(values.dob),
            password: validatePassword(values.password),
            confirmPassword: values.confirmPassword === values.password ? null : 'Passwords do not match.',
        };
        setErrors(e);
        if (Object.values(e).some(Boolean)) return;
        setPersonal({
            firstName: values.firstName.trim(),
            lastName: values.lastName.trim(),
            dob: values.dob,
            password: values.password,
        });
        router.push('/register/business');
    };

    return (<ScreenContainer>
      <StepIndicator step={3}/>
      <AuthHeader icon="person" title="About you" subtitle="The person behind the business."/>
      <View style={styles.form}>
        <View style={styles.row}>
          <View style={styles.rowItem}>
            <TextField label="First name" placeholder="Amina" autoCapitalize="words" autoComplete="given-name" value={values.firstName} onChangeText={setField('firstName')} error={errors.firstName}/>
          </View>
          <View style={styles.rowItem}>
            <TextField label="Last name" placeholder="Bello" autoCapitalize="words" autoComplete="family-name" value={values.lastName} onChangeText={setField('lastName')} error={errors.lastName}/>
          </View>
        </View>
        <TextField label="Date of birth" placeholder="DD/MM/YYYY" keyboardType="number-pad" maxLength={10} value={values.dob} onChangeText={setField('dob')} error={errors.dob}/>
        <TextField label="Password" placeholder="At least 8 characters" isPassword autoComplete="new-password" textContentType="newPassword" value={values.password} onChangeText={setField('password')} error={errors.password}/>
        <TextField label="Confirm password" placeholder="Re-enter password" isPassword autoComplete="new-password" textContentType="newPassword" value={values.confirmPassword} onChangeText={setField('confirmPassword')} error={errors.confirmPassword} returnKeyType="next" onSubmitEditing={next}/>
        <Button title="Continue" onPress={next}/>
      </View>
    </ScreenContainer>);
}
