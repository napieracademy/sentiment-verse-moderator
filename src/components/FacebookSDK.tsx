
import { useEffect, useState } from 'react';

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
      js.src = "https://connect.facebook.net/en_US/sdk.js"; // Cambiato da it_IT a en_US
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
      
      // Check login status immediately after initialization
      window.FB.getLoginStatus(function(response: any) {
        console.log("Facebook login status:", response.status);
        if (response.status !== 'connected') {
          console.log("User is not connected to Facebook or the app");
        } else {
          console.log("User is connected to Facebook and authorized the app");
        }
      });
      
      setIsLoaded(true);
      if (onSDKLoaded) {
        onSDKLoaded();
      }
      
      // Dispatch a custom event that components can listen for
      document.dispatchEvent(new Event('fb-sdk-loaded'));
    };
  }, [onSDKLoaded]);

  return null; // This component doesn't render anything
};

export default FacebookSDK;
