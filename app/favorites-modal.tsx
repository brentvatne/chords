import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMidi } from "../contexts/MidiContext";
import { chordToMidiNotes, type MusicalNoteWithOctave } from "./utils/chords";
import {
  ChordHistoryEntry,
  clearFavoriteChords,
  getFavoriteChords,
  getLastOctave,
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

export default function FavoritesModal() {
  const [favoriteChords, setFavoriteChords] = useState<ChordHistoryEntry[]>([]);
  const { keyboard } = useMidi();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const favorites = await getFavoriteChords();
    setFavoriteChords(favorites);
  };

  const handleClearFavorites = async () => {
    await clearFavoriteChords();
    setFavoriteChords([]);
  };

  const handleChordPress = async (chord: ChordHistoryEntry) => {
    const octave = getLastOctave() ?? 4;
    const firstNote = chord.notes[0] as MusicalNoteWithOctave;
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

  const handleFavoriteToggle = async (chord: ChordHistoryEntry) => {
    await toggleFavoriteChord(chord);
    loadFavorites();
  };

  return (
    <FlatList
      data={favoriteChords}
      keyExtractor={(item) => item.timestamp.toString()}
      renderItem={({ item }) => (
        <Pressable
          style={({ pressed }) => [
            styles.chordItem,
            pressed && { opacity: 0.7 },
          ]}
          onPress={() => handleChordPress(item)}
        >
          <View>
            <Text style={styles.chordName}>{item.name}</Text>
            <Text style={styles.chordNotes}>{item.notes.join(", ")}</Text>
          </View>
          <Pressable
            onPress={() => handleFavoriteToggle(item)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="heart" size={24} color="#E89D45" />
          </Pressable>
        </Pressable>
      )}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E",
  },
  clearButton: {
    backgroundColor: "#E89D45",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearButtonText: {
    color: "#1C1C1E",
    fontWeight: "600",
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
  chordName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#F5F1E8",
    marginBottom: 4,
  },
  chordNotes: {
    fontSize: 16,
    color: "#999",
  },
});
