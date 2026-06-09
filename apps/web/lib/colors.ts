export const colors = {
  navy: "#0A1931",
  sky: "#B3CFE5",
  azure: "#4A7FA7",
  ocean: "#1A3D63",
  ice: "#F6FAFD",
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
    primary: colors.ice,
    secondary: colors.white,
    tertiary: colors.gray50,
    dark: colors.navy,
  },
  text: {
    primary: colors.navy,
    secondary: colors.gray600,
    muted: colors.gray400,
    inverse: colors.white,
  },
  accents: {
    primary: colors.ocean,
    secondary: colors.azure,
    tertiary: colors.sky,
    highlight: colors.navy,
  },
  borders: {
    light: colors.gray200,
    medium: colors.gray300,
    dark: colors.gray400,
  },
};
