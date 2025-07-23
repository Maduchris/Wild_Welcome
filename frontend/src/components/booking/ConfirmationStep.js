import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaHome,
  FaEnvelope,
  FaPhone,
  FaDownload,
  FaArrowRight,
} from "react-icons/fa";
import { Button } from "../ui/ThemeProvider";

const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.theme.spacing.lg};
  text-align: center;
  padding: ${(props) => props.theme.spacing.xl};
`;

const SuccessIcon = styled(motion.div)`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.success},
    ${(props) => props.theme.colors.successLight || props.theme.colors.success}
  );
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing.lg};
  box-shadow: 0 10px 30px ${(props) => props.theme.colors.success}30;

  svg {
    font-size: 60px;
    color: ${(props) => props.theme.colors.surface};
  }
`;

const StepTitle = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSizes["3xl"]};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const StepSubtitle = styled.p`
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  color: ${(props) => props.theme.colors.textSecondary};
  margin-bottom: ${(props) => props.theme.spacing.xl};
  max-width: 500px;
  line-height: 1.6;
`;

const ApplicationId = styled.div`
  background: ${(props) => props.theme.colors.primary}10;
  border: 1px solid ${(props) => props.theme.colors.primary}30;
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: ${(props) => props.theme.spacing.lg};
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const ApplicationIdLabel = styled.div`
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  color: ${(props) => props.theme.colors.textSecondary};
  margin-bottom: ${(props) => props.theme.spacing.xs};
`;

const ApplicationIdValue = styled.div`
  font-size: ${(props) => props.theme.typography.fontSizes.xl};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: ${(props) => props.theme.colors.primary};
  font-family: monospace;
`;

const NextStepsSection = styled.div`
  background: ${(props) => props.theme.colors.gray[50]};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: ${(props) => props.theme.spacing.xl};
  margin: ${(props) => props.theme.spacing.xl} 0;
  width: 100%;
  max-width: 600px;
`;

const NextStepsTitle = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSizes.xl};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  text-align: center;
`;

const NextStepsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.md};
`;

const NextStepItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${(props) => props.theme.spacing.md};
  text-align: left;
`;

const StepIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    font-size: ${(props) => props.theme.typography.fontSizes.md};
  }
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepItemTitle = styled.div`
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.xs};
`;

const StepDescription = styled.div`
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  color: ${(props) => props.theme.colors.textSecondary};
  line-height: 1.5;
`;

const ContactInfo = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: ${(props) => props.theme.spacing.lg};
  margin: ${(props) => props.theme.spacing.lg} 0;
  width: 100%;
  max-width: 400px;
`;

const ContactTitle = styled.h4`
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  margin-bottom: ${(props) => props.theme.spacing.sm};
  color: ${(props) => props.theme.colors.textSecondary};

  &:last-child {
    margin-bottom: 0;
  }

  svg {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
  margin-top: ${(props) => props.theme.spacing.xl};

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    flex-direction: column;
    width: 100%;
  }
`;

const ConfirmationStep = () => {
  // Generate a mock application ID
  const applicationId = `WW-${Date.now().toString(36).toUpperCase()}`;

  const handleDownloadConfirmation = () => {
    // In a real app, this would generate and download a PDF
    console.log("Downloading confirmation...");
    alert("Confirmation download feature will be implemented soon!");
  };

  const handleGoToDashboard = () => {
    // Navigate to user dashboard
    window.location.href = "/user/dashboard";
  };

  const handleViewApplications = () => {
    // Navigate to applications page
    window.location.href = "/user/applications";
  };

  return (
    <StepContainer>
      <SuccessIcon
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 10,
          delay: 0.2,
        }}
      >
        <FaCheckCircle />
      </SuccessIcon>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <StepTitle>Application Submitted!</StepTitle>
        <StepSubtitle>
          Thank you for your application! We've received your information and
          will review it shortly. You'll hear back from us within 24-48 hours.
        </StepSubtitle>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <ApplicationId>
          <ApplicationIdLabel>Application ID</ApplicationIdLabel>
          <ApplicationIdValue>{applicationId}</ApplicationIdValue>
        </ApplicationId>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        style={{ width: "100%" }}
      >
        <NextStepsSection>
          <NextStepsTitle>What happens next?</NextStepsTitle>
          <NextStepsList>
            <NextStepItem>
              <StepIcon>
                <FaEnvelope />
              </StepIcon>
              <StepContent>
                <StepItemTitle>Application Review</StepItemTitle>
                <StepDescription>
                  We'll review your application and verify the information
                  provided. This typically takes 24-48 hours.
                </StepDescription>
              </StepContent>
            </NextStepItem>

            <NextStepItem>
              <StepIcon>
                <FaPhone />
              </StepIcon>
              <StepContent>
                <StepItemTitle>Background Check</StepItemTitle>
                <StepDescription>
                  If your application meets our criteria, we'll conduct a
                  background and credit check with your permission.
                </StepDescription>
              </StepContent>
            </NextStepItem>

            <NextStepItem>
              <StepIcon>
                <FaHome />
              </StepIcon>
              <StepContent>
                <StepItemTitle>Final Decision</StepItemTitle>
                <StepDescription>
                  You'll receive a final decision via email. If approved, we'll
                  send you the lease agreement and move-in instructions.
                </StepDescription>
              </StepContent>
            </NextStepItem>
          </NextStepsList>
        </NextStepsSection>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
      >
        <ContactInfo>
          <ContactTitle>Need Help?</ContactTitle>
          <ContactItem>
            <FaEnvelope />
            <span>support@wildwelcome.com</span>
          </ContactItem>
          <ContactItem>
            <FaPhone />
            <span>(555) 123-4567</span>
          </ContactItem>
        </ContactInfo>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
      >
        <ActionButtons>
          <Button variant="outline" onClick={handleDownloadConfirmation}>
            <FaDownload style={{ marginRight: 8 }} />
            Download Confirmation
          </Button>

          <Button variant="secondary" onClick={handleViewApplications}>
            View Applications
          </Button>

          <Button variant="primary" onClick={handleGoToDashboard}>
            Go to Dashboard
            <FaArrowRight style={{ marginLeft: 8 }} />
          </Button>
        </ActionButtons>
      </motion.div>
    </StepContainer>
  );
};

export default ConfirmationStep;
