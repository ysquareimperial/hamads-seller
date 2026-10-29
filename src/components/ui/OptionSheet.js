import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';

import { colors } from '@/theme';

import { BottomSheet } from './BottomSheet';
import { styles } from './OptionSheet.styles';

export function OptionSheet({ visible, title, options, selected, onSelect, onClose, searchable = false }) {
    const [query, setQuery] = useState('');
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
    }, [options, query]);

    const close = () => {
        setQuery('');
        onClose();
    };

    return (<BottomSheet visible={visible} title={title} onClose={close}>
      {searchable ? (<View style={styles.search}>
          <Ionicons name="search" size={18} color={colors.textMuted}/>
          <TextInput value={query} onChangeText={setQuery} placeholder="Search" placeholderTextColor={colors.disabled} autoCorrect={false} style={styles.searchInput}/>
        </View>) : null}
      <FlatList data={filtered} keyExtractor={(item) => String(item.value)} keyboardShouldPersistTaps="handled" style={styles.list} ListEmptyComponent={<Text style={styles.empty}>No matches</Text>} renderItem={({ item }) => {
            const isSelected = item.value === selected;
            return (<Pressable accessibilityRole="button" accessibilityState={{ selected: isSelected }} onPress={() => {
                    setQuery('');
                    onSelect(item.value);
                }} style={styles.row}>
              <Text style={[styles.label, isSelected && styles.labelSelected]} numberOfLines={2}>{item.label}</Text>
              {isSelected ? <Ionicons name="checkmark" size={20} color={colors.primary}/> : null}
            </Pressable>);
        }}/>
    </BottomSheet>);
}
