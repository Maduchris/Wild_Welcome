// Light Theme
export const lightTheme = {
  colors: {
    primary: '#EEC170',
    primaryDark: '#86571F',
    primaryLight: '#AFBE8E',
    secondary: '#295135',
    accent: '#AFBE8E',
    brown: '#86571F',
    offWhite: '#F9F7F3',
    black: '#000000',
    white: '#FFFFFF',
    success: '#295135',
    error: '#86571F',
    warning: '#EEC170',
    background: '#F9F7F3',
    surface: '#FFFFFF',
    text: '#000000',
    textSecondary: '#295135',
    border: '#AFBE8E',
    borderLight: '#F9F7F3',
    landingGradient: 'linear-gradient(135deg, #EEC170 0%, #86571F 100%)',
    textLight: '#AFBE8E',
    gray: {
      100: '#F9F7F3',
      500: '#AFBE8E',
    },
    // Additional colors for better theme support
    cardBackground: '#FFFFFF',
    inputBackground: '#FFFFFF',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    overlayColor: 'rgba(0, 0, 0, 0.5)',
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
    xxxl: '4rem',
  },
  
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  },
  
  typography: {
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
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
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  transitions: {
    fast: '0.15s ease',
    normal: '0.2s ease',
    slow: '0.3s ease',
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

// Dark Theme
export const darkTheme = {
  colors: {
    primary: '#EEC170',
    primaryDark: '#86571F',
    primaryLight: '#AFBE8E',
    secondary: '#295135',
    accent: '#AFBE8E',
    brown: '#86571F',
    offWhite: '#1a1a1a',
    black: '#FFFFFF',
    white: '#000000',
    success: '#4ade80',
    error: '#f87171',
    warning: '#fbbf24',
    background: '#0f0f0f',
    surface: '#1a1a1a',
    text: '#FFFFFF',
    textSecondary: '#EEC170',
    border: '#333333',
    borderLight: '#1a1a1a',
    landingGradient: 'linear-gradient(135deg, #295135 0%, #86571F 100%)',
    textLight: '#AFBE8E',
    gray: {
      100: '#1a1a1a',
      500: '#333333',
    },
    // Additional colors for better theme support
    cardBackground: '#1a1a1a',
    inputBackground: '#0f0f0f',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    overlayColor: 'rgba(0, 0, 0, 0.7)',
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
    xxxl: '4rem',
  },
  
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.3)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
  },
  
  typography: {
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
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
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  transitions: {
    fast: '0.15s ease',
    normal: '0.2s ease',
    slow: '0.3s ease',
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

// Default theme (light)
const theme = lightTheme;

export default theme; 