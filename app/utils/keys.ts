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

NOTES_IN_MAJOR_KEYS["C#"] = ["C#", "D#", "E#", "F#", "G#", "A#", "B#"];
NOTES_IN_MAJOR_KEYS["Db"] = ["Db", "Eb", "F", "Gb", "Ab", "Bb", "C"];

export function getNoteWithoutOctave(noteWithOctave: string): MusicalNote {
  // Remove any octave number from the note
  const note = Note.get(noteWithOctave).pc;
  if (!note) return "C" as MusicalNote; // Fallback to C if parsing fails
  return note as MusicalNote;
}

export function isNoteInKey(note: string, key: string): boolean {
  // Remove any octave number and normalize the note
  const normalizedNote = Note.get(note).pc;
  if (!normalizedNote) return false;

  // Normalize the key
  const normalizedKey = Note.get(key).pc;
  if (!normalizedKey) return false;

  // Special handling for keys that use double sharps
  const specialKeys = ["G#", "A#", "B#", "C#"];
  if (specialKeys.includes(key)) {
    // Explicitly disallow naturals that should be sharp
    const keyScale = NOTES_IN_MAJOR_KEYS[key];
    return keyScale.includes(normalizedNote);
  }

  // For all other keys, use their predefined scales
  const keyScale = NOTES_IN_MAJOR_KEYS[normalizedKey];
  if (keyScale) {
    return keyScale.includes(normalizedNote);
  }

  // If no predefined scale exists, fall back to Tonal.js Scale
  const scale = Scale.get(`${normalizedKey} major`).notes;
  return scale.includes(normalizedNote);
}

// For testing
export function _getNotesInKey(key: string): string[] {
  const normalizedKey = Note.get(key).pc;
  if (!normalizedKey) return [];

  // Special cases for keys that use double sharps
  const specialKeys = ["G#", "A#", "B#", "C#"];
  if (specialKeys.includes(key)) {
    return NOTES_IN_MAJOR_KEYS[key];
  }

  // For all other keys, use their predefined scales
  const keyScale = NOTES_IN_MAJOR_KEYS[normalizedKey];
  if (keyScale) {
    return keyScale;
  }

  // If no predefined scale exists, fall back to Tonal.js Scale
  const scale = Scale.get(`${normalizedKey} major`).notes;
  return scale;
}
