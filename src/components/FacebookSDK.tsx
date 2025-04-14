
import React, { useEffect } from 'react';

// Create type definitions for the Facebook SDK
declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

const FacebookSDK: React.FC = () => {
  useEffect(() => {
    // The SDK will call window.fbAsyncInit when it's loaded
    const originalFBAsyncInit = window.fbAsyncInit;
    
    window.fbAsyncInit = function() {
      if (originalFBAsyncInit) {
        originalFBAsyncInit();
      }
      
      // Add any additional initialization code here
      console.log('Facebook SDK initialized');
    };
  }, []);

  return null; // This component doesn't render anything
};

export default FacebookSDK;
