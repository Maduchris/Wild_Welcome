import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaCalendarAlt,
  FaClock,
  FaBriefcase,
  FaDollarSign,
} from "react-icons/fa";
import { Input, Button } from "../ui/ThemeProvider";
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

const Section = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  padding-bottom: ${(props) => props.theme.spacing.lg};
  margin-bottom: ${(props) => props.theme.spacing.lg};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  padding-bottom: ${(props) => props.theme.spacing.sm};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};

  svg {
    color: ${(props) => props.theme.colors.primary};
    font-size: ${(props) => props.theme.typography.fontSizes.md};
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${(props) => props.theme.spacing.md};

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  gap: ${(props) => props.theme.spacing.xs};

  svg {
    font-size: ${(props) => props.theme.typography.fontSizes.sm};
    color: ${(props) => props.theme.colors.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${(props) => props.theme.spacing.md};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSizes.md};
  color: ${(props) => props.theme.colors.text};
  background-color: ${(props) => props.theme.colors.surface};
  transition: all ${(props) => props.theme.transitions.normal};

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${(props) => props.theme.colors.primary}33;
  }

  &:invalid {
    border-color: ${(props) => props.theme.colors.error};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: ${(props) => props.theme.spacing.md};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSizes.md};
  font-family: inherit;
  color: ${(props) => props.theme.colors.text};
  background-color: ${(props) => props.theme.colors.surface};
  resize: vertical;
  transition: all ${(props) => props.theme.transitions.normal};

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${(props) => props.theme.colors.primary}33;
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.textSecondary};
  }
`;

const ErrorMessage = styled.div`
  color: ${(props) => props.theme.colors.error};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  margin-top: ${(props) => props.theme.spacing.xs};
`;

const ActionButton = styled(Button)`
  margin-top: ${(props) => props.theme.spacing.lg};
  align-self: flex-end;
`;

const PersonalInfoStep = () => {
  const { currentStepData, goToNextStep, isLoading } = useBookingContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: currentStepData,
  });

  const onSubmit = (data) => {
    goToNextStep(data);
  };

  return (
    <StepContainer>
      <StepTitle>Personal Information</StepTitle>
      <StepSubtitle>
        Please provide your details to complete the booking process
      </StepSubtitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Section>
          <SectionTitle>
            <FaUser />
            Contact Information
          </SectionTitle>

          <FormRow>
            <FormGroup>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                {...register("firstName", {
                  required: "First name is required",
                })}
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <ErrorMessage>{errors.firstName.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                {...register("lastName", {
                  required: "Last name is required",
                })}
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <ErrorMessage>{errors.lastName.message}</ErrorMessage>
              )}
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label htmlFor="email">
              <FaEnvelope style={{ marginRight: 8 }} />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              placeholder="Enter your email"
            />
            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="phone">
              <FaPhone style={{ marginRight: 8 }} />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[+]?[1-9][\d]{0,15}$/,
                  message: "Invalid phone number",
                },
              })}
              placeholder="Enter your phone number"
            />
            {errors.phone && (
              <ErrorMessage>{errors.phone.message}</ErrorMessage>
            )}
          </FormGroup>
        </Section>

        <Section>
          <SectionTitle>
            <FaCalendar />
            Move-in Details
          </SectionTitle>

          <FormRow>
            <FormGroup>
              <Label htmlFor="moveInDate">
                <FaCalendarAlt style={{ marginRight: 8 }} />
                Preferred Move-in Date
              </Label>
              <Input
                id="moveInDate"
                type="date"
                {...register("moveInDate", {
                  required: "Move-in date is required",
                  validate: (value) => {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return (
                      selectedDate >= today ||
                      "Move-in date cannot be in the past"
                    );
                  },
                })}
              />
              {errors.moveInDate && (
                <ErrorMessage>{errors.moveInDate.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="leaseDuration">
                <FaClock style={{ marginRight: 8 }} />
                Lease Duration
              </Label>
              <Select
                id="leaseDuration"
                {...register("leaseDuration", {
                  required: "Lease duration is required",
                })}
              >
                <option value="">Select duration</option>
                <option value="3-months">3 Months</option>
                <option value="6-months">6 Months</option>
                <option value="12-months">12 Months</option>
                <option value="18-months">18 Months</option>
                <option value="24-months">24 Months</option>
                <option value="month-to-month">Month to Month</option>
              </Select>
              {errors.leaseDuration && (
                <ErrorMessage>{errors.leaseDuration.message}</ErrorMessage>
              )}
            </FormGroup>
          </FormRow>
        </Section>

        <Section>
          <SectionTitle>
            <FaBriefcase />
            Employment Information
          </SectionTitle>

          <FormGroup>
            <Label htmlFor="employer">
              <FaBriefcase style={{ marginRight: 8 }} />
              Current Employer
            </Label>
            <Input
              id="employer"
              {...register("employer", {
                required: "Employer is required",
              })}
              placeholder="Enter your employer name"
            />
            {errors.employer && (
              <ErrorMessage>{errors.employer.message}</ErrorMessage>
            )}
          </FormGroup>

          <FormRow>
            <FormGroup>
              <Label htmlFor="jobTitle">
                <FaUser style={{ marginRight: 8 }} />
                Job Title
              </Label>
              <Input
                id="jobTitle"
                {...register("jobTitle", {
                  required: "Job title is required",
                })}
                placeholder="Enter your job title"
              />
              {errors.jobTitle && (
                <ErrorMessage>{errors.jobTitle.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="monthlyIncome">
                <FaDollarSign style={{ marginRight: 8 }} />
                Monthly Income
              </Label>
              <Input
                id="monthlyIncome"
                type="number"
                {...register("monthlyIncome", {
                  required: "Monthly income is required",
                  min: { value: 0, message: "Income must be positive" },
                })}
                placeholder="Enter your monthly income"
              />
              {errors.monthlyIncome && (
                <ErrorMessage>{errors.monthlyIncome.message}</ErrorMessage>
              )}
            </FormGroup>
          </FormRow>
        </Section>

        <Section>
          <SectionTitle>
            <FaUser />
            Additional Information
          </SectionTitle>

          <FormGroup>
            <Label htmlFor="aboutMe">
              <FaUser style={{ marginRight: 8 }} />
              Tell us about yourself
            </Label>
            <TextArea
              id="aboutMe"
              {...register("aboutMe")}
              placeholder="Share a bit about yourself, your lifestyle, and why you're interested in this property..."
            />
          </FormGroup>
        </Section>

        <ActionButton
          type="submit"
          variant="primary"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Continue to Review"}
        </ActionButton>
      </form>
    </StepContainer>
  );
};

export default PersonalInfoStep;
