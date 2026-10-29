import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { OTP_FROM_RESPONSE, OTP_LENGTH, OTP_RESEND_SECONDS } from '@/config';
import { getErrorMessage } from '@/utils/getErrorMessage';

import { extractOtp, validateOtp } from '../utils/validation';

/**
 * Shared state machine for "request code → verify code".
 * config: { validate(raw), normalize(raw), display(normalized), request(normalized), verify(normalized, code), onVerified(normalized) }
 */
export function useOtpStep(config) {
    const [target, setTarget] = useState('');
    const [sentTo, setSentTo] = useState(null); // normalized target the code was sent to
    const [code, setCodeState] = useState('');
    const [fieldError, setFieldError] = useState(null);
    const [error, setError] = useState(null);
    const [sending, setSending] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [devFilled, setDevFilled] = useState(false);
    const busy = useRef(false);
    const configRef = useRef(config);
    useLayoutEffect(() => {
        configRef.current = config;
    });

    useEffect(() => {
        if (cooldown <= 0) return undefined;
        const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    const requestCode = async (normalized) => {
        const response = await configRef.current.request(normalized);
        setSentTo(normalized);
        setCooldown(OTP_RESEND_SECONDS);
        const devCode = OTP_FROM_RESPONSE ? extractOtp(response, OTP_LENGTH) : null;
        setCodeState(devCode ?? '');
        setDevFilled(!!devCode);
    };

    const send = async () => {
        if (busy.current) return;
        const invalid = configRef.current.validate(target);
        setFieldError(invalid);
        setError(null);
        if (invalid) return;
        busy.current = true;
        setSending(true);
        try {
            await requestCode(configRef.current.normalize(target));
        }
        catch (e) {
            setError(getErrorMessage(e));
        }
        finally {
            busy.current = false;
            setSending(false);
        }
    };

    const resend = async () => {
        if (busy.current || !sentTo || cooldown > 0) return;
        busy.current = true;
        setSending(true);
        setError(null);
        try {
            await requestCode(sentTo);
        }
        catch (e) {
            setError(getErrorMessage(e));
        }
        finally {
            busy.current = false;
            setSending(false);
        }
    };

    const verify = async () => {
        if (busy.current || !sentTo) return;
        const invalid = validateOtp(code, OTP_LENGTH);
        setError(invalid);
        if (invalid) return;
        busy.current = true;
        setVerifying(true);
        try {
            await configRef.current.verify(sentTo, code);
            configRef.current.onVerified(sentTo);
        }
        catch (e) {
            setError(getErrorMessage(e));
        }
        finally {
            busy.current = false;
            setVerifying(false);
        }
    };

    const setCode = (value) => {
        setCodeState(value);
        if (error) setError(null);
    };

    const changeTarget = () => {
        setSentTo(null);
        setCodeState('');
        setError(null);
        setDevFilled(false);
    };

    return {
        stage: sentTo ? 'code' : 'enter',
        target,
        setTarget: (v) => {
            setTarget(v);
            if (fieldError) setFieldError(null);
        },
        fieldError,
        displayTarget: sentTo ? config.display(sentTo) : '',
        code,
        setCode,
        length: OTP_LENGTH,
        error,
        sending,
        verifying,
        cooldown,
        devFilled,
        send,
        resend,
        verify,
        changeTarget,
    };
}
