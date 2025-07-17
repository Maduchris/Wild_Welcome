import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const SignUpContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #EEC170 0%, #295135 100%);
`;

const SignUpContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.xl};
  width: 100%;
  max-width: 1200px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${props => props.theme.spacing.lg};
  }
`;

const SignUpIllustration = styled.div`
  flex: 1;
  max-width: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  
  img {
    width: 100%;
    max-width: 500px;
    border-radius: 1rem;
    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.10), 0 10px 10px -5px rgba(0,0,0,0.04);
    height: auto;
    object-fit: contain;
    background: #fff;
    display: block;
  }
  
  @media (max-width: 768px) {
    order: -1;
    max-width: 100%;
    margin-bottom: 1.5rem;
    img {
      max-width: 90vw;
    }
  }
`;

const SignUpCard = styled(motion.div)`
  width: 100%;
  max-width: 500px;
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
  
  h1 {
    font-size: ${props => props.theme.typography.fontSizes['3xl']};
    font-weight: ${props => props.theme.typography.fontWeights.bold};
    color: ${props => props.theme.colors.primary};
    margin: 0;
  }
  
  p {
    color: ${props => props.theme.colors.textSecondary};
    margin-top: ${props => props.theme.spacing.sm};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const UserTypeSelector = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const UserTypeButton = styled.button`
  flex: 1;
  padding: ${props => props.theme.spacing.lg};
  border: 2px solid ${props => props.isSelected ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.isSelected ? props.theme.colors.primaryLight : props.theme.colors.white};
  color: ${props => props.isSelected ? props.theme.colors.primary : props.theme.colors.text};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  transition: all ${props => props.theme.transitions.normal};
  cursor: pointer;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.primaryLight};
  }
`;

const NameRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.lg};
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const PasswordRequirements = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.sm};
`;

const Requirement = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.isMet ? props.theme.colors.success : props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.xs};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.md};
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

const Footer = styled.div`
  text-align: center;
  margin-top: ${props => props.theme.spacing.xl};
  
  p {
    color: ${props => props.theme.colors.textSecondary};
    margin-bottom: ${props => props.theme.spacing.sm};
  }
  
  a {
    color: ${props => props.theme.colors.primary};
    font-weight: ${props => props.theme.typography.fontWeights.medium};
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const SignUp = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState('user');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const watchedPassword = watch('password', '');

  const passwordRequirements = [
    { label: 'At least 8 characters', met: watchedPassword.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(watchedPassword) },
    { label: 'One lowercase letter', met: /[a-z]/.test(watchedPassword) },
    { label: 'One number', met: /\d/.test(watchedPassword) },
  ];

  const onSubmit = async (data) => {
    if (!agreedToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const userData = {
        ...data,
        user_type: userType,
        phone: data.phone || '',
      };
      
      const result = await registerUser(userData);
      
      if (result.success) {
        // Registration successful - navigation is handled by the auth context
        console.log('Registration successful:', result.user);
      } else {
        // Registration failed
        setError(result.error);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignUpContainer>
      <SignUpContent>
        <SignUpIllustration>
          <img src="/images/signup-illustration.jpg" alt="Wild Welcome" />
        </SignUpIllustration>
        <SignUpCard
          as={motion.div}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Logo>
            <h1>Wild Welcome</h1>
            <p>Join our community of wildlife enthusiasts</p>
          </Logo>

          <Form onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div style={{ 
                color: '#D32F2F', 
                backgroundColor: '#FFEBEE', 
                padding: '0.75rem', 
                borderRadius: '0.5rem', 
                marginBottom: '1rem',
                fontSize: '0.875rem'
              }}>
                {error}
              </div>
            )}

            <UserTypeSelector>
              <UserTypeButton
                type="button"
                isSelected={userType === 'user'}
                onClick={() => setUserType('user')}
              >
                🏠 I'm looking for a room
              </UserTypeButton>
              <UserTypeButton
                type="button"
                isSelected={userType === 'landlord'}
                onClick={() => setUserType('landlord')}
              >
                🏢 I'm a landlord
              </UserTypeButton>
            </UserTypeSelector>

            <NameRow>
              <Input
                label="First Name"
                placeholder="Enter your first name"
                {...register('first_name', {
                  required: 'First name is required',
                })}
                error={errors.first_name?.message}
              />
              <Input
                label="Last Name"
                placeholder="Enter your last name"
                {...register('last_name', {
                  required: 'Last name is required',
                })}
                error={errors.last_name?.message}
              />
            </NameRow>

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
              label="Phone Number (Optional)"
              type="tel"
              placeholder="Enter your phone number"
              {...register('phone')}
              error={errors.phone?.message}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Create a password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Password must contain uppercase, lowercase, and number',
                },
              })}
              error={errors.password?.message}
            />

            {watchedPassword && (
              <PasswordRequirements>
                <h4>Password Requirements:</h4>
                {passwordRequirements.map((req, index) => (
                  <Requirement key={index} isMet={req.met}>
                    {req.met ? '✓' : '○'} {req.label}
                  </Requirement>
                ))}
              </PasswordRequirements>
            )}

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
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="/privacy" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
              </CheckboxLabel>
            </CheckboxContainer>

            <Button
              type="submit"
              variant="primary"
              size="large"
              disabled={isLoading}
              style={{ width: '100%' }}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </Form>

          <Footer>
            <p>Already have an account?</p>
            <Link to="/login">Sign in here</Link>
          </Footer>
        </SignUpCard>
      </SignUpContent>
    </SignUpContainer>
  );
};

export default SignUp; 