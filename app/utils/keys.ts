import { Note, Scale } from "tonal";
import type { MusicalNote } from "../../app/utils/chords";

// We'll generate this dynamically now using Tonal
const NOTES_IN_MAJOR_KEYS: Record<string, string[]> = {};

// Initialize the keys map with all possible keys
[
  "C",
  "G",
  "D",
  "A",
  "E",
  "B",
  "F#",
  "C#",
  "G#",
  "F",
  "Bb",
  "Eb",
  "Ab",
  "Db",
  "Gb",
  "Cb",
].forEach((key) => {
  // Get the scale notes for this key
  const scale = Scale.get(`${key} major`).notes;
  NOTES_IN_MAJOR_KEYS[key] = scale;

  // Add enharmonic equivalents
  const enharmonic = Note.enharmonic(key);
  if (enharmonic !== key) {
    NOTES_IN_MAJOR_KEYS[enharmonic] = scale;
  }
});

// Special cases for keys that use double sharps
NOTES_IN_MAJOR_KEYS["G#"] = ["G#", "A#", "B#", "C#", "D#", "E#", "F"];
NOTES_IN_MAJOR_KEYS["Ab"] = ["Ab", "Bb", "C", "Db", "Eb", "F", "G"];

NOTES_IN_MAJOR_KEYS["A#"] = ["A#", "B#", "C", "D#", "E#", "F", "G"];
NOTES_IN_MAJOR_KEYS["Bb"] = ["Bb", "C", "D", "Eb", "F", "G", "A"];

NOTES_IN_MAJOR_KEYS["B#"] = ["B#", "C#", "D", "E#", "F#", "G", "A"];
NOTES_IN_MAJOR_KEYS["Cb"] = ["Cb", "Db", "Eb", "Fb", "Gb", "Ab", "Bb"];

// Additional sharp key definitions
NOTES_IN_MAJOR_KEYS["F#"] = ["F#", "G#", "A#", "B", "C#", "D#", "E#"];
NOTES_IN_MAJOR_KEYS["B"] = ["B", "C#", "D#", "E", "F#", "G#", "A#"];

// Add support for minor keys
const NOTES_IN_MINOR_KEYS: Record<string, string[]> = {
  // Natural minor keys (parallel to major keys)
  Am: ["A", "B", "C", "D", "E", "F", "G"],
  Em: ["E", "F#", "G", "A", "B", "C", "D"],
  Bm: ["B", "C#", "D", "E", "F#", "G", "A"],
  "F#m": ["F#", "G#", "A", "B", "C#", "D", "E"],
  "C#m": ["C#", "D#", "E", "F#", "G#", "A", "B"],
  "G#m": ["G#", "A#", "B", "C#", "D#", "E", "F#"],
  "D#m": ["D#", "E#", "F#", "G#", "A#", "B", "C#"],
  "A#m": ["A#", "B#", "C#", "D#", "E#", "F#", "G#"],
  Dm: ["D", "E", "F", "G", "A", "Bb", "C"],
  Gm: ["G", "A", "Bb", "C", "D", "Eb", "F"],
  Cm: ["C", "D", "Eb", "F", "G", "Ab", "Bb"],
  Fm: ["F", "G", "Ab", "Bb", "C", "Db", "Eb"],
  Bbm: ["Bb", "C", "Db", "Eb", "F", "Gb", "Ab"],
  Ebm: ["Eb", "F", "Gb", "Ab", "Bb", "Cb", "Db"],
  Abm: ["Ab", "Bb", "Cb", "Db", "Eb", "Fb", "Gb"],
  Dbm: ["Db", "Eb", "E", "Gb", "Ab", "A", "B"],
  Gbm: ["Gb", "Ab", "A", "B", "Db", "D", "E"],
};

export function getNoteWithoutOctave(noteWithOctave: string): MusicalNote {
  // Remove any octave number from the note
  const note = Note.get(noteWithOctave).pc;
  if (!note) return "C" as MusicalNote; // Fallback to C if parsing fails
  return note as MusicalNote;
}

export function isNoteInKey(note: string, key: string): boolean {
  const noteWithoutOctave = getNoteWithoutOctave(note);
  const keyNotes = _getNotesInKey(key);
  return keyNotes.includes(noteWithoutOctave);
}

// For testing
export function _getNotesInKey(key: string): string[] {
  // Check minor keys first
  if (NOTES_IN_MINOR_KEYS[key]) {
    return NOTES_IN_MINOR_KEYS[key];
  }

  // Check major keys
  if (NOTES_IN_MAJOR_KEYS[key]) {
    return NOTES_IN_MAJOR_KEYS[key];
  }

  // If not in our predefined lists, try to generate using Tonal.js
  const scale = Scale.get(`${key} major`);
  if (scale && scale.notes && scale.notes.length > 0) {
    return scale.notes.map(getNoteWithoutOctave);
  }

  // Try minor scale if major didn't work
  const minorScale = Scale.get(`${key} minor`);
  if (minorScale && minorScale.notes && minorScale.notes.length > 0) {
    return minorScale.notes.map(getNoteWithoutOctave);
  }

  return [];
}

// Additional special cases for problematic enharmonic keys
NOTES_IN_MAJOR_KEYS["C#"] = ["C#", "D#", "E#", "F#", "G#", "A#", "B#"];
