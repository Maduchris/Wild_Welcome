import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Handle MetaMask and other wallet connection errors
window.addEventListener('error', (event) => {
  // Suppress MetaMask connection errors
  if (event.error && event.error.message && 
      (event.error.message.includes('MetaMask') || 
       event.error.message.includes('Failed to connect to MetaMask'))) {
    event.preventDefault();
    console.log('MetaMask connection error suppressed - this is normal if you have MetaMask extension installed');
    return false;
  }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  // Suppress MetaMask-related promise rejections
  if (event.reason && event.reason.message && 
      (event.reason.message.includes('MetaMask') || 
       event.reason.message.includes('Failed to connect to MetaMask'))) {
    event.preventDefault();
    console.log('MetaMask promise rejection suppressed - this is normal if you have MetaMask extension installed');
    return false;
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 