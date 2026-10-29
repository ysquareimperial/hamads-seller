import { Redirect } from 'expo-router';

/** Sign-up starts with the phone number. */
export default function RegisterIndex() {
    return <Redirect href="/register/phone"/>;
}
