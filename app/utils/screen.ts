import { Dimensions } from "react-native";

// Standard iPhone SE width is 375pt
const SMALL_SCREEN_WIDTH = 393;

export function isSmallScreen() {
  const { width } = Dimensions.get("window");
  return width <= SMALL_SCREEN_WIDTH;
}

export const FONT_SIZES = {
  qualityButtonText: {
    normal: 20,
    small: 12,
  },
  qualityButtonDescription: {
    normal: 12,
    small: 8,
  },
  blackKeyText: {
    normal: 16,
    small: 10,
  },
  blackKeyFlatText: {
    normal: 14,
    small: 8,
  },
};
