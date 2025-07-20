import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Comprehensive error handling for MetaMask and wallet extensions
const originalConsoleError = console.error;
console.error = (...args) => {
  // Suppress MetaMask and wallet-related console errors
  const errorMessage = args.join(' ');
  if (errorMessage.includes('MetaMask') || 
      errorMessage.includes('Failed to connect to MetaMask') ||
      errorMessage.includes('ethereum') ||
      errorMessage.includes('wallet') ||
      errorMessage.includes('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn')) {
    return; // Don't log these errors
  }
  originalConsoleError.apply(console, args);
};

// Handle runtime errors
window.addEventListener('error', (event) => {
  // Suppress MetaMask and wallet connection errors
  if (event.error && event.error.message && 
      (event.error.message.includes('MetaMask') || 
       event.error.message.includes('Failed to connect to MetaMask') ||
       event.error.message.includes('ethereum') ||
       event.error.message.includes('wallet') ||
       event.filename?.includes('chrome-extension'))) {
    event.preventDefault();
    return false;
  }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  // Suppress MetaMask-related promise rejections
  if (event.reason && event.reason.message && 
      (event.reason.message.includes('MetaMask') || 
       event.reason.message.includes('Failed to connect to MetaMask') ||
       event.reason.message.includes('ethereum') ||
       event.reason.message.includes('wallet'))) {
    event.preventDefault();
    return false;
  }
});

// Prevent MetaMask from injecting scripts
if (window.ethereum) {
  // Override ethereum object to prevent connection attempts
  Object.defineProperty(window, 'ethereum', {
    get: () => undefined,
    set: () => {},
    configurable: true
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 