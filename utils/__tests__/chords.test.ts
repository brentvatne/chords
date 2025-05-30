import {
    ChordSelection,
    ExtensionType,
    getChordInfo,
    mapSelectionToTonalType,
    MusicalNoteWithOctave,
    TriadType
} from '../chords';

// Helper function to generate all possible combinations of extensions
function generateExtensionCombinations(extensions: ExtensionType[]): ExtensionType[][] {
  const result: ExtensionType[][] = [[]];
  for (let i = 0; i < extensions.length; i++) {
    const len = result.length;
    for (let j = 0; j < len; j++) {
      result.push([...result[j], extensions[i]]);
    }
  }
  return result;
}

describe('mapSelectionToTonalType', () => {
  const TRIADS: TriadType[] = ['major', 'minor', 'dim', 'sus'];
  const EXTENSIONS: ExtensionType[] = ['6', 'm7', 'M7', '9'];
  const allExtensionCombos = generateExtensionCombinations(EXTENSIONS);

  // Test basic triads
  test('basic triads', () => {
    const cases: [ChordSelection, string][] = [
      [{ triad: 'major', extensions: [] }, 'M'],
      [{ triad: 'minor', extensions: [] }, 'm'],
      [{ triad: 'dim', extensions: [] }, 'dim'],
      [{ triad: 'sus', extensions: [] }, 'sus4'],
    ];

    cases.forEach(([input, expected]) => {
      expect(mapSelectionToTonalType(input)).toBe(expected);
    });
  });

  // Test major chords with all extension combinations
  test('major chords with extensions', () => {
    const cases: [ChordSelection, string][] = [
      // Single extensions
      [{ triad: 'major', extensions: ['6'] }, 'M6'],
      [{ triad: 'major', extensions: ['M7'] }, 'maj7'],
      [{ triad: 'major', extensions: ['9'] }, 'Madd9'],
      // Double extensions
      [{ triad: 'major', extensions: ['M7', '6'] }, 'maj7add6'],
      [{ triad: 'major', extensions: ['M7', '9'] }, 'maj79'],
      [{ triad: 'major', extensions: ['6', '9'] }, 'M69'],
      // Triple extensions
      [{ triad: 'major', extensions: ['M7', '6', '9'] }, 'maj769'],
    ];

    cases.forEach(([input, expected]) => {
      expect(mapSelectionToTonalType(input)).toBe(expected);
    });
  });

  // Test minor chords with all extension combinations
  test('minor chords with extensions', () => {
    const cases: [ChordSelection, string][] = [
      // Single extensions
      [{ triad: 'minor', extensions: ['6'] }, 'm6'],
      [{ triad: 'minor', extensions: ['m7'] }, 'm7'],
      [{ triad: 'minor', extensions: ['9'] }, 'madd9'],
      // Double extensions
      [{ triad: 'minor', extensions: ['m7', '6'] }, 'm7add6'],
      [{ triad: 'minor', extensions: ['m7', '9'] }, 'm79'],
      [{ triad: 'minor', extensions: ['6', '9'] }, 'm69'],
      // Triple extensions
      [{ triad: 'minor', extensions: ['m7', '6', '9'] }, 'm769'],
    ];

    cases.forEach(([input, expected]) => {
      expect(mapSelectionToTonalType(input)).toBe(expected);
    });
  });

  // Test diminished chords with all extension combinations
  test('diminished chords with extensions', () => {
    const cases: [ChordSelection, string][] = [
      // Single extensions
      [{ triad: 'dim', extensions: ['6'] }, 'dim6'],
      [{ triad: 'dim', extensions: ['m7'] }, 'dim7'],
      [{ triad: 'dim', extensions: ['9'] }, 'dimadd9'],
      // Double extensions
      [{ triad: 'dim', extensions: ['m7', '6'] }, 'dim7add6'],
      [{ triad: 'dim', extensions: ['m7', '9'] }, 'dim79'],
      [{ triad: 'dim', extensions: ['6', '9'] }, 'dim69'],
      // Triple extensions
      [{ triad: 'dim', extensions: ['m7', '6', '9'] }, 'dim769'],
    ];

    cases.forEach(([input, expected]) => {
      expect(mapSelectionToTonalType(input)).toBe(expected);
    });
  });

  // Test sus chords with all extension combinations
  test('sus chords with extensions', () => {
    const cases: [ChordSelection, string][] = [
      // Single extensions
      [{ triad: 'sus', extensions: ['6'] }, 'sus46'],
      [{ triad: 'sus', extensions: ['m7'] }, '7sus4'],
      [{ triad: 'sus', extensions: ['9'] }, 'sus4add9'],
      // Double extensions
      [{ triad: 'sus', extensions: ['m7', '6'] }, '7sus4add6'],
      [{ triad: 'sus', extensions: ['m7', '9'] }, '7sus49'],
      [{ triad: 'sus', extensions: ['6', '9'] }, 'sus469'],
      // Triple extensions
      [{ triad: 'sus', extensions: ['m7', '6', '9'] }, '7sus469'],
    ];

    cases.forEach(([input, expected]) => {
      expect(mapSelectionToTonalType(input)).toBe(expected);
    });
  });
});

