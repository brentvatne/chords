export type KeySignature = {
  name: string;
  type: "major" | "minor";
  notes: string[];
  chords: {
    I: string;
    II: string;
    III: string;
    IV: string;
    V: string;
    VI: string;
    VII: string;
  };
};

export const MAJOR_KEYS: KeySignature[] = [
  {
    name: "C",
    type: "major",
    notes: ["C", "D", "E", "F", "G", "A", "B"],
    chords: {
      I: "C",
      II: "Dm",
      III: "Em",
      IV: "F",
      V: "G",
      VI: "Am",
      VII: "Bdim",
    },
  },
  {
    name: "G",
    type: "major",
    notes: ["G", "A", "B", "C", "D", "E", "F♯"],
    chords: {
      I: "G",
      II: "Am",
      III: "Bm",
      IV: "C",
      V: "D",
      VI: "Em",
      VII: "F♯dim",
    },
  },
  {
    name: "D",
    type: "major",
    notes: ["D", "E", "F♯", "G", "A", "B", "C♯"],
    chords: {
      I: "D",
      II: "Em",
      III: "F♯m",
      IV: "G",
      V: "A",
      VI: "Bm",
      VII: "C♯dim",
    },
  },
  {
    name: "A",
    type: "major",
    notes: ["A", "B", "C♯", "D", "E", "F♯", "G♯"],
    chords: {
      I: "A",
      II: "Bm",
      III: "C♯m",
      IV: "D",
      V: "E",
      VI: "F♯m",
      VII: "G♯dim",
    },
  },
  {
    name: "E",
    type: "major",
    notes: ["E", "F♯", "G♯", "A", "B", "C♯", "D♯"],
    chords: {
      I: "E",
      II: "F♯m",
      III: "G♯m",
      IV: "A",
      V: "B",
      VI: "C♯m",
      VII: "D♯dim",
    },
  },
  {
    name: "B",
    type: "major",
    notes: ["B", "C♯", "D♯", "E", "F♯", "G♯", "A♯"],
    chords: {
      I: "B",
      II: "C♯m",
      III: "D♯m",
      IV: "E",
      V: "F♯",
      VI: "G♯m",
      VII: "A♯dim",
    },
  },
  {
    name: "F♯",
    type: "major",
    notes: ["F♯", "G♯", "A♯", "B", "C♯", "D♯", "E♯"],
    chords: {
      I: "F♯",
      II: "G♯m",
      III: "A♯m",
      IV: "B",
      V: "C♯",
      VI: "D♯m",
      VII: "E♯dim",
    },
  },
  {
    name: "C♯",
    type: "major",
    notes: ["C♯", "D♯", "E♯", "F♯", "G♯", "A♯", "B♯"],
    chords: {
      I: "C♯",
      II: "D♯m",
      III: "E♯m",
      IV: "F♯",
      V: "G♯",
      VI: "A♯m",
      VII: "B♯dim",
    },
  },
  {
    name: "F",
    type: "major",
    notes: ["F", "G", "A", "B♭", "C", "D", "E"],
    chords: {
      I: "F",
      II: "Gm",
      III: "Am",
      IV: "B♭",
      V: "C",
      VI: "Dm",
      VII: "Edim",
    },
  },
  {
    name: "B♭",
    type: "major",
    notes: ["B♭", "C", "D", "E♭", "F", "G", "A"],
    chords: {
      I: "B♭",
      II: "Cm",
      III: "Dm",
      IV: "E♭",
      V: "F",
      VI: "Gm",
      VII: "Adim",
    },
  },
  {
    name: "E♭",
    type: "major",
    notes: ["E♭", "F", "G", "A♭", "B♭", "C", "D"],
    chords: {
      I: "E♭",
      II: "Fm",
      III: "Gm",
      IV: "A♭",
      V: "B♭",
      VI: "Cm",
      VII: "Ddim",
    },
  },
  {
    name: "A♭",
    type: "major",
    notes: ["A♭", "B♭", "C", "D♭", "E♭", "F", "G"],
    chords: {
      I: "A♭",
      II: "B♭m",
      III: "Cm",
      IV: "D♭",
      V: "E♭",
      VI: "Fm",
      VII: "Gdim",
    },
  },
  {
    name: "D♭",
    type: "major",
    notes: ["D♭", "E♭", "F", "G♭", "A♭", "B♭", "C"],
    chords: {
      I: "D♭",
      II: "E♭m",
      III: "Fm",
      IV: "G♭",
      V: "A♭",
      VI: "B♭m",
      VII: "Cdim",
    },
  },
  {
    name: "G♭",
    type: "major",
    notes: ["G♭", "A♭", "B♭", "C♭", "D♭", "E♭", "F"],
    chords: {
      I: "G♭",
      II: "A♭m",
      III: "B♭m",
      IV: "C♭",
      V: "D♭",
      VI: "E♭m",
      VII: "Fdim",
    },
  },
  {
    name: "C♭",
    type: "major",
    notes: ["C♭", "D♭", "E♭", "F♭", "G♭", "A♭", "B♭"],
    chords: {
      I: "C♭",
      II: "D♭m",
      III: "E♭m",
      IV: "F♭",
      V: "G♭",
      VI: "A♭m",
      VII: "B♭dim",
    },
  },
];

