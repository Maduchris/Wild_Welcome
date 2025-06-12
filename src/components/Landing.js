import React from 'react';
import './Landing.css';
import logo from '../assets/logo.png'; // Replace with your actual logo file name

const Landing = () => {
  return (
    <div className="landing-container">
      <img src={logo} alt="Wild Welcome Logo" className="logo-entry" />
      <h1 className="landing-title">WILD WELCOME</h1>
    </div>
  );
};

export default Landing; 