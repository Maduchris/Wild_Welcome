import React from 'react';
import './Login.css';
import deerImg from '../assets/deer.jpg'; // Replace with your actual image file name

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-image-wrapper">
        <img src={deerImg} alt="Deer" className="login-image slide-in-left" />
      </div>
      <div className="login-form-wrapper">
        <h2 className="login-title">Login</h2>
        <form className="login-form">
          <input type="text" placeholder="Email" className="login-input" />
          <input type="password" placeholder="Password" className="login-input" />
          <button className="login-btn" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login; 