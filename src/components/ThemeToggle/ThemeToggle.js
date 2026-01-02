import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div 
      className="theme-toggle-button" 
      onClick={toggleTheme}
      title={`Press 'T' to toggle theme. Currently: ${isDarkMode ? 'Dark' : 'Light'} mode`}
    >
      {isDarkMode ? '☀️' : '🌙'}
    </div>
  );
};

export default ThemeToggle;