describe('getChordInfo', () => {
  const root = 'C4' as MusicalNoteWithOctave;

  // Test basic triads
  test('returns correct notes for basic triads', () => {
    const cases: [ChordSelection, string[]][] = [
      [{ triad: 'major', extensions: [] }, ['C', 'E', 'G']],
      [{ triad: 'minor', extensions: [] }, ['C', 'Eb', 'G']],
      [{ triad: 'dim', extensions: [] }, ['C', 'Eb', 'Gb']],
      [{ triad: 'sus', extensions: [] }, ['C', 'F', 'G']],
    ];

    cases.forEach(([selection, expectedNotes]) => {
      const result = getChordInfo(selection, root);
      expect(result?.notes).toEqual(expectedNotes);
    });
  });

  // Test major chords with extensions
  test('returns correct notes for major chords with extensions', () => {
    const cases: [ChordSelection, string[]][] = [
      [{ triad: 'major', extensions: ['6'] }, ['C', 'E', 'G', 'A']],
      [{ triad: 'major', extensions: ['M7'] }, ['C', 'E', 'G', 'B']],
      [{ triad: 'major', extensions: ['9'] }, ['C', 'E', 'G', 'D']],
      [{ triad: 'major', extensions: ['M7', '6'] }, ['C', 'E', 'G', 'A', 'B']],
      [{ triad: 'major', extensions: ['M7', '9'] }, ['C', 'E', 'G', 'B', 'D']],
      [{ triad: 'major', extensions: ['6', '9'] }, ['C', 'E', 'G', 'A', 'D']],
      [{ triad: 'major', extensions: ['M7', '6', '9'] }, ['C', 'E', 'G', 'A', 'B', 'D']],
    ];

    cases.forEach(([selection, expectedNotes]) => {
      const result = getChordInfo(selection, root);
      expect(result?.notes).toEqual(expectedNotes);
    });
  });

  // Test minor chords with extensions
  test('returns correct notes for minor chords with extensions', () => {
    const cases: [ChordSelection, string[]][] = [
      [{ triad: 'minor', extensions: ['6'] }, ['C', 'Eb', 'G', 'A']],
      [{ triad: 'minor', extensions: ['m7'] }, ['C', 'Eb', 'G', 'Bb']],
      [{ triad: 'minor', extensions: ['9'] }, ['C', 'Eb', 'G', 'D']],
      [{ triad: 'minor', extensions: ['m7', '6'] }, ['C', 'Eb', 'G', 'A', 'Bb']],
      [{ triad: 'minor', extensions: ['m7', '9'] }, ['C', 'Eb', 'G', 'Bb', 'D']],
      [{ triad: 'minor', extensions: ['6', '9'] }, ['C', 'Eb', 'G', 'A', 'D']],
      [{ triad: 'minor', extensions: ['m7', '6', '9'] }, ['C', 'Eb', 'G', 'A', 'Bb', 'D']],
    ];

    cases.forEach(([selection, expectedNotes]) => {
      const result = getChordInfo(selection, root);
      expect(result?.notes).toEqual(expectedNotes);
    });
  });

  // Test sus chords with extensions
  test('returns correct notes for sus chords with extensions', () => {
    const cases: [ChordSelection, string[]][] = [
      [{ triad: 'sus', extensions: ['6'] }, ['C', 'F', 'G', 'A']],
      [{ triad: 'sus', extensions: ['m7'] }, ['C', 'F', 'G', 'Bb']],
      [{ triad: 'sus', extensions: ['9'] }, ['C', 'F', 'G', 'D']],
      [{ triad: 'sus', extensions: ['m7', '6'] }, ['C', 'F', 'G', 'A', 'Bb']],
      [{ triad: 'sus', extensions: ['m7', '9'] }, ['C', 'F', 'G', 'Bb', 'D']],
      [{ triad: 'sus', extensions: ['6', '9'] }, ['C', 'F', 'G', 'A', 'D']],
      [{ triad: 'sus', extensions: ['m7', '6', '9'] }, ['C', 'F', 'G', 'A', 'Bb', 'D']],
    ];

    cases.forEach(([selection, expectedNotes]) => {
      const result = getChordInfo(selection, root);
      expect(result?.notes).toEqual(expectedNotes);
    });
  });

  // Test chord name formatting
  test('formats chord names correctly', () => {
    const cases: [ChordSelection, string][] = [
      // Basic triads
      [{ triad: 'major', extensions: [] }, 'C major'],
      [{ triad: 'minor', extensions: [] }, 'C minor'],
      [{ triad: 'dim', extensions: [] }, 'C diminished'],
      [{ triad: 'sus', extensions: [] }, 'C suspended'],
      
      // Major chord extensions
      [{ triad: 'major', extensions: ['M7'] }, 'C major 7th'],
      [{ triad: 'major', extensions: ['M7', '9'] }, 'C major 7th 9th'],
      [{ triad: 'major', extensions: ['M7', '6'] }, 'C major 7th 6th'],
      [{ triad: 'major', extensions: ['6'] }, 'C major 6th'],
      [{ triad: 'major', extensions: ['9'] }, 'C major 9th'],
      [{ triad: 'major', extensions: ['6', '9'] }, 'C major 6th 9th'],
      [{ triad: 'major', extensions: ['M7', '6', '9'] }, 'C major 7th 6th 9th'],
      
      // Minor chord extensions  
      [{ triad: 'minor', extensions: ['m7'] }, 'C minor 7th'],
      [{ triad: 'minor', extensions: ['m7', '9'] }, 'C minor 7th 9th'],
      [{ triad: 'minor', extensions: ['6'] }, 'C minor 6th'],
      
      // Sus chord extensions
      [{ triad: 'sus', extensions: ['m7'] }, 'C suspended 7th'],
      [{ triad: 'sus', extensions: ['9'] }, 'C suspended 9th'],
    ];

    cases.forEach(([selection, expectedName]) => {
      const result = getChordInfo(selection, root);
      expect(result?.name.trim()).toBe(expectedName);
    });
  });
}); 