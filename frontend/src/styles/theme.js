// Light Theme
export const lightTheme = {
  colors: {
    primary: '#295135', // Dark green as primary
    primaryDark: '#1A3A26', // Darker shade of primary
    primaryLight: '#3B6B4A', // Lighter shade of primary
    secondary: '#AFBE8E', // Sage green as secondary
    accent: '#EEC170', // Golden yellow as accent
    brown: '#86571F', // Brown
    offWhite: '#F9F7F3', // Off-white
    black: '#000000', // Black
    white: '#FFFFFF', // Pure white
    success: '#AFBE8E', // Using sage green for success
    error: '#D32F2F', // Red for errors
    warning: '#EEC170', // Using golden yellow for warnings
    background: '#F9F7F3', // Off-white background
    surface: '#FFFFFF', // White surface
    text: '#000000', // Black text
    textSecondary: '#295135', // Dark green for secondary text
    border: '#AFBE8E', // Sage green borders
    borderLight: '#EEC170', // Golden yellow light borders
    landingGradient: 'linear-gradient(135deg, #295135 0%, #AFBE8E 100%)',
    textLight: '#295135', // Dark green for light text
    gray: {
      100: '#F9F7F3', // Off-white
      200: '#EEC170', // Golden yellow
      300: '#AFBE8E', // Sage green
      400: '#86571F', // Brown
      500: '#295135', // Dark green
      600: '#1A3A26', // Darker green
      700: '#000000', // Black
      800: '#000000', // Black
      900: '#000000', // Black
    },
    // Additional colors for better theme support
    cardBackground: '#FFFFFF',
    inputBackground: '#F9F7F3',
    shadowColor: 'rgba(41, 81, 53, 0.1)', // Dark green with opacity
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
    sm: '0 1px 2px 0 rgba(41, 81, 53, 0.1)',
    md: '0 4px 6px -1px rgba(41, 81, 53, 0.15), 0 2px 4px -2px rgba(41, 81, 53, 0.1)',
    lg: '0 10px 15px -3px rgba(41, 81, 53, 0.15), 0 4px 6px -4px rgba(41, 81, 53, 0.1)',
    xl: '0 20px 25px -5px rgba(41, 81, 53, 0.15), 0 8px 10px -6px rgba(41, 81, 53, 0.1)',
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
    primary: '#AFBE8E', // Sage green as primary in dark mode
    primaryDark: '#8FA876', // Darker sage green
    primaryLight: '#C5D1A8', // Lighter sage green
    secondary: '#EEC170', // Golden yellow as secondary
    accent: '#86571F', // Brown as accent
    brown: '#EEC170', // Golden yellow (inverted brown)
    offWhite: '#000000', // Black (inverted)
    black: '#F9F7F3', // Off-white (inverted)
    white: '#000000', // Black (inverted)
    success: '#AFBE8E', // Sage green for success
    error: '#FF6B6B', // Light red for errors
    warning: '#EEC170', // Golden yellow for warnings
    background: '#000000', // Black background
    surface: '#1A1A1A', // Dark gray surface
    text: '#F9F7F3', // Off-white text
    textSecondary: '#AFBE8E', // Sage green for secondary text
    border: '#295135', // Dark green borders
    borderLight: '#86571F', // Brown light borders
    landingGradient: 'linear-gradient(135deg, #AFBE8E 0%, #EEC170 100%)',
    textLight: '#AFBE8E', // Sage green for light text
    gray: {
      100: '#000000', // Black
      200: '#1A1A1A', // Dark gray
      300: '#295135', // Dark green
      400: '#86571F', // Brown
      500: '#EEC170', // Golden yellow
      600: '#AFBE8E', // Sage green
      700: '#C5D1A8', // Light sage green
      800: '#F9F7F3', // Off-white
      900: '#FFFFFF', // White
    },
    // Additional colors for better theme support
    cardBackground: '#1A1A1A',
    inputBackground: '#000000',
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