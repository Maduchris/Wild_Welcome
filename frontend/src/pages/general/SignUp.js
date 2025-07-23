import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import toast from "react-hot-toast";
import {
  FaGoogle,
  FaFacebook,
  FaUser,
  FaHome,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { authAPI } from "../../services/api";
import {
  Card,
  Button,
  Input,
  ThemedComponentProvider,
} from "../../components/ui/ThemeProvider";

// SignUp-specific styled components using ONLY theme variables
const SignUpContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spacing.xl};
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.primary} 0%,
    ${(props) => props.theme.colors.secondary} 100%
  );

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: ${(props) => props.theme.spacing.lg}
      ${(props) => props.theme.spacing.md};
  }
`;

const SignUpContent = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 0;
  width: 100%;
  max-width: 1200px;
  min-height: 80vh;
  border-radius: ${(props) => props.theme.borderRadius.xl};
  overflow: hidden;
  box-shadow: ${(props) => props.theme.shadows.xl};

  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    flex-direction: column;
    gap: ${(props) => props.theme.spacing.xl};
    min-height: auto;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    gap: ${(props) => props.theme.spacing.lg};
    padding: 0 ${(props) => props.theme.spacing.sm};
  }
`;

const SignUpCard = styled(Card)`
  padding: ${(props) => props.theme.spacing["3xl"]}
    ${(props) => props.theme.spacing.xl};
  width: 100%;
  max-width: 420px;
  animation: slideUp 0.5s ease-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0;
  border-top-right-radius: ${(props) => props.theme.borderRadius.xl};
  border-bottom-right-radius: ${(props) => props.theme.borderRadius.xl};

  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    border-radius: ${(props) => props.theme.borderRadius.xl};
    max-width: 100%;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const SignUpHeader = styled.div`
  text-align: center;
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const LogoImage = styled.img`
  width: 80px;
  height: 80px;
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const SignUpLogo = styled.h1`
  font-size: ${(props) => props.theme.typography.fontSizes["2xl"]};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: ${(props) => props.theme.colors.secondary};
  margin-bottom: ${(props) => props.theme.spacing.xs};
`;

const SignUpSubtitle = styled.p`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
`;

const UserTypeSelection = styled.div`
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const UserTypeLabel = styled.label`
  display: block;
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
`;

const UserTypeButtons = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.sm};
`;

const UserTypeButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.theme.spacing.sm};
  padding: ${(props) => props.theme.spacing.md};
  border: 2px solid
    ${(props) =>
      props.active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  background: ${(props) =>
    props.active ? props.theme.colors.primary : props.theme.colors.surface};
  color: ${(props) =>
    props.active ? props.theme.colors.surface : props.theme.colors.text};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.normal};

  &:hover {
    background: ${(props) =>
      props.active ? props.theme.colors.brown : props.theme.colors.gray[100]};
    border-color: ${(props) => props.theme.colors.primary};
  }

  &:focus {
    outline: none;
    ring: 2px solid ${(props) => props.theme.colors.primary};
  }
`;

const SignUpForm = styled.form`
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing.xl};
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
    gap: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
`;

const SignUpInput = styled(Input)`
  width: 100%;
  border-color: ${(props) =>
    props.hasError ? props.theme.colors.error : props.theme.colors.border};

  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${(props) => props.theme.colors.primary}33;
  }
`;

const ErrorMessage = styled.div`
  color: ${(props) => props.theme.colors.error};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  margin-top: ${(props) => props.theme.spacing.xs};
`;

const PasswordRequirements = styled.div`
  margin-top: ${(props) => props.theme.spacing.sm};
  padding: ${(props) => props.theme.spacing.md};
  background: ${(props) => props.theme.colors.gray[50]};
  border-radius: ${(props) => props.theme.borderRadius.md};
  border: 1px solid ${(props) => props.theme.colors.border};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const PasswordRequirementsHeader = styled.div`
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const PasswordRequirement = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  color: ${(props) =>
    props.valid
      ? props.theme.colors.success
      : props.theme.colors.textSecondary};
  margin-bottom: ${(props) => props.theme.spacing.sm};
  padding: ${(props) => props.theme.spacing.xs};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  background: ${(props) =>
    props.valid
      ? props.theme.colors.successLight || "rgba(34, 197, 94, 0.1)"
      : "transparent"};
  transition: all ${(props) => props.theme.transitions.normal};

  &:last-child {
    margin-bottom: 0;
  }

  svg {
    font-size: ${(props) => props.theme.typography.fontSizes.md};
    color: ${(props) =>
      props.valid ? props.theme.colors.success : props.theme.colors.error};
  }
