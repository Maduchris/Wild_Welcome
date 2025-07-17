import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import ProfileImageUpload from '../../components/ui/ProfileImageUpload';

const AccountContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSizes['3xl']};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: ${props => props.theme.spacing.xl};
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div``;

const ProfileCard = styled(Card)`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const UserName = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const UserEmail = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const MenuCard = styled(Card)`
  padding: 0;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.lg};
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  border-bottom: 1px solid ${props => props.theme.colors.borderLight};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: ${props => props.theme.colors.surface};
  }
  
  ${props => props.isActive && `
    background-color: ${props.theme.colors.primaryLight};
    color: ${props.theme.colors.primary};
    font-weight: ${props.theme.typography.fontWeights.medium};
  `}
`;

const MenuIcon = styled.span`
  margin-right: ${props => props.theme.spacing.sm};
`;

const ContentSection = styled.div``;

const Section = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.lg};
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.lg};
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const PropertyStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const StatCard = styled(Card)`
  text-align: center;
  padding: ${props => props.theme.spacing.lg};
`;

const StatNumber = styled.div`
  font-size: ${props => props.theme.typography.fontSizes['2xl']};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const StatLabel = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  font-size: ${props => props.theme.typography.fontSizes.sm};
`;

const NotificationSettings = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const NotificationItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.lg};
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.md};
`;

const NotificationInfo = styled.div``;

const NotificationTitle = styled.h4`
  font-size: ${props => props.theme.typography.fontSizes.base};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing.xs} 0;
`;

const NotificationDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background-color: ${props => props.theme.colors.primary};
  }
  
  &:checked + span:before {
    transform: translateX(26px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.theme.colors.border};
  transition: ${props => props.theme.transitions.normal};
  border-radius: 24px;
  
  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: ${props => props.theme.transitions.normal};
    border-radius: 50%;
  }
`;

const SecurityItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.lg};
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const SecurityInfo = styled.div``;

const SecurityTitle = styled.h4`
  font-size: ${props => props.theme.typography.fontSizes.base};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing.xs} 0;
