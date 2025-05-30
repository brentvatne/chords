import { Note, Scale } from "tonal";
import { MusicalNote } from "./chords";

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

// Special case for G# major which uses double sharps
NOTES_IN_MAJOR_KEYS["G#"] = ["G#", "A#", "B#", "C#", "D#", "E#", "F"];
// Its enharmonic equivalent Ab major
NOTES_IN_MAJOR_KEYS["Ab"] = ["Ab", "Bb", "C", "Db", "Eb", "F", "G"];

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

  // Special handling for G# major and its enharmonic Ab major
  if (normalizedKey === "G#" || normalizedKey === "Ab") {
    // When using G# major, we need to be strict about accidentals
    if (key === "G#") {
      // Explicitly disallow G natural
      if (normalizedNote === "G") return false;

      const gsScale = NOTES_IN_MAJOR_KEYS["G#"];
      return gsScale.includes(normalizedNote);
    }

    // When using Ab major, use its scale
    const abScale = NOTES_IN_MAJOR_KEYS["Ab"];
    return abScale.includes(normalizedNote);
  }

  // Get the scale for this key using Tonal
  const scale = Scale.get(`${normalizedKey} major`).notes;

  // Check if the normalized note is in the scale
  return scale.includes(normalizedNote);
}

// For testing
export function _getNotesInKey(key: string): string[] {
  const normalizedKey = Note.get(key).pc;
  if (!normalizedKey) return [];

  // Special case for G# major
  if (normalizedKey === "G#") {
    return NOTES_IN_MAJOR_KEYS["G#"];
  }

  // Special case for Ab major
  if (normalizedKey === "Ab") {
    return NOTES_IN_MAJOR_KEYS["Ab"];
  }

  const scale = Scale.get(`${normalizedKey} major`).notes;
  return scale;
}
