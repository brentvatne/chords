import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMidi } from "../contexts/MidiContext";
import { chordToMidiNotes } from "./utils/chords";
import {
  ChordHistoryEntry,
  clearChordHistory,
  getChordHistory,
  getFavoriteChords,
  toggleFavoriteChord,
} from "./utils/storage";

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

export default function HistoryModal() {
  const [history, setHistory] = useState<ChordHistoryEntry[]>([]);
  const [favoriteChords, setFavoriteChords] = useState<ChordHistoryEntry[]>([]);
  const { keyboard } = useMidi();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadHistory();
    loadFavorites();
  }, []);

  const loadHistory = () => {
    setHistory(getChordHistory());
  };

  const loadFavorites = () => {
    setFavoriteChords(getFavoriteChords());
  };

  const handleClearHistory = async () => {
    await clearChordHistory();
    setHistory([]);
  };

  const handleChordPress = async (chord: ChordHistoryEntry) => {
    // Use the first note's octave from the stored chord
    const [firstNote] = chord.notes;
    const midiNotes = chordToMidiNotes(
      {
        triad: chord.name.includes("m")
          ? "minor"
          : chord.name.includes("dim")
            ? "dim"
            : chord.name.includes("sus")
              ? "sus"
              : "major",
        extensions: [],
      },
      firstNote,
    );

    await keyboard.playNotes(midiNotes, 100);
    setTimeout(() => {
      keyboard.releaseNotes(midiNotes);
    }, 500);
  };

  const handleFavoriteToggle = (chord: ChordHistoryEntry) => {
    toggleFavoriteChord(chord);
    loadFavorites(); // Refresh favorites list
  };

  const isChordFavorited = (chord: ChordHistoryEntry) => {
    return favoriteChords.some(
      (f) => f.name === chord.name && f.timestamp === chord.timestamp,
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Chord history</Text>

      <FlatList
        data={history}
        keyExtractor={(item) => item.timestamp.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.chordItem,
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => handleChordPress(item)}
          >
            <View style={styles.chordInfo}>
              <Text style={styles.chordName}>{item.name}</Text>
              <Text style={styles.chordNotes}>{item.notes.join(", ")}</Text>
              <Text style={styles.timestamp}>
                {formatTimestamp(item.timestamp)}
              </Text>
            </View>
            <Pressable
              onPress={() => handleFavoriteToggle(item)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={isChordFavorited(item) ? "heart" : "heart-outline"}
                size={24}
                color="#E89D45"
              />
            </Pressable>
          </Pressable>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F5F1E8",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  list: {
    padding: 20,
  },
  chordItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#404040",
  },
  chordInfo: {
    flex: 1,
  },
  chordName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#F5F1E8",
    marginBottom: 4,
  },
  chordNotes: {
    fontSize: 16,
    color: "#999",
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 14,
    color: "#666",
  },
});
