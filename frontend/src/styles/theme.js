// Wild Welcome Color Palette
const colors = {
  gold: "#EEC170",
  goldDark: "#D4A942", // Darker gold for better visibility
  olive: "#AFBE8E",
  darkGreen: "#295135",
  brown: "#86571F",
  offWhite: "#F9F7F3",
  black: "#000000",
  white: "#FFFFFF",
};

const lightTheme = {
  colors: {
    // Primary colors from palette
    primary: colors.goldDark, // Use darker gold for better visibility in light mode
    primaryDark: colors.brown,
    primaryLight: colors.olive,
    secondary: colors.darkGreen,
    accent: colors.olive,

    // Light theme specific
    background: colors.offWhite,
    surface: colors.offWhite,
    text: colors.black,
    textSecondary: colors.darkGreen,
    textLight: colors.olive,

    // UI elements
    border: colors.olive,
    borderLight: colors.olive,
    hover: colors.olive,

    // Status colors
    success: colors.darkGreen,
    successLight: "#E8F5E8",
    successDark: colors.darkGreen,
    error: colors.brown,
    errorLight: "#FEE2E2",
    errorDark: colors.brown,
    warning: colors.goldDark, // Use darker gold for better visibility
    warningLight: "#FEF3C7",
    warningDark: colors.brown,

    // Semantic colors
    white: colors.white,
    black: colors.black,
    offWhite: colors.offWhite,

    // Gradients
    landingGradient: `linear-gradient(135deg, ${colors.goldDark} 0%, ${colors.brown} 100%)`,

    // Gray scale (using olive variations)
    gray: {
      50: "#F8F9F8",
      100: colors.offWhite,
      200: "#E5E7E5",
      300: "#D1D5D1",
      400: "#A8B3A8",
      500: colors.olive,
      600: "#8FA87F",
      700: "#759370",
      800: "#5B7D60",
      900: colors.darkGreen,
    },
  },
};

const darkTheme = {
  colors: {
    // Primary colors from palette (same as light)
    primary: colors.gold,
    primaryDark: colors.brown,
    primaryLight: colors.olive,
    secondary: colors.darkGreen,
    accent: colors.darkGreen,

    // Dark theme specific
    background: "#0A0A0A",
    surface: "#1A1A1A",
    text: colors.offWhite,
    textSecondary: colors.gold,
    textLight: colors.olive,

    // UI elements
    border: "#3A3A3A",
    borderLight: "#2A2A2A",
    hover: colors.olive,

    // Status colors (same as light but with dark backgrounds)
    success: colors.darkGreen,
    successLight: "#1A2E1A",
    successDark: colors.darkGreen,
    error: colors.brown,
    errorLight: "#2A1F1A",
    errorDark: colors.brown,
    warning: colors.gold,
    warningLight: "#2A2419",
    warningDark: colors.brown,

    // Semantic colors
    white: colors.white,
    black: colors.black,
    offWhite: colors.offWhite,

    // Gradients
    landingGradient: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.brown} 100%)`,

    // Gray scale (inverted for dark theme)
    gray: {
      50: "#0A0A0A",
      100: "#1A1A1A",
      200: "#2A2A2A",
      300: "#3A3A3A",
      400: "#4A4A4A",
      500: "#6A6A6A",
      600: colors.olive,
      700: "#CACACA",
      800: "#DADADA",
      900: colors.offWhite,
    },
  },
};

const sharedTheme = {
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    xxl: "3rem",
    xxxl: "4rem",
  },

  borderRadius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    full: "9999px",
  },

  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },

  typography: {
    fontSizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
    },

    fontWeights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },

    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  transitions: {
    fast: "0.15s ease",
    normal: "0.2s ease",
    slow: "0.3s ease",
  },

  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};

// Create complete themes by merging shared theme with color schemes
export const themes = {
  light: { ...sharedTheme, ...lightTheme },
  dark: { ...sharedTheme, ...darkTheme },
};

// Export default light theme for backward compatibility
export default themes.light;
