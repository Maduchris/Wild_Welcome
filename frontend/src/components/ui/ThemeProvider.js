import React from "react";
import styled, {
  ThemeProvider as StyledThemeProvider,
} from "styled-components";
import { useTheme } from "../../contexts/ThemeContext";

// Reusable styled components that use ONLY theme variables

// Page Layout Components
export const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  transition: background-color 0.3s ease, color 0.3s ease;
`;

export const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

// Section Components
export const Section = styled.section`
  padding: ${(props) => props.padding || "4rem 2rem"};
  background: ${(props) => props.background || "transparent"};
  ${(props) => props.centered && "text-align: center;"}
`;

export const HeroSection = styled(Section)`
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.primary} 0%,
    ${(props) => props.theme.colors.secondary} 100%
  );
  color: ${(props) => props.theme.colors.surface};
  text-align: center;
`;

// Card Components
export const Card = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border-radius: 1rem;
  padding: ${(props) => props.padding || "1.5rem"};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -2px rgba(0, 0, 0, 0.1);
  border: 1px solid ${(props) => props.theme.colors.border};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 8px 10px -6px rgba(0, 0, 0, 0.1);
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

export const PropertyCard = styled(Card)`
  overflow: hidden;
  padding: 0;
`;

// Button Components
export const Button = styled.button`
  background: ${(props) =>
    props.variant === "primary"
      ? `linear-gradient(90deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primaryDark} 100%)`
      : props.theme.colors.surface};
  color: ${(props) =>
    props.variant === "primary"
      ? props.theme.colors.surface
      : props.theme.colors.primary};
  border: 1px solid ${(props) => props.theme.colors.primary};
  padding: ${(props) =>
    props.size === "large" ? "1rem 2rem" : "0.75rem 1.5rem"};
  border-radius: 0.5rem;
  font-size: ${(props) => (props.size === "large" ? "1.1rem" : "1rem")};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${(props) =>
      props.variant === "primary"
        ? `linear-gradient(90deg, ${props.theme.colors.primaryDark} 0%, ${props.theme.colors.primary} 100%)`
        : props.theme.colors.primary};
    color: ${(props) =>
      props.variant === "primary"
        ? props.theme.colors.background
        : props.theme.colors.surface};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;

    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
`;

// Input Components
export const Input = styled.input`
  padding: 1rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 1rem;
  background: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.text};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${(props) => props.theme.colors.primary}33;
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.textSecondary};
    opacity: 0.7;
  }
`;

// Typography Components
export const Title = styled.h1`
  font-size: ${(props) =>
    props.size === "large"
      ? "3rem"
      : props.size === "medium"
      ? "2.25rem"
      : "2rem"};
  font-weight: 700;
  margin-bottom: ${(props) => props.mb || "1.5rem"};
  color: ${(props) => props.color || props.theme.colors.text};
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: ${(props) => (props.size === "large" ? "2rem" : "1.75rem")};
  }
`;

export const Subtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: ${(props) => props.mb || "2rem"};
  color: ${(props) => props.color || props.theme.colors.textSecondary};
  line-height: 1.6;
  max-width: ${(props) => props.maxWidth || "none"};
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

// Grid Components
export const Grid = styled.div`
  display: grid;
  grid-template-columns: ${(props) =>
    props.columns || "repeat(auto-fit, minmax(300px, 1fr))"};
  gap: ${(props) => props.gap || "2rem"};
  margin: ${(props) => props.margin || "0"};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

// Form Components
export const Form = styled.form`
  display: grid;
  grid-template-columns: ${(props) =>
    props.layout === "horizontal"
      ? "repeat(auto-fit, minmax(200px, 1fr))"
      : "1fr"};
  gap: 1rem;
  align-items: end;
  max-width: ${(props) => props.maxWidth || "800px"};
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Search Section Component
export const SearchSection = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border-radius: 1rem;
  padding: 2rem;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid ${(props) => props.theme.colors.border};

  @media (max-width: 1024px) {
    max-width: 90%;
    padding: 1.5rem;
  }

  @media (max-width: 768px) {
    max-width: 95%;
    padding: 1rem;
  }
`;

// Stats Components
export const StatsGrid = styled(Grid)`
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`;

export const StatCard = styled(Card)`
  text-align: center;
  background: ${(props) => props.theme.colors.accent};
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.colors.primary};
    transform: translateY(-4px);
  }
`;

export const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

export const StatLabel = styled.div`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 1rem;
  font-weight: 500;
`;

// Tag Components
export const Tag = styled.span`
  background: ${(props) => props.theme.colors.accent};
  color: ${(props) => props.theme.colors.secondary};
  border-radius: 0.5rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.text};
  }
`;

// Image Components
export const ImageContainer = styled.div`
  width: 100%;
  height: ${(props) => props.height || "200px"};
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.primary} 0%,
    ${(props) => props.theme.colors.secondary} 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: ${(props) => (props.rounded ? "1rem" : "0")};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

// Common Page Components
export const PageTitle = styled.h1`
  font-size: ${(props) => props.theme.typography.fontSizes["3xl"]};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: ${(props) => props.theme.colors.text};
  margin: 0 0 ${(props) => props.theme.spacing.xs} 0;
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  line-height: 1.2;

  svg {
    color: ${(props) => props.theme.colors.primary};
    font-size: 0.9em;
  }
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.xl};

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${(props) => props.theme.spacing.lg};
  }
`;

export const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spacing.xxxl};
  color: ${(props) => props.theme.colors.textSecondary};
  text-align: center;

  h2 {
    color: ${(props) => props.theme.colors.text};
    margin-bottom: ${(props) => props.theme.spacing.md};
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spacing.xxxl};
  color: ${(props) => props.theme.colors.textSecondary};
  text-align: center;

  h3 {
    color: ${(props) => props.theme.colors.text};
    margin-bottom: ${(props) => props.theme.spacing.md};
  }

  p {
    margin-bottom: ${(props) => props.theme.spacing.lg};
  }
`;

// Wrapper component that provides theme to all styled components
export const ThemedComponentProvider = ({ children }) => {
  const { currentTheme } = useTheme();

  // Provide a fallback theme if theme is not loaded yet
  const fallbackTheme = {
    colors: {
      primary: "#EEC170",
      secondary: "#295135",
      brown: "#86571F",
      background: "#F9F7F3",
      surface: "#FFFFFF",
      text: "#295135",
      textSecondary: "#86571F",
      border: "#AFBE8E",
      accent: "#AFBE8E",
      error: "#EF4444",
    },
  };

  return (
    <StyledThemeProvider theme={currentTheme || fallbackTheme}>
      {children}
    </StyledThemeProvider>
  );
};

export default ThemedComponentProvider;
