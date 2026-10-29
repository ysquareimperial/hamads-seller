import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { MAX_PRODUCT_TAGS } from '@/config';
import { colors } from '@/theme';

import { styles } from './TagInput.styles';

const clean = (t) => t.trim().toLowerCase().replace(/\s+/g, ' ');

/** Free-text tags. Comma or return adds a tag; popular tags are tappable suggestions. */
export function TagInput({ tags, onChange, suggestions = [], editable = true }) {
    const [draft, setDraft] = useState('');
    const full = tags.length >= MAX_PRODUCT_TAGS;

    const add = (raw) => {
        const parts = raw.split(',').map(clean).filter(Boolean);
        const next = [...tags];
        parts.forEach((p) => {
            if (!next.includes(p) && next.length < MAX_PRODUCT_TAGS) next.push(p);
        });
        if (next.length !== tags.length) onChange(next);
        setDraft('');
    };

    const onChangeText = (text) => {
        if (text.includes(',')) add(text);
        else setDraft(text);
    };

    const unused = suggestions.map((s) => s.name).filter((n) => !tags.includes(clean(n))).slice(0, 12);

    return (<View style={styles.wrapper}>
      <Text style={styles.label}>{`TAGS (${tags.length}/${MAX_PRODUCT_TAGS})`}</Text>
      <View style={styles.field}>
        {tags.map((tag) => (<Pressable key={tag} accessibilityRole="button" accessibilityLabel={`Remove tag ${tag}`} disabled={!editable} onPress={() => onChange(tags.filter((t) => t !== tag))} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
            <Ionicons name="close" size={14} color={colors.primary}/>
          </Pressable>))}
        {!full ? (<TextInput value={draft} onChangeText={onChangeText} onSubmitEditing={() => add(draft)} onBlur={() => draft && add(draft)} blurOnSubmit={false} editable={editable} placeholder={tags.length ? 'Add another' : 'e.g. ankara, cotton, women'} placeholderTextColor={colors.disabled} autoCapitalize="none" returnKeyType="done" style={styles.input}/>) : null}
      </View>
      {unused.length > 0 && !full ? (<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestions} keyboardShouldPersistTaps="handled">
          {unused.map((name) => (<Pressable key={name} accessibilityRole="button" onPress={() => add(name)} style={styles.suggestion}>
              <Text style={styles.suggestionText}>{`+ ${name}`}</Text>
            </Pressable>))}
        </ScrollView>) : null}
      <Text style={styles.hint}>Helps shoppers find this product. Separate with commas.</Text>
    </View>);
}
