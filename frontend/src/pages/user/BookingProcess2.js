import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const BookingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.primaryDark} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xl};
`;

const BookingCard = styled(motion.div)`
  width: 100%;
  max-width: 800px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.full};
  margin-bottom: ${props => props.theme.spacing.xl};
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: ${props => props.theme.colors.white};
  width: 66%;
  transition: width ${props => props.theme.transitions.normal};
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const StepNumber = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  background-color: ${props => props.isActive ? props.theme.colors.white : 'rgba(255, 255, 255, 0.3)'};
  color: ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.white};
`;

const StepLabel = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.isActive ? props.theme.colors.white : 'rgba(255, 255, 255, 0.7)'};
  font-weight: ${props => props.isActive ? props.theme.typography.fontWeights.medium : props.theme.typography.fontWeights.normal};
`;

const Title = styled.h1`
  text-align: center;
  font-size: ${props => props.theme.typography.fontSizes['3xl']};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Subtitle = styled.p`
  text-align: center;
  font-size: ${props => props.theme.typography.fontSizes.lg};
  color: ${props => props.theme.colors.gray[100]};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${props => props.theme.spacing.xl};
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const ReviewSection = styled.div``;

const Section = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const SectionTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.md};
  padding-bottom: ${props => props.theme.spacing.sm};
  border-bottom: 1px solid ${props => props.theme.colors.borderLight};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
`;

const InfoItem = styled.div`
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.md};
`;

const InfoLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const InfoValue = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.base};
  color: ${props => props.theme.colors.text};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
`;

const PropertyCard = styled(Card)`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const PropertyImage = styled.div`
  width: 100%;
  height: 150px;
  background-color: ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.gray[500]};
  font-size: ${props => props.theme.typography.fontSizes['2xl']};
`;

const PropertyTitle = styled.h4`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
`;

const PropertyLocation = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  margin: 0 0 ${props => props.theme.spacing.md} 0;
`;

const PropertyPrice = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.primary};
`;

const SummaryCard = styled(Card)`
  position: sticky;
  top: 100px;
  height: fit-content;
`;

const SummaryTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.sm};
  
  &:last-child {
    margin-bottom: 0;
    border-top: 1px solid ${props => props.theme.colors.border};
    padding-top: ${props => props.theme.spacing.sm};
    font-weight: ${props => props.theme.typography.fontWeights.semibold};
    font-size: ${props => props.theme.typography.fontSizes.lg};
  }
`;

const SummaryLabel = styled.span`
  color: ${props => props.theme.colors.textSecondary};
`;

const SummaryValue = styled.span`
  color: ${props => props.theme.colors.text};
`;

const TotalValue = styled.span`
  color: ${props => props.theme.colors.primary};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.sm};
  margin: ${props => props.theme.spacing.lg} 0;
`;

const Checkbox = styled.input`
  margin-top: 2px;
`;

