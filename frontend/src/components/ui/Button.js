import styled, { css } from 'styled-components';

const getVariantStyles = (variant, theme) => {
  switch (variant) {
    case 'primary':
      return css`
        background-color: ${theme.colors.primary};
        color: ${theme.colors.white};
        border: 1px solid ${theme.colors.primary};
        
        &:hover {
          background-color: ${theme.colors.primaryDark};
          border-color: ${theme.colors.primaryDark};
        }
        
        &:disabled {
          background-color: ${theme.colors.gray[300]};
          border-color: ${theme.colors.gray[300]};
          color: ${theme.colors.gray[500]};
          cursor: not-allowed;
        }
      `;
    
    case 'secondary':
      return css`
        background-color: ${theme.colors.white};
        color: ${theme.colors.primary};
        border: 1px solid ${theme.colors.primary};
        
        &:hover {
          background-color: ${theme.colors.primaryLight};
        }
        
        &:disabled {
          background-color: ${theme.colors.gray[100]};
          border-color: ${theme.colors.gray[300]};
          color: ${theme.colors.gray[500]};
          cursor: not-allowed;
        }
      `;
    
    case 'outline':
      return css`
        background-color: transparent;
        color: ${theme.colors.text};
        border: 1px solid ${theme.colors.border};
        
        &:hover {
          background-color: ${theme.colors.surface};
          border-color: ${theme.colors.gray[400]};
        }
        
        &:disabled {
          background-color: ${theme.colors.gray[100]};
          border-color: ${theme.colors.gray[300]};
          color: ${theme.colors.gray[500]};
          cursor: not-allowed;
        }
      `;
    
    case 'ghost':
      return css`
        background-color: transparent;
        color: ${theme.colors.text};
        border: 1px solid transparent;
        
        &:hover {
          background-color: ${theme.colors.surface};
        }
        
        &:disabled {
          color: ${theme.colors.gray[500]};
          cursor: not-allowed;
        }
      `;
    
    case 'danger':
      return css`
        background-color: ${theme.colors.error};
        color: ${theme.colors.white};
        border: 1px solid ${theme.colors.error};
        
        &:hover {
          background-color: ${theme.colors.errorDark};
          border-color: ${theme.colors.errorDark};
        }
        
        &:disabled {
          background-color: ${theme.colors.gray[300]};
          border-color: ${theme.colors.gray[300]};
          color: ${theme.colors.gray[500]};
          cursor: not-allowed;
        }
      `;
    
    default:
      return css`
        background-color: ${theme.colors.primary};
        color: ${theme.colors.white};
        border: 1px solid ${theme.colors.primary};
        
        &:hover {
          background-color: ${theme.colors.primaryDark};
          border-color: ${theme.colors.primaryDark};
        }
      `;
  }
};

const getSizeStyles = (size, theme) => {
  switch (size) {
    case 'sm':
      return css`
        padding: ${theme.spacing.sm} ${theme.spacing.md};
        font-size: ${theme.typography.fontSizes.sm};
        border-radius: ${theme.borderRadius.sm};
      `;
    
    case 'lg':
      return css`
        padding: ${theme.spacing.md} ${theme.spacing.xl};
        font-size: ${theme.typography.fontSizes.lg};
        border-radius: ${theme.borderRadius.md};
      `;
    
    default:
      return css`
        padding: ${theme.spacing.sm} ${theme.spacing.lg};
        font-size: ${theme.typography.fontSizes.base};
        border-radius: ${theme.borderRadius.md};
      `;
  }
};

const StyledButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['loading', 'variant', 'size', 'fullWidth'].includes(prop)
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  transition: all ${props => props.theme.transitions.normal};
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  min-height: 44px;
  
  ${props => getVariantStyles(props.variant, props.theme)}
  ${props => getSizeStyles(props.size, props.theme)}
  
  ${props => props.fullWidth && css`
    width: 100%;
  `}
  
  ${props => props.loading && css`
    position: relative;
    color: transparent;
    
    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `}
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  loading = false,
  disabled = false,
  ...props 
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      loading={loading}
      disabled={disabled || loading}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button; 