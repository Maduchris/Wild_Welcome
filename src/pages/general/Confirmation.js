import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Confirmation.css';

const Confirmation = () => {
  // Try to get account type from location state, fallback to Tenant
  const location = useLocation();
  const accountType = location.state?.accountType || 'Tenant';
  const landingRoute = accountType === 'Landlord' ? '/landlord/landing' : '/user/landing';

  return (
    <div className="confirmation-container">
      <div className="confirmation-content">
        <div className="confirmation-card">
          <div className="confirmation-icon">
            ✉️
          </div>
          
          <h1 className="confirmation-title">Check Your Email</h1>
          <p className="confirmation-subtitle">
            We've sent a verification link to your email address. 
            Please check your inbox and click the link to verify your account.
          </p>

          <div className="confirmation-details">
            <div className="detail-item">
              <span className="detail-label">Email Address:</span>
              <span className="detail-value">user@example.com</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Account Type:</span>
              <span className="detail-value">{accountType}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Registration Date:</span>
              <span className="detail-value">{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div className="email-notice">
            <div className="email-notice-title">Didn't receive the email?</div>
            <div className="email-notice-text">
              Check your spam folder or click the button below to resend the verification email.
            </div>
          </div>

          <div className="verification-steps">
            <div className="verification-title">Next Steps:</div>
            <ul className="verification-list">
              <li className="verification-item">Check your email inbox</li>
              <li className="verification-item">Click the verification link</li>
              <li className="verification-item">Complete your profile setup</li>
              <li className="verification-item">Start browsing available rooms</li>
            </ul>
          </div>

          <div className="confirmation-actions">
            <Link to={landingRoute} className="primary-button">
              Go to {accountType === 'Landlord' ? 'Landlord' : 'User'} Dashboard
            </Link>
            <button className="secondary-button">
              Resend Email
            </button>
          </div>
        </div>
        
        <div className="confirmation-illustration">
          <img src="/images/tiger.jpg" alt="Tiger illustration" />
        </div>
      </div>
    </div>
  );
};

export default Confirmation; 