import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Pressable } from 'react-native';
import 'react-native-reanimated';
import { MidiProvider } from '../contexts/MidiContext';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <MidiProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1C1C1E', // Black like the control panel
          },
          headerTintColor: '#F5F1E8', // Cream text on dark background
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'MIDI Chords',
            headerRight: () => (
              <Pressable 
                onPress={() => router.push('/device-modal')}
                style={{ 
                  padding: 8,
                  marginRight: 4,
                }}
              >
                <Ionicons name="hardware-chip-outline" size={24} color="#E89D45" />
              </Pressable>
            ),
          }}
        />
        <Stack.Screen
          name="device-modal"
          options={{
            title: 'MIDI Devices',
            presentation: 'modal',
            headerStyle: {
              backgroundColor: '#1C1C1E',
            },
            headerTintColor: '#F5F1E8',
          }}
        />
      </Stack>
    </MidiProvider>
  );
}
