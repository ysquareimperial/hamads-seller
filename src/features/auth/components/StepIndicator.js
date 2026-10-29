import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/theme';

import { styles } from './StepIndicator.styles';


const STEPS = ['Phone', 'Email', 'Personal details', 'Business'];

/** Back button + "Step x of 4" progress bar for sign-up. `step` is 1-based. */
export function StepIndicator({ step }) {
    const goBack = () => {
        if (router.canGoBack()) router.back();
        else router.replace('/login');
    };
    return (<View style={styles.container}>
      <View style={styles.top}>
        <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={goBack} hitSlop={12} style={styles.back}>
          <Ionicons name="chevron-back" size={24} color={colors.text}/>
        </Pressable>
        <Text style={styles.count}>{`Step ${step} of ${STEPS.length} · ${STEPS[step - 1]}`}</Text>
      </View>
      <View style={styles.bars}>
        {STEPS.map((label, i) => (<View key={label} style={[styles.bar, i < step && styles.barDone]}/>))}
      </View>
    </View>);
}
