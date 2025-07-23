import axios from 'axios';

// Base URL for the API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token with automatic refresh
api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('token');
    
    // Check if token exists and is still valid
    if (token) {
      try {
        // Decode token to check expiration (basic check)
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        // If token expires in next 5 minutes, try to refresh
        if (tokenData.exp && tokenData.exp - currentTime < 300) {
          console.log('Token expiring soon, attempting refresh...');
          const refreshResponse = await authAPI.refreshToken();
          token = refreshResponse.access_token || localStorage.getItem('token');
        }
      } catch (error) {
        console.warn('Token validation failed:', error);
        // If token is malformed, clear it
        if (error.name === 'InvalidTokenError') {
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          token = null;
        }
      }
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling with retry logic
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      const currentPath = window.location.pathname;
      
      // Don't auto-logout if we're already on login/register pages
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/signup') {
        originalRequest._retry = true;
        
        try {
          // Try to refresh the token
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            console.log('Attempting token refresh due to 401 error...');
            const refreshResponse = await authAPI.refreshToken();
            
            if (refreshResponse.access_token) {
              // Update the authorization header and retry the request
              originalRequest.headers.Authorization = `Bearer ${refreshResponse.access_token}`;
              return api(originalRequest);
            }
          }
        } catch (refreshError) {
          console.warn('Token refresh failed:', refreshError);
        }
        
        // If refresh fails or no refresh token, logout
        console.warn('Authentication error - logging out:', error.response?.data);
        
        // Clear auth data and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        
        // Show a toast message if available
        if (typeof window !== 'undefined' && window.toast) {
          window.toast.error('Session expired. Please log in again.');
        }
        
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.access_token) {
        // Store tokens with consistent naming
        localStorage.setItem('token', response.data.access_token);
        
        // Store refresh token if provided
        if (response.data.refresh_token) {
          localStorage.setItem('refresh_token', response.data.refresh_token);
        }
        
        // Store session metadata
        const sessionData = {
          loginTime: Date.now(),
          tokenExpiry: null, // Will be calculated from token if needed
          lastActivity: Date.now()
        };
        localStorage.setItem('session_data', JSON.stringify(sessionData));
        
        // Note: User info will be fetched later when needed
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  logout: () => {
    // Clear all authentication and session data
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('session_data');
    
    // Clear any cached data
    sessionStorage.clear();
    
    // Redirect to login
    window.location.href = '/login';
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  googleLogin: async (token) => {
    try {
      const response = await api.post('/auth/google', { token });
      if (response.data.access_token) {
        // Store with consistent naming
        localStorage.setItem('token', response.data.access_token);
        
        // Store refresh token if provided
        if (response.data.refresh_token) {
          localStorage.setItem('refresh_token', response.data.refresh_token);
        }
        
        // Store session metadata
        const sessionData = {
          loginTime: Date.now(),
          tokenExpiry: null,
          lastActivity: Date.now()
        };
        localStorage.setItem('session_data', JSON.stringify(sessionData));
        
        const userResponse = await api.get('/auth/me');
        localStorage.setItem('user', JSON.stringify(userResponse.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
      
      if (response.data.access_token) {
        // Store with consistent naming
        localStorage.setItem('token', response.data.access_token);
        
        // Update refresh token if new one is provided
        if (response.data.refresh_token) {
          localStorage.setItem('refresh_token', response.data.refresh_token);
        }
        
        // Update session data
        const sessionData = JSON.parse(localStorage.getItem('session_data') || '{}');
        sessionData.lastActivity = Date.now();
        sessionData.tokenRefreshTime = Date.now();
        localStorage.setItem('session_data', JSON.stringify(sessionData));
      }
      
      return response.data;
    } catch (error) {
      // If refresh fails, logout user
      console.error('Token refresh failed:', error);
      authAPI.logout();
      throw error.response?.data || error;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', { 
        token, 
        new_password: newPassword 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getStats: async () => {
    try {
      const response = await api.get('/auth/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// Properties APIs
export const propertiesAPI = {
  getAll: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params.append(key, value);
        }
      });

      const response = await api.get(`/properties?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/properties/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  create: async (propertyData) => {
    try {
      const response = await api.post('/properties', propertyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  update: async (id, propertyData) => {
    try {
      const response = await api.put(`/properties/${id}`, propertyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/properties/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getMyProperties: async () => {
    try {
      const response = await api.get('/properties/landlord/my-properties');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  uploadImages: async (propertyId, files) => {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      
      const response = await api.post(`/properties/${propertyId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  search: async (searchParams) => {
    try {
      const params = new URLSearchParams();
      
      // Add search params to query
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params.append(key, value);
        }
      });

      const response = await api.get(`/properties/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// Bookings APIs
export const bookingsAPI = {
  create: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getById: async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getUserBookings: async () => {
    try {
      const response = await api.get('/bookings');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getLandlordApplications: async () => {
    try {
      const response = await api.get('/bookings/landlord/requests');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  approve: async (bookingId, message = '') => {
    try {
      const response = await api.post(`/bookings/${bookingId}/approve`, { 
        message_data: { response_message: message } 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  reject: async (bookingId, message = '') => {
    try {
      const response = await api.post(`/bookings/${bookingId}/reject`, { 
        message_data: { response_message: message } 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// Users APIs
export const usersAPI = {
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getFavorites: async () => {
    try {
      const response = await api.get('/users/favourites');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  addToFavorites: async (propertyId) => {
    try {
      const response = await api.post(`/users/favourites/${propertyId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  removeFromFavorites: async (propertyId) => {
    try {
      const response = await api.delete(`/users/favourites/${propertyId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/users/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteAccount: async () => {
    try {
      const response = await api.delete('/users/account');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// Reviews APIs
export const reviewsAPI = {
  getFeatured: async () => {
    try {
      const response = await api.get('/reviews/featured');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getAll: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params.append(key, value);
        }
      });

      const response = await api.get(`/reviews?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  create: async (reviewData) => {
    try {
      const response = await api.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  update: async (reviewId, reviewData) => {
    try {
      const response = await api.put(`/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  delete: async (reviewId) => {
    try {
      const response = await api.delete(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// Utilities APIs
export const utilsAPI = {
  // Get health check
  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get app info
  getAppInfo: async () => {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// Session management utilities
export const updateLastActivity = () => {
  const sessionData = JSON.parse(localStorage.getItem('session_data') || '{}');
  sessionData.lastActivity = Date.now();
  localStorage.setItem('session_data', JSON.stringify(sessionData));
};

export const getSessionData = () => {
  const sessionData = localStorage.getItem('session_data');
  return sessionData ? JSON.parse(sessionData) : null;
};

export const isSessionValid = () => {
  const token = getAuthToken();
  const sessionData = getSessionData();
  
  if (!token || !sessionData) return false;
  
  // Check if session has been inactive for more than 24 hours
  const maxInactivity = 24 * 60 * 60 * 1000; // 24 hours
  const timeSinceLastActivity = Date.now() - (sessionData.lastActivity || 0);
  
  if (timeSinceLastActivity > maxInactivity) {
    console.log('Session expired due to inactivity');
    return false;
  }
  
  return true;
};

// Helper functions
export const getAuthToken = () => localStorage.getItem('token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  try {
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    localStorage.removeItem('user');
    return null;
  }
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  const sessionValid = isSessionValid();
  
  if (!token) return false;
  
  if (!sessionValid) {
    // Session expired, clear data
    logout();
    return false;
  }
  
  // Validate JWT token structure and expiration
  try {
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    if (tokenData.exp && tokenData.exp < currentTime) {
      console.log('JWT token expired, logging out');
      logout();
      return false;
    }
  } catch (error) {
    console.error('Invalid JWT token:', error);
    logout();
    return false;
  }
  
  // Update activity if authenticated
  updateLastActivity();
  return true;
};

export const isLandlord = () => {
  const user = getCurrentUser();
  return user?.user_type === 'landlord';
};

export const isPropertyOwner = (propertyLandlordId) => {
  const user = getCurrentUser();
  return user?.id === propertyLandlordId;
};

export const logout = () => {
  // Clear all authentication and session data
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  localStorage.removeItem('session_data');
  
  // Clear any cached data
  sessionStorage.clear();
  
  // Redirect to login
  window.location.href = '/login';
};

export default api;