import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { MidiProvider } from "../contexts/MidiContext";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
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
    <GestureHandlerRootView>
      <MidiProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="device-modal"
            options={{
              title: "MIDI Devices",
              presentation: "formSheet",
              headerStyle: {
                backgroundColor: "#1C1C1E",
              },
              headerTintColor: "#F5F1E8",
              headerTitleStyle: {
                fontWeight: "600",
              },
              contentStyle: {
                backgroundColor: "#1C1C1E",
              },
              headerLeft: () => (
                <Pressable
                  onPress={() => router.back()}
                  style={({ pressed }) => [
                    styles.closeButton,
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Ionicons name="close" size={20} color="#E89D45" />
                </Pressable>
              ),
            }}
          />
          <Stack.Screen
            name="key-modal"
            options={{
              title: "Select key",
              presentation: "formSheet",
              headerStyle: {
                backgroundColor: "#1C1C1E",
              },
              headerTintColor: "#F5F1E8",
              headerTitleStyle: {
                fontWeight: "600",
              },
              contentStyle: {
                backgroundColor: "#1C1C1E",
              },
              headerLeft: () => (
                <Pressable
                  onPress={() => router.back()}
                  style={({ pressed }) => [
                    styles.closeButton,
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Ionicons name="close" size={20} color="#E89D45" />
                </Pressable>
              ),
            }}
          />
        </Stack>
      </MidiProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -8,
  },
});
