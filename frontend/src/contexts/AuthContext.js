import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Token management utilities
const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

const getStoredToken = () => localStorage.getItem(TOKEN_KEY);
const getStoredRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
const getStoredUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

const setStoredRefreshToken = (token) => {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

const setStoredUser = (user) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
};

const clearStoredAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  
  // Auth state
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getStoredToken());
  const [refreshToken, setRefreshToken] = useState(getStoredRefreshToken());
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = getStoredToken();
        const storedUser = getStoredUser();

        if (storedToken && storedUser) {
          // Try to verify token is still valid by fetching current user
          try {
            const currentUser = await authAPI.getCurrentUser();
            setUser(currentUser);
            setToken(storedToken);
            setIsAuthenticated(true);
          } catch (profileError) {
            console.warn('Could not verify user profile, but token exists:', profileError);
            // If we have a stored user, use it (fallback)
            setUser(storedUser);
            setToken(storedToken);
            setIsAuthenticated(true);
          }
        } else {
          // TEMPORARY: Set default user for testing (remove this later)
          console.log('No stored auth found, setting default user for testing');
          const defaultUser = {
            email: 'test@example.com',
            first_name: 'Test',
            last_name: 'User',
            user_type: 'user', // Change to 'landlord' to test landlord routes
            is_active: true,
            is_verified: true
          };
          setUser(defaultUser);
          setStoredUser(defaultUser);
          setIsAuthenticated(true);
          // Clear any invalid stored data
          // clearStoredAuth();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // TEMPORARY: Don't clear auth on error for testing
        // clearStoredAuth();
        
        // Set default user even on error for testing
        const defaultUser = {
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
          user_type: 'user', // Change to 'landlord' to test landlord routes
          is_active: true,
          is_verified: true
        };
        setUser(defaultUser);
        setStoredUser(defaultUser);
        setIsAuthenticated(true);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = useCallback(async (credentials) => {
    try {
      setIsLoading(true);
      
      const response = await authAPI.login(credentials);
      const { access_token, refresh_token } = response;
      
      // Store tokens
      setStoredToken(access_token);
      setStoredRefreshToken(refresh_token || null); // Handle missing refresh token
      
      // Update state
      setToken(access_token);
      setRefreshToken(refresh_token || null);
      
      // Try to get user profile, but don't fail if /me endpoint is broken
      let userProfile = null;
      try {
        userProfile = await authAPI.getCurrentUser();
        setStoredUser(userProfile);
        setUser(userProfile);
      } catch (profileError) {
        console.warn('Could not fetch user profile:', profileError);
        // Create a basic user object from the token payload
        // This is a fallback when /me endpoint is not working
        const tokenPayload = JSON.parse(atob(access_token.split('.')[1]));
        userProfile = {
          email: tokenPayload.sub,
          first_name: 'User',
          last_name: '',
          user_type: 'user', // Default to user type
          is_active: true,
          is_verified: false
        };
        setStoredUser(userProfile);
        setUser(userProfile);
      }
      
      setIsAuthenticated(true);

      // Navigate based on user type (default to /user if user_type is not available)
      const userType = userProfile?.user_type || 'user';
      const redirectPath = userType === 'landlord' ? '/landlord/dashboard' : '/user';
      navigate(redirectPath);
      
      return { success: true, user: userProfile };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.detail || 'Login failed. Please try again.';
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Register function
  const register = useCallback(async (userData) => {
    try {
      setIsLoading(true);
      
      const response = await authAPI.register(userData);
      
      // After successful registration, log the user in
      const loginResult = await login({
        email: userData.email,
        password: userData.password,
      });
      
      return loginResult;
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.detail || 'Registration failed. Please try again.';
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [login]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Call logout endpoint (optional)
      await authAPI.logout();
    } catch (error) {
      console.log('Logout endpoint not available or failed');
    } finally {
      // Clear all stored data
      clearStoredAuth();
      
      // Reset state
      setUser(null);
      setToken(null);
      setRefreshToken(null);
      setIsAuthenticated(false);
      
      // Navigate to login
      navigate('/login');
    }
  }, [navigate]);

  // Update user profile
  const updateProfile = useCallback(async (userData) => {
    try {
      const updatedUser = await authAPI.getCurrentUser();
      setUser(updatedUser);
      setStoredUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error.response?.data?.detail || 'Profile update failed.';
      return { success: false, error: errorMessage };
    }
  }, []);

  // Refresh token function
  const refreshAuthToken = useCallback(async () => {
    try {
      const storedRefreshToken = getStoredRefreshToken();
      if (!storedRefreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authAPI.refreshToken(storedRefreshToken);
      const { access_token, refresh_token } = response;

      // Update stored tokens
      setStoredToken(access_token);
      setStoredRefreshToken(refresh_token);
      
      // Update state
      setToken(access_token);
      setRefreshToken(refresh_token);

      return { success: true, token: access_token };
    } catch (error) {
      console.error('Token refresh error:', error);
      // Refresh failed, logout user
      await logout();
      return { success: false, error: 'Session expired. Please login again.' };
    }
  }, [logout]);

  // Check if user is landlord
  const isLandlord = useCallback(() => {
    return user?.user_type === 'landlord';
  }, [user]);

  // Check if user is tenant
  const isTenant = useCallback(() => {
    return user?.user_type === 'user';
  }, [user]);

  // Get user initials for avatar
  const getUserInitials = useCallback(() => {
    if (!user) return '';
    const { first_name, last_name } = user;
    return `${first_name?.charAt(0) || ''}${last_name?.charAt(0) || ''}`.toUpperCase();
  }, [user]);

  // Get user display name
  const getUserDisplayName = useCallback(() => {
    if (!user) return '';
    const { first_name, last_name } = user;
    return `${first_name || ''} ${last_name || ''}`.trim();
  }, [user]);

  // Context value
  const value = {
    // State
    user,
    token,
    refreshToken,
    isLoading,
    isAuthenticated,
    
    // Functions
    login,
    register,
    logout,
    updateProfile,
    refreshAuthToken,
    
    // Utilities
    isLandlord,
    isTenant,
    getUserInitials,
    getUserDisplayName,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 