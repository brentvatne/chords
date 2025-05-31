import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMidi } from "../contexts/MidiContext";
import { chordToMidiNotes, type MusicalNoteWithOctave } from "./utils/chords";
import { getFavoriteChords, getLastOctave } from "./utils/storage";

export default function FavoritesModal() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const insets = useSafeAreaInsets();
  const { keyboard } = useMidi();

  useEffect(() => {
    setFavorites(getFavoriteChords());
  }, []);

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

  const renderItem = ({ item }: { item: string }) => (
    <Pressable
      style={({ pressed }) => [
        styles.favoriteItem,
        pressed && { opacity: 0.7 },
      ]}
      onPress={() => playChord(item)}
    >
      <Text style={styles.chordName}>{item}</Text>
    </Pressable>
  );

  return (
    <FlatList
      data={favorites}
      renderItem={renderItem}
      keyExtractor={(item) => item}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: insets.bottom + 40 },
      ]}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No favorite chords yet</Text>
          <Text style={styles.emptySubtext}>
            Star chords in your history to add them here
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
  favoriteItem: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#404040",
  },
  chordName: {
    color: "#F5F1E8",
    fontSize: 18,
    fontWeight: "600",
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