`;

const SignUpButton = styled(Button)`
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing.lg};
  padding: ${(props) => props.theme.spacing.md};
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
`;

const SocialLoginSection = styled.div`
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const SocialDivider = styled.div`
  display: flex;
  align-items: center;
  margin: ${(props) => props.theme.spacing.lg} 0;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: ${(props) => props.theme.colors.border};
  }

  span {
    padding: 0 ${(props) => props.theme.spacing.lg};
    color: ${(props) => props.theme.colors.textSecondary};
    font-size: ${(props) => props.theme.typography.fontSizes.sm};
  }
`;

const SocialButtons = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.sm};
`;

const SocialButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.theme.spacing.sm};
  padding: ${(props) => props.theme.spacing.md};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  background: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.normal};

  &:hover {
    background: ${(props) => props.theme.colors.gray[100]};
    border-color: ${(props) => props.theme.colors.primary};
  }

  &:focus {
    outline: none;
    ring: 2px solid ${(props) => props.theme.colors.primary};
  }
`;

const LoginPrompt = styled.div`
  text-align: center;
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};

  a {
    color: ${(props) => props.theme.colors.primary};
    text-decoration: none;
    font-weight: ${(props) => props.theme.typography.fontWeights.medium};

    &:hover {
      text-decoration: underline;
    }
  }
`;

const SignUpIllustration = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.colors.surface};
  border-top-left-radius: ${(props) => props.theme.borderRadius.xl};
  border-bottom-left-radius: ${(props) => props.theme.borderRadius.xl};
  overflow: hidden;

  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    order: -1;
    border-radius: ${(props) => props.theme.borderRadius.xl};
    min-height: 300px;
  }
`;

const IllustrationImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;

  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    height: 300px;
  }
`;

