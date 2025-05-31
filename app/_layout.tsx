import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Alert, Pressable, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { MidiProvider } from "../contexts/MidiContext";
import { clearChordHistory } from "./utils/storage";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const handleClearHistory = () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear your chord history?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            clearChordHistory();
            router.back();
          },
        },
      ],
    );
  };

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#1C1C1E" }}>
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
              title: "Select device",
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
                    pressed && { opacity: 0.5 },
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
                    pressed && { opacity: 0.5 },
                  ]}
                >
                  <Ionicons name="close" size={20} color="#E89D45" />
                </Pressable>
              ),
            }}
          />
          <Stack.Screen
            name="history-modal"
            options={{
              title: "Chord history",
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
                    pressed && { opacity: 0.5 },
                  ]}
                >
                  <Ionicons name="close" size={20} color="#E89D45" />
                </Pressable>
              ),
              headerRight: () => (
                <Pressable
                  onPress={handleClearHistory}
                  style={({ pressed }) => [
                    styles.clearButton,
                    pressed && { opacity: 0.5 },
                  ]}
                >
                  <Ionicons name="trash-outline" size={20} color="#E89D45" />
                </Pressable>
              ),
            }}
          />
          <Stack.Screen
            name="favorites-modal"
            options={{
              title: "Favorite chords",
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
                    pressed && { opacity: 0.5 },
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
  clearButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: -8,
  },
});
