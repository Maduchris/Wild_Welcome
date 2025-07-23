import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ThemedComponentProvider } from '../../components/ui/ThemeProvider';

// Landing-specific styled components using ONLY theme variables
const LandingRoot = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.brown} 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0;
  margin-bottom: 48px;
`;

const Logo = styled.img`
  width: 420px;
  max-width: 90vw;
  height: auto;
  opacity: 0;
  transform: scale(0.7);
  transition: opacity 0.3s, transform 0.3s;
  
  &.pop-in {
    animation: logoPopIn 0.8s cubic-bezier(0.23, 1.15, 0.4, 1.01) forwards;
  }
  
  @keyframes logoPopIn {
    0% {
      opacity: 0;
      transform: scale(0.7);
    }
    60% {
      opacity: 1;
      transform: scale(1.15);
    }
    80% {
      transform: scale(0.95);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @media (max-width: 900px) {
    width: 300px;
  }
  
  @media (max-width: 600px) {
    width: 180px;
  }
`;

const GetStartedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
`;

const GetStartedButton = styled.button`
  background: linear-gradient(90deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.brown} 100%);
  color: ${props => props.theme.colors.secondary};
  font-size: 1.3rem;
  font-weight: 700;
  padding: 18px 60px;
  border: none;
  border-radius: 40px;
  box-shadow: 0 8px 32px rgba(136, 87, 31, 0.15);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
  margin-bottom: 18px;
  letter-spacing: 1px;
  
  &:disabled {
    opacity: 0.7;
    cursor: default;
  }
  
  &:hover:not(:disabled) {
    background: linear-gradient(90deg, ${props => props.theme.colors.brown} 0%, ${props => props.theme.colors.primary} 100%);
    color: ${props => props.theme.colors.background};
    transform: translateY(-2px) scale(1.04);
    box-shadow: 0 12px 36px rgba(136, 87, 31, 0.18);
  }
  
  @media (max-width: 600px) {
    font-size: 1rem;
    padding: 12px 20px;
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 10px;
  animation: fadeInOptions 0.5s cubic-bezier(0.23, 1.15, 0.4, 1.01);
  
  @keyframes fadeInOptions {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const OptionButton = styled.button`
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.secondary};
  font-size: 1.1rem;
  font-weight: 600;
  padding: 14px 40px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 30px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border 0.2s;
  margin-bottom: 0;
  
  &:hover {
    background: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.brown};
    border-color: ${props => props.theme.colors.brown};
  }
  
  @media (max-width: 600px) {
    font-size: 1rem;
    padding: 12px 20px;
  }
`;

const Landing = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setLogoVisible(true), 100);
  }, []);

  const handleGetStarted = () => {
    setShowOptions(true);
  };

  return (
    <ThemedComponentProvider>
      <LandingRoot>
        <LogoContainer>
          <Logo
            src="/images/wild-welcome-logo.png"
            alt="Wild Welcome Logo"
            className={logoVisible ? 'pop-in' : ''}
          />
        </LogoContainer>
        <GetStartedContainer>
          <GetStartedButton onClick={handleGetStarted} disabled={showOptions}>
            Get Started
          </GetStartedButton>
          {showOptions && (
            <OptionsContainer>
              <OptionButton onClick={() => navigate('/signup')}>Sign Up (New User)</OptionButton>
              <OptionButton onClick={() => navigate('/login')}>Login (Returning User)</OptionButton>
            </OptionsContainer>
          )}
        </GetStartedContainer>
      </LandingRoot>
    </ThemedComponentProvider>
  );
};

export default Landing; 