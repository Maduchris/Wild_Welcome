import styled, { css } from 'styled-components';

const getInputStyles = (variant, theme) => {
  switch (variant) {
    case 'error':
      return css`
        border-color: ${theme.colors.error};
        
        &:focus {
          border-color: ${theme.colors.error};
          box-shadow: 0 0 0 3px ${theme.colors.errorLight};
        }
      `;
    
    case 'success':
      return css`
        border-color: ${theme.colors.success};
        
        &:focus {
          border-color: ${theme.colors.success};
          box-shadow: 0 0 0 3px ${theme.colors.successLight};
        }
      `;
    
    default:
      return css`
        border-color: ${theme.colors.border};
        
        &:focus {
          border-color: ${theme.colors.primary};
          box-shadow: 0 0 0 3px ${theme.colors.primaryLight};
        }
      `;
  }
};

const StyledInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.typography.fontSizes.base};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.text};
  transition: all ${props => props.theme.transitions.normal};
  
  &::placeholder {
    color: ${props => props.theme.colors.textLight};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.gray[100]};
    color: ${props => props.theme.colors.gray[500]};
    cursor: not-allowed;
  }
  
  ${props => getInputStyles(props.variant, props.theme)}
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.text};
`;

const InputError = styled.span`
  display: block;
  margin-top: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.error};
`;

const InputHelp = styled.span`
  display: block;
  margin-top: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textSecondary};
`;

const Input = ({
  label,
  error,
  help,
  variant,
  ...props
}) => {
  const inputVariant = error ? 'error' : variant;
  
  return (
    <InputWrapper>
      {label && <InputLabel>{label}</InputLabel>}
      <StyledInput variant={inputVariant} {...props} />
      {error && <InputError>{error}</InputError>}
      {help && !error && <InputHelp>{help}</InputHelp>}
    </InputWrapper>
  );
};

export default Input; 