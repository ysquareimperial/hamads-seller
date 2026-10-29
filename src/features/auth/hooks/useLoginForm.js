import { router } from 'expo-router';
import { useRef, useState } from 'react';

import { useAuthStore } from '@/store/authStore';
import { getErrorMessage } from '@/utils/getErrorMessage';

import { authService } from '../services/authService';
import { normalizePhone, validatePassword, validatePhone } from '../utils/validation';

export function useLoginForm() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const inFlight = useRef(false);
    const completeSignIn = useAuthStore((s) => s.completeSignIn);

    const submit = async () => {
        if (inFlight.current) return;
        const nextErrors = { phone: validatePhone(phone), password: validatePassword(password) };
        setErrors(nextErrors);
        setSubmitError(null);
        if (nextErrors.phone || nextErrors.password) return;
        inFlight.current = true;
        setIsSubmitting(true);
        try {
            const tokens = await authService.login({ phone_number: normalizePhone(phone), password });
            await completeSignIn(tokens);
            router.replace('/');
        }
        catch (error) {
            setSubmitError(getErrorMessage(error));
        }
        finally {
            inFlight.current = false;
            setIsSubmitting(false);
        }
    };

    return { phone, setPhone, password, setPassword, errors, submitError, isSubmitting, submit };
}
