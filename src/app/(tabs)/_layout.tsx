import { Tabs } from 'expo-router';

import { HomeIcon } from '@/components/ui/home-icon';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
