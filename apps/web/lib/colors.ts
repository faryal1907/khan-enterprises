// lib/colors.ts
export const colors = {
  // Maroon family (replaces the old navy/blue tones)
  maroon: "#5E1414", // deepest maroon  (was navy)
  maroonDeep: "#7A1F1F", // primary maroon (was ocean)
  maroonSoft: "#9E3B3B", // lighter maroon (was azure)
  maroonTint: "#E9C9C9", // soft maroon tint (was sky)
  blush: "#FBF4F4", // very light maroon-tinted background (was ice)

  // Lime accent
  lime: "#B7D640",
  limeSoft: "#D3E883",

  white: "#FFFFFF",
  gray50: "#FAFAFA",
  gray100: "#F5F5F5",
  gray200: "#E5E5E5",
  gray300: "#D4D4D4",
  gray400: "#A3A3A3",
  gray500: "#737373",
  gray600: "#525252",
  gray700: "#404040",
  gray800: "#262626",
  gray900: "#171717",
} as const;

export const theme = {
  colors,
  backgrounds: {
    primary: colors.blush,
    secondary: colors.white,
    tertiary: colors.gray50,
    dark: colors.maroon,
  },
  text: {
    primary: colors.maroon,
    secondary: colors.gray600,
    muted: colors.gray400,
    inverse: colors.white,
  },
  accents: {
    primary: colors.maroonDeep,
    secondary: colors.lime,
    tertiary: colors.maroonTint,
    highlight: colors.lime,
  },
  borders: {
    light: colors.gray200,
    medium: colors.gray300,
    dark: colors.gray400,
  },
};
