import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Keyboard } from "./app/components/Keyboard";

describe("Problematic Keys", () => {
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

  test("F# major should work", () => {
    const { getAllByText, queryByText } = renderKeyboard("F#");

    // Check if we can find some black keys that should be enabled
    console.log("Testing F# major...");

    // Try to find any enabled keys
    try {
      const sharpKeys = getAllByText(/[A-G]#/);
      console.log("Found sharp keys:", sharpKeys.length);
    } catch (e) {
      console.log("No sharp keys found");
    }

    // F# major should have these notes: F#, G#, A#, B, C#, D#, E#
    // Let's check if any black keys are showing
    const blackKeyNotes = ["F#", "G#", "A#", "C#", "D#"];
    let enabledBlackKeys = 0;

    blackKeyNotes.forEach((note) => {
      try {
        const keys = getAllByText(note);
        console.log(`Found ${note}: ${keys.length} keys`);
        enabledBlackKeys += keys.length;
      } catch (e) {
        console.log(`${note} not found (disabled)`);
      }
    });

    console.log(`Total enabled black keys: ${enabledBlackKeys}`);

    // F# major should have at least some black keys enabled
    expect(enabledBlackKeys).toBeGreaterThan(0);
  });

  test("B major should work", () => {
    const { getAllByText, queryByText } = renderKeyboard("B");

    console.log("Testing B major...");

    // B major should have these notes: B, C#, D#, E, F#, G#, A#
    const blackKeyNotes = ["C#", "D#", "F#", "G#", "A#"];
    let enabledBlackKeys = 0;

    blackKeyNotes.forEach((note) => {
      try {
        const keys = getAllByText(note);
        console.log(`Found ${note}: ${keys.length} keys`);
        enabledBlackKeys += keys.length;
      } catch (e) {
        console.log(`${note} not found (disabled)`);
      }
    });

    console.log(`Total enabled black keys: ${enabledBlackKeys}`);

    // B major should have at least some black keys enabled
    expect(enabledBlackKeys).toBeGreaterThan(0);
  });

  test("Ab major should work", () => {
    const { getAllByText, queryByText } = renderKeyboard("Ab");

    console.log("Testing Ab major...");

    // Ab major should have these notes: Ab, Bb, C, Db, Eb, F, G
    const blackKeyNotes = ["Ab", "Bb", "Db", "Eb"];
    let enabledBlackKeys = 0;

    blackKeyNotes.forEach((note) => {
      try {
        const keys = getAllByText(note);
        console.log(`Found ${note}: ${keys.length} keys`);
        enabledBlackKeys += keys.length;
      } catch (e) {
        console.log(`${note} not found (disabled)`);
      }
    });

    console.log(`Total enabled black keys: ${enabledBlackKeys}`);

    // Ab major should have at least some black keys enabled
    expect(enabledBlackKeys).toBeGreaterThan(0);
  });
});
