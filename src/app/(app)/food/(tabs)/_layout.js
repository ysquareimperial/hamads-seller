import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { colors } from '@/theme';

const tabIcon = (active, inactive) => function TabIcon({ color, focused, size }) {
    return <Ionicons name={focused ? active : inactive} size={size} color={color}/>;
};

export default function FoodTabsLayout() {
    return (<Tabs screenOptions={{
            headerShown: false,
            sceneStyle: { backgroundColor: colors.background },
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textMuted,
            tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
            tabBarLabelStyle: { fontWeight: '600' },
        }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: tabIcon('flame', 'flame-outline') }}/>
      <Tabs.Screen name="menu" options={{ title: 'Menu', tabBarIcon: tabIcon('fast-food', 'fast-food-outline') }}/>
      <Tabs.Screen name="orders" options={{ title: 'Orders', tabBarIcon: tabIcon('bag-handle', 'bag-handle-outline') }}/>
      <Tabs.Screen name="account" options={{ title: 'Account', tabBarIcon: tabIcon('person', 'person-outline') }}/>
    </Tabs>);
}
