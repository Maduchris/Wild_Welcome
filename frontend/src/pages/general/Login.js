import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import toast from "react-hot-toast";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { authAPI } from "../../services/api";
import {
  Card,
  Button,
  Input,
  ThemedComponentProvider,
} from "../../components/ui/ThemeProvider";

// Login-specific styled components using ONLY theme variables
const LoginContainer = styled.div`
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

const LoginContent = styled.div`
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

const LoginCard = styled(Card)`
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

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const LogoImage = styled.img`
  width: 80px;
  height: 80px;
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const LoginLogo = styled.h1`
  font-size: ${(props) => props.theme.typography.fontSizes["2xl"]};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: ${(props) => props.theme.colors.secondary};
  margin-bottom: ${(props) => props.theme.spacing.xs};
`;

const LoginSubtitle = styled.p`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
`;

const LoginForm = styled.form`
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const FormGroup = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
`;

const LoginInput = styled(Input)`
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

const LoginButton = styled(Button)`
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

const SignUpPrompt = styled.div`
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

const LoginIllustration = styled.div`
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

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
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
      const response = await authAPI.login(formData);

      if (response.access_token) {
        localStorage.setItem("token", response.access_token);
        
        // Fetch user data
        const userData = await authAPI.getCurrentUser();
        localStorage.setItem("user", JSON.stringify(userData));

        toast.success("Login successful!");

        // Navigate based on user type
        if (userData.user_type === "landlord") {
          navigate("/landlord");
        } else {
          navigate("/user");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message || "Invalid email or password";
      toast.error(errorMessage);

      // Handle specific error types
      if (errorMessage.toLowerCase().includes("email")) {
        setErrors({ email: errorMessage });
      } else if (errorMessage.toLowerCase().includes("password")) {
        setErrors({ password: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    toast.info(`${provider} login will be implemented soon`);
  };

  return (
    <ThemedComponentProvider>
      <LoginContainer>
        <LoginContent>
          <LoginIllustration>
            <IllustrationImage src="/images/deer.jpg" alt="Deer illustration" />
          </LoginIllustration>

          <LoginCard>
            <LoginHeader>
              <LogoImage
                src="/images/wild-welcome-logo.png"
                alt="Wild Welcome Logo"
              />
              <LoginLogo>Wild Welcome</LoginLogo>
              <LoginSubtitle>
                Welcome back! Please sign in to your account.
              </LoginSubtitle>
            </LoginHeader>

            <LoginForm onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="email">Email Address</Label>
                <LoginInput
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  hasError={!!errors.email}
                />
                {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="password">Password</Label>
                <LoginInput
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  hasError={!!errors.password}
                />
                {errors.password && (
                  <ErrorMessage>{errors.password}</ErrorMessage>
                )}
              </FormGroup>

              <LoginButton
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </LoginButton>
            </LoginForm>

            <SocialLoginSection>
              <SocialDivider>
                <span>Or continue with</span>
              </SocialDivider>
              <SocialButtons>
                <SocialButton
                  type="button"
                  onClick={() => handleSocialLogin("Google")}
                >
                  <FaGoogle />
                  Google
                </SocialButton>
                <SocialButton
                  type="button"
                  onClick={() => handleSocialLogin("Facebook")}
                >
                  <FaFacebook />
                  Facebook
                </SocialButton>
              </SocialButtons>
            </SocialLoginSection>

            <SignUpPrompt>
              Don't have an account? <Link to="/signup">Sign up here</Link>
            </SignUpPrompt>
          </LoginCard>
        </LoginContent>
      </LoginContainer>
    </ThemedComponentProvider>
  );
};

export default Login;
