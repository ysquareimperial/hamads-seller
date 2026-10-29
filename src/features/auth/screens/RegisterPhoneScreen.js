import { router } from 'expo-router';
import { useEffect } from 'react';

import { PhoneField } from '@/components/ui/PhoneField';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { formatPhone } from '@/utils/format';

import { AuthHeader } from '../components/AuthHeader';
import { AuthTabs } from '../components/AuthTabs';
import { OtpStep } from '../components/OtpStep';
import { StepIndicator } from '../components/StepIndicator';
import { useOtpStep } from '../hooks/useOtpStep';
import { useRegistrationStore } from '../registrationStore';
import { authService } from '../services/authService';
import { normalizePhone, validatePhone } from '../utils/validation';

export function RegisterPhoneScreen() {
    const setPhone = useRegistrationStore((s) => s.setPhone);
    const reset = useRegistrationStore((s) => s.reset);

    // Starting sign-up from the top discards any earlier draft.
    useEffect(() => {
        reset();
    }, [reset]);

    const otp = useOtpStep({
        validate: validatePhone,
        normalize: normalizePhone,
        display: formatPhone,
        request: (phone) => authService.requestPhoneOtp(phone),
        verify: (phone, code) => authService.verifyPhoneOtp(phone, code),
        onVerified: (phone) => {
            setPhone(phone);
            router.push('/register/email');
        },
    });

    return (<ScreenContainer>
      {otp.stage === 'enter' ? (<>
          <AuthHeader title="Start selling" subtitle="Create your seller account first. You'll choose Online Store or Food Shop at the end."/>
          <AuthTabs active="signup"/>
        </>) : (<>
          <StepIndicator step={1}/>
          <AuthHeader icon="call" title="Verify your phone" subtitle="Enter the 6-digit code we sent you."/>
        </>)}
      <OtpStep otp={otp} renderTargetField={(o) => (<PhoneField value={o.target} onChangeText={o.setTarget} error={o.fieldError} editable={!o.sending} returnKeyType="send" onSubmitEditing={o.send}/>)}/>
    </ScreenContainer>);
}
