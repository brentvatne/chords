import Storage from "expo-sqlite/kv-store";
import { ExtensionType, TriadType } from "./chords";

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

export interface ChordHistoryEntry {
  name: string;
  notes: string[];
  timestamp: number;
}

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
  return Storage.getItemSync(STORAGE_KEYS.LAST_SELECTED_KEY);
}

export function setLastSelectedKey(key: string | null): void {
  if (key) {
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

export function getChordHistory(): ChordHistoryEntry[] {
  const history = Storage.getItemSync(STORAGE_KEYS.CHORD_HISTORY);
  return history ? JSON.parse(history) : [];
}

export function addChordToHistory(chord: {
  name: string;
  notes: string[];
}): void {
  const history = getChordHistory();
  const entry: ChordHistoryEntry = {
    ...chord,
    timestamp: Date.now(),
  };

  // Add to beginning, limit to 200 entries
  const newHistory = [entry, ...history].slice(0, 200);
  Storage.setItemSync(STORAGE_KEYS.CHORD_HISTORY, JSON.stringify(newHistory));

  // Also store as last played chord
  Storage.setItemSync(STORAGE_KEYS.LAST_PLAYED_CHORD, JSON.stringify(entry));
}

export function getLastPlayedChord(): ChordHistoryEntry | null {
  const chord = Storage.getItemSync(STORAGE_KEYS.LAST_PLAYED_CHORD);
  return chord ? JSON.parse(chord) : null;
}

export function clearChordHistory(): void {
  Storage.removeItemSync(STORAGE_KEYS.CHORD_HISTORY);
  Storage.removeItemSync(STORAGE_KEYS.LAST_PLAYED_CHORD);
}

export function getFavoriteChords(): string[] {
  const favorites = Storage.getItemSync(STORAGE_KEYS.FAVORITE_CHORDS);
  return favorites ? JSON.parse(favorites) : [];
}

export function toggleFavoriteChord(chordName: string): boolean {
  const favorites = getFavoriteChords();
  const isCurrentlyFavorited = favorites.includes(chordName);

  const newFavorites = isCurrentlyFavorited
    ? favorites.filter((name) => name !== chordName)
    : [...favorites, chordName];

  Storage.setItemSync(
    STORAGE_KEYS.FAVORITE_CHORDS,
    JSON.stringify(newFavorites),
  );
  return !isCurrentlyFavorited; // return new favorite state
}
