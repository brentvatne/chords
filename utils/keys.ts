// All possible notes in order
const NOTES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;
type Note = (typeof NOTES)[number];

// Major scale pattern in semitones: W-W-H-W-W-W-H (W=2 semitones, H=1 semitone)
const MAJOR_SCALE_PATTERN = [2, 2, 1, 2, 2, 2, 1];

/**
 * Returns all notes in a major key
 * @param rootNote The root note of the key (e.g., 'C' for C major)
 * @returns Array of notes in the key
 */
export function getNotesInKey(rootNote: Note): Note[] {
  const startIndex = NOTES.indexOf(rootNote);
  if (startIndex === -1) return [];

  const notesInKey = [rootNote];
  let currentIndex = startIndex;

  // Follow the major scale pattern to build the scale
  for (const interval of MAJOR_SCALE_PATTERN) {
    currentIndex = (currentIndex + interval) % NOTES.length;
    notesInKey.push(NOTES[currentIndex]);
  }

  // Remove the last note as it's the octave of the root
  notesInKey.pop();
  return notesInKey;
}

/**
 * Checks if a note is in a given key
 * @param note The note to check (e.g., 'C#')
 * @param key The key to check against (e.g., 'C' for C major)
 * @returns boolean indicating if the note is in the key
 */
export function isNoteInKey(note: Note, key: Note): boolean {
  const notesInKey = getNotesInKey(key);
  return notesInKey.includes(note);
}

/**
 * Extracts the note name without the octave
 * @param noteWithOctave Note with octave (e.g., 'C4')
 * @returns The note name without octave (e.g., 'C')
 */
export function getNoteWithoutOctave(noteWithOctave: string): Note {
  // If the note has a sharp, take first two characters, otherwise take first character
  const note = noteWithOctave.includes("#")
    ? noteWithOctave.slice(0, 2)
    : noteWithOctave.slice(0, 1);
  return note as Note;
}
