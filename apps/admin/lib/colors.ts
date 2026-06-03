export const colors = {
  wine: "#4F0803",
  spicy: "#AA1F1F",
  olive: "#4C4B1E",
  neon: "#C5D83F",
  espresso: "#150C0C",
  milk: "#F6E3CB",
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
    primary: colors.white,
    secondary: colors.milk,
    tertiary: colors.gray50,
    dark: colors.espresso,
  },
  text: {
    primary: colors.espresso,
    secondary: colors.gray600,
    muted: colors.gray400,
    inverse: colors.white,
  },
  accents: {
    primary: colors.wine,
    secondary: colors.spicy,
    tertiary: colors.olive,
    highlight: colors.neon,
  },
  borders: {
    light: colors.gray200,
    medium: colors.gray300,
    dark: colors.gray400,
  },
};
