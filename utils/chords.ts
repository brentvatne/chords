import { Chord, Note } from "tonal";

export type TriadType = "major" | "minor" | "dim" | "sus";
export type ExtensionType = "6" | "m7" | "M7" | "9";
export type MusicalNote =
  | "C"
  | "C#"
  | "D"
  | "D#"
  | "E"
  | "F"
  | "F#"
  | "G"
  | "G#"
  | "A"
  | "A#"
  | "B";
export type MusicalNoteWithOctave =
  `${MusicalNote}${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`;

export interface ChordSelection {
  triad: TriadType;
  extensions: ExtensionType[];
}

export interface ChordInfo {
  name: string;
  notes: string[];
  root: string;
  quality: string;
}

export function mapSelectionToTonalType(selection: ChordSelection): string {
  // Handle base triad type
  let base = "";
  switch (selection.triad) {
    case "dim":
      base = "dim";
      break;
    case "minor":
      base = "m";
      break;
    case "major":
      base = "M";
      break;
    case "sus":
      base = "sus4";
      break;
  }

  if (selection.extensions.length === 0) return base;

  // Sort extensions to ensure consistent ordering
  const sortedExtensions = [...selection.extensions].sort((a, b) => {
    // Custom sorting to ensure proper order: M7 > m7 > 6 > 9
    const order = { M7: 0, m7: 1, "6": 2, "9": 3 };
    return order[a as keyof typeof order] - order[b as keyof typeof order];
  });

  // Special handling for different combinations
  const hasM7 = sortedExtensions.includes("M7");
  const hasm7 = sortedExtensions.includes("m7");
  const has6 = sortedExtensions.includes("6");
  const has9 = sortedExtensions.includes("9");

  // Handle major seventh chords
  if (hasM7) {
    if (has6 && has9) {
      return "maj769";
    } else if (has6) {
      return "maj7add6";
    } else if (has9) {
      return "maj79";
    } else {
      return "maj7";
    }
  }

  // Handle minor seventh chords
  if (hasm7) {
    // Special case for sus chords with m7 - it should be 7sus4, not sus47
    if (selection.triad === "sus") {
      let result = "7sus4";
      if (has6 && has9) {
        return result + "69";
      } else if (has6) {
        return result + "add6";
      } else if (has9) {
        return result + "9";
      } else {
        return result;
      }
    }

    let result = base + "7";
    if (has6 && has9) {
      return result + "69";
    } else if (has6) {
      return result + "add6";
    } else if (has9) {
      return result + "9";
    } else {
      return result;
    }
  }

  // Handle sus chords with extensions (non-m7 cases)
  if (selection.triad === "sus") {
    let result = "sus4";
    if (has6 && has9) {
      return result + "69";
    } else if (has6) {
      return result + "6";
    } else if (has9) {
      return result + "add9";
    }
    return result;
  }

  // Handle 6/9 chords
  if (has6 && has9) {
    return base + "69";
  }

  // Handle single extensions
  if (has6) {
    return base + "6";
  }

  if (has9) {
    // For major chords with only add9, use Madd9
    if (selection.triad === "major") {
      return "Madd9";
    }
    return base + "add9";
  }

  return base;
}

