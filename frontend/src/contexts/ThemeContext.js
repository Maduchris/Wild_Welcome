import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { lightTheme, darkTheme } from '../styles/theme';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Helper function to check if current route is a general page
const isGeneralPage = (pathname) => {
  const generalRoutes = ['/', '/login', '/signup', '/confirmation'];
  return generalRoutes.includes(pathname);
};

export const ThemeProvider = ({ children }) => {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Use dark theme for non-general pages by default, but allow user to override
  const isGeneral = isGeneralPage(location.pathname);
  const effectiveDarkMode = isDarkMode;
  const theme = effectiveDarkMode ? darkTheme : lightTheme;

  const toggleTheme = () => {
    console.log('Toggling theme from:', isDarkMode ? 'dark' : 'light', 'to:', !isDarkMode ? 'dark' : 'light');
    setIsDarkMode(prev => !prev);
  };

  const setTheme = (mode) => {
    console.log('Setting theme to:', mode);
    setIsDarkMode(mode === 'dark');
  };

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Update document body class for global CSS
    document.body.classList.toggle('dark-mode', effectiveDarkMode);
    document.body.classList.toggle('light-mode', !effectiveDarkMode);
    
    console.log('Theme changed to:', effectiveDarkMode ? 'dark' : 'light', 'isGeneral:', isGeneral);
  }, [isDarkMode, effectiveDarkMode, isGeneral]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const value = {
    theme,
    isDarkMode: effectiveDarkMode,
    toggleTheme,
    setTheme,
    isGeneralPage: isGeneral,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 