import { Pressable, Text, View } from 'react-native';

import { styles } from './SegmentedControl.styles';

/** options: [{ value, label }] */
export function SegmentedControl({ label, options, value, onChange, error }) {
    return (<View style={styles.container}>
      {label ? <Text style={styles.title}>{label}</Text> : null}
      <View style={[styles.track, !!error && styles.trackError]} accessibilityRole="radiogroup">
        {options.map((option) => {
            const selected = option.value === value;
            return (<Pressable key={option.value} accessibilityRole="radio" accessibilityState={{ selected }} onPress={() => onChange(option.value)} style={[styles.option, selected && styles.optionSelected]}>
              <Text style={[styles.label, selected && styles.labelSelected]}>{option.label}</Text>
            </Pressable>);
        })}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>);
}