`;

const SecurityDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const LandlordAccount = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileImage, setProfileImage] = useState(null);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false,
    bookingRequests: true,
    maintenance: true
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 987-6543',
      companyName: 'Johnson Properties LLC',
      address: '456 Business Ave, City, State 54321'
    }
  });

  const handleProfileUpdate = async (data) => {
    try {
      console.log('Profile update data:', data);
      // Here you would typically send the data to your backend
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleProfileImageChange = (file, previewUrl) => {
    console.log('Profile image changed:', file);
    setProfileImage(previewUrl);
    // Here you would typically upload the file to your backend
  };

  const handleProfileImageRemove = () => {
    setProfileImage(null);
    // Here you would typically remove the image from your backend
  };

  const renderProfileTab = () => (
    <Section>
      <SectionTitle>Landlord Information</SectionTitle>
      <Form onSubmit={handleSubmit(handleProfileUpdate)}>
        <Row>
          <Input
            label="First Name"
            {...register('firstName', { required: 'First name is required' })}
            error={errors.firstName?.message}
          />
          <Input
            label="Last Name"
            {...register('lastName', { required: 'Last name is required' })}
            error={errors.lastName?.message}
          />
        </Row>
        <Row>
          <Input
            label="Email Address"
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            error={errors.email?.message}
          />
          <Input
            label="Phone Number"
            {...register('phone')}
            error={errors.phone?.message}
          />
        </Row>
        <Input
          label="Company Name (Optional)"
          {...register('companyName')}
          error={errors.companyName?.message}
        />
        <Input
          label="Business Address"
          {...register('address')}
          error={errors.address?.message}
        />
        <ButtonGroup>
          <Button type="submit" variant="primary">
            Save Changes
          </Button>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </ButtonGroup>
      </Form>
    </Section>
  );

  const renderDashboardTab = () => (
    <Section>
      <SectionTitle>Property Overview</SectionTitle>
      <PropertyStats>
        <StatCard>
          <StatNumber>12</StatNumber>
          <StatLabel>Total Properties</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>8</StatNumber>
          <StatLabel>Occupied Units</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>4</StatNumber>
          <StatLabel>Available Units</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>95%</StatNumber>
          <StatLabel>Occupancy Rate</StatLabel>
        </StatCard>
      </PropertyStats>
      
      <SectionTitle>Recent Activity</SectionTitle>
      <div>
        <p>No recent activity to display.</p>
      </div>
    </Section>
  );

  const renderNotificationsTab = () => (
    <Section>
      <SectionTitle>Notification Settings</SectionTitle>
      <NotificationSettings>
        <NotificationItem>
          <NotificationInfo>
            <NotificationTitle>Email Notifications</NotificationTitle>
            <NotificationDescription>
              Receive notifications about bookings, messages, and updates via email
            </NotificationDescription>
          </NotificationInfo>
          <ToggleSwitch>
            <ToggleInput
              type="checkbox"
              checked={notifications.email}
              onChange={() => handleNotificationToggle('email')}
            />
            <ToggleSlider />
          </ToggleSwitch>
        </NotificationItem>
        
        <NotificationItem>
          <NotificationInfo>
            <NotificationTitle>Push Notifications</NotificationTitle>
            <NotificationDescription>
              Receive push notifications on your device
            </NotificationDescription>
          </NotificationInfo>
          <ToggleSwitch>
            <ToggleInput
              type="checkbox"
              checked={notifications.push}
              onChange={() => handleNotificationToggle('push')}
            />
            <ToggleSlider />
          </ToggleSwitch>
        </NotificationItem>
        
        <NotificationItem>
          <NotificationInfo>
            <NotificationTitle>Booking Requests</NotificationTitle>
            <NotificationDescription>
              Get notified when new booking requests are submitted
            </NotificationDescription>
          </NotificationInfo>
          <ToggleSwitch>
            <ToggleInput
              type="checkbox"
              checked={notifications.bookingRequests}
              onChange={() => handleNotificationToggle('bookingRequests')}
            />
            <ToggleSlider />
          </ToggleSwitch>
        </NotificationItem>
        
        <NotificationItem>
          <NotificationInfo>
            <NotificationTitle>Maintenance Alerts</NotificationTitle>
            <NotificationDescription>
              Receive alerts for maintenance requests and issues
            </NotificationDescription>
          </NotificationInfo>
          <ToggleSwitch>
            <ToggleInput
              type="checkbox"
              checked={notifications.maintenance}
              onChange={() => handleNotificationToggle('maintenance')}
            />
            <ToggleSlider />
          </ToggleSwitch>
        </NotificationItem>
        
        <NotificationItem>
          <NotificationInfo>
            <NotificationTitle>SMS Notifications</NotificationTitle>
            <NotificationDescription>
              Receive important updates via text message
            </NotificationDescription>
          </NotificationInfo>
          <ToggleSwitch>
            <ToggleInput
              type="checkbox"
              checked={notifications.sms}
              onChange={() => handleNotificationToggle('sms')}
            />
            <ToggleSlider />
          </ToggleSwitch>
        </NotificationItem>
        
        <NotificationItem>
          <NotificationInfo>
            <NotificationTitle>Marketing Communications</NotificationTitle>
            <NotificationDescription>
              Receive promotional offers and newsletters
            </NotificationDescription>
          </NotificationInfo>
          <ToggleSwitch>
            <ToggleInput
              type="checkbox"
              checked={notifications.marketing}
              onChange={() => handleNotificationToggle('marketing')}
            />
            <ToggleSlider />
          </ToggleSwitch>
        </NotificationItem>
      </NotificationSettings>
    </Section>
  );

  const renderSecurityTab = () => (
    <Section>
      <SectionTitle>Security Settings</SectionTitle>
      <SecurityItem>
        <SecurityInfo>
          <SecurityTitle>Change Password</SecurityTitle>
          <SecurityDescription>
            Update your password to keep your account secure
          </SecurityDescription>
        </SecurityInfo>
        <Button variant="outline" size="sm">
          Change
        </Button>
      </SecurityItem>
      
      <SecurityItem>
        <SecurityInfo>
          <SecurityTitle>Two-Factor Authentication</SecurityTitle>
          <SecurityDescription>
            Add an extra layer of security to your account
          </SecurityDescription>
        </SecurityInfo>
        <Button variant="outline" size="sm">
          Enable
        </Button>
      </SecurityItem>
      
      <SecurityItem>
        <SecurityInfo>
          <SecurityTitle>Login History</SecurityTitle>
          <SecurityDescription>
            View recent login activity and device information
          </SecurityDescription>
        </SecurityInfo>
        <Button variant="outline" size="sm">
          View
        </Button>
      </SecurityItem>
    </Section>
  );

  return (
    <AccountContainer>
      <Header userType="landlord" userInitials="SJ" profileImage={profileImage} />
      
      <MainContent>
        <PageTitle>Landlord Account</PageTitle>
        
        <ContentGrid>
          <Sidebar>
            <ProfileCard>
              <ProfileImageUpload
                currentImage={profileImage}
                userInitials="SJ"
                onImageChange={handleProfileImageChange}
                onRemoveImage={handleProfileImageRemove}
              />
              <UserName>Sarah Johnson</UserName>
              <UserEmail>sarah.johnson@email.com</UserEmail>
            </ProfileCard>
            
            <MenuCard>
              <MenuItem
                isActive={activeTab === 'profile'}
                onClick={() => setActiveTab('profile')}
              >
                <MenuIcon>👤</MenuIcon>
                Profile
              </MenuItem>
              <MenuItem
                isActive={activeTab === 'dashboard'}
                onClick={() => setActiveTab('dashboard')}
              >
                <MenuIcon>📊</MenuIcon>
                Dashboard
              </MenuItem>
              <MenuItem
                isActive={activeTab === 'notifications'}
                onClick={() => setActiveTab('notifications')}
              >
                <MenuIcon>🔔</MenuIcon>
                Notifications
              </MenuItem>
              <MenuItem
                isActive={activeTab === 'security'}
                onClick={() => setActiveTab('security')}
              >
                <MenuIcon>🔒</MenuIcon>
                Security
              </MenuItem>
            </MenuCard>
          </Sidebar>
          
          <ContentSection>
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'dashboard' && renderDashboardTab()}
            {activeTab === 'notifications' && renderNotificationsTab()}
            {activeTab === 'security' && renderSecurityTab()}
          </ContentSection>
        </ContentGrid>
      </MainContent>
    </AccountContainer>
  );
};

export default LandlordAccount; 