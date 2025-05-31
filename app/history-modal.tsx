import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMidi } from "../contexts/MidiContext";
import { chordToMidiNotes, type MusicalNoteWithOctave } from "./utils/chords";
import {
    getChordHistory,
    getFavoriteChords,
    getLastOctave,
    toggleFavoriteChord,
} from "./utils/storage";

interface ChordHistoryEntry {
  name: string;
  notes: string[];
  timestamp: number;
}

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
  const [favoriteChords, setFavoriteChords] = useState<string[]>([]);
  const insets = useSafeAreaInsets();
  const { keyboard } = useMidi();

  useEffect(() => {
    setHistory(getChordHistory());
    setFavoriteChords(getFavoriteChords());
  }, []);

  const handleFavoritePress = (chordName: string) => {
    const isNowFavorited = toggleFavoriteChord(chordName);
    setFavoriteChords((prev) =>
      isNowFavorited
        ? [...prev, chordName]
        : prev.filter((name) => name !== chordName),
    );
  };

  const playChord = async (chordName: string) => {
    try {
      // Extract the root note (first note before any quality)
      const rootNoteMatch = chordName.match(/^[A-G][#b]?/)?.[0];
      if (!rootNoteMatch) {
        console.error("Could not extract root note from:", chordName);
        return;
      }

      // Use the last played octave or default to 4
      const octave = getLastOctave() ?? 4;
      const rootNote = `${rootNoteMatch}${octave}` as MusicalNoteWithOctave;

      // Get the chord quality (everything after the root note)
      const quality = chordName.slice(rootNoteMatch.length);

      // Reconstruct the chord info to get MIDI notes
      const midiNotes = chordToMidiNotes(
        {
          triad:
            quality.includes("m") && !quality.includes("maj")
              ? "minor"
              : quality.includes("dim")
                ? "dim"
                : quality.includes("sus")
                  ? "sus"
                  : "major",
          extensions: [
            ...(quality.includes("6") ? ["6" as const] : []),
            ...(quality.includes("maj7")
              ? ["M7" as const]
              : quality.includes("7")
                ? ["m7" as const]
                : []),
            ...(quality.includes("9") ? ["9" as const] : []),
          ],
        },
        rootNote,
      );

      if (midiNotes.length > 0) {
        await keyboard.playNotes(midiNotes, 100);
        setTimeout(() => keyboard.releaseNotes(midiNotes), 500);
      }
    } catch (error) {
      console.error("Error playing chord:", error);
    }
  };

  const renderItem = ({ item }: { item: ChordHistoryEntry }) => (
    <Pressable
      style={({ pressed }) => [styles.historyItem, pressed && { opacity: 0.7 }]}
      onPress={() => playChord(item.name)}
    >
      <View style={styles.historyItemHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.chordName}>{item.name}</Text>
          <Text style={styles.timestamp}>
            {formatTimestamp(item.timestamp)}
          </Text>
        </View>
        <Pressable
          onPress={() => handleFavoritePress(item.name)}
          style={({ pressed }) => [
            styles.favoriteButton,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons
            name={favoriteChords.includes(item.name) ? "star" : "star-outline"}
            size={24}
            color={favoriteChords.includes(item.name) ? "#E89D45" : "#999"}
          />
        </Pressable>
      </View>
      <Text style={styles.notes}>{item.notes.join(", ")}</Text>
    </Pressable>
  );

  return (
    <FlatList
      data={history}
      renderItem={renderItem}
      keyExtractor={(item) => item.timestamp.toString()}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: insets.bottom + 40 },
      ]}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No chords played yet</Text>
          <Text style={styles.emptySubtext}>
            Play some chords and they&apos;ll appear here
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
  },
  historyItem: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#404040",
  },
  historyItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  chordName: {
    color: "#F5F1E8",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  timestamp: {
    color: "#999",
    fontSize: 14,
  },
  notes: {
    color: "#E89D45",
    fontSize: 14,
  },
  favoriteButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  emptyText: {
    color: "#F5F1E8",
    fontSize: 18,
    marginBottom: 8,
  },
  emptySubtext: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
  },
});
