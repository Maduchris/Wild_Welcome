import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser, isAuthenticated } from '../../services/api';

const ProtectedRoute = ({ children, requireAuth = true, userType = null }) => {
  const authenticated = isAuthenticated();
  const user = getCurrentUser();

  // If authentication is required but user is not authenticated
  if (requireAuth && !authenticated) {
    return <Navigate to="/login" replace />;
  }

  // If specific user type is required
  if (userType && user?.user_type !== userType) {
    // Redirect based on user type
    if (user?.user_type === 'landlord') {
      return <Navigate to="/landlord" replace />;
    } else if (user?.user_type === 'user') {
      return <Navigate to="/user" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;