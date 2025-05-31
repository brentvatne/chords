import { Note, Scale } from "tonal";

export type MusicalNote =
  | "C"
  | "C#"
  | "Db"
  | "D"
  | "D#"
  | "Eb"
  | "E"
  | "F"
  | "F#"
  | "Gb"
  | "G"
  | "G#"
  | "Ab"
  | "A"
  | "A#"
  | "Bb"
  | "B"
  | "Cb"
  | "E#"
  | "B#"
  | "Fb";

export type MusicalNoteWithOctave = `${MusicalNote}${number}`;
export type TriadType = "major" | "minor" | "dim" | "sus";
export type ExtensionType = "6" | "m7" | "M7" | "9";

interface ChordDescription {
  shortName: string;
  description: string;
  shortDescription: string; // Added for small screens
}

export const CHORD_QUALITY_DESCRIPTIONS: Record<TriadType, ChordDescription> = {
  major: {
    shortName: "maj",
    description: "A bright, stable chord built on the major third",
    shortDescription: "Bright",
  },
  minor: {
    shortName: "min",
    description: "A darker, more melancholic sound with a minor third",
    shortDescription: "Dark",
  },
  dim: {
    shortName: "dim",
    description: "A tense, unstable sound with two minor thirds",
    shortDescription: "Tense",
  },
  sus: {
    shortName: "sus",
    description: "An open, ambiguous sound without a third",
    shortDescription: "Open",
  },
};

export const EXTENSION_DESCRIPTIONS: Record<ExtensionType, ChordDescription> = {
  "6": {
    shortName: "6",
    description: "Adds a major sixth for a lighter, jazzier sound",
    shortDescription: "Sweet",
  },
  m7: {
    shortName: "7",
    description: "Adds a minor seventh for a bluesy, dominant sound",
    shortDescription: "Bluesy",
  },
  M7: {
    shortName: "maj7",
    description: "Adds a major seventh for a smooth, jazzy sound",
    shortDescription: "Dreamy",
  },
  "9": {
    shortName: "9",
    description: "Adds a ninth for extra color and richness",
    shortDescription: "Rich",
  },
};

export interface ChordSelection {
  triad?: TriadType;
  extensions: ExtensionType[];
}

export interface ChordInfo {
  name: string;
  notes: MusicalNoteWithOctave[];
  root: string;
  quality: string;
}

const TRIAD_INTERVALS: Record<TriadType, number[]> = {
  dim: [0, 3, 6],
  minor: [0, 3, 7],
  major: [0, 4, 7],
  sus: [0, 5, 7],
};

const EXTENSION_INTERVALS: Record<ExtensionType, number[]> = {
  "6": [9],
  m7: [10],
  M7: [11],
  "9": [14],
};

const NOTE_TO_MIDI_NUMBER: Record<MusicalNote, number> = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
  Cb: 11,
  "E#": 5,
  "B#": 0,
  Fb: 4,
};

function getChordName(selection: ChordSelection, rootNote: string): string {
  const { triad, extensions } = selection;
  let name = rootNote;

  // Add triad quality
  switch (triad) {
    case "minor":
      name += "m";
      break;
    case "dim":
      name += "dim";
      break;
    case "sus":
      name += "sus4";
      break;
    // major is implied
  }

  // Add extensions in order
  if (extensions.includes("6")) name += "6";
  if (extensions.includes("m7")) name += "7";
  if (extensions.includes("M7")) name += "maj7";
  if (extensions.includes("9")) name += "9";

  return name;
}

export function getChordInfo(
  selection: ChordSelection,
  rootNoteWithOctave: MusicalNoteWithOctave,
): ChordInfo {
  const rootNote = getNoteWithoutOctave(rootNoteWithOctave);
  const name = getChordName(selection, rootNote);

  // Get all intervals for the chord
  const intervals = [
    ...TRIAD_INTERVALS[selection.triad || "major"],
    ...selection.extensions.flatMap((ext) => EXTENSION_INTERVALS[ext]),
  ];

  // Convert intervals to MIDI note numbers
  const midiNotes = chordToMidiNotes(selection, rootNoteWithOctave);

  // Convert MIDI notes back to note names (this is a simplification)
  const notes = midiNotes.map((midi) => {
    const noteNum = midi % 12;
    const noteName = Object.entries(NOTE_TO_MIDI_NUMBER).find(
      ([, value]) => value === noteNum,
    )?.[0];
    return noteName || "?";
  });

  return {
    name,
    notes,
    root: rootNote,
    quality: CHORD_QUALITY_DESCRIPTIONS[selection.triad || "major"].shortName,
  };
}

