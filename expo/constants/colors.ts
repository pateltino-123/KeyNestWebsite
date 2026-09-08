// KeyNest Realty Color Tokens
// Palette: Warm Beige (#FDFBF7 / #F7F3EB), Deep Charcoal (#22252A), and Soft Sage Green (#367A5E)

export const PALETTE = {
  // Warm Beige & Off-white canvas
  warmBeigeBg: "#FDFBF7",
  warmBeigeSurface: "#F7F3EB",
  warmBeigeCard: "#FFFFFF",
  warmBeigeBorder: "#E8E2D5",
  warmBeigeLight: "#FAF7F0",
  warmBeigeSubtle: "#EFE8DC",

  // Deep Charcoal Typography & Contrast
  charcoal: "#22252A",
  charcoalHeading: "#1C1E22",
  charcoalSoft: "#363B42",
  charcoalBody: "#4A515A",
  charcoalMuted: "#737B85",
  charcoalFooter: "#1A1D21",
  charcoalCard: "#23272D",

  // Soft Sage Green Accents (appealing, calming, natural)
  softGreen: "#367A5E",
  softGreenHover: "#285C47",
  softGreenLight: "#EDF5F1",
  softGreenPill: "#E4F0E8",
  softGreenBorder: "#C7E0D3",
  softGreenDark: "#1E4636",

  // Soft Blue backward-compatibility aliases mapped to Soft Sage Green
  softBlue: "#367A5E",
  softBlueHover: "#285C47",
  softBlueLight: "#EDF5F1",
  softBluePill: "#E4F0E8",
  softBlueBorder: "#C7E0D3",
  softBlueDark: "#1E4636",

  // Utility
  white: "#FFFFFF",
  black: "#111315",
  success: "#2E7D5B",
  successLight: "#EBF5F0",
  error: "#C84B4B",
  errorLight: "#FCEBEB",
  warning: "#D9822B",
  warningLight: "#FEF4EA",
};

export const lightTheme = {
  primary: PALETTE.softGreen,
  primaryLight: "#489474",
  accent: PALETTE.softGreen,
  accentLight: PALETTE.softGreenLight,
  accentDark: PALETTE.softGreenHover,
  brandNavy: PALETTE.charcoal,
  gold: "#C67D26",
  background: PALETTE.warmBeigeBg,
  surface: PALETTE.white,
  surfaceAlt: PALETTE.warmBeigeSurface,
  surfaceBeige: PALETTE.warmBeigeSurface,
  text: PALETTE.charcoal,
  textSecondary: PALETTE.charcoalBody,
  textMuted: PALETTE.charcoalMuted,
  border: PALETTE.warmBeigeBorder,
  borderLight: PALETTE.warmBeigeLight,
  success: PALETTE.success,
  successLight: PALETTE.successLight,
  error: PALETTE.error,
  errorLight: PALETTE.errorLight,
  warning: PALETTE.warning,
  warningLight: PALETTE.warningLight,
  white: PALETTE.white,
  black: PALETTE.black,
  overlay: "rgba(34, 37, 42, 0.6)",
  shadow: "rgba(34, 37, 42, 0.06)",
};

export const darkTheme = {
  primary: "#5EAB86",
  primaryLight: "#82C7A5",
  accent: "#5EAB86",
  accentLight: "#1D2D24",
  accentDark: "#214332",
  brandNavy: PALETTE.charcoalHeading,
  gold: "#E0953C",
  background: "#16181B",
  surface: "#1F2328",
  surfaceAlt: "#272C33",
  surfaceBeige: "#2A2F37",
  text: "#F5F3EF",
  textSecondary: "#A3ABB5",
  textMuted: "#737B85",
  border: "#333942",
  borderLight: "#262A31",
  success: "#34D399",
  successLight: "#133E2E",
  error: "#F87171",
  errorLight: "#3E1E1E",
  warning: "#FBBF24",
  warningLight: "#3E3114",
  white: PALETTE.white,
  black: "#000000",
  overlay: "rgba(0, 0, 0, 0.75)",
  shadow: "rgba(0, 0, 0, 0.3)",
};

export type ThemeColors = typeof lightTheme;

export default lightTheme;
