import Color from "color";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getNoteWithoutOctave, isNoteInKey } from "../utils/keys";

interface KeyboardProps {
  octave: number;
  onNotePress: (note: string) => void;
  selectedKey: string | null;
}

const BlackKeyPressedColor = Color("#1C1C1E").lighten(1.5).hex();
const WhiteKeyPressedColor = Color("#FEFCF8").darken(0.02).hex();

export function Keyboard({ octave, onNotePress, selectedKey }: KeyboardProps) {
  const whiteKeys = ["C", "D", "E", "F", "G", "A", "B", "C"]; // Always show 8 keys
  const [keyboardWidth, setKeyboardWidth] = useState(0);

  const whiteKeyWidth =
    keyboardWidth > 0 ? keyboardWidth / whiteKeys.length : 0;
  const blackKeyWidth = whiteKeyWidth * 0.5;

  const blackKeyPositions = [
    { note: "C#", flatName: "Db", offsetFactor: 1, octaveOffset: 0 },
    { note: "D#", flatName: "Eb", offsetFactor: 2, octaveOffset: 0 },
    { note: "F#", flatName: "Gb", offsetFactor: 4, octaveOffset: 0 },
    { note: "G#", flatName: "Ab", offsetFactor: 5, octaveOffset: 0 },
    { note: "A#", flatName: "Bb", offsetFactor: 6, octaveOffset: 0 },
    { note: "C#", flatName: "Db", offsetFactor: 8, octaveOffset: 1 }, // Always show, but may be disabled
  ];

  const isNoteDisabled = (note: string, keyOctave: number) => {
    // First check if octave is out of range
    if (keyOctave > 8) return true;

    // If no key is selected, all notes are enabled
    if (!selectedKey) return false;

    // Check if the note is in the selected key
    return !isNoteInKey(getNoteWithoutOctave(note), selectedKey as any);
  };

  return (
    <View
      style={styles.keyboard}
      onLayout={(event) => {
        setKeyboardWidth(event.nativeEvent.layout.width);
      }}
    >
      {/* White keys */}
      <View style={styles.whiteKeysContainer}>
        {whiteKeys.map((note, index) => {
          // For the last C key (index 7), use the next octave
          const keyOctave = note === "C" && index === 7 ? octave + 1 : octave;
          const noteWithOctave = `${note}${keyOctave}`;
          const isDisabled = isNoteDisabled(noteWithOctave, keyOctave);

          return (
            <Pressable
              key={`${note}-${index}`} // Use index to differentiate the two C keys
              style={({ pressed }) => [
                styles.whiteKey,
                isDisabled && styles.whiteKeyDisabled,
                pressed && { backgroundColor: WhiteKeyPressedColor },
              ]}
              onPress={
                isDisabled ? undefined : () => onNotePress(noteWithOctave)
              }
              disabled={isDisabled}
            >
              <View style={styles.keyLabelContainer}>
                {note === "C" && !isDisabled && (
                  <Text style={styles.octaveText}>{keyOctave}</Text>
                )}
                {!isDisabled && <Text style={styles.whiteKeyText}>{note}</Text>}
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Black keys */}
      {keyboardWidth > 0 && (
        <View style={styles.blackKeysContainer}>
          {blackKeyPositions.map(
            ({ note, flatName, offsetFactor, octaveOffset }) => {
              const keyOctave = octave + octaveOffset;
              const noteWithOctave = `${note}${keyOctave}`;
              const isDisabled = isNoteDisabled(noteWithOctave, keyOctave);

              return (
                <Pressable
                  key={`${note}-${octaveOffset}`} // Make key unique for multiple C# keys
                  style={({ pressed }) => [
                    styles.blackKey,
                    {
                      width: blackKeyWidth,
                      left: whiteKeyWidth * offsetFactor - blackKeyWidth / 2,
                      backgroundColor: pressed
                        ? BlackKeyPressedColor
                        : "#1C1C1E",
                    },
                    isDisabled && styles.blackKeyDisabled,
                  ]}
                  onPress={
                    isDisabled ? undefined : () => onNotePress(noteWithOctave)
                  }
                  disabled={isDisabled}
                >
                  {!isDisabled && (
                    <View style={styles.blackKeyLabelContainer}>
                      <Text style={styles.blackKeyText}>{note}</Text>
                      <Text
                        style={[styles.blackKeyText, styles.blackKeyFlatText]}
                      >
                        {flatName}
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            },
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    height: 220,
    marginHorizontal: 0,
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#D4C4A8", // Warm beige border
  },
  whiteKeysContainer: {
    flexDirection: "row",
    height: "100%",
  },
  whiteKey: {
    flex: 1,
    backgroundColor: "#FEFCF8",
    borderWidth: 1,
    borderColor: "#D4C4A8",
    borderRadius: 5,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 10,
    marginHorizontal: 1,
  },
  whiteKeyText: {
    fontSize: 18,
    opacity: 0.8,
    fontWeight: "bold",
    color: "#2A2A2A", // Dark gray
  },
  octaveText: {
    fontSize: 16,
    color: "#8A7B6B", // Muted brown
    fontWeight: "600",
    marginBottom: 2, // Small gap between octave and note
  },
  blackKeysContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "60%",
  },
  blackKey: {
    position: "absolute",
    height: "100%",
    backgroundColor: "#1C1C1E",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#0A0A0A",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 8,
    zIndex: 1,
  },
  blackKeyText: {
    color: "#F5F1E8", // Cream text
    fontSize: 16,
    opacity: 0.6,
    fontWeight: "bold",
  },
  blackKeyFlatText: {
    marginTop: 2,
    fontSize: 14,
    opacity: 0.4,
  },
  blackKeyLabelContainer: {
    position: "absolute",
    bottom: 8,
    alignItems: "center",
  },
  keyLabelContainer: {
    alignItems: "center",
  },
  whiteKeyDisabled: {
    backgroundColor: Color("#FEFCF8").darken(0.05).hex(),
    borderColor: Color("#D4C4A8").darken(0.1).hex(),
  },
  blackKeyDisabled: {
    backgroundColor: Color("#1C1C1E").lighten(2).hex(),
    borderColor: Color("#0A0A0A").lighten(1.5).hex(),
  },
});
