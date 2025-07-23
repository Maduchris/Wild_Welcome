import React, { useState, createContext, useContext } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa";
import UserHeader from "../user/UserHeader";
import {
  PageContainer,
  ContentContainer,
  Section,
  Card,
  Button,
  ThemedComponentProvider,
} from "../ui/ThemeProvider";

// Context for sharing booking data between steps
const BookingContext = createContext();

export const useBookingContext = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBookingContext must be used within BookingWizard");
  }
  return context;
};

// Styled Components
const BookingPageContainer = styled(PageContainer)`
  background: ${(props) => props.theme.colors.background};
  min-height: 100vh;
`;

const BookingContentContainer = styled(ContentContainer)`
  max-width: 1000px;
  padding: ${(props) => props.theme.spacing.xl}
    ${(props) => props.theme.spacing.lg};
`;

const WizardSection = styled(Section)`
  background: transparent;
  padding: 0;
`;

const WizardCard = styled(motion.div)`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
`;

const StyledCard = styled(Card)`
  padding: ${(props) => props.theme.spacing["3xl"]};
  margin: ${(props) => props.theme.spacing.lg} 0;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: ${(props) => props.theme.spacing.xl};
    margin: ${(props) => props.theme.spacing.md} 0;
  }
`;

const ProgressContainer = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background-color: ${(props) => props.theme.colors.gray[200]};
  border-radius: ${(props) => props.theme.borderRadius.full};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(
    90deg,
    ${(props) => props.theme.colors.primary},
    ${(props) => props.theme.colors.secondary}
  );
  width: ${(props) => props.progress}%;
  transition: width ${(props) => props.theme.transitions.normal};
  border-radius: ${(props) => props.theme.borderRadius.full};
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StepItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  flex: 1;
`;

const StepNumber = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  background-color: ${(props) => {
    if (props.isCompleted) return props.theme.colors.success;
    if (props.isActive) return props.theme.colors.primary;
    return props.theme.colors.gray[300];
  }};
  color: ${(props) => props.theme.colors.surface};
  transition: all ${(props) => props.theme.transitions.normal};
  border: 2px solid
    ${(props) => {
      if (props.isCompleted) return props.theme.colors.success;
      if (props.isActive) return props.theme.colors.primary;
      return props.theme.colors.gray[300];
    }};

  svg {
    font-size: ${(props) => props.theme.typography.fontSizes.sm};
  }
`;

const StepLabel = styled.span`
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  color: ${(props) => {
    if (props.isCompleted || props.isActive) return props.theme.colors.text;
    return props.theme.colors.textSecondary;
  }};
  font-weight: ${(props) =>
    props.isActive
      ? props.theme.typography.fontWeights.medium
      : props.theme.typography.fontWeights.normal};
  text-align: center;
  transition: all ${(props) => props.theme.transitions.normal};

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: ${(props) => props.theme.typography.fontSizes.xs};
  }
`;

const StepConnector = styled.div`
  flex: 1;
  height: 2px;
  background-color: ${(props) =>
    props.isActive ? props.theme.colors.primary : props.theme.colors.gray[300]};
  margin: 0 ${(props) => props.theme.spacing.sm};
  transition: background-color ${(props) => props.theme.transitions.normal};

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    display: none;
  }
`;

const ContentArea = styled.div`
  margin: ${(props) => props.theme.spacing.xl} 0;
  min-height: 400px;
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
  justify-content: space-between;
  margin-top: ${(props) => props.theme.spacing.xl};

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const BackButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
`;

const NextButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
`;

// Progress Step Component
const ProgressStep = ({ steps, currentStep, completedSteps }) => {
  return (
    <ProgressContainer>
      <ProgressBar>
        <ProgressFill progress={(currentStep / (steps.length - 1)) * 100} />
      </ProgressBar>
      <StepIndicator>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <StepItem>
              <StepNumber
                isActive={index === currentStep}
                isCompleted={completedSteps.includes(index)}
              >
                {completedSteps.includes(index) ? <FaCheck /> : index + 1}
              </StepNumber>
              <StepLabel
                isActive={index === currentStep}
                isCompleted={completedSteps.includes(index)}
              >
                {step.title}
              </StepLabel>
            </StepItem>
            {index < steps.length - 1 && (
              <StepConnector isActive={completedSteps.includes(index)} />
            )}
          </React.Fragment>
        ))}
      </StepIndicator>
    </ProgressContainer>
  );
};

// Main BookingWizard Component
const BookingWizard = ({
  steps,
  initialData = {},
  onComplete,
  onCancel,
  children,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingData, setBookingData] = useState(initialData);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const updateBookingData = (stepData) => {
    setBookingData((prev) => ({
      ...prev,
      [steps[currentStep].id]: stepData,
    }));
  };

  const goToNextStep = async (stepData) => {
    setIsLoading(true);

    try {
      // Update data for current step
      updateBookingData(stepData);

      // Mark current step as completed
      setCompletedSteps((prev) => [...new Set([...prev, currentStep])]);

      // Move to next step or complete
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Final step - complete the booking
        const finalData = {
          ...bookingData,
          [steps[currentStep].id]: stepData,
        };
        await onComplete(finalData);
      }
    } catch (error) {
      console.error("Error proceeding to next step:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onCancel();
    }
  };

  const contextValue = {
    bookingData,
    updateBookingData,
    currentStepData: bookingData[steps[currentStep]?.id] || {},
    isLoading,
    goToNextStep,
    goToPreviousStep,
  };

  const CurrentStepComponent = steps[currentStep]?.component;

  return (
    <ThemedComponentProvider>
      <BookingContext.Provider value={contextValue}>
        <BookingPageContainer>
          <UserHeader />
          <BookingContentContainer>
            <WizardSection>
              <WizardCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <StyledCard>
                  <ProgressStep
                    steps={steps}
                    currentStep={currentStep}
                    completedSteps={completedSteps}
                  />

                  <ContentArea>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        {CurrentStepComponent && <CurrentStepComponent />}
                      </motion.div>
                    </AnimatePresence>
                  </ContentArea>

                  <NavigationButtons>
                    <BackButton
                      variant="outline"
                      onClick={goToPreviousStep}
                      disabled={isLoading}
                    >
                      <FaArrowLeft />
                      {currentStep === 0 ? "Cancel" : "Back"}
                    </BackButton>

                    <NextButton
                      variant="primary"
                      onClick={() => {
                        // This will be handled by individual step components
                        // They will call goToNextStep with their data
                      }}
                      disabled={isLoading}
                      style={{ visibility: "hidden" }} // Hidden as steps handle their own next buttons
                    >
                      {currentStep === steps.length - 1 ? "Complete" : "Next"}
                      <FaArrowRight />
                    </NextButton>
                  </NavigationButtons>
                </StyledCard>
              </WizardCard>
            </WizardSection>
          </BookingContentContainer>
        </BookingPageContainer>
      </BookingContext.Provider>
    </ThemedComponentProvider>
  );
};

export default BookingWizard;
