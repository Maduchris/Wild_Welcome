import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';

const ToggleContainer = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 2px solid #AFBE8E;
  border-radius: 50%;
  background: #EEC170;
  color: #295135;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
  font-size: 1.2rem;
  font-weight: bold;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    background: #86571F;
    color: #F9F7F3;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px #EEC17033;
  }

  /* Dark mode styles */
  body.dark-mode & {
    background: #EEC170;
    color: #0f0f0f;
    border-color: #333333;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }

  body.dark-mode &:hover {
    background: #86571F;
    color: #FFFFFF;
  }
`;

const ThemeToggle = ({ className, size = 'medium' }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <ToggleContainer 
      onClick={toggleTheme}
      className={className}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      {isDarkMode ? '🌙' : '☀️'}
    </ToggleContainer>
  );
};

export default ThemeToggle; 