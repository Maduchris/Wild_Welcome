import React, { useState, useEffect } from 'react';
import './Landing.css';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setLogoVisible(true), 100);
  }, []);

  const handleGetStarted = () => {
    setShowOptions(true);
  };

  return (
    <div className="landing-root">
      <div className="landing-logo-container">
        <img
          src="/images/wild-welcome-logo.png"
          alt="Wild Welcome Logo"
          className={`landing-logo${logoVisible ? ' pop-in' : ''}`}
        />
      </div>
      <div className="get-started-container">
        <button className="get-started-btn" onClick={handleGetStarted} disabled={showOptions}>
          Get Started
        </button>
        {showOptions && (
          <div className="get-started-options">
            <button className="option-btn" onClick={() => navigate('/signup')}>Sign Up (New User)</button>
            <button className="option-btn" onClick={() => navigate('/login')}>Login (Returning User)</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Landing; 