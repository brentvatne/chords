import {
    ChordSelection,
    chordToMidiNotes,
    getChordInfo,
    getTriadForNoteInKey,
} from "../chords";

describe("Chord utilities", () => {
  describe("getTriadForNoteInKey", () => {
    test("returns major when no key is selected", () => {
      expect(getTriadForNoteInKey("C", null)).toBe("major");
      expect(getTriadForNoteInKey("G#", null)).toBe("major");
      expect(getTriadForNoteInKey("B#", null)).toBe("major");
    });

    // Test regular keys
    test("correctly identifies chord qualities in C major", () => {
      // I - IV - V are major
      expect(getTriadForNoteInKey("C", "C")).toBe("major"); // I
      expect(getTriadForNoteInKey("F", "C")).toBe("major"); // IV
      expect(getTriadForNoteInKey("G", "C")).toBe("major"); // V

      // ii - iii - vi are minor
      expect(getTriadForNoteInKey("D", "C")).toBe("minor"); // ii
      expect(getTriadForNoteInKey("E", "C")).toBe("minor"); // iii
      expect(getTriadForNoteInKey("A", "C")).toBe("minor"); // vi

      // vii° is diminished
      expect(getTriadForNoteInKey("B", "C")).toBe("dim"); // vii°

      // Non-scale notes default to major
      expect(getTriadForNoteInKey("C#", "C")).toBe("major");
      expect(getTriadForNoteInKey("F#", "C")).toBe("major");
    });

    // Test special keys that use double sharps
    test("correctly identifies chord qualities in G# major", () => {
      // I - IV - V are major
      expect(getTriadForNoteInKey("G#", "G#")).toBe("major"); // I
      expect(getTriadForNoteInKey("C#", "G#")).toBe("major"); // IV
      expect(getTriadForNoteInKey("D#", "G#")).toBe("major"); // V

      // ii - iii - vi are minor
      expect(getTriadForNoteInKey("A#", "G#")).toBe("minor"); // ii
      expect(getTriadForNoteInKey("B#", "G#")).toBe("minor"); // iii
      expect(getTriadForNoteInKey("E#", "G#")).toBe("minor"); // vi

      // vii° is diminished
      expect(getTriadForNoteInKey("F", "G#")).toBe("dim"); // vii°

      // Non-scale notes default to major
      expect(getTriadForNoteInKey("G", "G#")).toBe("major");
      expect(getTriadForNoteInKey("A", "G#")).toBe("major");
    });

    test("correctly identifies chord qualities in A# major", () => {
      // I - IV - V are major
      expect(getTriadForNoteInKey("A#", "A#")).toBe("major"); // I
      expect(getTriadForNoteInKey("D#", "A#")).toBe("major"); // IV
      expect(getTriadForNoteInKey("E#", "A#")).toBe("major"); // V

      // ii - iii - vi are minor
      expect(getTriadForNoteInKey("B#", "A#")).toBe("minor"); // ii
      expect(getTriadForNoteInKey("C", "A#")).toBe("minor"); // iii
      expect(getTriadForNoteInKey("F", "A#")).toBe("minor"); // vi

      // vii° is diminished
      expect(getTriadForNoteInKey("G", "A#")).toBe("dim"); // vii°

      // Non-scale notes default to major
      expect(getTriadForNoteInKey("A", "A#")).toBe("major");
      expect(getTriadForNoteInKey("B", "A#")).toBe("major");
    });

    test("correctly identifies chord qualities in B# major", () => {
      // I - IV - V are major
      expect(getTriadForNoteInKey("B#", "B#")).toBe("major"); // I
      expect(getTriadForNoteInKey("E#", "B#")).toBe("major"); // IV
      expect(getTriadForNoteInKey("F#", "B#")).toBe("major"); // V

      // ii - iii - vi are minor
      expect(getTriadForNoteInKey("C#", "B#")).toBe("minor"); // ii
      expect(getTriadForNoteInKey("D", "B#")).toBe("minor"); // iii
      expect(getTriadForNoteInKey("G", "B#")).toBe("minor"); // vi

      // vii° is diminished
      expect(getTriadForNoteInKey("A", "B#")).toBe("dim"); // vii°

      // Non-scale notes default to major
      expect(getTriadForNoteInKey("B", "B#")).toBe("major");
      expect(getTriadForNoteInKey("C", "B#")).toBe("major");
    });

    test("correctly identifies chord qualities in C# major", () => {
      // I - IV - V are major
      expect(getTriadForNoteInKey("C#", "C#")).toBe("major"); // I
      expect(getTriadForNoteInKey("F#", "C#")).toBe("major"); // IV
      expect(getTriadForNoteInKey("G#", "C#")).toBe("major"); // V

      // ii - iii - vi are minor
      expect(getTriadForNoteInKey("D#", "C#")).toBe("minor"); // ii
      expect(getTriadForNoteInKey("E#", "C#")).toBe("minor"); // iii
      expect(getTriadForNoteInKey("A#", "C#")).toBe("minor"); // vi

      // vii° is diminished
      expect(getTriadForNoteInKey("B#", "C#")).toBe("dim"); // vii°

      // Non-scale notes default to major
      expect(getTriadForNoteInKey("C", "C#")).toBe("major");
      expect(getTriadForNoteInKey("D", "C#")).toBe("major");
    });

    // Test enharmonic equivalents
    test("correctly identifies chord qualities in enharmonic keys", () => {
      // Test Db major (enharmonic to C# major)
      expect(getTriadForNoteInKey("Db", "Db")).toBe("major"); // I
      expect(getTriadForNoteInKey("Gb", "Db")).toBe("major"); // IV
      expect(getTriadForNoteInKey("Ab", "Db")).toBe("major"); // V
      expect(getTriadForNoteInKey("Eb", "Db")).toBe("minor"); // ii
      expect(getTriadForNoteInKey("F", "Db")).toBe("minor"); // iii
      expect(getTriadForNoteInKey("Bb", "Db")).toBe("minor"); // vi
      expect(getTriadForNoteInKey("C", "Db")).toBe("dim"); // vii°

      // Test Ab major (enharmonic to G# major)
      expect(getTriadForNoteInKey("Ab", "Ab")).toBe("major"); // I
      expect(getTriadForNoteInKey("Db", "Ab")).toBe("major"); // IV
      expect(getTriadForNoteInKey("Eb", "Ab")).toBe("major"); // V
      expect(getTriadForNoteInKey("Bb", "Ab")).toBe("minor"); // ii
      expect(getTriadForNoteInKey("C", "Ab")).toBe("minor"); // iii
      expect(getTriadForNoteInKey("F", "Ab")).toBe("minor"); // vi
      expect(getTriadForNoteInKey("G", "Ab")).toBe("dim"); // vii°
    });

    test("handles notes with octave numbers", () => {
      expect(getTriadForNoteInKey("C4", "C")).toBe("major"); // I in C
      expect(getTriadForNoteInKey("D4", "C")).toBe("minor"); // ii in C
      expect(getTriadForNoteInKey("G#4", "G#")).toBe("major"); // I in G#
      expect(getTriadForNoteInKey("A#4", "G#")).toBe("minor"); // ii in G#
      expect(getTriadForNoteInKey("B#4", "C#")).toBe("dim"); // vii° in C#
    });
  });
});

