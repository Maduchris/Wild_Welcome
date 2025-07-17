import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../../contexts/AuthContext';

const HeaderContainer = styled.header`
  background-color: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: ${props => props.theme.spacing.lg} 0;
  position: sticky;
  top: 0;
  z-index: ${props => props.theme.zIndex.sticky};
  box-shadow: ${props => props.theme.shadows.sm};
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.xl};
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 0 ${props => props.theme.spacing.md};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 0 ${props => props.theme.spacing.sm};
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  font-size: ${props => props.theme.typography.fontSizes['2xl']};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.primary};
  flex-shrink: 0;
  
  img {
    height: 35px;
    width: auto;
    margin-right: ${props => props.theme.spacing.sm};
    object-fit: contain;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.typography.fontSizes.xl};
    
    img {
      height: 30px;
    }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: ${props => props.theme.typography.fontSizes.lg};
    
    img {
      height: 28px;
      margin-right: ${props => props.theme.spacing.xs};
    }
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: ${props => props.theme.spacing.xl};
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    gap: ${props => props.theme.spacing.lg};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  transition: color ${props => props.theme.transitions.normal};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  white-space: nowrap;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.background};
  }
  
  ${props => props.isActive && `
    color: ${props.theme.colors.primary};
    background-color: ${props.theme.colors.primaryLight};
  `}
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  flex-shrink: 0;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    gap: ${props => props.theme.spacing.sm};
  }
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  background-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.white};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  cursor: pointer;
  transition: transform ${props => props.theme.transitions.normal};
  flex-shrink: 0;
  
  &:hover {
    transform: scale(1.05);
  }
  
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 35px;
    height: 35px;
    font-size: ${props => props.theme.typography.fontSizes.sm};
  }
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const UserDropdown = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.sm};
  position: absolute;
  top: 100%;
  right: 0;
  z-index: ${props => props.theme.zIndex.dropdown};
  min-width: 200px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.text};
`;

const UserEmail = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textSecondary};
`;

const LogoutButton = styled.button`
  background-color: ${props => props.theme.colors.danger};
  color: ${props => props.theme.colors.white};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  transition: background-color ${props => props.theme.transitions.normal};
  width: 100%;
  text-align: left;

  &:hover {
    background-color: ${props => props.theme.colors.dangerDark};
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  padding: ${props => props.theme.spacing.sm};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  display: none;
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.md};
  z-index: ${props => props.theme.zIndex.dropdown};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: ${props => props.isOpen ? 'block' : 'none'};
  }
`;

const MobileNavLink = styled(Link)`
  display: block;
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.sm};
  transition: background-color ${props => props.theme.transitions.normal};
  
  &:hover {
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.primary};
  }
  
  ${props => props.isActive && `
    background-color: ${props.theme.colors.primaryLight};
    color: ${props => props.theme.colors.primary};
  `}
`;

const MobileLogoutButton = styled.button`
  background-color: ${props => props.theme.colors.danger};
  color: ${props => props.theme.colors.white};
  padding: ${props => props.theme.spacing.md};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  transition: background-color ${props => props.theme.transitions.normal};
  width: 100%;
  text-align: left;

  &:hover {
    background-color: ${props => props.theme.colors.dangerDark};
  }
`;

const Header = ({ userType = 'user', profileImage = null, userInitials = 'JD' }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, getUserInitials, getUserDisplayName, isLandlord, isTenant } = useAuth();
  
  // Use auth context data if available, otherwise fall back to props
  const currentUserType = user ? (isLandlord() ? 'landlord' : 'user') : userType;
  const currentProfileImage = user?.profile_image || profileImage;
  const currentUserInitials = user ? getUserInitials() : userInitials;
  
  const getNavLinks = () => {
    if (currentUserType === 'landlord') {
      return [
        { to: '/landlord/dashboard', label: 'Dashboard' },
        { to: '/landlord/properties', label: 'Properties' },
        { to: '/landlord/calendar', label: 'Calendar' },
        { to: '/landlord/booking-request', label: 'Bookings' },
        { to: '/landlord/account', label: 'Account' },
      ];
    } else if (currentUserType === 'user') {
      return [
        { to: '/user', label: 'Home' },
        { to: '/user/search', label: 'Search' },
        { to: '/user/favourites', label: 'Favourites' },
        { to: '/user/applications', label: 'Applications' },
        { to: '/user/account', label: 'Account' },
      ];
    }
    return [];
  };

  const navLinks = getNavLinks();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
  };

  // Don't render header for public pages
  if (!user) {
    return null;
  }

  return (
    <>
      <HeaderContainer>
        <HeaderContent>
          <Logo to={currentUserType === 'landlord' ? '/landlord/dashboard' : '/user'}>
            <img src="/images/wild-welcome-logo.png" alt="Wild Welcome" />
            <span>Wild Welcome</span>
          </Logo>
          
          <Nav>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                isActive={location.pathname === link.to}
              >
                {link.label}
              </NavLink>
            ))}
          </Nav>
          
          <UserMenu>
            <ThemeToggle />
            <Avatar>
              {currentProfileImage ? (
                <ProfileImage src={currentProfileImage} alt="Profile" />
              ) : (
                currentUserInitials
              )}
            </Avatar>
            <UserDropdown>
              <UserInfo>
                <UserName>{getUserDisplayName()}</UserName>
                <UserEmail>{user?.email}</UserEmail>
              </UserInfo>
              <LogoutButton onClick={handleLogout}>
                Logout
              </LogoutButton>
            </UserDropdown>
            <MobileMenuButton onClick={toggleMobileMenu}>
              {mobileMenuOpen ? '✕' : '☰'}
            </MobileMenuButton>
          </UserMenu>
        </HeaderContent>
      </HeaderContainer>
      
      <MobileMenu isOpen={mobileMenuOpen}>
        {navLinks.map((link) => (
          <MobileNavLink
            key={link.to}
            to={link.to}
            isActive={location.pathname === link.to}
            onClick={() => setMobileMenuOpen(false)}
          >
            {link.label}
          </MobileNavLink>
        ))}
        <MobileLogoutButton onClick={handleLogout}>
          Logout
        </MobileLogoutButton>
      </MobileMenu>
    </>
  );
};

export default Header; 