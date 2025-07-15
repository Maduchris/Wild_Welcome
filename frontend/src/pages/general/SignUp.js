import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
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
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState('tenant');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
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
      alert('Please agree to the terms and conditions');
      return;
    }
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Sign up data:', { ...data, userType });
      navigate('/signup-step2');
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignUpContainer>
      <SignUpContent>
        <SignUpIllustration>
          <img src="/images/zebra.jpg" alt="Zebra illustration" onError={e => { e.target.onerror = null; e.target.style.display='none'; e.target.parentNode.innerHTML += '<div style=\'color:#86571F;text-align:center;\'>Image not found</div>'; }} />
        </SignUpIllustration>
        <SignUpCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card>
            <Logo>
              <h1>Wild Welcome</h1>
              <p>Create your account to get started</p>
            </Logo>

            <UserTypeSelector>
              <UserTypeButton
                type="button"
                isSelected={userType === 'tenant'}
                onClick={() => setUserType('tenant')}
              >
                👤 I'm looking for a room
              </UserTypeButton>
              <UserTypeButton
                type="button"
                isSelected={userType === 'landlord'}
                onClick={() => setUserType('landlord')}
              >
                🏠 I'm a landlord
              </UserTypeButton>
            </UserTypeSelector>

            <Form onSubmit={handleSubmit(onSubmit)}>
              <NameRow>
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

              <PasswordRequirements>
                <strong>Password requirements:</strong>
                {passwordRequirements.map((req, index) => (
                  <Requirement key={index} isMet={req.met}>
                    <span>{req.met ? '✅' : '⭕'}</span>
                    {req.label}
                  </Requirement>
                ))}
              </PasswordRequirements>

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === watchedPassword || 'Passwords do not match',
                })}
                error={errors.confirmPassword?.message}
              />

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

              <Button
                type="submit"
                fullWidth
                loading={isLoading}
                disabled={!agreedToTerms}
              >
                Create Account
              </Button>
            </Form>

            <Footer>
              <p>
                Already have an account?{' '}
                <Link to="/login">Sign in</Link>
              </p>
              <p>
                <Link to="/">Back to home</Link>
              </p>
            </Footer>
          </Card>
        </SignUpCard>
      </SignUpContent>
    </SignUpContainer>
  );
};

export default SignUp; 