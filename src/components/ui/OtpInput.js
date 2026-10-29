import { useRef, useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { styles } from './OtpInput.styles';

export function OtpInput({ value, onChange, length = 6, hasError = false, editable = true, autoFocus = false }) {
    const inputRef = useRef(null);
    const [focused, setFocused] = useState(false);
    return (<View>
      <View style={styles.row}>
        {Array.from({ length }, (_, i) => {
            const char = value[i];
            const active = focused && i === Math.min(value.length, length - 1);
            return (<View key={i} style={[
                    styles.box,
                    !!char && styles.boxFilled,
                    active && styles.boxActive,
                    hasError && styles.boxError,
                ]}>
              <Text style={styles.digit}>{char ?? ''}</Text>
            </View>);
        })}
      </View>
      <TextInput ref={inputRef} value={value} editable={editable} autoFocus={autoFocus} onChangeText={(text) => onChange(text.replace(/\D/g, '').slice(0, length))} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} keyboardType="number-pad" maxLength={length} textContentType="oneTimeCode" autoComplete="sms-otp" caretHidden accessibilityLabel={`${length}-digit verification code`} style={styles.hiddenInput}/>
    </View>);
}
