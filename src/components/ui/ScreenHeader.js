import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/theme';

import { styles } from './ScreenHeader.styles';

export function ScreenHeader({ title, subtitle, right, showBack = true }) {
    const goBack = () => {
        if (router.canGoBack()) router.back();
        else router.replace('/');
    };
    return (<View style={styles.container}>
      {showBack ? (<Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={goBack} hitSlop={8} style={styles.back}>
          <Ionicons name="chevron-back" size={22} color={colors.text}/>
        </Pressable>) : null}
      <View style={styles.titles}>
        <Text style={styles.title} numberOfLines={1} accessibilityRole="header">
          {title}
        </Text>
        {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
      </View>
      <View style={styles.right}>{right}</View>
    </View>);
}
