import { Dimensions } from "react-native";

// Standard iPhone SE width is 375pt
const SMALL_SCREEN_WIDTH = 393;

export function isSmallScreen() {
  const { width, height } = Dimensions.get("window");
  return Math.min(width, height) <= SMALL_SCREEN_WIDTH;
}

export const FONT_SIZES = {
  qualityButtonText: {
    normal: 16,
    small: 14,
  },
  qualityButtonDescription: {
    normal: 12,
    small: 10,
  },
  blackKeyText: {
    normal: 14,
    small: 12,
  },
  blackKeyFlatText: {
    normal: 14,
    small: 12,
  },
  keyText: {
    normal: 14,
    small: 12,
  },
};