export function getChordInfo(
  selection: ChordSelection,
  root: MusicalNoteWithOctave,
): ChordInfo | null {
  try {
    const tonalType = mapSelectionToTonalType(selection);

    let chordData = Chord.getChord(tonalType, root);

    if (!chordData || chordData.empty || !chordData.tonic) {
      // Try alternative chord symbols for complex chords
      let alternativeType = "";

      // Try alternative symbols for major 9th chords
      if (tonalType === "maj79") {
        alternativeType = "maj9";
      }
      // Try alternative symbols for minor 9th chords
      else if (tonalType === "m79") {
        alternativeType = "m9";
      }
      // Try alternative symbols for sus4 with 7th and 9th
      else if (tonalType === "7sus49") {
        alternativeType = "9sus";
      }
      // Try alternative symbols for sus4 with 6th
      else if (tonalType === "sus46") {
        alternativeType = "6sus";
      }
      // Try alternative symbols for major 7th with 6th
      else if (tonalType.includes("maj76")) {
        alternativeType = "M13";
      }
      // Try alternative symbols for minor 7th with 6th
      else if (tonalType.includes("m76")) {
        alternativeType = "m13";
      }

      if (alternativeType) {
        chordData = Chord.getChord(alternativeType, root);
        if (!chordData.empty && chordData.tonic) {
          return {
            name: formatChordName(root, selection),
            notes: orderChordNotes(chordData.notes, root, selection),
            root: chordData.tonic,
            quality: chordData.type,
          };
        }
      }

      // For complex chords, manually construct them
      if (
        selection.extensions.includes("6") &&
        (selection.extensions.includes("M7") ||
          selection.extensions.includes("m7"))
      ) {
        const baseChord = selection.extensions.includes("M7")
          ? Chord.getChord("maj7", root)
          : Chord.getChord(
              selection.triad === "minor"
                ? "m7"
                : selection.triad === "dim"
                  ? "dim7"
                  : selection.triad === "sus"
                    ? "7sus4"
                    : "7",
              root,
            );

        if (!baseChord.empty && baseChord.tonic) {
          const notes = [...baseChord.notes];
          const sixth = Note.transpose(root, "M6");
          notes.splice(-1, 0, Note.pitchClass(sixth)); // Insert 6th before the 7th

          // Add 9th if present
          if (selection.extensions.includes("9")) {
            const ninth = Note.transpose(root, "M9");
            notes.push(Note.pitchClass(ninth));
          }

          return {
            name: formatChordName(root, selection),
            notes,
            root: baseChord.tonic,
            quality: baseChord.type,
          };
        }
      }

      // For sus4 with 6th, manually construct the chord
      if (selection.triad === "sus" && selection.extensions.includes("6")) {
        const baseChord = selection.extensions.includes("m7")
          ? Chord.getChord("7sus4", root)
          : Chord.getChord("sus4", root);
        if (!baseChord.empty && baseChord.tonic) {
          let notes = [...baseChord.notes];
          const sixth = Note.transpose(root, "M6");

          // Insert 6th in the correct position (after 5th, before 7th if present)
          if (selection.extensions.includes("m7")) {
            // For 7sus4 chords, insert 6th before the 7th
            const seventhNote = Note.pitchClass(Note.transpose(root, "m7"));
            const seventhIndex = notes.findIndex(
              (note) => note === seventhNote,
            );
            if (seventhIndex !== -1) {
              notes.splice(seventhIndex, 0, Note.pitchClass(sixth));
            } else {
              notes.push(Note.pitchClass(sixth));
            }
          } else {
            // For sus4 chords, just add the 6th at the end
            notes.push(Note.pitchClass(sixth));
          }

          // Add 9th if present
          if (selection.extensions.includes("9")) {
            const ninth = Note.transpose(root, "M9");
            notes.push(Note.pitchClass(ninth));
          }

          return {
            name: formatChordName(root, selection),
            notes,
            root: baseChord.tonic,
            quality: "suspended fourth",
          };
        }
      }

      // For maj9 and maj13 combinations that tonal doesn't recognize
      if (
        selection.extensions.includes("M7") &&
        selection.extensions.includes("9")
      ) {
        const baseChord = Chord.getChord("maj9", root);
        if (!baseChord.empty && baseChord.tonic) {
          const notes = [...baseChord.notes];

          // Add 6th if present
          if (selection.extensions.includes("6")) {
            const sixth = Note.transpose(root, "M6");
            // Insert 6th in correct position (before 7th)
            const seventhIndex = notes.findIndex(
              (note) => note === Note.pitchClass(Note.transpose(root, "M7")),
            );
            if (seventhIndex !== -1) {
              notes.splice(seventhIndex, 0, Note.pitchClass(sixth));
            } else {
              notes.push(Note.pitchClass(sixth));
            }
          }

          return {
            name: formatChordName(root, selection),
            notes,
            root: baseChord.tonic,
            quality: baseChord.type,
          };
        }
      }

      console.warn(
        `No chord found for ${root} (selection: ${JSON.stringify(selection)}, tried types: ${tonalType}${alternativeType ? ", " + alternativeType : ""})`,
      );
      return null;
    }

    return {
      name: formatChordName(root, selection),
      notes: orderChordNotes(chordData.notes, root, selection),
      root: chordData.tonic,
      quality: chordData.type,
    };
  } catch (e) {
    console.error("Error in getChordInfo:", e);
    return null;
  }
}

