import React, { useState } from "react";
import styled from "styled-components";
import {
  FaUser,
  FaCalendar,
  FaBriefcase,
  FaEdit,
  FaMapMarker,
} from "react-icons/fa";
import { Button } from "../ui/ThemeProvider";
import { useBookingContext } from "./BookingWizard";

const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.lg};
`;

const StepTitle = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSizes["2xl"]};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.sm};
  text-align: center;
`;

const StepSubtitle = styled.p`
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  color: ${(props) => props.theme.colors.textSecondary};
  text-align: center;
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const ReviewGrid = styled.div`
  display: grid;
  gap: ${(props) => props.theme.spacing.lg};

  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    grid-template-columns: 2fr 1fr;
  }
`;

const ReviewSection = styled.div`
  background: ${(props) => props.theme.colors.gray[50]};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: ${(props) => props.theme.spacing.lg};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const ReviewSectionTitle = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: space-between;

  svg {
    color: ${(props) => props.theme.colors.primary};
    margin-right: ${(props) => props.theme.spacing.sm};
  }
`;

const EditButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  padding: ${(props) => props.theme.spacing.xs}
    ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  transition: all ${(props) => props.theme.transitions.normal};

  &:hover {
    background: ${(props) => props.theme.colors.primary}10;
  }
`;

const ReviewItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.sm};
  padding-bottom: ${(props) => props.theme.spacing.sm};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const ReviewLabel = styled.span`
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
`;

const ReviewValue = styled.span`
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.typography.fontSizes.md};
`;

const PropertySummary = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: ${(props) => props.theme.spacing.lg};
  position: sticky;
  top: ${(props) => props.theme.spacing.lg};
`;

const PropertyImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: ${(props) => props.theme.borderRadius.md};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const PropertyTitle = styled.h4`
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const PropertyLocation = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  margin-bottom: ${(props) => props.theme.spacing.md};

  svg {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const PropertyPrice = styled.div`
  font-size: ${(props) => props.theme.typography.fontSizes.xl};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: ${(props) => props.theme.colors.primary};
  text-align: center;
  padding: ${(props) => props.theme.spacing.md};
  background: ${(props) => props.theme.colors.primary}10;
  border-radius: ${(props) => props.theme.borderRadius.md};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const TermsSection = styled.div`
  background: ${(props) => props.theme.colors.warning}10;
  border: 1px solid ${(props) => props.theme.colors.warning};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.md};
  margin: ${(props) => props.theme.spacing.lg} 0;
`;

const TermsTitle = styled.h4`
  color: ${(props) => props.theme.colors.warning};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const TermsText = styled.p`
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  color: ${(props) => props.theme.colors.text};
  line-height: 1.5;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${(props) => props.theme.spacing.sm};
  margin: ${(props) => props.theme.spacing.lg} 0;
`;

const Checkbox = styled.input`
  margin-top: 2px;
`;

const CheckboxLabel = styled.label`
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  color: ${(props) => props.theme.colors.text};
  line-height: 1.5;
`;

const ActionButton = styled(Button)`
  margin-top: ${(props) => props.theme.spacing.lg};
  align-self: stretch;
`;

