import React from 'react';
import './Signup2.css';
import elephantImg from '../assets/elephant.jpg'; // Replace with your actual image file name

const Signup2 = () => {
  return (
    <div className="signup-container">
      <div className="signup-image-wrapper">
        <img src={elephantImg} alt="Elephant" className="signup-image slide-in-left" />
      </div>
      <div className="signup-form-wrapper">
        <h2 className="signup-title">Sign Up</h2>
        <form className="signup-form">
          <input type="text" placeholder="Name" className="signup-input" />
          <input type="email" placeholder="Email" className="signup-input" />
          <input type="password" placeholder="Password" className="signup-input" />
          <button className="signup-btn" type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup2; 