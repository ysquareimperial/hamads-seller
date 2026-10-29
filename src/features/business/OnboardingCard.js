import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/theme';

import { stepRoute } from './onboardingSteps';
import { styles } from './OnboardingCard.styles';

/** GET /seller/onboarding as a checklist. Hidden once complete. */
export function OnboardingCard({ onboarding, vendor, storeEnabled }) {
    if (!onboarding || onboarding.complete) return null;
    const steps = onboarding.steps ?? [];
    const done = steps.filter((s) => s.done).length;
    const titleOf = (key) => steps.find((s) => s.key === key)?.title ?? key;
    return (<View style={styles.card}>
      <View style={styles.top}>
        <Text style={styles.title}>Finish setting up</Text>
        <Text style={styles.count}>{`${done}/${steps.length}`}</Text>
      </View>
      <View style={styles.bar}>
        <View style={[styles.fill, { width: `${steps.length ? (done / steps.length) * 100 : 0}%` }]}/>
      </View>
      {steps.map((step) => {
            const route = step.done ? null : stepRoute(step.key, { vendor, storeEnabled });
            const isNext = step.key === onboarding.next_step;
            return (<Pressable key={step.key} accessibilityRole="button" disabled={!route} onPress={() => route && router.push(route)} style={styles.step}>
            <Ionicons name={step.done ? 'checkmark-circle' : isNext ? 'arrow-forward-circle' : 'ellipse-outline'} size={20} color={step.done ? colors.success : isNext ? colors.primary : colors.disabled}/>
            <View style={styles.stepText}>
              <Text style={[styles.stepTitle, step.done && styles.stepDone, isNext && styles.stepNext]}>{step.title}</Text>
              {!step.done && step.blocked_by ? (<Text style={styles.blocked}>{`Waiting on: ${titleOf(step.blocked_by)}`}</Text>) : null}
            </View>
            {route ? <Ionicons name="chevron-forward" size={16} color={colors.disabled}/> : null}
          </Pressable>);
        })}
    </View>);
}
