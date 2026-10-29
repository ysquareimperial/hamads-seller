import { TextField } from './TextField';

/** Nigerian phone input: fixed 🇳🇬 +234 prefix, user types e.g. 08012345678. */
export function PhoneField(props) {
    return (<TextField label="Phone number" placeholder="0801 234 5678" prefix={'\u{1F1F3}\u{1F1EC}  +234'} keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" maxLength={16} {...props}/>);
}
