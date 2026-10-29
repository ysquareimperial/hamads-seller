import { ScrollView } from 'react-native';

import { Chip } from './Chip';
import { styles } from './ChipRow.styles';

/** Horizontal single-select filter. options: [{ value, label }] */
export function ChipRow({ options, value, onChange }) {
    return (<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row} style={styles.scroll}>
      {options.map((o) => (<Chip key={String(o.value)} label={o.label} selected={o.value === value} onPress={() => onChange(o.value)}/>))}
    </ScrollView>);
}
