import { Redirect, router } from 'expo-router';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { TextField } from '@/components/ui/TextField';

import { AuthHeader } from '../components/AuthHeader';
import { OtpStep } from '../components/OtpStep';
import { StepIndicator } from '../components/StepIndicator';
import { useOtpStep } from '../hooks/useOtpStep';
import { useRegistrationStore } from '../registrationStore';
import { authService } from '../services/authService';
import { normalizeEmail, validateEmail } from '../utils/validation';

export function RegisterEmailScreen() {
    const phone = useRegistrationStore((s) => s.phone);
    if (!phone) return <Redirect href="/register/phone"/>;
    return <RegisterEmailContent />;
}

function RegisterEmailContent() {
    const setEmail = useRegistrationStore((s) => s.setEmail);
    const otp = useOtpStep({
        validate: validateEmail,
        normalize: normalizeEmail,
        display: (email) => email,
        request: (email) => authService.requestEmailOtp(email),
        verify: (email, code) => authService.verifyEmailOtp(email, code),
        onVerified: (email) => {
            setEmail(email);
            router.push('/register/details');
        },
    });

    return (<ScreenContainer>
      <StepIndicator step={2}/>
      <AuthHeader icon="mail" title="Verify your email" subtitle={otp.stage === 'enter' ? "We'll send order and payout updates here." : 'Enter the 6-digit code we emailed you.'}/>
      <OtpStep otp={otp} renderTargetField={(o) => (<TextField label="Email address" placeholder="you@business.com" keyboardType="email-address" autoComplete="email" textContentType="emailAddress" value={o.target} onChangeText={o.setTarget} error={o.fieldError} editable={!o.sending} returnKeyType="send" onSubmitEditing={o.send}/>)}/>
    </ScreenContainer>);
}
