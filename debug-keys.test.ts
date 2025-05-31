import { _getNotesInKey, isNoteInKey } from "./app/utils/keys";

describe("Key function debugging", () => {
  test("F major key tests", () => {
    const fMajorNotes = _getNotesInKey("F");
    console.log("F major notes:", fMajorNotes);

    console.log('isNoteInKey("Bb", "F"):', isNoteInKey("Bb", "F"));
    console.log('isNoteInKey("A#", "F"):', isNoteInKey("A#", "F"));

    expect(isNoteInKey("Bb", "F")).toBe(true);
  });

  test("D major key tests", () => {
    const dMajorNotes = _getNotesInKey("D");
    console.log("D major notes:", dMajorNotes);

    console.log('isNoteInKey("F#", "D"):', isNoteInKey("F#", "D"));
    console.log('isNoteInKey("Gb", "D"):', isNoteInKey("Gb", "D"));

    expect(isNoteInKey("F#", "D")).toBe(true);
  });

  test("Ab major key tests", () => {
    const abMajorNotes = _getNotesInKey("Ab");
    console.log("Ab major notes:", abMajorNotes);

    console.log('isNoteInKey("Ab", "Ab"):', isNoteInKey("Ab", "Ab"));
    console.log('isNoteInKey("Bb", "Ab"):', isNoteInKey("Bb", "Ab"));
    console.log('isNoteInKey("C", "Ab"):', isNoteInKey("C", "Ab"));

    expect(isNoteInKey("Ab", "Ab")).toBe(true);
    expect(isNoteInKey("Bb", "Ab")).toBe(true);
    expect(isNoteInKey("C", "Ab")).toBe(true);
  });
});
