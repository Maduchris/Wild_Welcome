import React from "react";
import styled, { css } from "styled-components";

const getSelectStyles = (variant, theme) => {
  switch (variant) {
    case "error":
      return css`
        border-color: ${theme.colors.error};

        &:focus {
          border-color: ${theme.colors.error};
          box-shadow: 0 0 0 3px ${theme.colors.error}20;
        }
      `;

    case "success":
      return css`
        border-color: ${theme.colors.success};

        &:focus {
          border-color: ${theme.colors.success};
          box-shadow: 0 0 0 3px ${theme.colors.success}20;
        }
      `;

    default:
      return css`
        border-color: ${theme.colors.border};

        &:focus {
          border-color: ${theme.colors.primary};
          box-shadow: 0 0 0 3px ${theme.colors.primary}20;
        }
      `;
  }
};

const StyledSelect = styled.select`
  width: 100%;
  padding: ${(props) => props.theme.spacing.md};
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  background-color: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.text};
  transition: all ${(props) => props.theme.transitions.normal};
  cursor: pointer;

  &:disabled {
    background-color: ${(props) =>
      props.theme.colors.surfaceAlt || props.theme.colors.surface};
    color: ${(props) => props.theme.colors.textSecondary};
    cursor: not-allowed;
  }

  ${(props) => getSelectStyles(props.variant, props.theme)}
`;

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SelectLabel = styled.label`
  display: block;
  margin-bottom: ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  color: ${(props) => props.theme.colors.text};

  &.required:after {
    content: " *";
    color: ${(props) => props.theme.colors.error};
  }
`;

const SelectError = styled.span`
  display: block;
  margin-top: ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  color: ${(props) => props.theme.colors.error};
`;

const SelectHelp = styled.span`
  display: block;
  margin-top: ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  color: ${(props) => props.theme.colors.textSecondary};
`;

const Select = React.forwardRef(
  (
    { label, error, help, variant, required, children, options, ...props },
    ref
  ) => {
    const selectVariant = error ? "error" : variant;

    return (
      <SelectWrapper>
        {label && (
          <SelectLabel className={required ? "required" : ""}>
            {label}
          </SelectLabel>
        )}
        <StyledSelect ref={ref} variant={selectVariant} {...props}>
          {children ||
            options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
        </StyledSelect>
        {error && <SelectError>{error}</SelectError>}
        {help && !error && <SelectHelp>{help}</SelectHelp>}
      </SelectWrapper>
    );
  }
);

export default Select;
