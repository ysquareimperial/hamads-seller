import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { styles } from './AuthTabs.styles';

const TABS = [
    { key: 'login', label: 'Log in', path: '/login' },
    { key: 'signup', label: 'Sign up', path: '/register/phone' },
];

export function AuthTabs({ active }) {
    return (<View style={styles.track} accessibilityRole="tablist">
      {TABS.map((tab) => {
            const isActive = tab.key === active;
            return (<Pressable key={tab.key} accessibilityRole="tab" accessibilityState={{ selected: isActive }} onPress={() => {
                    if (!isActive) router.replace(tab.path);
                }} style={[styles.tab, isActive && styles.tabActive]}>
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
          </Pressable>);
        })}
    </View>);
}
