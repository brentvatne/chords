import { getNoteWithoutOctave, isNoteInKey } from "./app/utils/keys";

describe("Debug F major black key issue", () => {
  test("F major Bb key logic", () => {
    const selectedKey = "F";
    const blackKeySharp = "A#";
    const blackKeyFlat = "Bb";
    const octave = 4;

    // Simulate getBlackKeyNoteForKey logic
    const flatKeys = ["F", "Bb", "Eb", "Ab", "Db", "Gb", "Cb"];
    const noteToCheck = flatKeys.includes(selectedKey)
      ? blackKeyFlat
      : blackKeySharp;
    console.log("noteToCheck:", noteToCheck); // Should be "Bb"

    const noteWithOctave = `${noteToCheck}${octave}`;
    console.log("noteWithOctave:", noteWithOctave); // Should be "Bb4"

    // Simulate isNoteDisabled logic
    const noteWithoutOctave = getNoteWithoutOctave(noteWithOctave);
    console.log("noteWithoutOctave:", noteWithoutOctave); // Should be "Bb"

    const isDirectlyInKey = isNoteInKey(noteWithoutOctave, selectedKey);
    console.log('isNoteInKey("Bb", "F"):', isDirectlyInKey); // Should be true

    // Check enharmonic logic
    const isCurrentKeyFlat = flatKeys.includes(selectedKey);
    console.log("isCurrentKeyFlat:", isCurrentKeyFlat); // Should be true

    const enharmonicMap: Record<string, string> = {
      ...(isCurrentKeyFlat
        ? {
            "C#": "Db",
            "D#": "Eb",
            "F#": "Gb",
            "G#": "Ab",
            "A#": "Bb",
          }
        : {}),
      ...(!isCurrentKeyFlat
        ? {
            Db: "C#",
            Eb: "D#",
            Gb: "F#",
            Ab: "G#",
            Bb: "A#",
          }
        : {}),
    };

    const enharmonic = enharmonicMap[noteWithoutOctave];
    console.log("enharmonic:", enharmonic);

    if (enharmonic) {
      const isEnharmonicInKey = isNoteInKey(enharmonic, selectedKey);
      console.log(
        `isNoteInKey("${enharmonic}", "${selectedKey}"):`,
        isEnharmonicInKey,
      );
    }

    const shouldBeDisabled = !(
      isDirectlyInKey ||
      (enharmonic && isNoteInKey(enharmonic, selectedKey))
    );
    console.log("shouldBeDisabled:", shouldBeDisabled);

    expect(shouldBeDisabled).toBe(false); // Should not be disabled
  });
});