const ReviewSubmitStep = () => {
  const { bookingData, goToNextStep, goToPreviousStep, isLoading } =
    useBookingContext();
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Mock property data - in real app this would come from props or context
  const propertyData = {
    title: "Luxury 2BR Apartment in Downtown",
    location: "123 Main St, Downtown",
    price: "$2,500/month",
    image: "/images/room1.jpg",
  };

  const personalInfo = bookingData.personalInfo || {};

  const formatValue = (value) => {
    if (!value) return "Not provided";
    return value;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    if (!amount) return "Not provided";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleSubmit = () => {
    if (!agreedToTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }

    goToNextStep({
      termsAgreed: true,
      submissionDate: new Date().toISOString(),
    });
  };

  const handleEdit = () => {
    goToPreviousStep();
  };

  return (
    <StepContainer>
      <StepTitle>Review & Submit</StepTitle>
      <StepSubtitle>
        Please review your information before submitting your application
      </StepSubtitle>

      <ReviewGrid>
        <div>
          <ReviewSection>
            <ReviewSectionTitle>
              <div>
                <FaUser />
                Personal Information
              </div>
              <EditButton onClick={handleEdit}>
                <FaEdit />
                Edit
              </EditButton>
            </ReviewSectionTitle>

            <ReviewItem>
              <ReviewLabel>Full Name</ReviewLabel>
              <ReviewValue>
                {formatValue(personalInfo.firstName)}{" "}
                {formatValue(personalInfo.lastName)}
              </ReviewValue>
            </ReviewItem>

            <ReviewItem>
              <ReviewLabel>Email</ReviewLabel>
              <ReviewValue>{formatValue(personalInfo.email)}</ReviewValue>
            </ReviewItem>

            <ReviewItem>
              <ReviewLabel>Phone</ReviewLabel>
              <ReviewValue>{formatValue(personalInfo.phone)}</ReviewValue>
            </ReviewItem>
          </ReviewSection>

          <ReviewSection>
            <ReviewSectionTitle>
              <div>
                <FaCalendar />
                Move-in Details
              </div>
            </ReviewSectionTitle>

            <ReviewItem>
              <ReviewLabel>Move-in Date</ReviewLabel>
              <ReviewValue>{formatDate(personalInfo.moveInDate)}</ReviewValue>
            </ReviewItem>

            <ReviewItem>
              <ReviewLabel>Lease Duration</ReviewLabel>
              <ReviewValue>
                {formatValue(personalInfo.leaseDuration)}
              </ReviewValue>
            </ReviewItem>
          </ReviewSection>

          <ReviewSection>
            <ReviewSectionTitle>
              <div>
                <FaBriefcase />
                Employment Information
              </div>
            </ReviewSectionTitle>

            <ReviewItem>
              <ReviewLabel>Employer</ReviewLabel>
              <ReviewValue>{formatValue(personalInfo.employer)}</ReviewValue>
            </ReviewItem>

            <ReviewItem>
              <ReviewLabel>Job Title</ReviewLabel>
              <ReviewValue>{formatValue(personalInfo.jobTitle)}</ReviewValue>
            </ReviewItem>

            <ReviewItem>
              <ReviewLabel>Monthly Income</ReviewLabel>
              <ReviewValue>
                {formatCurrency(personalInfo.monthlyIncome)}
              </ReviewValue>
            </ReviewItem>
          </ReviewSection>

          {personalInfo.aboutMe && (
            <ReviewSection>
              <ReviewSectionTitle>
                <div>Additional Information</div>
              </ReviewSectionTitle>

              <ReviewItem>
                <ReviewLabel>About</ReviewLabel>
                <ReviewValue>{personalInfo.aboutMe}</ReviewValue>
              </ReviewItem>
            </ReviewSection>
          )}
        </div>

        <PropertySummary>
          <PropertyImage src={propertyData.image} alt={propertyData.title} />
          <PropertyTitle>{propertyData.title}</PropertyTitle>
          <PropertyLocation>
            <FaMapMarker />
            {propertyData.location}
          </PropertyLocation>
          <PropertyPrice>{propertyData.price}</PropertyPrice>
        </PropertySummary>
      </ReviewGrid>

      <TermsSection>
        <TermsTitle>Terms and Conditions</TermsTitle>
        <TermsText>
          By submitting this application, you acknowledge that you have read and
          agree to our terms and conditions. This application does not guarantee
          approval and is subject to background and credit checks. All
          information provided must be accurate and truthful.
        </TermsText>
      </TermsSection>

      <CheckboxContainer>
        <Checkbox
          id="termsAgreement"
          type="checkbox"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
        />
        <CheckboxLabel htmlFor="termsAgreement">
          I agree to the terms and conditions and confirm that all information
          provided is accurate.
        </CheckboxLabel>
      </CheckboxContainer>

      <ActionButton
        variant="primary"
        size="lg"
        disabled={!agreedToTerms || isLoading}
        onClick={handleSubmit}
      >
        {isLoading ? "Submitting Application..." : "Submit Application"}
      </ActionButton>
    </StepContainer>
  );
};

export default ReviewSubmitStep;
