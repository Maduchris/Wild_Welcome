import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaSignOutAlt } from 'react-icons/fa';
import { authAPI, getCurrentUser } from '../../services/api';
import ThemeToggle from '../ui/ThemeToggle';

const Header = styled.header`
  background-color: ${props => props.theme?.colors?.surface || props.theme?.colors?.background || '#F9F7F3'};
  border-bottom: 1px solid ${props => props.theme?.colors?.border || '#AFBE8E'};
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme?.colors?.primary || '#3b82f6'};
  text-decoration: none;
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: ${props => props.theme?.colors?.text || '#374151'};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  padding-bottom: 4px;
  border-bottom: 2px solid transparent;
  
  &:hover {
    color: ${props => props.theme?.colors?.primary || '#3b82f6'};
  }
  
  &.active {
    color: ${props => props.theme?.colors?.primary || '#3b82f6'};
    border-bottom-color: ${props => props.theme?.colors?.primary || '#3b82f6'};
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
`;

const AvatarButton = styled.button`
  width: 40px;
  height: 40px;
  background-color: ${props => props.theme?.colors?.primary || '#3b82f6'};
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme?.colors?.primaryDark || '#2563eb'};
    transform: scale(1.05);
  }
`;

const UserDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid ${props => props.theme?.colors?.border || '#e5e7eb'};
  min-width: 200px;
  z-index: 1000;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s ease;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: none;
  text-align: left;
  color: ${props => props.theme?.colors?.text || '#374151'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  
  &:hover {
    background-color: ${props => props.theme?.colors?.background || '#f9fafb'};
  }
  
  &:first-child {
    border-radius: 8px 8px 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 8px 8px;
    color: ${props => props.theme?.colors?.error || '#ef4444'};
    
    &:hover {
      background-color: ${props => props.theme?.colors?.errorLight || '#fee2e2'};
    }
  }
`;

const UserInfo = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${props => props.theme?.colors?.border || '#e5e7eb'};
  
  .user-name {
    font-weight: 600;
    color: ${props => props.theme?.colors?.text || '#374151'};
    margin-bottom: 4px;
  }
  
  .user-email {
    font-size: 12px;
    color: ${props => props.theme?.colors?.textSecondary || '#6b7280'};
  }
`;

const LandlordHeader = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to get user:', error);
      }
    };

    fetchUser();

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.user-menu')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      authAPI.logout();
    }
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <Header>
      <HeaderContent>
        <Logo to="/landlord/dashboard">Wild Welcome</Logo>
        <Nav>
          <NavLink 
            to="/landlord/dashboard" 
            className={isActive('/landlord/dashboard') ? 'active' : ''}
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/landlord/properties" 
            className={isActive('/landlord/properties') ? 'active' : ''}
          >
            Properties
          </NavLink>
          <NavLink 
            to="/landlord/calendar" 
            className={isActive('/landlord/calendar') ? 'active' : ''}
          >
            Calendar
          </NavLink>
          <NavLink 
            to="/landlord/booking-request" 
            className={isActive('/landlord/booking-request') || isActive('/landlord/bookings') ? 'active' : ''}
          >
            Bookings
          </NavLink>
          <NavLink 
            to="/landlord/account" 
            className={isActive('/landlord/account') ? 'active' : ''}
          >
            Account
          </NavLink>
        </Nav>
        <UserMenu className="user-menu">
          <ThemeToggle />
          <AvatarButton onClick={() => setDropdownOpen(!dropdownOpen)}>
            {user ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}` : 'LL'}
          </AvatarButton>
          <UserDropdown isOpen={dropdownOpen}>
            <UserInfo>
              <div className="user-name">
                {user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Landlord'}
              </div>
              <div className="user-email">{user?.email || 'landlord@example.com'}</div>
            </UserInfo>
            <DropdownItem as={Link} to="/landlord/account" onClick={() => setDropdownOpen(false)}>
              <FaHome /> Account Settings
            </DropdownItem>
            <DropdownItem onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </DropdownItem>
          </UserDropdown>
        </UserMenu>
      </HeaderContent>
    </Header>
  );
};

export default LandlordHeader;