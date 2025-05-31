import { _getNotesInKey, isNoteInKey } from "../keys";

describe("Key utilities", () => {
  describe("isNoteInKey", () => {
    test("correctly identifies notes in C major", () => {
      expect(isNoteInKey("C", "C")).toBe(true);
      expect(isNoteInKey("D", "C")).toBe(true);
      expect(isNoteInKey("E", "C")).toBe(true);
      expect(isNoteInKey("F", "C")).toBe(true);
      expect(isNoteInKey("G", "C")).toBe(true);
      expect(isNoteInKey("A", "C")).toBe(true);
      expect(isNoteInKey("B", "C")).toBe(true);
      expect(isNoteInKey("C#", "C")).toBe(false);
      expect(isNoteInKey("F#", "C")).toBe(false);
    });

    test("correctly identifies notes in G major", () => {
      expect(isNoteInKey("G", "G")).toBe(true);
      expect(isNoteInKey("A", "G")).toBe(true);
      expect(isNoteInKey("B", "G")).toBe(true);
      expect(isNoteInKey("C", "G")).toBe(true);
      expect(isNoteInKey("D", "G")).toBe(true);
      expect(isNoteInKey("E", "G")).toBe(true);
      expect(isNoteInKey("F#", "G")).toBe(true);
      expect(isNoteInKey("F", "G")).toBe(false);
      expect(isNoteInKey("G#", "G")).toBe(false);
    });

    test("correctly identifies notes in G# major", () => {
      expect(isNoteInKey("G#", "G#")).toBe(true);
      expect(isNoteInKey("A#", "G#")).toBe(true);
      expect(isNoteInKey("B#", "G#")).toBe(true);
      expect(isNoteInKey("C#", "G#")).toBe(true);
      expect(isNoteInKey("D#", "G#")).toBe(true);
      expect(isNoteInKey("E#", "G#")).toBe(true);
      expect(isNoteInKey("F", "G#")).toBe(true);
      expect(isNoteInKey("G", "G#")).toBe(false);
      expect(isNoteInKey("A", "G#")).toBe(false);
    });

    test("correctly identifies notes in A# major", () => {
      expect(isNoteInKey("A#", "A#")).toBe(true);
      expect(isNoteInKey("B#", "A#")).toBe(true);
      expect(isNoteInKey("C", "A#")).toBe(true);
      expect(isNoteInKey("D#", "A#")).toBe(true);
      expect(isNoteInKey("E#", "A#")).toBe(true);
      expect(isNoteInKey("F", "A#")).toBe(true);
      expect(isNoteInKey("G", "A#")).toBe(true);
      expect(isNoteInKey("A", "A#")).toBe(false);
      expect(isNoteInKey("B", "A#")).toBe(false);
    });

    test("correctly identifies notes in B# major", () => {
      expect(isNoteInKey("B#", "B#")).toBe(true);
      expect(isNoteInKey("C#", "B#")).toBe(true);
      expect(isNoteInKey("D", "B#")).toBe(true);
      expect(isNoteInKey("E#", "B#")).toBe(true);
      expect(isNoteInKey("F#", "B#")).toBe(true);
      expect(isNoteInKey("G", "B#")).toBe(true);
      expect(isNoteInKey("A", "B#")).toBe(true);
      expect(isNoteInKey("B", "B#")).toBe(false);
      expect(isNoteInKey("C", "B#")).toBe(false);
    });

    test("correctly identifies notes in C# major", () => {
      expect(isNoteInKey("C#", "C#")).toBe(true);
      expect(isNoteInKey("D#", "C#")).toBe(true);
      expect(isNoteInKey("E#", "C#")).toBe(true);
      expect(isNoteInKey("F#", "C#")).toBe(true);
      expect(isNoteInKey("G#", "C#")).toBe(true);
      expect(isNoteInKey("A#", "C#")).toBe(true);
      expect(isNoteInKey("B#", "C#")).toBe(true);
      expect(isNoteInKey("C", "C#")).toBe(false);
      expect(isNoteInKey("D", "C#")).toBe(false);
    });

    test("handles enharmonic equivalents", () => {
      // Test Db major (5 flats)
      expect(isNoteInKey("Db", "Db")).toBe(true);
      expect(isNoteInKey("Eb", "Db")).toBe(true);
      expect(isNoteInKey("F", "Db")).toBe(true);
      expect(isNoteInKey("Gb", "Db")).toBe(true);
      expect(isNoteInKey("Ab", "Db")).toBe(true);
      expect(isNoteInKey("Bb", "Db")).toBe(true);
      expect(isNoteInKey("C", "Db")).toBe(true);

      // Same key, but using C# major
      expect(isNoteInKey("C#", "C#")).toBe(true);
      expect(isNoteInKey("D#", "C#")).toBe(true);
      expect(isNoteInKey("E#", "C#")).toBe(true);
      expect(isNoteInKey("F#", "C#")).toBe(true);
      expect(isNoteInKey("G#", "C#")).toBe(true);
      expect(isNoteInKey("A#", "C#")).toBe(true);
      expect(isNoteInKey("B#", "C#")).toBe(true);

      // Test G# major and Ab major equivalence
      const gsNotes = _getNotesInKey("G#");
      const abNotes = _getNotesInKey("Ab");
      expect(gsNotes.length).toBe(7);
      expect(abNotes.length).toBe(7);
      expect(isNoteInKey("G#", "G#")).toBe(true);
      expect(isNoteInKey("Ab", "Ab")).toBe(true);
      expect(isNoteInKey("A#", "G#")).toBe(true);
      expect(isNoteInKey("Bb", "Ab")).toBe(true);
    });

    test("handles notes with octave numbers", () => {
      expect(isNoteInKey("C4", "C")).toBe(true);
      expect(isNoteInKey("F#4", "G")).toBe(true);
      expect(isNoteInKey("Bb3", "F")).toBe(true);
      expect(isNoteInKey("F4", "G#")).toBe(true);
      expect(isNoteInKey("B#4", "C#")).toBe(true);
    });
  });

  describe("_getNotesInKey", () => {
    test("returns correct notes for regular major keys", () => {
      expect(_getNotesInKey("C")).toEqual(["C", "D", "E", "F", "G", "A", "B"]);
      expect(_getNotesInKey("G")).toEqual(["G", "A", "B", "C", "D", "E", "F#"]);
      expect(_getNotesInKey("F")).toEqual(["F", "G", "A", "Bb", "C", "D", "E"]);
    });

    test("returns correct notes for special major keys", () => {
      expect(_getNotesInKey("G#")).toEqual([
        "G#",
        "A#",
        "B#",
        "C#",
        "D#",
        "E#",
        "F",
      ]);

      expect(_getNotesInKey("A#")).toEqual([
        "A#",
        "B#",
        "C",
        "D#",
        "E#",
        "F",
        "G",
      ]);

      expect(_getNotesInKey("B#")).toEqual([
        "B#",
        "C#",
        "D",
        "E#",
        "F#",
        "G",
        "A",
      ]);

      expect(_getNotesInKey("C#")).toEqual([
        "C#",
        "D#",
        "E#",
        "F#",
        "G#",
        "A#",
        "B#",
      ]);
    });

    test("returns correct notes for enharmonic equivalents", () => {
      // Test pairs of enharmonic equivalents
      const dbNotes = _getNotesInKey("Db");
      const csNotes = _getNotesInKey("C#");
      expect(dbNotes.length).toBe(7);
      expect(csNotes.length).toBe(7);

      const abNotes = _getNotesInKey("Ab");
      const gsNotes = _getNotesInKey("G#");
      expect(abNotes.length).toBe(7);
      expect(gsNotes.length).toBe(7);

      const bbNotes = _getNotesInKey("Bb");
      const asNotes = _getNotesInKey("A#");
      expect(bbNotes.length).toBe(7);
      expect(asNotes.length).toBe(7);

      const cbNotes = _getNotesInKey("Cb");
      const bsNotes = _getNotesInKey("B#");
      expect(cbNotes.length).toBe(7);
      expect(bsNotes.length).toBe(7);
    });

    test("returns empty array for invalid keys", () => {
      expect(_getNotesInKey("H")).toEqual([]);
      expect(_getNotesInKey("")).toEqual([]);
    });
  });
});
