import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${props => props.theme.colors.border};
  border-top: 4px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  allowedUserTypes = [], 
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, isLoading, user, isLandlord, isTenant } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <LoadingContainer>
        <div style={{ textAlign: 'center' }}>
          <LoadingSpinner />
          <LoadingText>Loading...</LoadingText>
        </div>
      </LoadingContainer>
    );
  }

  // If authentication is not required, render children
  if (!requireAuth) {
    return children;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If user types are specified, check if current user type is allowed
  if (allowedUserTypes.length > 0) {
    const userType = user?.user_type;
    const isAllowed = allowedUserTypes.includes(userType);
    
    if (!isAllowed) {
      // Redirect based on user type
      const redirectPath = userType === 'landlord' ? '/landlord/dashboard' : '/user';
      return <Navigate to={redirectPath} replace />;
    }
  }

  // All checks passed, render children
  return children;
};

// Convenience components for specific user types
export const TenantRoute = ({ children }) => (
  <ProtectedRoute allowedUserTypes={['user']} redirectTo="/user">
    {children}
  </ProtectedRoute>
);

export const LandlordRoute = ({ children }) => (
  <ProtectedRoute allowedUserTypes={['landlord']} redirectTo="/landlord/dashboard">
    {children}
  </ProtectedRoute>
);

// Route that redirects authenticated users away from auth pages
export const PublicRoute = ({ children }) => (
  <ProtectedRoute requireAuth={false}>
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute; 