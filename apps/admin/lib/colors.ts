// lib/admin-colors.ts
// Professional admin theme: neutral, high-contrast, minimal.
// Maroon + lime are used ONLY as restrained brand accents — never as
// body text or page backgrounds — so the UI stays easy to read long-term.
export const colors = {
  // Maroon family (brand accent)
  maroon: "#5E1414", // deepest maroon
  maroonDeep: "#7A1F1F", // primary maroon (primary actions)
  maroonSoft: "#7A1F1F", // lighter maroon (hover/secondary)
  maroonTint: "#5E1414", // very soft maroon wash (subtle highlights)

  // Lime accent
  lime: "#B7D640",
  limeSoft: "#E4EFBF", // soft lime wash for success/positive surfaces

  white: "#FFFFFF",
  gray50: "#FAFAFA",
  gray100: "#F4F4F5",
  gray200: "#E5E5E5",
  gray300: "#D4D4D4",
  gray400: "#A3A3A3",
  gray500: "#737373",
  gray600: "#525252",
  gray700: "#404040",
  gray800: "#262626",
  gray900: "#18181B",
} as const;

export const theme = {
  colors,
  backgrounds: {
    primary: colors.white, // cards / primary surfaces stay clean white
    secondary: colors.gray50, // app shell / page background
    tertiary: colors.gray100, // subtle zebra / nested surfaces
    dark: colors.maroon, // sidebar / dark chrome
  },
  text: {
    primary: colors.gray900, // body + headings: neutral, max readability
    secondary: colors.gray600, // supporting copy
    muted: colors.gray400, // labels / placeholders
    inverse: colors.white, // text on dark / maroon surfaces
    brand: colors.maroonDeep, // optional brand-tinted emphasis
  },
  accents: {
    primary: colors.maroonDeep, // primary buttons / key actions
    primaryHover: colors.maroon,
    secondary: colors.lime, // positive / highlight accents
    tertiary: colors.maroonTint, // soft highlight backgrounds
    highlight: colors.lime,
    error: "#EF4444", // standard red for errors
  },
  borders: {
    light: colors.gray200,
    medium: colors.gray300,
    dark: colors.gray400,
  },
};
