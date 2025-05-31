import {
    MAJOR_KEYS,
    MINOR_KEYS,
    getTriadForNoteInKey,
    isNoteInKey,
} from "../music-theory";

describe("Music Theory", () => {
  describe("Key Definitions", () => {
    test("Major keys have correct notes", () => {
      const cMajor = MAJOR_KEYS.find((k) => k.name === "C");
      expect(cMajor?.notes).toEqual(["C", "D", "E", "F", "G", "A", "B"]);

      const gMajor = MAJOR_KEYS.find((k) => k.name === "G");
      expect(gMajor?.notes).toEqual(["G", "A", "B", "C", "D", "E", "F♯"]);
    });

    test("Minor keys have correct notes", () => {
      const aMinor = MINOR_KEYS.find((k) => k.name === "Am");
      expect(aMinor?.notes).toEqual(["A", "B", "C", "D", "E", "F", "G"]);

      const eMinor = MINOR_KEYS.find((k) => k.name === "Em");
      expect(eMinor?.notes).toEqual(["E", "F♯", "G", "A", "B", "C", "D"]);
    });

    test("Major keys have correct chords", () => {
      const cMajor = MAJOR_KEYS.find((k) => k.name === "C");
      expect(cMajor?.chords).toEqual({
        I: "C",
        II: "Dm",
        III: "Em",
        IV: "F",
        V: "G",
        VI: "Am",
        VII: "Bdim",
      });
    });

    test("Minor keys have correct chords", () => {
      const aMinor = MINOR_KEYS.find((k) => k.name === "Am");
      expect(aMinor?.chords).toEqual({
        I: "Am",
        II: "Bdim",
        III: "C",
        IV: "Dm",
        V: "Em",
        VI: "F",
        VII: "G",
      });
    });
  });

  describe("isNoteInKey", () => {
    test("Returns true for notes in the key", () => {
      const cMajor = MAJOR_KEYS.find((k) => k.name === "C");
      if (!cMajor) throw new Error("C major not found");
      expect(isNoteInKey("C", cMajor)).toBe(true);
      expect(isNoteInKey("D", cMajor)).toBe(true);
      expect(isNoteInKey("E", cMajor)).toBe(true);
    });

    test("Returns false for notes not in the key", () => {
      const cMajor = MAJOR_KEYS.find((k) => k.name === "C");
      if (!cMajor) throw new Error("C major not found");
      expect(isNoteInKey("C♯", cMajor)).toBe(false);
      expect(isNoteInKey("F♯", cMajor)).toBe(false);
    });

    test("Returns true for any note when key is null", () => {
      expect(isNoteInKey("C", null)).toBe(true);
      expect(isNoteInKey("F♯", null)).toBe(true);
    });
  });

  describe("getTriadForNoteInKey", () => {
    test("Returns correct chord for note in major key", () => {
      const cMajor = MAJOR_KEYS.find((k) => k.name === "C");
      if (!cMajor) throw new Error("C major not found");
      expect(getTriadForNoteInKey("C", cMajor)).toBe("C");
      expect(getTriadForNoteInKey("D", cMajor)).toBe("Dm");
      expect(getTriadForNoteInKey("E", cMajor)).toBe("Em");
    });

    test("Returns correct chord for note in minor key", () => {
      const aMinor = MINOR_KEYS.find((k) => k.name === "Am");
      if (!aMinor) throw new Error("A minor not found");
      expect(getTriadForNoteInKey("A", aMinor)).toBe("Am");
      expect(getTriadForNoteInKey("B", aMinor)).toBe("Bdim");
      expect(getTriadForNoteInKey("C", aMinor)).toBe("C");
    });

    test("Returns null for notes not in key", () => {
      const cMajor = MAJOR_KEYS.find((k) => k.name === "C");
      if (!cMajor) throw new Error("C major not found");
      expect(getTriadForNoteInKey("C♯", cMajor)).toBeNull();
      expect(getTriadForNoteInKey("F♯", cMajor)).toBeNull();
    });

    test("Returns null when key is null", () => {
      expect(getTriadForNoteInKey("C", null)).toBeNull();
      expect(getTriadForNoteInKey("F♯", null)).toBeNull();
    });
  });
});
