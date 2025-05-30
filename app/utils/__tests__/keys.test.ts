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
      expect(isNoteInKey("F#", "G#")).toBe(false);
      expect(isNoteInKey("G", "G#")).toBe(false);
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
    });
  });

  describe("_getNotesInKey", () => {
    test("returns correct notes for major keys", () => {
      expect(_getNotesInKey("C")).toEqual(["C", "D", "E", "F", "G", "A", "B"]);
      expect(_getNotesInKey("G")).toEqual(["G", "A", "B", "C", "D", "E", "F#"]);
      expect(_getNotesInKey("F")).toEqual(["F", "G", "A", "Bb", "C", "D", "E"]);
      expect(_getNotesInKey("G#")).toEqual([
        "G#",
        "A#",
        "B#",
        "C#",
        "D#",
        "E#",
        "F",
      ]);
    });

    test("handles enharmonic keys", () => {
      const dbNotes = _getNotesInKey("Db");
      const csNotes = _getNotesInKey("C#");

      // Both should contain the same notes (in some enharmonic form)
      expect(dbNotes.length).toBe(7);
      expect(csNotes.length).toBe(7);

      // The notes should be enharmonically equivalent
      expect(isNoteInKey("Db", "Db")).toBe(true);
      expect(isNoteInKey("C#", "C#")).toBe(true);
      expect(isNoteInKey("Eb", "Db")).toBe(true);
      expect(isNoteInKey("D#", "C#")).toBe(true);
    });

    test("returns empty array for invalid keys", () => {
      expect(_getNotesInKey("H")).toEqual([]);
      expect(_getNotesInKey("")).toEqual([]);
    });
  });
});
