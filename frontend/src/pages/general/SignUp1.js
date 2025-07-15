import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp1.css';

const SignUp1 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'tenant',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleUserTypeChange = (userType) => {
    setFormData(prev => ({ ...prev, userType }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (formData.userType === 'landlord') navigate('/signup/landlord');
      else navigate('/signup/tenant');
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const heroStyle = {
    flex: 1.2,
    background: "url('/images/signup-zebra.jpg') center center/cover no-repeat",
    minWidth: '320px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  };

  return (
    <div className="signup-container">
      <div className="signup-hero" style={heroStyle} aria-hidden="true"></div>
      <div className="signup-card">
        <div className="signup-header">
          <p className="signup-subtitle">Create your account to get started</p>
        </div>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="user-type-selector">
            <label className={`user-type-option ${formData.userType === 'tenant' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="userType"
                value="tenant"
                checked={formData.userType === 'tenant'}
                onChange={() => handleUserTypeChange('tenant')}
              />
              <span className="user-type-icon">🏠</span>
              <span className="user-type-label">I'm looking for a room</span>
            </label>
            <label className={`user-type-option ${formData.userType === 'landlord' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="userType"
                value="landlord"
                checked={formData.userType === 'landlord'}
                onChange={() => handleUserTypeChange('landlord')}
              />
              <span className="user-type-icon">🏢</span>
              <span className="user-type-label">I'm a landlord</span>
            </label>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className={`form-input ${errors.firstName ? 'error' : ''}`}
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="lastName" className="form-label">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className={`form-input ${errors.lastName ? 'error' : ''}`}
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          </div>
          <div className="terms-checkbox">
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
            />
            <label htmlFor="agreeToTerms" className="terms-text">
              I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">terms and conditions</a>
            </label>
          </div>
          {errors.agreeToTerms && <span className="error-message">{errors.agreeToTerms}</span>}
          <button className="signup-button" type="submit" disabled={isLoading}>
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp1; 