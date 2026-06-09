import { Tabs } from 'expo-router';
import { Text } from 'react-native';

import { useClientOnlyValue } from '@/components/useClientOnlyValue';

export default function TabLayout() {
  const icon = (label: string, color: string) => <Text style={{ color, fontWeight: '900', fontSize: 13 }}>{label}</Text>;

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#07111f' },
        headerTintColor: '#f6fbff',
        headerTitleStyle: { fontWeight: '800' },
        tabBarActiveTintColor: '#73d4ff',
        tabBarInactiveTintColor: '#7d91a8',
        tabBarStyle: { backgroundColor: '#0c1726', borderTopColor: '#20344d' },
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Visao',
          tabBarIcon: ({ color }) => icon('MC', color),
        }}
      />
      <Tabs.Screen
        name="dashboards"
        options={{
          title: 'Telemetria',
          tabBarIcon: ({ color }) => icon('TL', color),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Resposta',
          tabBarIcon: ({ color }) => icon('RS', color),
        }}
      />
      <Tabs.Screen
        name="agc"
        options={{
          title: 'AGC',
          tabBarIcon: ({ color }) => icon('AG', color),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Config',
          tabBarIcon: ({ color }) => icon('CF', color),
        }}
      />
    </Tabs>
  );
}
