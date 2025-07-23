import React from "react";
import styled, { css } from "styled-components";

const getTextAreaStyles = (variant, theme) => {
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

const StyledTextArea = styled.textarea`
  width: 100%;
  padding: ${(props) => props.theme.spacing.md};
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  background-color: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.text};
  transition: all ${(props) => props.theme.transitions.normal};
  font-family: inherit;
  resize: vertical;
  min-height: ${(props) => props.minHeight || "120px"};

  &::placeholder {
    color: ${(props) => props.theme.colors.textSecondary};
  }

  &:disabled {
    background-color: ${(props) =>
      props.theme.colors.surfaceAlt || props.theme.colors.surface};
    color: ${(props) => props.theme.colors.textSecondary};
    cursor: not-allowed;
  }

  ${(props) => getTextAreaStyles(props.variant, props.theme)}
`;

const TextAreaWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const TextAreaLabel = styled.label`
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

const TextAreaError = styled.span`
  display: block;
  margin-top: ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  color: ${(props) => props.theme.colors.error};
`;

const TextAreaHelp = styled.span`
  display: block;
  margin-top: ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  color: ${(props) => props.theme.colors.textSecondary};
`;

const TextArea = React.forwardRef(
  ({ label, error, help, variant, required, minHeight, ...props }, ref) => {
    const textAreaVariant = error ? "error" : variant;

    return (
      <TextAreaWrapper>
        {label && (
          <TextAreaLabel className={required ? "required" : ""}>
            {label}
          </TextAreaLabel>
        )}
        <StyledTextArea
          ref={ref}
          variant={textAreaVariant}
          minHeight={minHeight}
          {...props}
        />
        {error && <TextAreaError>{error}</TextAreaError>}
        {help && !error && <TextAreaHelp>{help}</TextAreaHelp>}
      </TextAreaWrapper>
    );
  }
);

export default TextArea;
