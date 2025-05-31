import { _getNotesInKey, isNoteInKey } from "./app/utils/keys.ts";

console.log("F major notes:", _getNotesInKey("F"));
console.log('isNoteInKey("Bb", "F"):', isNoteInKey("Bb", "F"));
console.log('isNoteInKey("A#", "F"):', isNoteInKey("A#", "F"));

console.log("\nD major notes:", _getNotesInKey("D"));
console.log('isNoteInKey("F#", "D"):', isNoteInKey("F#", "D"));
console.log('isNoteInKey("Gb", "D"):', isNoteInKey("Gb", "D"));

console.log("\nAb major notes:", _getNotesInKey("Ab"));
console.log('isNoteInKey("Ab", "Ab"):', isNoteInKey("Ab", "Ab"));
console.log('isNoteInKey("Bb", "Ab"):', isNoteInKey("Bb", "Ab"));
console.log('isNoteInKey("C", "Ab"):', isNoteInKey("C", "Ab"));
