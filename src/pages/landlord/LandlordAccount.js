import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const AccountContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
`;

const Header = styled.header`
  background-color: ${props => props.theme.colors.white};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: ${props => props.theme.spacing.lg} 0;
  position: sticky;
  top: 0;
  z-index: ${props => props.theme.zIndex.sticky};
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.xl};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: ${props => props.theme.typography.fontSizes['2xl']};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
`;

const Nav = styled.nav`
  display: flex;
  gap: ${props => props.theme.spacing.xl};
  align-items: center;
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  transition: color ${props => props.theme.transitions.normal};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
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

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  background-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.typography.fontSizes['2xl']};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
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

const LandlordAccount = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleProfileUpdate = async (data) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Profile update data:', data);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderProfileTab = () => (
    <Section>
      <SectionTitle>Landlord Information</SectionTitle>
      <Form onSubmit={handleSubmit(handleProfileUpdate)}>
        <Row>
          <Input
            label="First Name"
            placeholder="Enter your first name"
            defaultValue="Sarah"
            {...register('firstName', {
              required: 'First name is required',
            })}
            error={errors.firstName?.message}
          />
          <Input
            label="Last Name"
            placeholder="Enter your last name"
            defaultValue="Johnson"
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
          defaultValue="sarah.johnson@email.com"
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
          defaultValue="+1 (555) 987-6543"
          {...register('phone', {
            required: 'Phone number is required',
          })}
          error={errors.phone?.message}
        />
        
        <Input
          label="Company Name (Optional)"
          placeholder="Enter your company name"
          defaultValue="Johnson Properties LLC"
          {...register('companyName')}
        />
        
        <ButtonGroup>
          <Button type="submit" loading={isLoading}>
            Save Changes
          </Button>
          <Button variant="outline" type="button">
            Cancel
          </Button>
        </ButtonGroup>
      </Form>
    </Section>
  );

  const renderSecurityTab = () => (
    <Section>
      <SectionTitle>Security Settings</SectionTitle>
      <Form>
        <Input
          label="Current Password"
          type="password"
          placeholder="Enter your current password"
          {...register('currentPassword', {
            required: 'Current password is required',
          })}
          error={errors.currentPassword?.message}
        />
        
        <Input
          label="New Password"
          type="password"
          placeholder="Enter your new password"
          {...register('newPassword', {
            required: 'New password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          })}
          error={errors.newPassword?.message}
        />
        
        <Input
          label="Confirm New Password"
          type="password"
          placeholder="Confirm your new password"
          {...register('confirmPassword', {
            required: 'Please confirm your password',
          })}
          error={errors.confirmPassword?.message}
        />
        
        <ButtonGroup>
          <Button type="submit">
            Update Password
          </Button>
          <Button variant="outline" type="button">
            Cancel
          </Button>
        </ButtonGroup>
      </Form>
    </Section>
  );

  return (
    <AccountContainer>
      <Header>
        <HeaderContent>
          <Logo to="/landlord/dashboard">Wild Welcome</Logo>
          <Nav>
            <NavLink to="/landlord/properties">Properties</NavLink>
            <NavLink to="/landlord/calendar">Calendar</NavLink>
            <NavLink to="/landlord/booking-request">Bookings</NavLink>
            <NavLink to="/landlord/account">Account</NavLink>
          </Nav>
        </HeaderContent>
      </Header>

      <MainContent>
        <PageTitle>Landlord Account</PageTitle>

        <ContentGrid>
          <Sidebar>
            <ProfileCard>
              <Avatar>SJ</Avatar>
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
            {activeTab === 'security' && renderSecurityTab()}
          </ContentSection>
        </ContentGrid>
      </MainContent>
    </AccountContainer>
  );
};

export default LandlordAccount; 