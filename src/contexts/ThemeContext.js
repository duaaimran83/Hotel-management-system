import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('roomsync_theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    // Apply theme to document root
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    } else {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    }
    // Save to localStorage
    localStorage.setItem('roomsync_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    // Keyboard listener for 'T' key
    const handleKeyPress = (e) => {
      // Check if user is typing in an input/textarea
      const isInputFocused = 
        e.target.tagName === 'INPUT' || 
        e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable;
      
      // Only toggle if not typing in input and 'T' key is pressed
      if (!isInputFocused && (e.key === 'T' || e.key === 't')) {
        setIsDarkMode(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

