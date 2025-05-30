import { Stack } from "expo-router";
import { MidiProvider } from "../contexts/MidiContext";

export default function RootLayout() {
  return (
    <MidiProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </MidiProvider>
  );
}
