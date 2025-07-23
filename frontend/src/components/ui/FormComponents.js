import styled from "styled-components";

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.sm};
  margin-bottom: ${(props) => props.theme.spacing.lg};

  &:focus-within {
    transform: translateY(-1px);
    transition: transform ${(props) => props.theme.transitions.normal};
  }
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.columns || "1fr 1fr"};
  gap: ${(props) => props.theme.spacing.lg};

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

export const FormSection = styled.div`
  background-color: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: ${(props) => props.theme.spacing.xl};
  margin-bottom: ${(props) => props.theme.spacing.xl};
  box-shadow: ${(props) => props.theme.shadows.sm};

  &:hover {
    border-color: ${(props) => props.theme.colors.primary}40;
    transition: border-color ${(props) => props.theme.transitions.normal};
  }
`;

export const FormSectionTitle = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSizes.xl};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  color: ${(props) => props.theme.colors.text};
  margin: 0 0 ${(props) => props.theme.spacing.lg} 0;
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  padding-bottom: ${(props) => props.theme.spacing.md};
  border-bottom: 2px solid ${(props) => props.theme.colors.border};

  svg {
    color: ${(props) => props.theme.colors.primary};
    font-size: 1.2em;
  }
`;

export const Label = styled.label`
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  color: ${(props) => props.theme.colors.text};

  &.required:after {
    content: " *";
    color: ${(props) => props.theme.colors.error};
  }
`;

export const ErrorMessage = styled.span`
  color: ${(props) => props.theme.colors.error};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  margin-top: ${(props) => props.theme.spacing.xs};
`;
