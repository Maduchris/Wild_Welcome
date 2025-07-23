import React from 'react';
import styled from 'styled-components';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: ${props => props.theme.borderRadius.full};
  border: 2px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  position: relative;
  overflow: hidden;
  
  &:hover {
    background-color: ${props => props.theme.colors.hover};
    color: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  svg {
    font-size: 1.25rem;
    transition: all ${props => props.theme.transitions.normal};
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${props => props.theme.transitions.normal};
  
  ${props => props.isVisible ? `
    opacity: 1;
    transform: translateY(0) rotate(0deg);
  ` : `
    opacity: 0;
    transform: translateY(${props.isExiting ? '-100%' : '100%'}) rotate(${props.isExiting ? '-180deg' : '180deg'});
  `}
`;

const ThemeToggle = ({ className }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <ToggleButton 
      onClick={toggleTheme} 
      className={className}
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      <IconWrapper isVisible={isDarkMode} isExiting={!isDarkMode}>
        <FaSun />
      </IconWrapper>
      <IconWrapper 
        isVisible={!isDarkMode} 
        isExiting={isDarkMode}
        style={{ position: 'absolute' }}
      >
        <FaMoon />
      </IconWrapper>
    </ToggleButton>
  );
};

export default ThemeToggle;