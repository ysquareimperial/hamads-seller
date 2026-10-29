import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Pressable, Text, View } from 'react-native';

import { colors } from '@/theme';

import { styles } from './SinglePhotoPicker.styles';

/** value: { uri, mimeType?, kind: 'existing' | 'new' } | null */
export function SinglePhotoPicker({ value, onChange, label = 'PHOTO', hint, disabled = false, aspect = [4, 3] }) {
    const pick = async (fromCamera) => {
        if (fromCamera) {
            const permission = await ImagePicker.requestCameraPermissionsAsync();
            if (!permission.granted) {
                Alert.alert('Camera access needed', 'Allow camera access in Settings to take photos.');
                return;
            }
        }
        const options = { mediaTypes: ['images'], allowsEditing: true, aspect, quality: 0.8 };
        const result = fromCamera ? await ImagePicker.launchCameraAsync(options) : await ImagePicker.launchImageLibraryAsync(options);
        if (!result.canceled) {
            const asset = result.assets[0];
            onChange({ uri: asset.uri, mimeType: asset.mimeType, kind: 'new' });
        }
    };

    const open = () => {
        const actions = [
            { text: 'Take photo', onPress: () => void pick(true) },
            { text: 'Choose from library', onPress: () => void pick(false) },
        ];
        if (value) actions.push({ text: 'Remove photo', style: 'destructive', onPress: () => onChange(null) });
        actions.push({ text: 'Cancel', style: 'cancel' });
        Alert.alert('Photo', undefined, actions);
    };

    return (<View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={value ? 'Change photo' : 'Add photo'} disabled={disabled} onPress={open} style={[styles.box, !value && styles.empty]}>
        {value ? (<Image source={{ uri: value.uri }} style={styles.image} contentFit="cover"/>) : (<>
            <Ionicons name="camera-outline" size={28} color={colors.primary}/>
            <Text style={styles.addText}>Add a photo</Text>
          </>)}
      </Pressable>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>);
}