export function chordToMidiNotes(
  selection: ChordSelection,
  rootNoteWithOctave: MusicalNoteWithOctave,
): number[] {
  const [rootNote, octaveStr] = rootNoteWithOctave.split(/(\d+)/) as [
    MusicalNote,
    string,
  ];
  const octave = parseInt(octaveStr, 10);
  const rootMidi = NOTE_TO_MIDI_NUMBER[rootNote] + octave * 12;

  // Get all intervals for the chord
  const intervals = [
    ...TRIAD_INTERVALS[selection.triad || "major"],
    ...selection.extensions.flatMap((ext) => EXTENSION_INTERVALS[ext]),
  ];

  // Convert intervals to MIDI note numbers
  return intervals.map((interval) => rootMidi + interval);
}

function getNoteWithoutOctave(noteWithOctave: string): MusicalNote {
  return noteWithOctave.replace(/\d+$/, "") as MusicalNote;
}

export function getTriadForNoteInKey(
  note: string,
  key: string | null,
): TriadType {
  if (!key) {
    // When no key is selected ("All" keys), determine the most natural quality for each note
    const notePC = Note.get(note).pc;
    if (!notePC) return "major";

    // In "All" keys mode, use these common associations:
    switch (notePC) {
      case "C":
      case "F":
      case "G":
        return "major"; // Most commonly major
      case "D":
      case "E":
      case "A":
        return "minor"; // Most commonly minor
      case "B":
        return "dim"; // Often diminished in common keys
      default:
        // For black keys, check if it's more commonly seen as sharp or flat
        const enharmonic = Note.enharmonic(notePC);
        if (enharmonic) {
          // If it has an enharmonic equivalent, check which is more common
          const sharpKeys = ["C#", "D#", "F#", "G#", "A#"];
          const flatKeys = ["Db", "Eb", "Gb", "Ab", "Bb"];
          if (sharpKeys.includes(notePC)) {
            return "major"; // In sharp keys, these are often major
          } else if (flatKeys.includes(notePC)) {
            return "minor"; // In flat keys, these are often minor
          }
        }
        return "major"; // Default to major for any other cases
    }
  }

  // Get the note's position in the scale (1-based index)
  const notePC = Note.get(note).pc;
  const keyPC = Note.get(key).pc;
  if (!notePC || !keyPC) return "major";

  // Special handling for keys that use double sharps
  const specialScales: Record<string, string[]> = {
    "G#": ["G#", "A#", "B#", "C#", "D#", "E#", "F"],
    "A#": ["A#", "B#", "C", "D#", "E#", "F", "G"],
    "B#": ["B#", "C#", "D", "E#", "F#", "G", "A"],
    "C#": ["C#", "D#", "E#", "F#", "G#", "A#", "B#"],
  };

  if (key in specialScales) {
    const scale = specialScales[key];
    const scaleDegree = scale.findIndex((n) => Note.get(n).pc === notePC) + 1;

    // Determine chord quality based on scale degree
    switch (scaleDegree) {
      case 1: // I
      case 4: // IV
      case 5: // V
        return "major";
      case 2: // ii
      case 3: // iii
      case 6: // vi
        return "minor";
      case 7: // vii°
        return "dim";
      default:
        return "major"; // Default to major for notes not in the key
    }
  }

  // For all other keys, use Tonal.js Scale
  const scale = Scale.get(`${key} major`);
  if (!scale.notes.length) return "major"; // Default to major if invalid key

  // Find the scale degree (1-based)
  const scaleDegree =
    scale.notes.findIndex((n) => Note.get(n).pc === notePC) + 1;

  // Determine chord quality based on scale degree
  switch (scaleDegree) {
    case 1: // I
    case 4: // IV
    case 5: // V
      return "major";
    case 2: // ii
    case 3: // iii
    case 6: // vi
      return "minor";
    case 7: // vii°
      return "dim";
    default:
      return "major"; // Default to major for notes not in the key
  }
}