const SignUp = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("user");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validatePassword = (password) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
    };
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!Object.values(passwordValidation).every(Boolean)) {
        newErrors.password = "Password does not meet requirements";
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const signupData = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email,
        password: formData.password,
        user_type: userType,
      };

      const response = await authAPI.register(signupData);

      if (response.message === "User registered successfully") {
        toast.success("Account created successfully! Welcome to Wild Welcome.");

        // Now login the user automatically
        const loginResponse = await authAPI.login({
          email: formData.email,
          password: formData.password,
        });

        if (loginResponse.access_token) {
          localStorage.setItem("token", loginResponse.access_token);

          // Fetch user data
          const userData = await authAPI.getCurrentUser();
          localStorage.setItem("user", JSON.stringify(userData));

          // Navigate based on user type
          if (userData.user_type === "landlord") {
            navigate("/landlord");
          } else {
            navigate("/user");
          }
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Account creation failed. Please try again.";
      toast.error(errorMessage);

      // Handle specific error types
      if (errorMessage.toLowerCase().includes("email")) {
        setErrors({ email: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = (provider) => {
    toast.info(`${provider} signup will be implemented soon`);
  };

  const passwordValidation = validatePassword(formData.password);

  return (
    <ThemedComponentProvider>
      <SignUpContainer>
        <SignUpContent>
          <SignUpIllustration>
            <IllustrationImage
              src="/images/zebra.jpg"
              alt="Zebra illustration"
            />
          </SignUpIllustration>

          <SignUpCard>
            <SignUpHeader>
              <LogoImage
                src="/images/wild-welcome-logo.png"
                alt="Wild Welcome Logo"
              />
              <SignUpLogo>Wild Welcome</SignUpLogo>
              <SignUpSubtitle>
                Create your account and start your journey with us.
              </SignUpSubtitle>
            </SignUpHeader>

            <UserTypeSelection>
              <UserTypeLabel>I want to sign up as:</UserTypeLabel>
              <UserTypeButtons>
                <UserTypeButton
                  type="button"
                  active={userType === "user"}
                  onClick={() => setUserType("user")}
                >
                  <FaUser />
                  User
                </UserTypeButton>
                <UserTypeButton
                  type="button"
                  active={userType === "landlord"}
                  onClick={() => setUserType("landlord")}
                >
                  <FaHome />
                  Landlord
                </UserTypeButton>
              </UserTypeButtons>
            </UserTypeSelection>

            <SignUpForm onSubmit={handleSubmit}>
              <FormRow>
                <FormGroup>
                  <Label htmlFor="firstName">First Name</Label>
                  <SignUpInput
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    hasError={!!errors.firstName}
                  />
                  {errors.firstName && (
                    <ErrorMessage>{errors.firstName}</ErrorMessage>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="lastName">Last Name</Label>
                  <SignUpInput
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    hasError={!!errors.lastName}
                  />
                  {errors.lastName && (
                    <ErrorMessage>{errors.lastName}</ErrorMessage>
                  )}
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label htmlFor="email">Email Address</Label>
                <SignUpInput
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  hasError={!!errors.email}
                />
                {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="password">Password</Label>
                <SignUpInput
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  hasError={!!errors.password}
                />
                {formData.password && (
                  <PasswordRequirements>
                    <PasswordRequirementsHeader>
                      Password must contain:
                    </PasswordRequirementsHeader>
                    <PasswordRequirement valid={passwordValidation.length}>
                      {passwordValidation.length ? <FaCheck /> : <FaTimes />}
                      At least 8 characters
                    </PasswordRequirement>
                    <PasswordRequirement valid={passwordValidation.uppercase}>
                      {passwordValidation.uppercase ? <FaCheck /> : <FaTimes />}
                      One uppercase letter (A-Z)
                    </PasswordRequirement>
                    <PasswordRequirement valid={passwordValidation.lowercase}>
                      {passwordValidation.lowercase ? <FaCheck /> : <FaTimes />}
                      One lowercase letter (a-z)
                    </PasswordRequirement>
                    <PasswordRequirement valid={passwordValidation.number}>
                      {passwordValidation.number ? <FaCheck /> : <FaTimes />}
                      One number (0-9)
                    </PasswordRequirement>
                  </PasswordRequirements>
                )}
                {errors.password && (
                  <ErrorMessage>{errors.password}</ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <SignUpInput
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  hasError={!!errors.confirmPassword}
                />
                {formData.confirmPassword && (
                  <PasswordRequirements>
                    <PasswordRequirement
                      valid={
                        formData.password === formData.confirmPassword &&
                        formData.password.length > 0
                      }
                    >
                      {formData.password === formData.confirmPassword &&
                      formData.password.length > 0 ? (
                        <FaCheck />
                      ) : (
                        <FaTimes />
                      )}
                      Passwords match
                    </PasswordRequirement>
                  </PasswordRequirements>
                )}
                {errors.confirmPassword && (
                  <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
                )}
              </FormGroup>

              <SignUpButton
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </SignUpButton>
            </SignUpForm>

            <SocialLoginSection>
              <SocialDivider>
                <span>Or continue with</span>
              </SocialDivider>
              <SocialButtons>
                <SocialButton
                  type="button"
                  onClick={() => handleSocialSignup("Google")}
                >
                  <FaGoogle />
                  Google
                </SocialButton>
                <SocialButton
                  type="button"
                  onClick={() => handleSocialSignup("Facebook")}
                >
                  <FaFacebook />
                  Facebook
                </SocialButton>
              </SocialButtons>
            </SocialLoginSection>

            <LoginPrompt>
              Already have an account? <Link to="/login">Sign in here</Link>
            </LoginPrompt>
          </SignUpCard>
        </SignUpContent>
      </SignUpContainer>
    </ThemedComponentProvider>
  );
};

export default SignUp;
