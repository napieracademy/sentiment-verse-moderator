
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode?.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    // Initialize the SDK once it's loaded
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: '1244095920468498',
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
      
      // Dispatch a custom event that components can listen for
      document.dispatchEvent(new Event('fb-sdk-loaded'));
    };
  }, [onSDKLoaded]);

  // Add Supabase Facebook login method
  const handleFacebookLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        scopes: 'public_profile,pages_show_list,pages_read_engagement,pages_read_user_content'
      }
    });

    if (error) {
      console.error('Error logging in with Facebook:', error);
    }
  };

  return null; // This component doesn't render anything
};

export default FacebookSDK;
