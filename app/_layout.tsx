import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
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
          headerShown: false,
          contentStyle: {
            backgroundColor: '#F5F1E8',
          },
        }}
      >
        <Stack.Screen
          name="index"
        />
        <Stack.Screen
          name="device-modal"
          options={{
            presentation: 'modal',
            headerShown: true,
            title: 'MIDI Devices',
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
