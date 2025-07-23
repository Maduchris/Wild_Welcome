import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaUser, FaCog, FaBell, FaSignOutAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import { authAPI, usersAPI, isAuthenticated } from '../../services/api';
import {
  PageContainer,
  ContentContainer,
  Card,
  Button,
  Input,
  Title,
  Grid,
  ThemedComponentProvider
} from './ThemeProvider';

// Account-specific styled components using ONLY theme variables
const MainContent = styled(ContentContainer)`
  padding: 2rem;
  max-width: 1200px;
`;

const ContentGrid = styled(Grid)`
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  align-items: start;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ProfileCard = styled(Card)`
  text-align: center;
  padding: 2rem;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  background: ${props => props.theme.colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem auto;
  color: ${props => props.theme.colors.secondary};
  font-size: 2rem;
  font-weight: 700;
  text-transform: uppercase;
`;

const UserName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const UserEmail = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  margin: 0;
`;

const MenuCard = styled(Card)`
  padding: 0;
  overflow: hidden;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 1rem 1.5rem;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: ${props => props.theme.colors.accent};
    color: ${props => props.theme.colors.surface};
  }
  
  ${props => props.isActive && `
    background-color: ${props.theme.colors.primary};
    color: ${props.theme.colors.secondary};
    font-weight: 600;
  `}
  
  ${props => props.isLogout && `
    color: ${props.theme.colors.error};
    border-top: 2px solid ${props.theme.colors.border};
    
    &:hover {
      background-color: ${props.theme.colors.error};
      color: ${props.theme.colors.surface};
    }
  `}
`;

const MenuIcon = styled.span`
  font-size: 1rem;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SectionCard = styled(Card)`
  padding: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
`;

const PasswordInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 0.25rem;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-start;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ErrorText = styled.span`
  color: ${props => props.theme.colors.error};
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const AccountPage = ({ 
  Header, 
  userType = 'user', 
  redirectPath = '/login',
  dashboardPath = '/user'
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfile,
    setValue: setProfileValue
  } = useForm();

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    watch: watchPassword
  } = useForm();

  const watchNewPassword = watchPassword('newPassword');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated()) {
        navigate(redirectPath);
        return;
      }

      try {
        setLoading(true);
        const user = await authAPI.getCurrentUser();
        setUserData(user);
        
        // Pre-populate form with user data
        setProfileValue('firstName', user.first_name || '');
        setProfileValue('lastName', user.last_name || '');
        setProfileValue('email', user.email || '');
        setProfileValue('phone', user.phone || '');
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        toast.error('Failed to load account information');
        navigate(redirectPath);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, redirectPath, setProfileValue]);

  const handleProfileUpdate = async (data) => {
    try {
      setIsLoading(true);
      const updatedUser = await usersAPI.updateProfile({
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone
      });
      
      setUserData(prev => ({ ...prev, ...updatedUser }));
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (data) => {
    try {
      setIsLoading(true);
      await authAPI.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      
      toast.success('Password changed successfully!');
      resetPassword();
    } catch (error) {
      console.error('Password change failed:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      toast.success('Logged out successfully');
      navigate(redirectPath);
    } catch (error) {
      console.error('Logout failed:', error);
      navigate(redirectPath);
    }
  };

  const getInitials = () => {
    if (!userData) return 'U';
    const firstName = userData.first_name || '';
    const lastName = userData.last_name || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || userData.email?.charAt(0).toUpperCase() || 'U';
  };

  const renderProfileForm = () => (
    <SectionCard>
      <SectionTitle>
        <FaUser />
        Profile Information
      </SectionTitle>
      
      <Form onSubmit={handleSubmitProfile(handleProfileUpdate)}>
        <FormRow>
          <FormGroup>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              type="text"
              {...registerProfile('firstName', {
                required: 'First name is required',
                minLength: {
                  value: 2,
                  message: 'First name must be at least 2 characters'
                }
              })}
            />
            {profileErrors.firstName && (
              <ErrorText>{profileErrors.firstName.message}</ErrorText>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              type="text"
              {...registerProfile('lastName', {
                required: 'Last name is required',
                minLength: {
                  value: 2,
                  message: 'Last name must be at least 2 characters'
                }
              })}
            />
            {profileErrors.lastName && (
              <ErrorText>{profileErrors.lastName.message}</ErrorText>
            )}
          </FormGroup>
        </FormRow>

        <FormGroup>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            disabled
            {...registerProfile('email')}
          />
          <ErrorText style={{ opacity: 0.7 }}>
            Email cannot be changed. Contact support if needed.
          </ErrorText>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            {...registerProfile('phone', {
              pattern: {
                value: /^[+]?[1-9][\d]{0,15}$/,
                message: 'Please enter a valid phone number'
              }
            })}
          />
          {profileErrors.phone && (
            <ErrorText>{profileErrors.phone.message}</ErrorText>
          )}
        </FormGroup>

        <ButtonGroup>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : null}
            Update Profile
          </Button>
          <Button type="button" variant="secondary" onClick={() => resetProfile()}>
            Reset
          </Button>
        </ButtonGroup>
      </Form>
    </SectionCard>
  );

  const renderPasswordForm = () => (
    <SectionCard>
      <SectionTitle>
        <FaCog />
        Change Password
      </SectionTitle>
      
      <Form onSubmit={handleSubmitPassword(handlePasswordChange)}>
        <FormGroup>
          <Label htmlFor="currentPassword">Current Password</Label>
          <PasswordInputContainer>
            <Input
              id="currentPassword"
              type={showCurrentPassword ? 'text' : 'password'}
              {...registerPassword('currentPassword', {
                required: 'Current password is required'
              })}
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
            </PasswordToggle>
          </PasswordInputContainer>
          {passwordErrors.currentPassword && (
            <ErrorText>{passwordErrors.currentPassword.message}</ErrorText>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="newPassword">New Password</Label>
          <PasswordInputContainer>
            <Input
              id="newPassword"
              type={showPassword ? 'text' : 'password'}
              {...registerPassword('newPassword', {
                required: 'New password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                }
              })}
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </PasswordToggle>
          </PasswordInputContainer>
          {passwordErrors.newPassword && (
            <ErrorText>{passwordErrors.newPassword.message}</ErrorText>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <PasswordInputContainer>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              {...registerPassword('confirmPassword', {
                required: 'Please confirm your new password',
                validate: value =>
                  value === watchNewPassword || 'Passwords do not match'
              })}
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </PasswordToggle>
          </PasswordInputContainer>
          {passwordErrors.confirmPassword && (
            <ErrorText>{passwordErrors.confirmPassword.message}</ErrorText>
          )}
        </FormGroup>

        <ButtonGroup>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : null}
            Change Password
          </Button>
          <Button type="button" variant="secondary" onClick={() => resetPassword()}>
            Cancel
          </Button>
        </ButtonGroup>
      </Form>
    </SectionCard>
  );

  if (loading) {
    return (
      <ThemedComponentProvider>
        <PageContainer>
          <Header />
          <MainContent>
            <Title>Loading Account...</Title>
            <div style={{textAlign: 'center', padding: '2rem'}}>
              <p>Loading your account information...</p>
            </div>
          </MainContent>
        </PageContainer>
      </ThemedComponentProvider>
    );
  }

  return (
    <ThemedComponentProvider>
      <PageContainer>
        <Header />
        <MainContent>
          <ContentGrid>
            <Sidebar>
              <ProfileCard>
                <Avatar>{getInitials()}</Avatar>
                <UserName>
                  {userData?.first_name && userData?.last_name
                    ? `${userData.first_name} ${userData.last_name}`
                    : userData?.email
                  }
                </UserName>
                <UserEmail>{userData?.email}</UserEmail>
              </ProfileCard>

              <MenuCard>
                <MenuItem
                  isActive={activeTab === 'profile'}
                  onClick={() => setActiveTab('profile')}
                >
                  <MenuIcon><FaUser /></MenuIcon>
                  Profile
                </MenuItem>
                <MenuItem
                  isActive={activeTab === 'security'}
                  onClick={() => setActiveTab('security')}
                >
                  <MenuIcon><FaCog /></MenuIcon>
                  Security
                </MenuItem>
                <MenuItem
                  isActive={activeTab === 'notifications'}
                  onClick={() => setActiveTab('notifications')}
                >
                  <MenuIcon><FaBell /></MenuIcon>
                  Notifications
                </MenuItem>
                <MenuItem
                  isLogout
                  onClick={handleLogout}
                >
                  <MenuIcon><FaSignOutAlt /></MenuIcon>
                  Logout
                </MenuItem>
              </MenuCard>
            </Sidebar>

            <ContentSection>
              {activeTab === 'profile' && renderProfileForm()}
              {activeTab === 'security' && renderPasswordForm()}
              {activeTab === 'notifications' && (
                <SectionCard>
                  <SectionTitle>
                    <FaBell />
                    Notification Settings
                  </SectionTitle>
                  <p>Notification settings coming soon...</p>
                </SectionCard>
              )}
            </ContentSection>
          </ContentGrid>
        </MainContent>
      </PageContainer>
    </ThemedComponentProvider>
  );
};

export default AccountPage;