describe("Chord Utils", () => {
  describe("getChordInfo", () => {
    test("Returns correct info for major triad", () => {
      const selection: ChordSelection = {
        triad: "major",
        extensions: [],
      };
      const info = getChordInfo(selection, "C4");
      expect(info.name).toBe("C");
      expect(info.notes).toEqual(["C", "E", "G"]);
    });

    test("Returns correct info for minor triad", () => {
      const selection: ChordSelection = {
        triad: "minor",
        extensions: [],
      };
      const info = getChordInfo(selection, "C4");
      expect(info.name).toBe("Cm");
      expect(info.notes).toEqual(["C", "E♭", "G"]);
    });

    test("Returns correct info for diminished triad", () => {
      const selection: ChordSelection = {
        triad: "dim",
        extensions: [],
      };
      const info = getChordInfo(selection, "C4");
      expect(info.name).toBe("Cdim");
      expect(info.notes).toEqual(["C", "E♭", "G♭"]);
    });

    test("Returns correct info for suspended triad", () => {
      const selection: ChordSelection = {
        triad: "sus",
        extensions: [],
      };
      const info = getChordInfo(selection, "C4");
      expect(info.name).toBe("Csus");
      expect(info.notes).toEqual(["C", "F", "G"]);
    });

    test("Handles extensions correctly", () => {
      const selection: ChordSelection = {
        triad: "major",
        extensions: ["6", "M7", "9"],
      };
      const info = getChordInfo(selection, "C4");
      expect(info.name).toBe("C6M79");
      expect(info.notes).toEqual(["C", "E", "G", "A", "B", "D"]);
    });
  });

  describe("chordToMidiNotes", () => {
    test("Returns correct MIDI notes for major triad", () => {
      const selection: ChordSelection = {
        triad: "major",
        extensions: [],
      };
      const notes = chordToMidiNotes(selection, "C4");
      expect(notes).toEqual([60, 64, 67]); // C4, E4, G4
    });

    test("Returns correct MIDI notes for minor triad", () => {
      const selection: ChordSelection = {
        triad: "minor",
        extensions: [],
      };
      const notes = chordToMidiNotes(selection, "C4");
      expect(notes).toEqual([60, 63, 67]); // C4, E♭4, G4
    });

    test("Returns correct MIDI notes with extensions", () => {
      const selection: ChordSelection = {
        triad: "major",
        extensions: ["M7"],
      };
      const notes = chordToMidiNotes(selection, "C4");
      expect(notes).toEqual([60, 64, 67, 71]); // C4, E4, G4, B4
    });

    test("Handles octave changes correctly", () => {
      const selection: ChordSelection = {
        triad: "major",
        extensions: ["9"],
      };
      const notes = chordToMidiNotes(selection, "C4");
      expect(notes).toEqual([60, 64, 67, 74]); // C4, E4, G4, D5
    });
  });
});
