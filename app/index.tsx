import { MidiKeyboard } from "@/modules/simple-midi";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useMidi } from "../contexts/MidiContext";
import { Keyboard } from "./components/Keyboard";
import {
  CHORD_QUALITY_DESCRIPTIONS,
  EXTENSION_DESCRIPTIONS,
  ExtensionType,
  MusicalNoteWithOctave,
  TriadType,
  chordToMidiNotes,
  getChordInfo,
} from "./utils/chords";

async function playNotesAsync(
  keyboard: any,
  midiNotes: number[],
  velocity: number,
  duration: number,
) {
  if (midiNotes.length === 0) return;
  for (const note of midiNotes) {
    await keyboard.playNote(note, velocity);
  }
  setTimeout(async () => {
    for (const note of midiNotes) {
      await keyboard.releaseNote(note);
    }
  }, duration);
}

const TRIAD_TYPES: TriadType[] = ["dim", "minor", "major", "sus"];
const EXTENSION_TYPES: ExtensionType[] = ["6", "m7", "M7", "9"];

async function sendNotesOnAsync(
  keyboard: MidiKeyboard,
  notes: number[],
  velocity: number,
) {
  for (const note of notes) {
    await keyboard.playNote(note, velocity);
  }
}

async function sendNotesOffAsync(keyboard: MidiKeyboard, notes: number[]) {
  for (const note of notes) {
    await keyboard.releaseNote(note);
  }
}

