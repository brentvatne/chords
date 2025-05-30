import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Chord, Note } from 'tonal';
import { useMidi } from '../../contexts/MidiContext';

type ChordQuality = 'major' | 'minor' | 'diminished' | 'augmented' | 'dominant' | 'minor-seventh' | 'major-seventh' | 'diminished-seventh' | 'augmented-seventh';
type MusicalNote = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';
type MusicalNoteWithOctave = `${MusicalNote}${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`;

interface ChordInfo {
  name: string;
  notes: string[];
  root: string;
  quality: string;
}

// Maps our descriptive ChordQuality to Tonal-compatible chord type symbols
function mapQualityToTonalType(quality: ChordQuality): string {
  switch (quality) {
    case 'major': return 'M'; // Tonal prefers M for major triads, or use 'major' if it works
    case 'minor': return 'm'; // Tonal prefers m for minor triads
    case 'diminished': return 'dim';
    case 'augmented': return 'aug';
    case 'dominant': return '7'; // Dominant usually implies the 7th
    case 'minor-seventh': return 'm7';
    case 'major-seventh': return 'M7'; // or 'maj7'
    case 'diminished-seventh': return 'dim7'; // or 'o7'
    case 'augmented-seventh': return 'aug7'; // or '+7'
    default: return quality; // Fallback, though should not happen with defined types
  }
}

function getChordFullName(tonic: string, type: string, qualityInput: ChordQuality): string {
  // Use qualityInput for more descriptive naming if tonal's type is too terse (e.g., "M" vs "Major")
  let qualityName = "";
  switch (qualityInput) {
    case 'major': qualityName = "Major"; break;
    case 'minor': qualityName = "Minor"; break;
    case 'diminished': qualityName = "Diminished"; break;
    case 'augmented': qualityName = "Augmented"; break;
    case 'dominant': qualityName = "Dominant 7th"; break;
    case 'minor-seventh': qualityName = "Minor 7th"; break;
    case 'major-seventh': qualityName = "Major 7th"; break;
    case 'diminished-seventh': qualityName = "Diminished 7th"; break;
    case 'augmented-seventh': qualityName = "Augmented 7th"; break;
    default: qualityName = type; // Fallback to tonal's type
  }
  return `${Note.pitchClass(tonic)} ${qualityName}`;
}

function getChordInfo(quality: ChordQuality, root: MusicalNoteWithOctave): ChordInfo | null {
  try {
    const tonalType = mapQualityToTonalType(quality);
    const chordData = Chord.getChord(tonalType, root);
    if (chordData.empty || !chordData.tonic) {
      console.warn(`No chord found or no tonic for ${root} (quality: ${quality}, tonalType: ${tonalType})`);
      return null;
    }
    // For display name, use the original quality selected by the user for better description
    const fullName = getChordFullName(chordData.tonic, chordData.type, quality);

    return {
      name: fullName,
      notes: chordData.notes,
      root: chordData.tonic, 
      quality: chordData.type, 
    };
  } catch (e) {
    console.error("Error in getChordInfo for display:", e);
    return null;
  }
}

function chordToMidiNotes(quality: ChordQuality, root: MusicalNoteWithOctave): number[] {
  try {
    const tonalType = mapQualityToTonalType(quality);
    const chordData = Chord.getChord(tonalType, root);
    if (chordData.empty) {
      console.warn(`Cannot get MIDI notes for ${root} (quality: ${quality}, tonalType: ${tonalType}): chord data is empty.`);
      return [];
    }

    const rootOctave = Note.octave(root);
    if (rootOctave === undefined || rootOctave === null) {
        console.warn(`Root note ${root} is missing an octave for MIDI conversion.`);
        return []; // Cannot proceed without a base octave
    }

    const midiNotes = chordData.notes.map(noteName => {
      let noteWithOctave = noteName;
      const noteDetails = Note.get(noteName);
      // If tonal returns a note without an octave, append the root's octave
      if (noteDetails.oct === undefined || noteDetails.oct === null) {
        noteWithOctave = `${noteDetails.pc}${rootOctave}`;
      }
      return Note.midi(noteWithOctave);
    }).filter((note): note is number => note !== null);

    if (midiNotes.length === 0 && chordData.notes.length > 0) {
        console.warn(`Could not convert any notes to MIDI for ${root} ${quality}. Original notes: ${chordData.notes.join(',')}`);
    }
    return midiNotes;
  } catch(e){
    console.error("Error in chordToMidiNotes:", e);
    return [];
  }
}

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

const ALL_CHORD_QUALITIES: ChordQuality[] = ['major', 'minor', 'diminished', 'augmented', 'dominant', 'minor-seventh', 'major-seventh', 'diminished-seventh', 'augmented-seventh'];

export default function PlayScreen() {
  const { connectedDevice, keyboard } = useMidi();
  const [octave, setOctave] = useState(4);
  const [selectedChordQuality, setSelectedChordQuality] = useState<ChordQuality>('major');
  const [currentChordInfo, setCurrentChordInfo] = useState<ChordInfo | null>(null);

  const handleNotePress = async (noteNameWithOctave: string) => {
    try {
      const rootNote = noteNameWithOctave as MusicalNoteWithOctave;
      
      // Get chord info for display
      const displayInfo = getChordInfo(selectedChordQuality, rootNote);
      setCurrentChordInfo(displayInfo);

      // Get MIDI notes using the dedicated function and play them
      const midiNotesToPlay = chordToMidiNotes(selectedChordQuality, rootNote);
      if (midiNotesToPlay.length > 0) {
        await playNotesAsync(keyboard, midiNotesToPlay, 100, 700);
      } else if (displayInfo) { // If displayInfo was generated but no MIDI notes, it implies an issue
        console.warn(`Could not play MIDI for ${displayInfo.name}, but display info was generated.`);
      }

    } catch (error) {
      console.error(`Error in handleNotePress for ${selectedChordQuality} with root ${noteNameWithOctave}:`, error);
      setCurrentChordInfo(null); 
      alert(`Could not process ${selectedChordQuality} chord. Please try again.`);
    }
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chordQualitySelector}>
            {ALL_CHORD_QUALITIES.map(quality => (
              <Pressable
                key={quality}
                style={[
                  styles.qualityButton,
                  selectedChordQuality === quality && styles.qualityButtonSelected
                ]}
                onPress={() => setSelectedChordQuality(quality)}
              >
                <Text 
                  style={[
                    styles.qualityButtonText,
                    selectedChordQuality === quality && styles.qualityButtonTextSelected
                  ]}
                >
                  {quality.charAt(0).toUpperCase() + quality.slice(1).replace('-seventh', '7').replace('diminished', 'dim').replace('augmented', 'aug').replace('major', 'Maj').replace('minor', 'min')}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
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
  },
  chordQualitySelector: {
    flexDirection: 'row',
    alignItems: 'center', 
    paddingVertical: 10,
  },
  qualityButton: {
    paddingVertical: 8,
    paddingHorizontal: 10, 
    borderRadius: 18,      
    borderWidth: 1,
    borderColor: '#007AFF',
    marginHorizontal: 4,   
    height: 38,            
    justifyContent: 'center',
  },
  qualityButtonSelected: {
    backgroundColor: '#007AFF',
  },
  qualityButtonText: {
    color: '#007AFF',
    fontSize: 12,         
    textAlign: 'center',
  },
  qualityButtonTextSelected: {
    color: 'white',
    fontWeight: 'bold',
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