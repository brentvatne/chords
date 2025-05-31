import Storage from "expo-sqlite/kv-store";
import { ChordInfo, ExtensionType, TriadType } from "./chords";

export const STORAGE_KEYS = {
  LAST_CONNECTED_DEVICE: "lastConnectedDeviceId",
  LAST_SELECTED_KEY: "lastSelectedKey",
  LAST_OCTAVE: "lastOctave",
  LAST_TRIAD: "lastTriad",
  LAST_EXTENSIONS: "lastExtensions",
  CHORD_HISTORY: "chordHistory",
  LAST_PLAYED_CHORD: "lastPlayedChord",
  FAVORITE_CHORDS: "favoriteChords",
} as const;

export function getLastConnectedDeviceId(): string | null {
  return Storage.getItemSync(STORAGE_KEYS.LAST_CONNECTED_DEVICE);
}

export function setLastConnectedDeviceId(deviceId: string | null): void {
  if (deviceId) {
    Storage.setItemSync(STORAGE_KEYS.LAST_CONNECTED_DEVICE, deviceId);
  } else {
    Storage.removeItemSync(STORAGE_KEYS.LAST_CONNECTED_DEVICE);
  }
}

export function getLastSelectedKey(): string | null {
  const key = Storage.getItemSync(STORAGE_KEYS.LAST_SELECTED_KEY);
  return key === "__ALL__" ? null : key;
}

export function setLastSelectedKey(key: string | null): void {
  if (key === null) {
    Storage.setItemSync(STORAGE_KEYS.LAST_SELECTED_KEY, "__ALL__");
  } else if (key) {
    Storage.setItemSync(STORAGE_KEYS.LAST_SELECTED_KEY, key);
  } else {
    Storage.removeItemSync(STORAGE_KEYS.LAST_SELECTED_KEY);
  }
}

export function getLastOctave(): number | null {
  const octave = Storage.getItemSync(STORAGE_KEYS.LAST_OCTAVE);
  return octave ? parseInt(octave, 10) : null;
}

export function setLastOctave(octave: number): void {
  Storage.setItemSync(STORAGE_KEYS.LAST_OCTAVE, octave.toString());
}

export function getLastTriad(): TriadType | null {
  const triad = Storage.getItemSync(STORAGE_KEYS.LAST_TRIAD);
  if (!triad) return null;
  // Handle both JSON-stringified and raw string values
  try {
    return JSON.parse(triad) as TriadType;
  } catch {
    // If parsing fails, assume it's a raw string
    return triad as TriadType;
  }
}

export function setLastTriad(triad: TriadType | null): void {
  if (triad === null) {
    Storage.removeItemSync(STORAGE_KEYS.LAST_TRIAD);
  } else {
    // Store as raw string since we don't need JSON for simple strings
    Storage.setItemSync(STORAGE_KEYS.LAST_TRIAD, triad);
  }
}

export function getLastExtensions(): ExtensionType[] {
  const extensions = Storage.getItemSync(STORAGE_KEYS.LAST_EXTENSIONS);
  return extensions ? JSON.parse(extensions) : [];
}

export function setLastExtensions(extensions: ExtensionType[]): void {
  Storage.setItemSync(STORAGE_KEYS.LAST_EXTENSIONS, JSON.stringify(extensions));
}

export function getLastPlayedChord(): ChordInfo | null {
  const chord = Storage.getItemSync(STORAGE_KEYS.LAST_PLAYED_CHORD);
  return chord ? JSON.parse(chord) : null;
}

export function setLastPlayedChord(chord: ChordInfo | null): void {
  if (chord) {
    Storage.setItemSync(STORAGE_KEYS.LAST_PLAYED_CHORD, JSON.stringify(chord));
  } else {
    Storage.removeItemSync(STORAGE_KEYS.LAST_PLAYED_CHORD);
  }
}

export interface ChordHistoryEntry extends ChordInfo {
  timestamp: number;
}

export function addChordToHistory(chord: ChordInfo): void {
  const history = getChordHistory();
  const newEntry: ChordHistoryEntry = {
    ...chord,
    timestamp: Date.now(),
  };
  history.unshift(newEntry);
  // Keep only the last 100 chords
  if (history.length > 100) {
    history.pop();
  }
  Storage.setItemSync(STORAGE_KEYS.CHORD_HISTORY, JSON.stringify(history));
}

export function getChordHistory(): ChordHistoryEntry[] {
  const history = Storage.getItemSync(STORAGE_KEYS.CHORD_HISTORY);
  return history ? JSON.parse(history) : [];
}

export function getFavoriteChords(): ChordHistoryEntry[] {
  const favorites = Storage.getItemSync(STORAGE_KEYS.FAVORITE_CHORDS);
  return favorites ? JSON.parse(favorites) : [];
}

export function toggleFavoriteChord(chord: ChordHistoryEntry): void {
  const favorites = getFavoriteChords();
  const index = favorites.findIndex(
    (f) => f.name === chord.name && f.timestamp === chord.timestamp,
  );
  if (index === -1) {
    favorites.unshift(chord);
  } else {
    favorites.splice(index, 1);
  }
  Storage.setItemSync(STORAGE_KEYS.FAVORITE_CHORDS, JSON.stringify(favorites));
}

export function clearFavoriteChords(): void {
  Storage.removeItemSync(STORAGE_KEYS.FAVORITE_CHORDS);
}

export function clearChordHistory(): void {
  Storage.removeItemSync(STORAGE_KEYS.CHORD_HISTORY);
  Storage.removeItemSync(STORAGE_KEYS.LAST_PLAYED_CHORD);
}
