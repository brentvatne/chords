import { Ionicons } from '@expo/vector-icons';
import Color from 'color';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMidi } from '../contexts/MidiContext';
import {
  ExtensionType,
  MusicalNoteWithOctave,
  TriadType,
  chordToMidiNotes,
  getChordInfo
} from '../utils/chords';
import { getNoteWithoutOctave, isNoteInKey } from '../utils/keys';

async function playNotesAsync(keyboard: any, midiNotes: number[], velocity: number, duration: number) {
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

interface KeyboardProps {
  octave: number;
  onNotePress: (note: string) => void;
  selectedKey: string | null;
}

function Keyboard({ octave, onNotePress, selectedKey }: KeyboardProps) {
  const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C']; // Always show 8 keys
  const [keyboardWidth, setKeyboardWidth] = useState(0);

  const whiteKeyWidth = keyboardWidth > 0 ? keyboardWidth / whiteKeys.length : 0;

  const blackKeyPositions = [
    { note: 'C#', offsetFactor: 1, octaveOffset: 0 }, 
    { note: 'D#', offsetFactor: 2, octaveOffset: 0 }, 
    { note: 'F#', offsetFactor: 4, octaveOffset: 0 }, 
    { note: 'G#', offsetFactor: 5, octaveOffset: 0 }, 
    { note: 'A#', offsetFactor: 6, octaveOffset: 0 }, 
    { note: 'C#', offsetFactor: 8, octaveOffset: 1 }, // Always show, but may be disabled
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
          const keyOctave = (note === 'C' && index === 7) ? octave + 1 : octave;
          const noteWithOctave = `${note}${keyOctave}`;
          const isDisabled = isNoteDisabled(noteWithOctave, keyOctave);
          
          return (
            <Pressable
              key={`${note}-${index}`} // Use index to differentiate the two C keys
              style={[styles.whiteKey, isDisabled && styles.whiteKeyDisabled]}
              onPress={isDisabled ? undefined : () => onNotePress(noteWithOctave)}
              disabled={isDisabled}
            >
              <View style={styles.keyLabelContainer}>
                {note === 'C' && !isDisabled && <Text style={styles.octaveText}>{keyOctave}</Text>}
                {!isDisabled && <Text style={styles.whiteKeyText}>{note}</Text>}
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Black keys */}
      {keyboardWidth > 0 && (
        <View style={styles.blackKeysContainer}>
          {blackKeyPositions.map(({ note, offsetFactor, octaveOffset }) => {
            const keyOctave = octave + octaveOffset;
            const noteWithOctave = `${note}${keyOctave}`;
            const isDisabled = isNoteDisabled(noteWithOctave, keyOctave);
            
            return (
              <Pressable
                key={`${note}-${octaveOffset}`} // Make key unique for multiple C# keys
                style={[
                  styles.blackKey,
                  { left: (whiteKeyWidth * offsetFactor) - (styles.blackKey.width / 2) },
                  isDisabled && styles.blackKeyDisabled,
                ]}
                onPress={isDisabled ? undefined : () => onNotePress(noteWithOctave)}
                disabled={isDisabled}
              >
                {!isDisabled && <Text style={styles.blackKeyText}>{note}</Text>}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const TRIAD_TYPES: TriadType[] = ['dim', 'minor', 'major', 'sus'];
const EXTENSION_TYPES: ExtensionType[] = ['6', 'm7', 'M7', '9'];

export default function PlayScreen() {
  const { selectedKey } = useLocalSearchParams<{ selectedKey: string }>();
  const { connectedDevice, keyboard } = useMidi();
  const [octave, setOctave] = useState(4);
  const [selectedTriad, setSelectedTriad] = useState<TriadType>('major');
  const [selectedExtensions, setSelectedExtensions] = useState<ExtensionType[]>([]);
  const [currentChordInfo, setCurrentChordInfo] = useState<{ name: string; notes: string[] } | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!connectedDevice) {
      router.push('/device-modal');
    }
  }, [connectedDevice]);

  const handleNotePress = async (noteNameWithOctave: string) => {
    try {
      const rootNote = noteNameWithOctave as MusicalNoteWithOctave;
      const selection = {
        triad: selectedTriad,
        extensions: selectedExtensions
      };
      
      // Get chord info for display
      const displayInfo = getChordInfo(selection, rootNote);
      setCurrentChordInfo(displayInfo);

      // Get MIDI notes using the dedicated function and play them
      const midiNotesToPlay = chordToMidiNotes(selection, rootNote);
      if (midiNotesToPlay.length > 0) {
        await playNotesAsync(keyboard, midiNotesToPlay, 100, 700);
      } else if (displayInfo) {
        console.warn(`Could not play MIDI for ${displayInfo.name}, but display info was generated.`);
      }

    } catch (error) {
      console.error(`Error in handleNotePress with selection ${JSON.stringify({ triad: selectedTriad, extensions: selectedExtensions })} and root ${noteNameWithOctave}:`, error);
      setCurrentChordInfo(null);
      alert(`Could not process chord. Please try again.`);
    }
  };

  const toggleExtension = (extension: ExtensionType) => {
    setSelectedExtensions(prev => 
      prev.includes(extension)
        ? prev.filter(e => e !== extension)
        : [...prev, extension]
    );
  };

  if (!connectedDevice) {
    return (
      <SafeAreaView style={styles.noDeviceContainer}>
        <Text style={styles.noDeviceText}>No MIDI device connected</Text>
        <Text style={styles.noDeviceSubtext}>
          To play notes on the keyboard, please connect to a MIDI device first.
        </Text>
        <Pressable 
          style={styles.deviceButton}
          onPress={() => router.push('/device-modal')}
        >
          <Text style={styles.deviceButtonText}>Connect Device</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <View style={[styles.header, { paddingTop: insets.top / 2 }]}>
          <Pressable 
            onPress={() => router.push('/device-modal')}
            style={[styles.headerButton, { top: insets.top + 4 }]}
          >
            <View style={styles.headerButtonContent}>
              <Ionicons 
                name="hardware-chip-outline" 
                size={20} 
                color="#E89D45" 
                style={styles.chipIcon}
              />
              {connectedDevice && (
                <View style={styles.connectionIndicator}>
                  <Ionicons 
                    name="checkmark-circle-sharp" 
                    size={11} 
                    color="#4CAF50" 
                    style={styles.connectionIcon}
                  />
                </View>
              )}
            </View>
          </Pressable>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>
              {currentChordInfo ? currentChordInfo.name : 'Play a chord'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {currentChordInfo ? currentChordInfo.notes.join(', ') : 'Notes will appear here'}
            </Text>
          </View>
        </View>

        <View style={styles.controlsArea}>
          <View style={styles.chordQualityContainer}>
            <View style={styles.qualitySection}>
              <View style={styles.qualitySelector}>
                {TRIAD_TYPES.map(triad => (
                  <Pressable
                    key={triad}
                    style={[
                      styles.qualityButton,
                      selectedTriad === triad && styles.qualityButtonSelected
                    ]}
                    onPress={() => setSelectedTriad(triad)}
                  >
                    <Text 
                      style={[
                        styles.qualityButtonText,
                        selectedTriad === triad && styles.qualityButtonTextSelected
                      ]}
                    >
                      {triad === 'dim' ? 'Dim' : 
                       triad === 'minor' ? 'Min' : 
                       triad === 'major' ? 'Maj' : 
                       'Sus'}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.qualitySection}>
              <View style={styles.qualitySelector}>
                {EXTENSION_TYPES.map(extension => (
                  <Pressable
                    key={extension}
                    style={[
                      styles.qualityButton,
                      selectedExtensions.includes(extension) && styles.qualityButtonSelected
                    ]}
                    onPress={() => toggleExtension(extension)}
                  >
                    <Text 
                      style={[
                        styles.qualityButtonText,
                        selectedExtensions.includes(extension) && styles.qualityButtonTextSelected
                      ]}
                    >
                      {extension}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.keyboardArea}>
            <View style={styles.keyboardControls}>
              <View style={styles.octaveStepper}>
                <Pressable 
                  style={[styles.stepperButton, octave <= 1 && styles.stepperButtonDisabled]}
                  onPress={() => setOctave(Math.max(1, octave - 1))}
                  disabled={octave <= 1}
                >
                  <Text style={[
                    styles.stepperButtonText,
                    octave <= 1 && styles.stepperButtonTextDisabled
                  ]}>−</Text>
                </Pressable>
                <Text style={styles.octaveDisplay}>{octave}</Text>
                <Pressable 
                  style={[styles.stepperButton, octave >= 8 && styles.stepperButtonDisabled]}
                  onPress={() => setOctave(Math.min(8, octave + 1))}
                  disabled={octave >= 8}
                >
                  <Text style={[
                    styles.stepperButtonText,
                    octave >= 8 && styles.stepperButtonTextDisabled
                  ]}>+</Text>
                </Pressable>
              </View>

              <Pressable 
                style={styles.keyButton}
                onPress={() => {
                  router.push('/key-modal');
                }}
              >
                <Text style={styles.keyButtonText}>Key: {selectedKey || 'All'}</Text>
              </Pressable>
            </View>
            <Keyboard octave={octave} onNotePress={handleNotePress} selectedKey={selectedKey || null} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1E8', // Cream/beige like keyboard body
  },
  content: {
    flex: 1,
  },
  noDeviceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  deviceIcon: {
    marginBottom: 20,
  },
  noDeviceText: {
    fontSize: 18,
    color: '#6B5B47', // Warm brown
    textAlign: 'center',
    marginBottom: 8,
  },
  noDeviceSubtext: {
    fontSize: 14,
    color: '#8A7B6B', // Muted brown
    textAlign: 'center',
    marginBottom: 20,
  },
  deviceButton: {
    backgroundColor: '#E89D45', // Warm orange like active buttons
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  deviceButtonText: {
    color: '#F5F1E8', // Cream text
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'column',
    backgroundColor: '#1C1C1E',
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  headerContent: {
    width: '100%',
  },
  headerTitle: {
    color: '#F5F1E8',
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 48,
  },
  headerSubtitle: {
    color: '#E89D45',
    fontSize: 20,
    marginTop: 8,
  },
  headerButton: {
    padding: 6,
    position: 'absolute',
    right: 16,
    top: 8,
    backgroundColor: '#2A2A2A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  headerButtonContent: {
    position: 'relative',
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipIcon: {
    opacity: 0.9,
  },
  connectionIndicator: {
    position: 'absolute',
    right: -3,
    top: -3,
    backgroundColor: '#1C1C1E',
    borderRadius: 6,
    padding: 1,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  connectionIcon: {
    shadowColor: '#000',
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
    backgroundColor: '#1C1C1E',
    paddingVertical: 15,
    // borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2A2A2A',
  },
  qualitySection: {
    marginBottom: 15,
  },
  qualitySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  qualityButton: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#404040',
    backgroundColor: '#2A2A2A', // Dark gray like inactive buttons
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  qualityButtonSelected: {
    borderColor: '#E89D45',
    backgroundColor: '#E89D45', // Warm orange for selected
  },
  qualityButtonText: {
    color: '#F5F1E8', // Cream text
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  qualityButtonTextSelected: {
    color: '#1C1C1E', // Dark text on orange background
  },
  keyboardArea: {
    // This will contain octave controls and keyboard
  },
  keyboardControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  octaveStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    padding: 4,
  },
  stepperButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 6,
  },
  stepperButtonDisabled: {
    backgroundColor: '#1C1C1E',
    opacity: 0.5,
  },
  stepperButtonText: {
    color: '#E89D45',
    fontSize: 20,
    fontWeight: 'bold',
  },
  stepperButtonTextDisabled: {
    color: '#8A7B6B',
  },
  octaveDisplay: {
    color: '#F5F1E8',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 12,
  },
  keyButton: {
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  keyButtonText: {
    color: '#E89D45',
    fontSize: 16,
    fontWeight: 'bold',
  },
  keyboard: {
    height: 220, 
    marginHorizontal: 0, 
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#D4C4A8', // Warm beige border
  },
  whiteKeysContainer: {
    flexDirection: 'row',
    height: '100%',
  },
  whiteKey: {
    flex: 1,
    backgroundColor: '#FEFCF8',
    borderWidth: 1,
    borderColor: '#D4C4A8',
    borderRadius: 5,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10,
    marginHorizontal: 1,
  },
  whiteKeyText: {
    fontSize: 15, 
    fontWeight: 'bold',
    color: '#2A2A2A', // Dark gray
  },
  octaveText: {
    fontSize: 11, 
    color: '#8A7B6B', // Muted brown
    fontWeight: '600',
    marginBottom: 2, // Small gap between octave and note
  },
  blackKeysContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%', 
  },
  blackKey: {
    position: 'absolute',
    width: 28,
    height: '100%',
    backgroundColor: '#1C1C1E',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#0A0A0A',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 8,
    zIndex: 1,
  },
  blackKeyText: {
    color: '#F5F1E8', // Cream text
    fontSize: 11, 
    fontWeight: 'bold',
    marginBottom: 2,
  },
  keyLabelContainer: {
    alignItems: 'center',
  },
  whiteKeyDisabled: {
    backgroundColor: Color('#FEFCF8').darken(0.1).hex(),
    borderColor: Color('#D4C4A8').darken(0.1).hex(),
  },
  blackKeyDisabled: {
    backgroundColor: Color('#1C1C1E').lighten(1.5).hex(),
    borderColor: Color('#0A0A0A').lighten(1.5).hex(),
  },
}); 