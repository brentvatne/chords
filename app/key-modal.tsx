import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ALL_KEYS } from "./utils/music-theory";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F5F1E8",
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#E89D45",
    marginBottom: 12,
  },
  keyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  keyButton: {
    backgroundColor: "#2A2A2A",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#404040",
    minWidth: 80,
    alignItems: "center",
  },
  keyButtonText: {
    color: "#F5F1E8",
    fontSize: 16,
    fontWeight: "bold",
  },
  clearButton: {
    backgroundColor: "#E89D45",
    borderColor: "#E89D45",
  },
  clearButtonText: {
    color: "#1C1C1E",
  },
});

export default function KeyModal() {
  const majorKeys = ALL_KEYS.filter((k) => k.type === "major");
  const minorKeys = ALL_KEYS.filter((k) => k.type === "minor");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Select Key</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Major Keys</Text>
          <View style={styles.keyGrid}>
            {majorKeys.map((key) => (
              <Pressable
                key={key.name}
                style={styles.keyButton}
                onPress={() => {
                  router.replace({
                    pathname: "/",
                    params: { selectedKey: key.name },
                  });
                }}
              >
                <Text style={styles.keyButtonText}>{key.name}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Minor Keys</Text>
          <View style={styles.keyGrid}>
            {minorKeys.map((key) => (
              <Pressable
                key={key.name}
                style={styles.keyButton}
                onPress={() => {
                  router.replace({
                    pathname: "/",
                    params: { selectedKey: key.name },
                  });
                }}
              >
                <Text style={styles.keyButtonText}>{key.name}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Pressable
            style={[styles.keyButton, styles.clearButton]}
            onPress={() => {
              router.replace({
                pathname: "/",
                params: { selectedKey: "__ALL__" },
              });
            }}
          >
            <Text style={[styles.keyButtonText, styles.clearButtonText]}>
              All
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
