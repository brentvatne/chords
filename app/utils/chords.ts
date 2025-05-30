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

export interface ChordQualityDescription {
  shortName: string; // Display name (e.g., "Maj", "Min")
  fullName: string; // Full name (e.g., "Major", "Minor")
  description: string; // Emotional/musical quality description
}

export const CHORD_QUALITY_DESCRIPTIONS: Record<
  TriadType,
  ChordQualityDescription
> = {
  major: {
    shortName: "Maj",
    fullName: "Major",
    description: "Bright, happy, resolved.",
  },
  minor: {
    shortName: "Min",
    fullName: "Minor",
    description: "Dark, melancholic, introspective.",
  },
  dim: {
    shortName: "Dim",
    fullName: "Diminished",
    description: "Tense, dramatic, and unsettling.",
  },
  sus: {
    shortName: "Sus",
    fullName: "Suspended",
    description: "Unstable, open-ended, leading to resolution.",
  },
};

export const EXTENSION_DESCRIPTIONS: Record<
  ExtensionType,
  ChordQualityDescription
> = {
  "6": {
    shortName: "6",
    fullName: "Sixth",
    description: "Sweet and gentle, adds warmth.",
  },
  m7: {
    shortName: "m7",
    fullName: "Minor Seventh",
    description: "Smooth and jazzy, creates flow.",
  },
  M7: {
    shortName: "M7",
    fullName: "Major Seventh",
    description: "Lush and dreamy, adds sophistication.",
  },
  "9": {
    shortName: "9",
    fullName: "Ninth",
    description: "Rich and complex, adds color.",
  },
};

interface ChordSelection {
  triad: TriadType;
  extensions: ExtensionType[];
}

interface ChordInfo {
  name: string;
  notes: string[];
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
    ...TRIAD_INTERVALS[selection.triad],
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
    ...TRIAD_INTERVALS[selection.triad],
    ...selection.extensions.flatMap((ext) => EXTENSION_INTERVALS[ext]),
  ];

  // Convert intervals to MIDI note numbers
  return intervals.map((interval) => rootMidi + interval);
}

function getNoteWithoutOctave(noteWithOctave: string): MusicalNote {
  return noteWithOctave.replace(/\d+$/, "") as MusicalNote;
}
