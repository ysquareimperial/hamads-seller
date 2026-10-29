import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';

import { MAX_PRODUCT_IMAGES } from '@/config';
import { colors } from '@/theme';

import { styles } from './ImagePickerGrid.styles';

let localId = 0;
const toImage = (asset) => ({ id: `new-${++localId}`, uri: asset.uri, mimeType: asset.mimeType, kind: 'new' });

const move = (list, from, to) => {
    const next = [...list];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    return next;
};

const swap = (list, a, b) => {
    const next = [...list];
    [next[a], next[b]] = [next[b], next[a]];
    return next;
};

/**
 * images: [{ id, uri, kind: 'existing' | 'new', mimeType? }]. The first image is the cover.
 * Tap a photo to select it, then tap another to swap them, or use the toolbar to
 * make it the cover, move it left/right, or remove it.
 */
export function ImagePickerGrid({ images, onChange, error, disabled = false }) {
    const [selected, setSelected] = useState(null);
    const remaining = MAX_PRODUCT_IMAGES - images.length;
    const sel = selected !== null && selected < images.length ? selected : null;

    const update = (next, nextSelected = null) => {
        onChange(next);
        setSelected(nextSelected);
    };

    const pickFromLibrary = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            selectionLimit: remaining,
            quality: 0.8,
        });
        if (!result.canceled) update([...images, ...result.assets.slice(0, remaining).map(toImage)]);
    };

    const takePhoto = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Camera access needed', 'Allow camera access in Settings to take product photos.');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.8 });
        if (!result.canceled) update([...images, toImage(result.assets[0])]);
    };

    const add = () => {
        setSelected(null);
        Alert.alert('Add photos', undefined, [
            { text: 'Take photo', onPress: () => void takePhoto() },
            { text: 'Choose from library', onPress: () => void pickFromLibrary() },
            { text: 'Cancel', style: 'cancel' },
        ]);
    };

    const tap = (index) => {
        if (sel === null) setSelected(index);
        else if (sel === index) setSelected(null);
        else update(swap(images, sel, index));
    };

    return (<View style={styles.wrapper}>
      <Text style={styles.label}>{`PHOTOS (${images.length}/${MAX_PRODUCT_IMAGES})`}</Text>
      <View style={styles.grid}>
        {images.map((image, index) => (<Pressable key={image.id} accessibilityRole="button" accessibilityState={{ selected: sel === index }} accessibilityLabel={index === 0 ? 'Cover photo' : `Photo ${index + 1}`} disabled={disabled} onPress={() => tap(index)} style={[styles.tile, sel === index && styles.tileSelected, sel !== null && sel !== index && styles.tileTarget]}>
            <Image source={{ uri: image.uri }} style={styles.image} contentFit="cover"/>
            <View style={[styles.badge, index === 0 && styles.badgeCover]}>
              <Text style={styles.badgeText}>{index === 0 ? 'Cover' : index + 1}</Text>
            </View>
            {sel === index ? (<View style={styles.check}>
                <Ionicons name="checkmark" size={14} color={colors.textOnPrimary}/>
              </View>) : null}
          </Pressable>))}
        {remaining > 0 && sel === null ? (<Pressable accessibilityRole="button" accessibilityLabel="Add photos" disabled={disabled} onPress={add} style={[styles.tile, styles.addTile, !!error && styles.addTileError]}>
            <Ionicons name="camera-outline" size={24} color={colors.primary}/>
            <Text style={styles.addText}>Add</Text>
          </Pressable>) : null}
      </View>

      {sel !== null ? (<View style={styles.toolbar}>
          {sel > 0 ? (<ToolButton icon="star-outline" label="Make cover" onPress={() => update(move(images, sel, 0), 0)}/>) : null}
          <ToolButton icon="chevron-back" label="Left" disabled={sel === 0} onPress={() => update(move(images, sel, sel - 1), sel - 1)}/>
          <ToolButton icon="chevron-forward" label="Right" disabled={sel === images.length - 1} onPress={() => update(move(images, sel, sel + 1), sel + 1)}/>
          <ToolButton icon="trash-outline" label="Remove" danger onPress={() => update(images.filter((_, i) => i !== sel))}/>
        </View>) : null}

      {error ? (<Text style={styles.error}>{error}</Text>) : (<Text style={styles.hint}>
          {sel !== null ? 'Tap another photo to swap them, or tap this one again to cancel.' : 'Tap a photo to rearrange or set it as the cover.'}
        </Text>)}
    </View>);
}

function ToolButton({ icon, label, onPress, disabled = false, danger = false }) {
    const tint = danger ? colors.danger : colors.primary;
    return (<Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} disabled={disabled} style={[styles.tool, danger && styles.toolDanger, disabled && styles.toolDisabled]}>
      <Ionicons name={icon} size={16} color={tint}/>
      <Text style={[styles.toolText, { color: tint }]}>{label}</Text>
    </Pressable>);
}
