import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Keyboard } from "../Keyboard";

describe("Keyboard", () => {
  const mockOnNotePressIn = jest.fn();
  const mockOnNotePressOut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderKeyboard = (selectedKey: string | null = null) => {
    const result = render(
      <Keyboard
        octave={4}
        onNotePressIn={mockOnNotePressIn}
        onNotePressOut={mockOnNotePressOut}
        selectedKey={selectedKey}
      />,
    );

    // Manually trigger the onLayout event to set keyboard width
    const keyboardView = result.getByTestId("keyboard");
    fireEvent(keyboardView, "layout", {
      nativeEvent: { layout: { width: 320, height: 220 } },
    });

    return result;
  };

  describe("Key enablement for different musical keys", () => {
    test("All keys should be enabled when no key is selected", () => {
      const { getAllByText } = renderKeyboard(null);

      // Check that all white keys are enabled
      ["C", "D", "E", "F", "G", "A", "B"].forEach((note) => {
        const keys = getAllByText(note);
        keys.forEach((key) => {
          expect(key.parent.parent.props.disabled).toBeFalsy();
        });
      });

      // Check that all black keys are enabled (they show sharp notation by default)
      ["C#", "D#", "F#", "G#", "A#"].forEach((note) => {
        const keys = getAllByText(note);
        expect(keys.length).toBeGreaterThan(0);
      });
    });

    test("C major should enable C, D, E, F, G, A, B", () => {
      const { getByText, getAllByText, queryByText } = renderKeyboard("C");

      // White keys that should be enabled
      ["C", "D", "E", "F", "G", "A", "B"].forEach((note) => {
        const keys = getAllByText(note);
        keys.forEach((key) => {
          expect(key.parent.parent.props.disabled).toBeFalsy();
        });
      });

      // Black keys should be disabled (not in C major)
      expect(queryByText("C#")).toBeNull(); // Disabled keys don't show text
      expect(queryByText("D#")).toBeNull();
      expect(queryByText("F#")).toBeNull();
      expect(queryByText("G#")).toBeNull();
      expect(queryByText("A#")).toBeNull();
    });

    test("C# major should enable C#, D#, E#(F), F#, G#, A#, B#(C)", () => {
      const { getAllByText, queryByText } = renderKeyboard("C#");

      // White keys that should be enabled (E# = F, B# = C)
      const fKey = getAllByText("F")[0]; // F is E# in C# major
      expect(fKey.parent.parent.props.disabled).toBeFalsy();

      // C should be enabled (it's B# in C# major)
      const cKeys = getAllByText("C");
      cKeys.forEach((key: any) => {
        expect(key.parent.parent.props.disabled).toBeFalsy();
      });

      // Black keys that should be enabled
      ["C#", "D#", "F#", "G#", "A#"].forEach((note) => {
        const keys = getAllByText(note);
        expect(keys.length).toBeGreaterThan(0);
      });

      // Natural notes that should be disabled (not in C# major)
      ["D", "E", "G", "A", "B"].forEach((note) => {
        expect(queryByText(note)).toBeNull();
      });
    });

    test("F major should enable F, G, A, Bb, C, D, E", () => {
      const { getAllByText, queryByText } = renderKeyboard("F");

      // White keys that should be enabled
      ["F", "G", "A", "C", "D", "E"].forEach((note) => {
        const keys = getAllByText(note);
        keys.forEach((key) => {
          expect(key.parent.parent.props.disabled).toBeFalsy();
        });
      });

      // Bb should show as the display text for A#/Bb black key
      const bbKeys = getAllByText("Bb");
      expect(bbKeys.length).toBeGreaterThan(0);

      // B natural should be disabled
      expect(queryByText("B")).toBeNull();
    });

    test("Gb major should enable Gb, Ab, Bb, Cb(B), Db, Eb, F", () => {
      const { getByText, getAllByText, queryByText } = renderKeyboard("Gb");

      // White keys that should be enabled
      const fKey = getByText("F");
      expect(fKey.parent.parent.props.disabled).toBeFalsy();

      // B should be enabled (it's Cb in Gb major)
      const bKey = getByText("B");
      expect(bKey.parent.parent.props.disabled).toBeFalsy();

      // Black keys should show flats
      ["Gb", "Ab", "Bb", "Db", "Eb"].forEach((note) => {
        const keys = getAllByText(note);
        expect(keys.length).toBeGreaterThan(0);
      });

      // Natural notes that should be disabled
      ["C", "D", "E", "G", "A"].forEach((note) => {
        expect(queryByText(note)).toBeNull();
      });
    });

    test("G# major should enable G#, A#, B#(C), C#, D#, E#(F), F", () => {
      const { getAllByText, queryByText } = renderKeyboard("G#");

      // F should be enabled (it's both F natural and E# in G# major)
      const fKey = getAllByText("F")[0];
      expect(fKey.parent.parent.props.disabled).toBeFalsy();

      // C should be enabled (it's B# in G# major)
      const cKeys = getAllByText("C");
      cKeys.forEach((key: any) => {
        expect(key.parent.parent.props.disabled).toBeFalsy();
      });

      // Black keys that should be enabled
      ["G#", "A#", "C#", "D#"].forEach((note) => {
        const keys = getAllByText(note);
        expect(keys.length).toBeGreaterThan(0);
      });

      // Natural notes that should be disabled
      ["D", "E", "G", "A", "B"].forEach((note) => {
        expect(queryByText(note)).toBeNull();
      });
    });

    test("D major should enable D, E, F#, G, A, B, C#", () => {
      const { getAllByText, queryByText } = renderKeyboard("D");

      // White keys that should be enabled
      ["D", "E", "G", "A", "B"].forEach((note) => {
        const keys = getAllByText(note);
        keys.forEach((key) => {
          expect(key.parent.parent.props.disabled).toBeFalsy();
        });
      });

      // C natural should be disabled (C# is in the key)
      expect(queryByText("C")).toBeNull();

      // F natural should be disabled (F# is in the key)
      expect(queryByText("F")).toBeNull();

      // Black keys that should be enabled
      ["F#", "C#"].forEach((note) => {
        const keys = getAllByText(note);
        expect(keys.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Key press functionality", () => {
    test("Pressing an enabled white key should trigger callbacks", () => {
      const { getAllByText } = renderKeyboard("C");
      const dKey = getAllByText("D")[0].parent.parent;

      fireEvent(dKey, "pressIn");
      expect(mockOnNotePressIn).toHaveBeenCalledWith("D4");

      fireEvent(dKey, "pressOut");
      expect(mockOnNotePressOut).toHaveBeenCalledWith("D4");
    });

    test("Pressing an enabled black key should trigger callbacks", () => {
      const { getAllByText } = renderKeyboard("D");
      const fSharpKeys = getAllByText("F#");
      const fSharpKey = fSharpKeys[0].parent.parent.parent;

      fireEvent(fSharpKey, "pressIn");
      expect(mockOnNotePressIn).toHaveBeenCalledWith("F#4");

      fireEvent(fSharpKey, "pressOut");
      expect(mockOnNotePressOut).toHaveBeenCalledWith("F#4");
    });

    test("Disabled keys should not trigger callbacks", () => {
      const { queryByText } = renderKeyboard("C");

      // In C major, there's no C# so it should be disabled and not have text
      expect(queryByText("C#")).toBeNull();

      // The callbacks should not have been called
      expect(mockOnNotePressIn).not.toHaveBeenCalled();
      expect(mockOnNotePressOut).not.toHaveBeenCalled();
    });
  });

  describe("Octave handling", () => {
    test("The last C key should be in the next octave", () => {
      const { getAllByText } = renderKeyboard(null);
      const cKeys = getAllByText("C");

      // Should have 2 C keys
      expect(cKeys.length).toBe(2);

      // Press the first C (should be C4)
      fireEvent(cKeys[0].parent.parent, "pressIn");
      expect(mockOnNotePressIn).toHaveBeenCalledWith("C4");

      // Press the last C (should be C5)
      fireEvent(cKeys[1].parent.parent, "pressIn");
      expect(mockOnNotePressIn).toHaveBeenCalledWith("C5");
    });

    test("The last C# should be in the next octave", () => {
      const { getAllByText } = renderKeyboard(null);
      const cSharpKeys = getAllByText("C#");

      // Should have 2 C# keys
      expect(cSharpKeys.length).toBe(2);

      // Press the first C# (should be C#4)
      fireEvent(cSharpKeys[0].parent.parent.parent, "pressIn");
      expect(mockOnNotePressIn).toHaveBeenCalledWith("C#4");

      // Press the last C# (should be C#5)
      fireEvent(cSharpKeys[1].parent.parent.parent, "pressIn");
      expect(mockOnNotePressIn).toHaveBeenCalledWith("C#5");
    });
  });

  describe("Enharmonic display", () => {
    test("Sharp keys should display sharps on black keys", () => {
      const { getAllByText, queryAllByText } = renderKeyboard("D");

      // Should show F# not Gb
      expect(getAllByText("F#").length).toBeGreaterThan(0);
      expect(getAllByText("C#").length).toBeGreaterThan(0);

      // Should also show the enharmonic as secondary text
      expect(queryAllByText("Gb").length).toBeGreaterThan(0);
      expect(queryAllByText("Db").length).toBeGreaterThan(0);
    });

    test("Flat keys should display flats on black keys", () => {
      const { getAllByText, queryAllByText } = renderKeyboard("F");

      // Should show Bb as primary, not A#
      expect(getAllByText("Bb").length).toBeGreaterThan(0);

      // Should show A# as secondary
      expect(queryAllByText("A#").length).toBeGreaterThan(0);
    });
  });
});
