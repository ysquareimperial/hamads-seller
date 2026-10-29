import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { TextField } from '@/components/ui/TextField';
import { colors } from '@/theme';

import { MAX_OPTIONS } from '../utils/variants';
import { styles } from './OptionsEditor.styles';
import { ValuesInput } from './ValuesInput';

const PLACEHOLDERS = [
    { name: 'e.g. Size', values: 'S, M, L, XL' },
    { name: 'e.g. Colour', values: 'Black, White, Red' },
    { name: 'e.g. Material', values: 'Cotton, Silk' },
];

/**
 * options: [{ name, values: [] }]. `namesLocked` once a product already has variants on the server
 * (the API only sets option names on a plain product); values can still be added.
 */
export function OptionsEditor({ options, onChange, namesLocked = false, editable = true, error }) {
    const update = (i, patch) => onChange(options.map((o, idx) => (idx === i ? { ...o, ...patch } : o)));
    const remove = (i) => onChange(options.filter((_, idx) => idx !== i));
    return (<View style={styles.wrapper}>
      {options.map((opt, i) => (<View key={i} style={styles.option}>
          <View style={styles.optionTop}>
            <View style={styles.flex}>
              <TextField label={`Option ${i + 1}`} placeholder={PLACEHOLDERS[i]?.name} autoCapitalize="words" maxLength={40} value={opt.name} onChangeText={(name) => update(i, { name })} editable={editable && !namesLocked}/>
            </View>
            {!namesLocked && options.length > 1 ? (<Pressable accessibilityRole="button" accessibilityLabel={`Remove option ${i + 1}`} onPress={() => remove(i)} hitSlop={8} style={styles.remove}>
                <Ionicons name="trash-outline" size={18} color={colors.danger}/>
              </Pressable>) : null}
          </View>
          <Text style={styles.label}>VALUES</Text>
          <ValuesInput values={opt.values} onChange={(values) => update(i, { values })} placeholder={PLACEHOLDERS[i]?.values} editable={editable}/>
        </View>))}
      {!namesLocked && options.length < MAX_OPTIONS ? (<Pressable accessibilityRole="button" onPress={() => onChange([...options, { name: '', values: [] }])} style={styles.add}>
          <Ionicons name="add-circle-outline" size={18} color={colors.primary}/>
          <Text style={styles.addText}>Add another option</Text>
        </Pressable>) : null}
      {namesLocked ? <Text style={styles.hint}>Option names are fixed once variants exist. You can still add or remove values.</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>);
}