export default function PlayScreen() {
  const { selectedKey } = useLocalSearchParams<{ selectedKey: string }>();
  const { connectedDevice, keyboard, devices, connectToDevice } = useMidi();
  const [octave, setOctave] = useState(4);
  const [selectedTriad, setSelectedTriad] = useState<TriadType>("major");
  const [selectedExtensions, setSelectedExtensions] = useState<ExtensionType[]>(
    [],
  );

  const hasAttemptedAutoConnect = useRef(false);
  const [currentChordInfo, setCurrentChordInfo] = useState<{
    name: string;
    notes: string[];
  } | null>(null);
  const insets = useSafeAreaInsets();
  const pressedNotes = useRef<{ [key: string]: number[] }>({});

  const handleNotePressIn = async (noteNameWithOctave: string) => {
    try {
      const rootNote = noteNameWithOctave as MusicalNoteWithOctave;
      const selection = {
        triad: selectedTriad,
        extensions: selectedExtensions,
      };

      // Get chord info for display
      const displayInfo = getChordInfo(selection, rootNote);
      setCurrentChordInfo(displayInfo);

      // Get MIDI notes using the dedicated function and play them
      const midiNotesToPlay = chordToMidiNotes(selection, rootNote);
      if (midiNotesToPlay.length > 0) {
        await sendNotesOnAsync(keyboard, midiNotesToPlay, 100);
        pressedNotes.current[noteNameWithOctave] = midiNotesToPlay;
      } else {
        console.warn(
          `Could not play MIDI for ${displayInfo.name}, but display info was generated.`,
        );
      }
    } catch (error) {
      console.error(
        `Error in handleNotePress with selection ${JSON.stringify({ triad: selectedTriad, extensions: selectedExtensions })} and root ${noteNameWithOctave}:`,
        error,
      );
      setCurrentChordInfo(null);
      alert(`Could not process chord. Please try again.`);
    }
  };

  const handleNotePressOut = async (noteNameWithOctave: string) => {
    await sendNotesOffAsync(keyboard, pressedNotes.current[noteNameWithOctave]);
    delete pressedNotes.current[noteNameWithOctave];
  };

  const toggleExtension = (extension: ExtensionType) => {
    setSelectedExtensions((prev) =>
      prev.includes(extension)
        ? prev.filter((e) => e !== extension)
        : [...prev, extension],
    );
  };

  useEffect(() => {
    if (devices.length > 0) {
      hasAttemptedAutoConnect.current = true;
    }

    if (
      !hasAttemptedAutoConnect.current &&
      !connectedDevice &&
      devices.length === 1
    ) {
      connectToDevice(devices[0].id);
    }
  }, [connectedDevice, devices, connectToDevice]);

  if (!connectedDevice) {
    return (
      <SafeAreaView style={styles.noDeviceContainer}>
        <Text style={styles.noDeviceText}>No MIDI device connected</Text>
        <Text style={styles.noDeviceSubtext}>
          To play notes on the keyboard, please connect to a MIDI device first.
        </Text>
        <Pressable
          style={styles.deviceButton}
          onPress={() => router.navigate("/device-modal")}
        >
          <Text style={styles.deviceButtonText}>Connect Device</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.content}>
        <View style={[styles.header, { paddingTop: insets.top / 2 }]}>
          <Pressable
            onPress={() => router.navigate("/device-modal")}
            style={({ pressed }) => [
              styles.headerButton,
              { top: insets.top + 4 },
              pressed && { opacity: 0.5 },
            ]}
          >
            <View style={styles.headerButtonContent}>
              <Ionicons
                name="hardware-chip-outline"
                size={25}
                color="#eee"
                style={styles.chipIcon}
              />
              {connectedDevice && (
                <View style={styles.connectionIndicator}>
                  <Ionicons
                    name="checkmark-circle-sharp"
                    size={15}
                    color="#4CAF50"
                    style={styles.connectionIcon}
                  />
                </View>
              )}
            </View>
          </Pressable>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>
              {currentChordInfo ? currentChordInfo.name : "Play a chord"}
            </Text>
            <Text style={styles.headerSubtitle}>
              {currentChordInfo
                ? currentChordInfo.notes.join(", ")
                : "Notes will appear here"}
            </Text>
          </View>
        </View>

        <View style={styles.controlsArea}>
          <View style={styles.chordQualityContainer}>
            <View style={styles.qualitySection}>
              <View style={styles.qualitySelector}>
                {TRIAD_TYPES.map((triad) => (
                  <Pressable
                    key={triad}
                    style={[
                      styles.qualityButton,
                      selectedTriad === triad && styles.qualityButtonSelected,
                    ]}
                    onPress={() => setSelectedTriad(triad)}
                  >
                    <View style={styles.qualityButtonContent}>
                      <Text
                        style={[
                          styles.qualityButtonText,
                          selectedTriad === triad &&
                            styles.qualityButtonTextSelected,
                        ]}
                      >
                        {CHORD_QUALITY_DESCRIPTIONS[triad].shortName}
                      </Text>
                      <Text
                        style={[
                          styles.qualityButtonDescription,
                          selectedTriad === triad &&
                            styles.qualityButtonDescriptionSelected,
                        ]}
                        numberOfLines={3}
                      >
                        {CHORD_QUALITY_DESCRIPTIONS[triad].description}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.qualitySection}>
              <View style={styles.qualitySelector}>
                {EXTENSION_TYPES.map((extension) => (
                  <Pressable
                    key={extension}
                    style={[
                      styles.qualityButton,
                      selectedExtensions.includes(extension) &&
                        styles.qualityButtonSelected,
                    ]}
                    onPress={() => toggleExtension(extension)}
                  >
                    <View style={styles.qualityButtonContent}>
                      <Text
                        style={[
                          styles.qualityButtonText,
                          selectedExtensions.includes(extension) &&
                            styles.qualityButtonTextSelected,
                        ]}
                      >
                        {EXTENSION_DESCRIPTIONS[extension].shortName}
                      </Text>
                      <Text
                        style={[
                          styles.qualityButtonDescription,
                          selectedExtensions.includes(extension) &&
                            styles.qualityButtonDescriptionSelected,
                        ]}
                        numberOfLines={3}
                      >
                        {EXTENSION_DESCRIPTIONS[extension].description}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.keyboardArea}>
            <View style={styles.keyboardControls}>
              <View style={styles.octaveStepper}>
                <Pressable
                  style={({ pressed }) => [
                    styles.stepperButton,
                    pressed && { opacity: 0.5 },
                    octave <= 1 && styles.stepperButtonDisabled,
                  ]}
                  onPress={() => setOctave(Math.max(1, octave - 1))}
                  disabled={octave <= 1}
                >
                  <Text
                    style={[
                      styles.stepperButtonText,
                      octave <= 1 && styles.stepperButtonTextDisabled,
                    ]}
                  >
                    −
                  </Text>
                </Pressable>
                <Text style={styles.octaveDisplay}>{octave}</Text>
                <Pressable
                  style={[
                    styles.stepperButton,
                    octave >= 8 && styles.stepperButtonDisabled,
                  ]}
                  onPress={() => setOctave(Math.min(8, octave + 1))}
                  disabled={octave >= 8}
                >
                  <Text
                    style={[
                      styles.stepperButtonText,
                      octave >= 8 && styles.stepperButtonTextDisabled,
                    ]}
                  >
                    +
                  </Text>
                </Pressable>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.keyButton,
                  pressed && { opacity: 0.5 },
                ]}
                onPress={() => {
                  router.navigate("/key-modal");
                }}
              >
                <Text style={styles.keyButtonText}>
                  Key: {selectedKey || "All"}
                </Text>
              </Pressable>
            </View>
            <Keyboard
              octave={octave}
              onNotePressIn={handleNotePressIn}
              onNotePressOut={handleNotePressOut}
              selectedKey={selectedKey || null}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F1E8", // Cream/beige like keyboard body
  },
  content: {
    flex: 1,
  },
  noDeviceContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  deviceIcon: {
    marginBottom: 20,
  },
  noDeviceText: {
    fontSize: 18,
    color: "#6B5B47", // Warm brown
    textAlign: "center",
    marginBottom: 8,
  },
  noDeviceSubtext: {
    fontSize: 14,
    color: "#8A7B6B", // Muted brown
    textAlign: "center",
    marginBottom: 20,
  },
  deviceButton: {
    backgroundColor: "#E89D45", // Warm orange like active buttons
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  deviceButtonText: {
    color: "#F5F1E8", // Cream text
    fontSize: 16,
    fontWeight: "bold",
  },
  header: {
    flexDirection: "column",
    backgroundColor: "#1C1C1E",
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  headerContent: {
    width: "100%",
  },
  headerTitle: {
    color: "#F5F1E8",
    fontSize: 40,
    fontWeight: "bold",
    marginTop: 48,
  },
  headerSubtitle: {
    color: "#E89D45",
    fontSize: 20,
    marginTop: 8,
  },
  headerButton: {
    padding: 6,
    position: "absolute",
    right: 16,
    top: 8,
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  headerButtonContent: {
    position: "relative",
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  chipIcon: {
    opacity: 0.9,
  },
  connectionIndicator: {
    position: "absolute",
    right: -10,
    top: -10,
    backgroundColor: "#1C1C1E",
    borderRadius: 6,
    padding: 1,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  connectionIcon: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
  },
  controlsArea: {
    flex: 1,
  },
  chordQualityContainer: {
    marginHorizontal: 0,
    paddingHorizontal: 16,
    marginBottom: 15,
    backgroundColor: "#1C1C1E",
    paddingVertical: 15,
    // borderRadius: 12,
    borderWidth: 2,
    borderColor: "#2A2A2A",
  },
  qualitySection: {
    marginBottom: 15,
  },
  qualitySelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  qualityButton: {
    width: "23%",
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#404040",
    backgroundColor: "#2A2A2A",
    overflow: "hidden",
    padding: 10,
  },
  qualityButtonContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  qualityButtonSelected: {
    borderColor: "#E89D45",
    backgroundColor: "#E89D45",
  },
  qualityButtonText: {
    color: "#F5F1E8",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  qualityButtonTextSelected: {
    color: "#1C1C1E",
  },
  qualityButtonDescription: {
    color: "#999",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 14,
  },
  qualityButtonDescriptionSelected: {
    color: "#1C1C1E",
    opacity: 0.7,
  },
  keyboardArea: {
    // This will contain octave controls and keyboard
  },
  keyboardControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  octaveStepper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    padding: 4,
  },
  stepperButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 6,
  },
  stepperButtonDisabled: {
    backgroundColor: "#1C1C1E",
    opacity: 0.5,
  },
  stepperButtonText: {
    color: "#E89D45",
    fontSize: 20,
    fontWeight: "bold",
  },
  stepperButtonTextDisabled: {
    color: "#8A7B6B",
  },
  octaveDisplay: {
    color: "#F5F1E8",
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 12,
  },
  keyButton: {
    backgroundColor: "#1C1C1E",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  keyButtonText: {
    color: "#E89D45",
    fontSize: 16,
    fontWeight: "bold",
  },
});
