
import React, { useEffect, useState } from 'react';

// Create type definitions for the Facebook SDK
declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

interface FacebookSDKProps {
  onSDKLoaded?: () => void;
}

const FacebookSDK: React.FC<FacebookSDKProps> = ({ onSDKLoaded }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load the SDK asynchronously
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/it_IT/sdk.js";
      fjs.parentNode?.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    // Initialize the SDK once it's loaded
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: '1244095920468498', // Keep the existing App ID
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
      
      window.FB.AppEvents.logPageView();
      console.log('Facebook SDK initialized');
      
      setIsLoaded(true);
      if (onSDKLoaded) {
        onSDKLoaded();
      }
    };
  }, [onSDKLoaded]);

  return null; // This component doesn't render anything
};

export default FacebookSDK;