function orderChordNotes(
  notes: string[],
  root: string,
  selection: ChordSelection,
): string[] {
  const orderedNotes = [...notes];

  // For chords with 9th, ensure it comes last
  if (selection.extensions.includes("9")) {
    const ninth = Note.transpose(root, "M9");
    const ninthPc = Note.pitchClass(ninth);
    const ninthIndex = orderedNotes.findIndex((note) => note === ninthPc);
    if (ninthIndex !== -1) {
      orderedNotes.splice(ninthIndex, 1);
      orderedNotes.push(ninthPc);
    }
  }

  // For chords with both 6th and 7th, ensure 6th comes before 7th
  if (
    selection.extensions.includes("6") &&
    (selection.extensions.includes("M7") || selection.extensions.includes("m7"))
  ) {
    const sixth = Note.transpose(root, "M6");
    const sixthPc = Note.pitchClass(sixth);
    const sixthIndex = orderedNotes.findIndex((note) => note === sixthPc);
    if (sixthIndex !== -1) {
      orderedNotes.splice(sixthIndex, 1);
      // Find the 7th
      const seventh = selection.extensions.includes("M7")
        ? Note.transpose(root, "M7")
        : Note.transpose(root, "m7");
      const seventhPc = Note.pitchClass(seventh);
      const seventhIndex = orderedNotes.findIndex((note) => note === seventhPc);
      if (seventhIndex !== -1) {
        orderedNotes.splice(seventhIndex, 0, sixthPc);
      }
    }
  }

  return orderedNotes;
}

function formatChordName(root: string, selection: ChordSelection): string {
  const rootName = Note.pitchClass(root);
  const parts: string[] = [rootName];

  // Add triad quality with proper musical names
  switch (selection.triad) {
    case "major":
      parts.push("major");
      break;
    case "minor":
      parts.push("minor");
      break;
    case "dim":
      parts.push("diminished");
      break;
    case "sus":
      parts.push("suspended");
      break;
  }

  // Sort extensions
  const sortedExtensions = [...selection.extensions].sort((a, b) => {
    const order = { M7: 0, m7: 1, "6": 2, "9": 3 };
    return order[a as keyof typeof order] - order[b as keyof typeof order];
  });

  // Add extensions with proper formatting
  sortedExtensions.forEach((ext) => {
    switch (ext) {
      case "M7":
        parts.push("7th");
        break;
      case "m7":
        parts.push("7th");
        break;
      case "6":
        parts.push("6th");
        break;
      case "9":
        parts.push("9th");
        break;
    }
  });

  return parts.join(" ");
}

export function chordToMidiNotes(
  selection: ChordSelection,
  root: MusicalNoteWithOctave,
): number[] {
  try {
    const tonalType = mapSelectionToTonalType(selection);
    const chordData = Chord.getChord(tonalType, root);
    if (chordData.empty) {
      console.warn(
        `Cannot get MIDI notes for ${root} (selection: ${JSON.stringify(selection)}, tonalType: ${tonalType}): chord data is empty.`,
      );
      return [];
    }

    const rootOctave = Note.octave(root);
    if (rootOctave === undefined || rootOctave === null) {
      console.warn(
        `Root note ${root} is missing an octave for MIDI conversion.`,
      );
      return [];
    }

    const midiNotes = chordData.notes
      .map((noteName) => {
        let noteWithOctave = noteName;
        const noteDetails = Note.get(noteName);
        if (noteDetails.oct === undefined || noteDetails.oct === null) {
          noteWithOctave = `${noteDetails.pc}${rootOctave}`;
        }
        return Note.midi(noteWithOctave);
      })
      .filter((note): note is number => note !== null);

    if (midiNotes.length === 0 && chordData.notes.length > 0) {
      console.warn(
        `Could not convert any notes to MIDI for ${root} with selection ${JSON.stringify(selection)}. Original notes: ${chordData.notes.join(",")}`,
      );
    }
    return midiNotes;
  } catch (e) {
    console.error("Error in chordToMidiNotes:", e);
    return [];
  }
}
