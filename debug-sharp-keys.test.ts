import { _getNotesInKey, isNoteInKey } from "./app/utils/keys";

describe("Debug sharp keys", () => {
  test("Check F# major definition", () => {
    const fSharpNotes = _getNotesInKey("F#");
    console.log("F# major notes:", fSharpNotes);

    // Test individual black key notes
    const blackKeys = ["F#", "G#", "A#", "C#", "D#"];
    blackKeys.forEach((note) => {
      const inKey = isNoteInKey(note, "F#");
      console.log(`isNoteInKey("${note}", "F#"):`, inKey);
    });
  });

  test("Check B major definition", () => {
    const bMajorNotes = _getNotesInKey("B");
    console.log("B major notes:", bMajorNotes);

    // Test individual black key notes
    const blackKeys = ["C#", "D#", "F#", "G#", "A#"];
    blackKeys.forEach((note) => {
      const inKey = isNoteInKey(note, "B");
      console.log(`isNoteInKey("${note}", "B"):`, inKey);
    });
  });

  test("Check if F# key is recognized", () => {
    console.log("Testing key recognition...");
    console.log('isNoteInKey("F#", "F#"):', isNoteInKey("F#", "F#"));
    console.log('isNoteInKey("F", "F#"):', isNoteInKey("F", "F#"));
    console.log('isNoteInKey("C#", "B"):', isNoteInKey("C#", "B"));
  });
});