export const MINOR_KEYS: KeySignature[] = [
  {
    name: "Am",
    type: "minor",
    notes: ["A", "B", "C", "D", "E", "F", "G"],
    chords: {
      I: "Am",
      II: "Bdim",
      III: "C",
      IV: "Dm",
      V: "Em",
      VI: "F",
      VII: "G",
    },
  },
  {
    name: "Em",
    type: "minor",
    notes: ["E", "F♯", "G", "A", "B", "C", "D"],
    chords: {
      I: "Em",
      II: "F♯dim",
      III: "G",
      IV: "Am",
      V: "Bm",
      VI: "C",
      VII: "D",
    },
  },
  {
    name: "Bm",
    type: "minor",
    notes: ["B", "C♯", "D", "E", "F♯", "G", "A"],
    chords: {
      I: "Bm",
      II: "C♯dim",
      III: "D",
      IV: "Em",
      V: "F♯m",
      VI: "G",
      VII: "A",
    },
  },
  {
    name: "F♯m",
    type: "minor",
    notes: ["F♯", "G♯", "A", "B", "C♯", "D", "E"],
    chords: {
      I: "F♯m",
      II: "G♯dim",
      III: "A",
      IV: "Bm",
      V: "C♯m",
      VI: "D",
      VII: "E",
    },
  },
  {
    name: "C♯m",
    type: "minor",
    notes: ["C♯", "D♯", "E", "F♯", "G♯", "A", "B"],
    chords: {
      I: "C♯m",
      II: "D♯dim",
      III: "E",
      IV: "F♯m",
      V: "G♯m",
      VI: "A",
      VII: "B",
    },
  },
  {
    name: "G♯m",
    type: "minor",
    notes: ["G♯", "A♯", "B", "C♯", "D♯", "E", "F♯"],
    chords: {
      I: "G♯m",
      II: "A♯dim",
      III: "B",
      IV: "C♯m",
      V: "D♯m",
      VI: "E",
      VII: "F♯",
    },
  },
  {
    name: "D♯m",
    type: "minor",
    notes: ["D♯", "E♯", "F♯", "G♯", "A♯", "B", "C♯"],
    chords: {
      I: "D♯m",
      II: "E♯dim",
      III: "F♯",
      IV: "G♯m",
      V: "A♯m",
      VI: "B",
      VII: "C♯",
    },
  },
  {
    name: "A♯m",
    type: "minor",
    notes: ["A♯", "B♯", "C♯", "D♯", "E♯", "F♯", "G♯"],
    chords: {
      I: "A♯m",
      II: "B♯dim",
      III: "C♯",
      IV: "D♯m",
      V: "E♯m",
      VI: "F♯",
      VII: "G♯",
    },
  },
  {
    name: "Dm",
    type: "minor",
    notes: ["D", "E", "F", "G", "A", "B♭", "C"],
    chords: {
      I: "Dm",
      II: "Edim",
      III: "F",
      IV: "Gm",
      V: "Am",
      VI: "B♭",
      VII: "C",
    },
  },
  {
    name: "Gm",
    type: "minor",
    notes: ["G", "A", "B♭", "C", "D", "E♭", "F"],
    chords: {
      I: "Gm",
      II: "Adim",
      III: "B♭",
      IV: "Cm",
      V: "Dm",
      VI: "E♭",
      VII: "F",
    },
  },
  {
    name: "Cm",
    type: "minor",
    notes: ["C", "D", "E♭", "F", "G", "A♭", "B♭"],
    chords: {
      I: "Cm",
      II: "Ddim",
      III: "E♭",
      IV: "Fm",
      V: "Gm",
      VI: "A♭",
      VII: "B♭",
    },
  },
  {
    name: "Fm",
    type: "minor",
    notes: ["F", "G", "A♭", "B♭", "C", "D♭", "E♭"],
    chords: {
      I: "Fm",
      II: "Gdim",
      III: "A♭",
      IV: "B♭m",
      V: "Cm",
      VI: "D♭",
      VII: "E♭",
    },
  },
  {
    name: "B♭m",
    type: "minor",
    notes: ["B♭", "C", "D♭", "E♭", "F", "G♭", "A♭"],
    chords: {
      I: "B♭m",
      II: "Cdim",
      III: "D♭",
      IV: "E♭m",
      V: "Fm",
      VI: "G♭",
      VII: "A♭",
    },
  },
  {
    name: "E♭m",
    type: "minor",
    notes: ["E♭", "F", "G♭", "A♭", "B♭", "C♭", "D♭"],
    chords: {
      I: "E♭m",
      II: "Fdim",
      III: "G♭",
      IV: "A♭m",
      V: "B♭m",
      VI: "C♭",
      VII: "D♭",
    },
  },
  {
    name: "A♭m",
    type: "minor",
    notes: ["A♭", "B♭", "C♭", "D♭", "E♭", "F♭", "G♭"],
    chords: {
      I: "A♭m",
      II: "B♭dim",
      III: "C♭",
      IV: "D♭m",
      V: "E♭m",
      VI: "F♭",
      VII: "G♭",
    },
  },
];

export const ALL_KEYS = [...MAJOR_KEYS, ...MINOR_KEYS];

export function isNoteInKey(note: string, key: KeySignature | null): boolean {
  if (!key) return true;
  return key.notes.includes(note);
}

export function getTriadForNoteInKey(
  note: string,
  key: KeySignature | null,
): string | null {
  if (!key) return null;

  // Find the position of the note in the key
  const noteIndex = key.notes.indexOf(note);
  if (noteIndex === -1) return null;

  // Get the chord for this position
  const chordPositions = ["I", "II", "III", "IV", "V", "VI", "VII"] as const;
  return key.chords[chordPositions[noteIndex]] || null;
}
