import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignUp1_1.css';

const SignUp1_1 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: '',
    serviceUsage: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePreferenceChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: value
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.serviceUsage) {
      newErrors.serviceUsage = 'Service usage is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to confirmation page
      navigate('/confirmation');
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-content">
        <div className="signup-card">
          <div className="signup11-header">
            <h1 className="signup11-logo">Wild Welcome</h1>
            <p className="signup11-subtitle">Tell us more about yourself</p>
          </div>

          <div className="progress-bar">
            <div className="progress-line">
              <div className="progress-fill"></div>
            </div>
            <div className="progress-step completed">
              <div className="step-circle">✓</div>
              <div className="step-label">Basic Info</div>
            </div>
            <div className="progress-step active">
              <div className="step-circle">2</div>
              <div className="step-label">Profile</div>
            </div>
            <div className="progress-step">
              <div className="step-circle">3</div>
              <div className="step-label">Complete</div>
            </div>
          </div>

          <form className="signup11-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  className={`form-input ${errors.dateOfBirth ? 'error' : ''}`}
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
                {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="gender" className="form-label">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  className={`form-select ${errors.gender ? 'error' : ''}`}
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
                {errors.gender && <span className="error-message">{errors.gender}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="occupation" className="form-label">Occupation</label>
                <input
                  type="text"
                  id="occupation"
                  name="occupation"
                  className={`form-input ${errors.occupation ? 'error' : ''}`}
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="Student, Professional, etc."
                />
                {errors.occupation && <span className="error-message">{errors.occupation}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="university" className="form-label">University/Institution (Optional)</label>
              <input
                type="text"
                id="university"
                name="university"
                className="form-input"
                value={formData.university}
                onChange={handleChange}
                placeholder="Enter your university or institution"
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio" className="form-label">Bio (Optional)</label>
              <textarea
                id="bio"
                name="bio"
                className="form-textarea"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us a bit about yourself..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="budget" className="form-label">Monthly Budget</label>
                <select
                  id="budget"
                  name="budget"
                  className={`form-select ${errors.budget ? 'error' : ''}`}
                  value={formData.preferences.budget}
                  onChange={handlePreferenceChange}
                >
                  <option value="">Select budget range</option>
                  <option value="500-800">$500 - $800</option>
                  <option value="800-1200">$800 - $1,200</option>
                  <option value="1200-1500">$1,200 - $1,500</option>
                  <option value="1500-2000">$1,500 - $2,000</option>
                  <option value="2000+">$2,000+</option>
                </select>
                {errors.budget && <span className="error-message">{errors.budget}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="location" className="form-label">Preferred Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className={`form-input ${errors.location ? 'error' : ''}`}
                  value={formData.preferences.location}
                  onChange={handlePreferenceChange}
                  placeholder="City, neighborhood, etc."
                />
                {errors.location && <span className="error-message">{errors.location}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="roomType" className="form-label">Room Type</label>
                <select
                  id="roomType"
                  name="roomType"
                  className="form-select"
                  value={formData.preferences.roomType}
                  onChange={handlePreferenceChange}
                >
                  <option value="">Select room type</option>
                  <option value="private">Private Room</option>
                  <option value="shared">Shared Room</option>
                  <option value="studio">Studio</option>
                  <option value="apartment">Apartment</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="moveInDate" className="form-label">Preferred Move-in Date</label>
                <input
                  type="date"
                  id="moveInDate"
                  name="moveInDate"
                  className="form-input"
                  value={formData.preferences.moveInDate}
                  onChange={handlePreferenceChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="serviceUsage" className="form-label">How did you hear about us?</label>
              <select
                id="serviceUsage"
                name="serviceUsage"
                className={`form-select ${errors.serviceUsage ? 'error' : ''}`}
                value={formData.serviceUsage}
                onChange={handleChange}
              >
                <option value="">Select an option</option>
                <option value="social-media">Social Media</option>
                <option value="friend">Friend/Family</option>
                <option value="search">Search Engine</option>
                <option value="advertisement">Advertisement</option>
                <option value="other">Other</option>
              </select>
              {errors.serviceUsage && <span className="error-message">{errors.serviceUsage}</span>}
            </div>

            <button 
              type="submit" 
              className="signup11-button"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Continue'}
            </button>
          </form>
        </div>
        
        <div className="signup11-illustration">
          <img src="/images/elephant.jpg" alt="Elephant illustration" />
        </div>
      </div>
    </div>
  );
};

export default SignUp1_1; 