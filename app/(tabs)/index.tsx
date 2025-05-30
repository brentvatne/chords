import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMidi } from '../../contexts/MidiContext';
import {
  ExtensionType,
  MusicalNoteWithOctave,
  TriadType,
  chordToMidiNotes,
  getChordInfo
} from '../../utils/chords';

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
}

function Keyboard({ octave, onNotePress }: KeyboardProps) {
  const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const [keyboardWidth, setKeyboardWidth] = useState(0);

  const whiteKeyWidth = keyboardWidth > 0 ? keyboardWidth / whiteKeys.length : 0;

  const blackKeyPositions = [
    { note: 'C#', offsetFactor: 1 }, 
    { note: 'D#', offsetFactor: 2 }, 
    { note: 'F#', offsetFactor: 4 }, 
    { note: 'G#', offsetFactor: 5 }, 
    { note: 'A#', offsetFactor: 6 }, 
  ];

  return (
    <View 
      style={styles.keyboard}
      onLayout={(event) => {
        setKeyboardWidth(event.nativeEvent.layout.width);
      }}
    >
      {/* White keys */}
      <View style={styles.whiteKeysContainer}>
        {whiteKeys.map((note) => (
          <Pressable
            key={note}
            style={styles.whiteKey}
            onPress={() => onNotePress(`${note}${octave}`)}
          >
            <Text style={styles.whiteKeyText}>{note}</Text>
            {note === 'C' && <Text style={styles.octaveText}>{octave}</Text>}
          </Pressable>
        ))}
      </View>

      {/* Black keys */}
      {keyboardWidth > 0 && (
        <View style={styles.blackKeysContainer}>
          {blackKeyPositions.map(({ note, offsetFactor }) => (
            <Pressable
              key={note}
              style={[
                styles.blackKey,
                { left: (whiteKeyWidth * offsetFactor) - (styles.blackKey.width / 2) }, 
              ]}
              onPress={() => onNotePress(`${note}${octave}`)}
            >
              <Text style={styles.blackKeyText}>{note}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const TRIAD_TYPES: TriadType[] = ['dim', 'minor', 'major', 'sus'];
const EXTENSION_TYPES: ExtensionType[] = ['6', 'm7', 'M7', '9'];

export default function PlayScreen() {
  const { connectedDevice, keyboard } = useMidi();
  const [octave, setOctave] = useState(4);
  const [selectedTriad, setSelectedTriad] = useState<TriadType>('major');
  const [selectedExtensions, setSelectedExtensions] = useState<ExtensionType[]>([]);
  const [currentChordInfo, setCurrentChordInfo] = useState<{ name: string; notes: string[] } | null>(null);

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
      <SafeAreaView style={styles.centeredContainer}>
        <Text style={styles.noDeviceTitle}>No MIDI device connected</Text>
        <Text style={styles.noDeviceSubtitle}>
          To play notes on the keyboard, please connect to a MIDI device first.
        </Text>
        <Pressable 
          style={styles.deviceButton}
          onPress={() => {
            // User can manually navigate to the device tab
          }}
        >
          <Text style={styles.deviceButtonText}>Go to Device Tab</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.chordDisplayArea}>
        {currentChordInfo ? (
          <>
            <Text style={styles.chordNameText}>{currentChordInfo.name}</Text>
            <Text style={styles.chordNotesText}>{currentChordInfo.notes.join(', ')}</Text>
          </>
        ) : (
          <View style={styles.chordPlaceholder}>
            <Text style={styles.chordNameText}>Play a chord</Text>
            <Text style={styles.chordNotesText}>Notes will appear here</Text>
          </View>
        )}
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
          <View style={styles.octaveControls}>
            <Pressable 
              style={styles.octaveButton}
              onPress={() => setOctave(Math.max(1, octave - 1))}
              disabled={octave <= 1}
            >
              <Ionicons name="chevron-back-outline" size={28} color={octave <= 1 ? styles.disabledText.color : styles.octaveButtonText.color} />
            </Pressable>
            
            <Pressable 
              style={styles.octaveButton}
              onPress={() => setOctave(Math.min(8, octave + 1))}
              disabled={octave >= 8}
            >
              <Ionicons name="chevron-forward-outline" size={28} color={octave >= 8 ? styles.disabledText.color : styles.octaveButtonText.color} />
            </Pressable>
          </View>
          <Keyboard octave={octave} onNotePress={handleNotePress} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5, 
    backgroundColor: '#f5f5f5',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  chordDisplayArea: {
    paddingTop: 20, 
    paddingBottom: 15,
    alignItems: 'center',
    justifyContent: 'center', // Added for vertical centering
    minHeight: 80, // Adjusted minHeight for two lines of text
  },
  chordPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5, // Make placeholder less prominent
  },
  chordNameText: {
    fontSize: 26, // Slightly adjusted size
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  chordNotesText: {
    fontSize: 15, // Slightly adjusted size
    color: '#555',
    textAlign: 'center',
  },
  controlsArea: {
    flex: 1, 
    justifyContent: 'flex-end', 
  },
  noDeviceTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  noDeviceSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  deviceButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  deviceButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chordQualityContainer: {
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 12,
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
    borderColor: '#333',
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  qualityButtonSelected: {
    borderColor: '#E89D45',
    backgroundColor: '#E89D45',
  },
  qualityButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  qualityButtonTextSelected: {
    color: '#fff',
  },
  keyboardArea: {
    // This will contain octave controls and keyboard
  },
  octaveControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 8, 
  },
  octaveButton: {
    padding: 8, 
  },
  octaveButtonText: {
    color: '#007AFF', 
    fontSize: 14,
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#ccc',
  },
  keyboard: {
    height: 220, 
    marginHorizontal: 0, 
    position: 'relative', 
  },
  whiteKeysContainer: {
    flexDirection: 'row',
    height: '100%',
  },
  whiteKey: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 5, 
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10, 
    marginHorizontal: 1, 
  },
  whiteKeyText: {
    fontSize: 15, 
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#333',
  },
  octaveText: {
    fontSize: 11, 
    color: '#666',
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
    backgroundColor: '#333', 
    borderRadius: 4, 
    borderWidth: 1,
    borderColor: '#222',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 8, 
    zIndex: 1, 
  },
  blackKeyText: {
    color: '#fff',
    fontSize: 11, 
    fontWeight: 'bold',
    marginBottom: 2,
  },
}); 