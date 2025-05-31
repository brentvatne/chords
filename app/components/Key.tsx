import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { isNoteInKey, KeySignature } from "../utils/music-theory";
import { FONT_SIZES, isSmallScreen } from "../utils/screen";

interface KeyProps {
  note: string;
  isBlack: boolean;
  onPressIn: () => void;
  onPressOut: () => void;
  selectedKey: KeySignature | null;
}

const styles = StyleSheet.create({
  whiteKey: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    flex: 1,
    marginHorizontal: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 10,
    height: "100%",
  },
  whiteKeyDisabled: {
    backgroundColor: "#EEEEEE",
  },
  blackKey: {
    backgroundColor: "#000000",
    width: "50%",
    height: "65%",
    position: "absolute",
    right: "-25%",
    zIndex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 10,
  },
  blackKeyDisabled: {
    backgroundColor: "#333333",
  },
  keyText: {
    color: "#000000",
    fontSize: isSmallScreen()
      ? FONT_SIZES.keyText.small
      : FONT_SIZES.keyText.normal,
    fontWeight: "500",
  },
  blackKeyText: {
    color: "#FFFFFF",
  },
  inKey: {
    backgroundColor: "#E89D45",
  },
  inKeyDisabled: {
    backgroundColor: "#D5D5D5",
  },
  inKeyBlack: {
    backgroundColor: "#C87D25",
  },
  inKeyBlackDisabled: {
    backgroundColor: "#333333",
  },
});

export function Key({
  note,
  isBlack,
  onPressIn,
  onPressOut,
  selectedKey,
}: KeyProps) {
  const inKey = selectedKey ? isNoteInKey(note, selectedKey) : true;
  const isDisabled = !inKey;

  return (
    <Pressable
      style={[
        isBlack ? styles.blackKey : styles.whiteKey,
        isDisabled &&
          (isBlack ? styles.blackKeyDisabled : styles.whiteKeyDisabled),
        inKey && (isBlack ? styles.inKeyBlack : styles.inKey),
        isDisabled &&
          inKey &&
          (isBlack ? styles.inKeyBlackDisabled : styles.inKeyDisabled),
      ]}
      onPressIn={inKey ? onPressIn : undefined}
      onPressOut={inKey ? onPressOut : undefined}
      disabled={isDisabled}
    >
      <Text
        style={[
          styles.keyText,
          isBlack && styles.blackKeyText,
          { opacity: isDisabled ? 0.4 : 1 },
        ]}
      >
        {note}
      </Text>
    </Pressable>
  );
}
