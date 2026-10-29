import { ActivityIndicator, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { TextField } from '@/components/ui/TextField';
import { colors } from '@/theme';

import { cleanUsername, storeLinkLabel } from './username';
import { styles } from './UsernameField.styles';

/** Username input with the live check from useUsernameCheck shown underneath. */
export function UsernameField({ value, onChange, check, error, editable = true, label = 'Store username' }) {
    const s = check.status;
    let line = null;
    if (s === 'checking') line = (<View style={styles.row}><ActivityIndicator size="small" color={colors.textMuted}/><Text style={styles.muted}>Checking…</Text></View>);
    else if (s === 'available') line = (<View style={styles.row}><Ionicons name="checkmark-circle" size={16} color={colors.success}/><Text style={styles.ok}>{`Available · ${storeLinkLabel(value)}`}</Text></View>);
    else if (s === 'current') line = (<View style={styles.row}><Ionicons name="link-outline" size={16} color={colors.textMuted}/><Text style={styles.muted}>Your current username</Text></View>);
    else if (s === 'taken') line = (<View style={styles.row}><Ionicons name="close-circle" size={16} color={colors.danger}/><Text style={styles.bad}>{check.reason ?? 'Already taken. Try another.'}</Text></View>);
    else if (s === 'short') line = <Text style={styles.muted}>{check.reason}</Text>;
    else if (s === 'error') line = <Text style={styles.muted}>{"Couldn't check right now. We'll check again when you save."}</Text>;

    return (<View style={styles.wrapper}>
      <TextField label={label} prefix="@" placeholder="aminafabrics" autoCapitalize="none" autoCorrect={false} value={value} onChangeText={(t) => onChange(cleanUsername(t))} error={error} editable={editable}/>
      {!error && line ? line : null}
      {!error ? <Text style={styles.hint}>Your public link. Customers use it to find your store.</Text> : null}
    </View>);
}
