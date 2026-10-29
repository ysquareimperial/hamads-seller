import { router } from 'expo-router';
import { useRef, useState } from 'react';

import { FOOD_PREP_MAX, FOOD_PREP_MIN } from '@/config';
import { foodVendorService } from '@/features/food/services/foodVendorService';
import { suggestUsername } from '@/features/username/username';
import { useUsernameCheck } from '@/features/username/useUsernameCheck';
import { useAuthStore } from '@/store/authStore';
import { getErrorMessage } from '@/utils/getErrorMessage';

import { useRegistrationStore } from '../registrationStore';
import { authService } from '../services/authService';
import { tokenStorage } from '../services/tokenStorage';
import { toIsoDate, validateRequired } from '../utils/validation';

const EMPTY = {
    accountType: 'individual',
    // store
    brandName: '',
    location: '',
    // food shop
    shopName: '',
    pickupAddress: '',
    lga: '',
    prepMinutes: '20',
    username: '',
};

/**
 * Step 4: choose Online Store or Food Shop, fill its details, create the account.
 * The API creates the account in one call with both personal and business fields,
 * so this is where complete-registration happens.
 */
export function useBusinessDetailsForm() {
    const phone = useRegistrationStore((s) => s.phone);
    const email = useRegistrationStore((s) => s.email);
    const personal = useRegistrationStore((s) => s.personal);
    const kind = useRegistrationStore((s) => s.kind);
    const setKindInStore = useRegistrationStore((s) => s.setKind);
    const resetDraft = useRegistrationStore((s) => s.reset);
    const setFoodDraft = useRegistrationStore((s) => s.setFoodDraft);
    const completeSignIn = useAuthStore((s) => s.completeSignIn);
    const isFood = kind === 'food';

    const [values, setValues] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const inFlight = useRef(false);
    // Suggest a username from the business name until the seller types their own.
    const [usernameTouched, setUsernameTouched] = useState(false);
    const usernameCheck = useUsernameCheck(values.username);

    const setKind = (next) => {
        setKindInStore(next);
        setErrors({});
        setSubmitError(null);
        if (!usernameTouched) {
            setValues((v) => ({ ...v, username: suggestUsername(next === 'food' ? v.shopName : v.brandName) }));
        }
    };

    const setField = (key) => (value) => {
        const next = key === 'prepMinutes' ? value.replace(/\D/g, '') : value;
        const suggest = !usernameTouched && (key === 'brandName' || key === 'shopName');
        if (key === 'username') setUsernameTouched(true);
        setValues((v) => ({ ...v, [key]: next, ...(suggest ? { username: suggestUsername(next) } : {}) }));
        if (errors[key] || (suggest && errors.username)) setErrors((e) => ({ ...e, [key]: null, ...(suggest ? { username: null } : {}) }));
    };

    const validate = () => {
        const prep = Number(values.prepMinutes);
        const next = {
            kind: !kind ? 'Choose what you want to open.' : null,
            username: !values.username ? 'Choose a username for your store link.' : usernameCheck.status === 'short' ? usernameCheck.reason : usernameCheck.status === 'taken' ? (usernameCheck.reason ?? 'That username is taken.') : null,
            ...(isFood ? {
                shopName: validateRequired(values.shopName, 'Enter your shop name.'),
                pickupAddress: validateRequired(values.pickupAddress, 'Enter your pickup address.', 5),
                lga: validateRequired(values.lga, 'Enter your LGA.'),
                prepMinutes: !Number.isInteger(prep) || prep < FOOD_PREP_MIN || prep > FOOD_PREP_MAX ? `Enter ${FOOD_PREP_MIN}–${FOOD_PREP_MAX} minutes.` : null,
            } : kind ? {
                brandName: validateRequired(values.brandName, 'Enter your store or brand name.'),
                location: validateRequired(values.location, 'Enter your business address.', 3),
            } : {}),
        };
        setErrors(next);
        return !Object.values(next).some(Boolean);
    };

    const submit = async () => {
        if (inFlight.current) return;
        setSubmitError(null);
        if (!validate()) return;
        inFlight.current = true;
        setIsSubmitting(true);
        try {
            const foodProfile = isFood ? {
                display_name: values.shopName.trim(),
                pickup_address: values.pickupAddress.trim(),
                lga: values.lga.trim(),
                default_prep_minutes: Number(values.prepMinutes),
            } : null;

            // For a food-first sign-up the account's brand/address default to the shop's
            // (the API requires them); they can be changed later in Profile.
            const tokens = await authService.completeRegistration({
                first_name: personal.firstName,
                last_name: personal.lastName,
                date_of_birth: toIsoDate(personal.dob),
                phone_number: phone,
                email,
                password: personal.password,
                account_type: values.accountType,
                brand_name: isFood ? foodProfile.display_name : values.brandName.trim(),
                location: isFood ? foodProfile.pickup_address : values.location.trim(),
                username: values.username,
                sells: isFood ? 'food' : 'products',
            });

            // Create the food shop before flipping to "signed in", so the hub shows it active.
            await tokenStorage.save(tokens);
            let seller = null;
            try {
                seller = await authService.me();
            }
            catch {
                // hub will load it
            }
            if (isFood) {
                try {
                    await foodVendorService.saveProfile(foodProfile);
                }
                catch {
                    // Account exists; keep the details so /setup/food can retry with them.
                    setFoodDraft(foodProfile);
                }
            }

            const draft = useRegistrationStore.getState().foodDraft;
            await completeSignIn(tokens, seller);
            resetDraft();
            if (draft) setFoodDraft(draft);
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

    return { kind, setKind, isFood, values, setField, errors, submitError, isSubmitting, submit, usernameCheck };
}
