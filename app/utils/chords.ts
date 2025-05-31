import { KeySignature } from "./music-theory";

export type MusicalNote =
  | "C"
  | "C♯"
  | "C#"
  | "D"
  | "D♯"
  | "D#"
  | "E"
  | "F"
  | "F♯"
  | "F#"
  | "G"
  | "G♯"
  | "G#"
  | "A"
  | "A♯"
  | "A#"
  | "B"
  | "E♭"
  | "Eb"
  | "A♭"
  | "Ab"
  | "B♭"
  | "Bb"
  | "D♭"
  | "Db"
  | "G♭"
  | "Gb"
  | "C♭"
  | "Cb"
  | "F♭"
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
  dim: {
    shortName: "dim",
    description: "Dark and unstable",
    shortDescription: "Dark, tense",
  },
  minor: {
    shortName: "min",
    description: "Soft and melancholic",
    shortDescription: "Soft, sad",
  },
  major: {
    shortName: "maj",
    description: "Bright and stable",
    shortDescription: "Bright, happy",
  },
  sus: {
    shortName: "sus",
    description: "Open and ambiguous",
    shortDescription: "Open, neutral",
  },
};

export const EXTENSION_DESCRIPTIONS: Record<ExtensionType, ChordDescription> = {
  "6": {
    shortName: "6",
    description: "Sweet and gentle",
    shortDescription: "Sweet, gentle",
  },
  m7: {
    shortName: "m7",
    description: "Soft and jazzy",
    shortDescription: "Soft, jazzy",
  },
  M7: {
    shortName: "M7",
    description: "Bright and complex",
    shortDescription: "Bright, rich",
  },
  "9": {
    shortName: "9",
    description: "Rich and colorful",
    shortDescription: "Rich, full",
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
  "C♯": 1,
  "C#": 1,
  D: 2,
  "D♯": 3,
  "D#": 3,
  E: 4,
  F: 5,
  "F♯": 6,
  "F#": 6,
  G: 7,
  "G♯": 8,
  "G#": 8,
  A: 9,
  "A♯": 10,
  "A#": 10,
  B: 11,
  "E♭": 3,
  Eb: 3,
  "A♭": 8,
  Ab: 8,
  "B♭": 10,
  Bb: 10,
  "D♭": 1,
  Db: 1,
  "G♭": 6,
  Gb: 6,
  "C♭": 11,
  Cb: 11,
  "F♭": 4,
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

  // Convert MIDI notes back to note names with octaves
  const octave = parseInt(rootNoteWithOctave.match(/\d+/)?.[0] ?? "4", 10);
  const notes = midiNotes.map((midi, index) => {
    const noteNum = midi % 12;
    const noteName = Object.entries(NOTE_TO_MIDI_NUMBER).find(
      ([, value]) => value === noteNum,
    )?.[0];
    const noteOctave = octave + (index > 2 ? 1 : 0);
    return `${noteName}${noteOctave}` as MusicalNoteWithOctave;
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
  // MIDI note 60 = C4, so the formula is: (octave + 1) * 12 + noteNumber
  const rootMidi = NOTE_TO_MIDI_NUMBER[rootNote] + (octave + 1) * 12;

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
  note: MusicalNoteWithOctave,
  key: KeySignature | null,
): TriadType | null {
  if (!key) return null;

  // Extract the note name without octave
  const noteName = note.replace(/\d+/, "");
  const noteIndex = key.notes.indexOf(noteName);
  if (noteIndex === -1) return null;

  // Get the chord for this position
  const chordPositions = ["I", "II", "III", "IV", "V", "VI", "VII"] as const;
  const chord = key.chords[chordPositions[noteIndex]];

  // Extract the triad type from the chord name
  if (chord.endsWith("dim")) return "dim";
  if (chord.endsWith("m")) return "minor";
  if (chord.endsWith("sus")) return "sus";
  return "major";
}
