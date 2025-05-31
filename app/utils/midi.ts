import { MidiKeyboard } from "@/modules/simple-midi";

export async function sendNotesOnAsync(
  keyboard: MidiKeyboard,
  notes: number[],
  velocity: number,
) {
  await keyboard.playNotes(notes, velocity);
}

export async function sendNotesOffAsync(
  keyboard: MidiKeyboard,
  notes: number[],
) {
  await keyboard.releaseNotes(notes);
}
