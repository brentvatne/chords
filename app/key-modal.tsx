import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export default function KeyModal() {
  return (
    <View style={styles.container}>
      <View style={styles.keyGrid}>
        {NOTES.map((note) => (
          <Pressable
            key={note}
            style={styles.keyButton}
            onPress={() => {
              router.replace({
                pathname: "/",
                params: { selectedKey: note },
              });
            }}
          >
            <Text style={styles.keyButtonText}>{note}</Text>
          </Pressable>
        ))}
        <Pressable
          style={[styles.keyButton, styles.clearButton]}
          onPress={() => {
            router.replace("/");
          }}
        >
          <Text style={styles.keyButtonText}>All</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E",
  },
  keyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 20,
    gap: 16,
  },
  keyButton: {
    width: "30%",
    aspectRatio: 1,
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    height: 80,
    borderColor: "#404040",
  },
  clearButton: {
    backgroundColor: "#3A3A3A",
    borderColor: "#505050",
  },
  keyButtonText: {
    color: "#F5F1E8",
    fontSize: 28,
    fontWeight: "600",
    paddingTop: 4,
  },
});
