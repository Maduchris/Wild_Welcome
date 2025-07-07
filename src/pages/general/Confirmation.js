import React from 'react';
import { Link } from 'react-router-dom';
import './Confirmation.css';

const Confirmation = () => {
  const backgroundStyle = {
    minHeight: '100vh',
    background: "url('/images/signup-tiger.jpg') center center/cover no-repeat",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  };

  return (
    <div className="confirmation-container" style={backgroundStyle}>
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
            <span className="detail-value">Tenant</span>
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
          <Link to="/login" className="primary-button">
            Go to Login
          </Link>
          <button className="secondary-button">
            Resend Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation; 