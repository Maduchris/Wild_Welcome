import React from 'react';
import { Link } from 'react-router-dom';
import './Error404.css';

const Error404 = () => {
  return (
    <div className="error404-container">
      <div className="error404-card">
        <div className="error404-icon">
          🔍
        </div>
        
        <h1 className="error404-title">404</h1>
        <h2 className="error404-subtitle">Page Not Found</h2>
        <p className="error404-description">
          Oops! The page you're looking for doesn't exist. 
          It might have been moved, deleted, or you entered the wrong URL.
        </p>

        <div className="error404-actions">
          <Link to="/user" className="primary-button">
            Go to Homepage
          </Link>
          <Link to="/user/search" className="secondary-button">
            Browse Rooms
          </Link>
        </div>

        <div className="helpful-links">
          <div className="helpful-links-title">Helpful Links:</div>
          <div className="helpful-links-list">
            <Link to="/user/search" className="helpful-link">Search for Rooms</Link>
            <Link to="/user/favourites" className="helpful-link">My Favourites</Link>
            <Link to="/user/applications" className="helpful-link">My Applications</Link>
            <Link to="/user/account" className="helpful-link">My Account</Link>
            <Link to="/" className="helpful-link">Back to Main Site</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error404; 