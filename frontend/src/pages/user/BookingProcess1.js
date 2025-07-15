import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
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
  max-width: 600px;
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
  width: 33%;
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const Section = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.borderLight};
  padding-bottom: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.lg};
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.typography.fontSizes.base};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.text};
  transition: all ${props => props.theme.transitions.normal};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primaryLight};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.typography.fontSizes.base};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.text};
  resize: vertical;
  min-height: 100px;
  transition: all ${props => props.theme.transitions.normal};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primaryLight};
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

const BookingProcess1 = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const listingId = searchParams.get('listingId');
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Booking step 1 data:', data);
      navigate(`/user/booking/step2?listingId=${listingId}`);
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/user/listing/${listingId}`);
  };

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
              <StepNumber isActive={true}>1</StepNumber>
              <StepLabel isActive={true}>Personal Info</StepLabel>
            </Step>
            <Step>
              <StepNumber isActive={false}>2</StepNumber>
              <StepLabel isActive={false}>Review & Submit</StepLabel>
            </Step>
            <Step>
              <StepNumber isActive={false}>3</StepNumber>
              <StepLabel isActive={false}>Confirmation</StepLabel>
            </Step>
          </StepIndicator>

          <Title>Personal Information</Title>
          <Subtitle>
            Please provide your details to complete the booking process
          </Subtitle>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Section>
              <SectionTitle>Contact Information</SectionTitle>
              <Row>
                <Input
                  label="First Name"
                  placeholder="Enter your first name"
                  {...register('firstName', {
                    required: 'First name is required',
                  })}
                  error={errors.firstName?.message}
                />
                <Input
                  label="Last Name"
                  placeholder="Enter your last name"
                  {...register('lastName', {
                    required: 'Last name is required',
                  })}
                  error={errors.lastName?.message}
                />
              </Row>
              
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                error={errors.email?.message}
              />
              
              <Input
                label="Phone Number"
                type="tel"
                placeholder="Enter your phone number"
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[\+]?[1-9][\d]{0,15}$/,
                    message: 'Invalid phone number',
                  },
                })}
                error={errors.phone?.message}
              />
            </Section>

            <Section>
              <SectionTitle>Move-in Details</SectionTitle>
              <Row>
                <div>
                  <label>Preferred Move-in Date</label>
                  <Input
                    type="date"
                    {...register('moveInDate', {
                      required: 'Move-in date is required',
                    })}
                    error={errors.moveInDate?.message}
                  />
                </div>
                <div>
                  <label>Lease Duration</label>
                  <Select {...register('leaseDuration', { required: 'Lease duration is required' })}>
                    <option value="">Select duration</option>
                    <option value="3-months">3 Months</option>
                    <option value="6-months">6 Months</option>
                    <option value="12-months">12 Months</option>
                    <option value="month-to-month">Month to Month</option>
                  </Select>
                </div>
              </Row>
            </Section>

            <Section>
              <SectionTitle>Employment Information</SectionTitle>
              <Input
                label="Current Employer"
                placeholder="Enter your employer name"
                {...register('employer', {
                  required: 'Employer is required',
                })}
                error={errors.employer?.message}
              />
              
              <Row>
                <Input
                  label="Job Title"
                  placeholder="Enter your job title"
                  {...register('jobTitle', {
                    required: 'Job title is required',
                  })}
                  error={errors.jobTitle?.message}
                />
                <Input
                  label="Monthly Income"
                  type="number"
                  placeholder="Enter your monthly income"
                  {...register('monthlyIncome', {
                    required: 'Monthly income is required',
                    min: { value: 0, message: 'Income must be positive' },
                  })}
                  error={errors.monthlyIncome?.message}
                />
              </Row>
            </Section>

            <Section>
              <SectionTitle>Additional Information</SectionTitle>
              <div>
                <label>Tell us about yourself</label>
                <TextArea
                  placeholder="Share a bit about yourself, your lifestyle, and why you're interested in this property..."
                  {...register('aboutMe')}
                />
              </div>
            </Section>

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
                type="submit"
                loading={isLoading}
                style={{ flex: 1 }}
              >
                Continue
              </Button>
            </ButtonGroup>
          </Form>
        </Card>
      </BookingCard>
    </BookingContainer>
  );
};

export default BookingProcess1; 