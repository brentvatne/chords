import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#E89D45',
        tabBarInactiveTintColor: '#8A7B6B',
        tabBarStyle: {
          backgroundColor: '#F5F1E8',
          borderTopColor: '#D4C4A8',
          borderTopWidth: 1,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: '#1C1C1E',
        },
        headerTintColor: '#F5F1E8',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Play',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="musical-notes" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="device"
        options={{
          title: 'Device',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="hardware-chip-outline" size={size} color={color} />
          ),
          headerTitle: 'MIDI Devices',
        }}
      />
    </Tabs>
  );
} 