const CheckboxLabel = styled.label`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.4;
  
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.xl};
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const BookingProcess2 = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const listingId = searchParams.get('listingId');
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [property] = useState({
    id: 1,
    title: 'Cozy Studio in Kigali City Center',
    location: 'Kigali, Rwanda',
    price: 120,
    features: ['Furnished', 'Private Bathroom', 'WiFi', 'Kitchen'],
    image: '🏠'
  });

  useEffect(() => {
    // Simulate loading booking data from previous step
    setBookingData({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      moveInDate: '2024-02-01',
      leaseDuration: '12-months',
      employer: 'Tech Corp',
      jobTitle: 'Software Engineer',
      monthlyIncome: 5000,
      aboutMe: 'I am a software engineer looking for a comfortable place to live while working in the city.',
    });

    // Simulate loading property data
    // setProperty({
    //   id: listingId,
    //   title: 'Cozy Studio in Downtown',
    //   location: 'Downtown, New York',
    //   price: 1200,
    //   image: '🏠',
    // });
  }, [listingId]);

  const handleSubmit = async () => {
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Submitting booking:', { bookingData, property });
      navigate('/user/applications');
    } catch (error) {
      console.error('Booking submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/user/booking/step1?listingId=${listingId}`);
  };

  if (!bookingData || !property) {
    return <div>Loading...</div>;
  }

  return (
    <BookingContainer>
      <BookingCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card>
          <ProgressBar>
            <ProgressFill />
          </ProgressBar>

          <StepIndicator>
            <Step>
              <StepNumber isActive={false}>1</StepNumber>
              <StepLabel isActive={false}>Personal Info</StepLabel>
            </Step>
            <Step>
              <StepNumber isActive={true}>2</StepNumber>
              <StepLabel isActive={true}>Review & Submit</StepLabel>
            </Step>
            <Step>
              <StepNumber isActive={false}>3</StepNumber>
              <StepLabel isActive={false}>Confirmation</StepLabel>
            </Step>
          </StepIndicator>

          <Title>Review Your Application</Title>
          <Subtitle>
            Please review your information before submitting your booking request
          </Subtitle>

          <ContentGrid>
            <ReviewSection>
              <Section>
                <SectionTitle>Property Details</SectionTitle>
                <PropertyCard>
                  <PropertyImage>{property.image}</PropertyImage>
                  <PropertyTitle>{property.title}</PropertyTitle>
                  <PropertyLocation>{property.location}</PropertyLocation>
                  <PropertyPrice>${property.price}/month</PropertyPrice>
                </PropertyCard>
              </Section>

              <Section>
                <SectionTitle>Personal Information</SectionTitle>
                <InfoGrid>
                  <InfoItem>
                    <InfoLabel>Full Name</InfoLabel>
                    <InfoValue>{bookingData.firstName} {bookingData.lastName}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Email</InfoLabel>
                    <InfoValue>{bookingData.email}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Phone</InfoLabel>
                    <InfoValue>{bookingData.phone}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Move-in Date</InfoLabel>
                    <InfoValue>{new Date(bookingData.moveInDate).toLocaleDateString()}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Lease Duration</InfoLabel>
                    <InfoValue>{bookingData.leaseDuration.replace('-', ' ')}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Monthly Income</InfoLabel>
                    <InfoValue>${bookingData.monthlyIncome.toLocaleString()}</InfoValue>
                  </InfoItem>
                </InfoGrid>
              </Section>

              <Section>
                <SectionTitle>Employment Information</SectionTitle>
                <InfoGrid>
                  <InfoItem>
                    <InfoLabel>Employer</InfoLabel>
                    <InfoValue>{bookingData.employer}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Job Title</InfoLabel>
                    <InfoValue>{bookingData.jobTitle}</InfoValue>
                  </InfoItem>
                </InfoGrid>
              </Section>

              <Section>
                <SectionTitle>About You</SectionTitle>
                <InfoItem>
                  <InfoValue>{bookingData.aboutMe}</InfoValue>
                </InfoItem>
              </Section>
            </ReviewSection>

            <div>
              <SummaryCard>
                <SummaryTitle>Booking Summary</SummaryTitle>
                
                <SummaryRow>
                  <SummaryLabel>Monthly Rent</SummaryLabel>
                  <SummaryValue>${property.price}</SummaryValue>
                </SummaryRow>
                
                <SummaryRow>
                  <SummaryLabel>Security Deposit</SummaryLabel>
                  <SummaryValue>${property.price}</SummaryValue>
                </SummaryRow>
                
                <SummaryRow>
                  <SummaryLabel>Application Fee</SummaryLabel>
                  <SummaryValue>$50</SummaryValue>
                </SummaryRow>
                
                <SummaryRow>
                  <SummaryLabel>Total</SummaryLabel>
                  <TotalValue>${property.price * 2 + 50}</TotalValue>
                </SummaryRow>

                <CheckboxContainer>
                  <Checkbox
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                  />
                  <CheckboxLabel htmlFor="terms">
                    I agree to the{' '}
                    <a href="/terms" target="_blank" rel="noopener noreferrer">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer">
                      Privacy Policy
                    </a>
                  </CheckboxLabel>
                </CheckboxContainer>

                <ButtonGroup>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    style={{ flex: 1 }}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    loading={isLoading}
                    disabled={!agreedToTerms}
                    style={{ flex: 1 }}
                  >
                    Submit Application
                  </Button>
                </ButtonGroup>
              </SummaryCard>
            </div>
          </ContentGrid>
        </Card>
      </BookingCard>
    </BookingContainer>
  );
};

export default BookingProcess2; 