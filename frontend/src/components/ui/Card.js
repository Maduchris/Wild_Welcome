import styled, { css } from "styled-components";

const getCardVariant = (variant, theme) => {
  switch (variant) {
    case "elevated":
      return css`
        box-shadow: ${theme.shadows.lg};
        border: 1px solid ${theme.colors.borderLight};
      `;

    case "outlined":
      return css`
        border: 1px solid ${theme.colors.border};
        box-shadow: none;
      `;

    case "flat":
      return css`
        background-color: ${theme.colors.surface};
        border: none;
        box-shadow: none;
      `;

    default:
      return css`
        box-shadow: ${theme.shadows.md};
        border: 1px solid ${theme.colors.borderLight};
      `;
  }
};

const StyledCard = styled.div`
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: ${(props) => props.padding || props.theme.spacing.xl};
  transition: all ${(props) => props.theme.transitions.normal};

  ${(props) => getCardVariant(props.variant, props.theme)}

  ${(props) =>
    props.hoverable &&
    css`
      cursor: pointer;

      &:hover {
        transform: translateY(-2px);
        box-shadow: ${props.theme.shadows.xl};
      }
    `}

  ${(props) =>
    props.clickable &&
    css`
      cursor: pointer;

      &:hover {
        box-shadow: ${props.theme.shadows.lg};
      }

      &:active {
        transform: translateY(0);
      }
    `}
`;

const CardHeader = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.lg};
  padding-bottom: ${(props) => props.theme.spacing.lg};
  border-bottom: 1px solid ${(props) => props.theme.colors.borderLight};
`;

const CardTitle = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSizes.xl};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  color: ${(props) => props.theme.colors.text};
  margin: 0;
`;

const CardSubtitle = styled.p`
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  color: ${(props) => props.theme.colors.textSecondary};
  margin: ${(props) => props.theme.spacing.sm} 0 0 0;
`;

const CardContent = styled.div`
  color: ${(props) => props.theme.colors.text};
`;

const CardFooter = styled.div`
  margin-top: ${(props) => props.theme.spacing.lg};
  padding-top: ${(props) => props.theme.spacing.lg};
  border-top: 1px solid ${(props) => props.theme.colors.borderLight};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Card = ({
  children,
  variant = "default",
  padding,
  hoverable = false,
  clickable = false,
  ...props
}) => {
  return (
    <StyledCard
      variant={variant}
      padding={padding}
      hoverable={hoverable}
      clickable={clickable}
      {...props}
    >
      {children}
    </StyledCard>
  );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
