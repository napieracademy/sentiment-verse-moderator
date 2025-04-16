import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Export the login function so other components can use it
export const handleFacebookLogin = async () => {
  // Costruiamo esplicitamente l'URL di callback per essere sicuri che sia corretto
  const callbackUrl = window.location.origin + '/auth/facebook/callback';
  console.log('Facebook login initiated, callback URL:', callbackUrl);
  
  // Salviamo l'URL corrente per poter tornare qui dopo l'autenticazione
  try {
    // Memorizza l'URL corrente (escludendo la home)
    if (window.location.pathname !== '/' && window.location.pathname !== '/auth/facebook/callback') {
      console.log('Saving return URL:', window.location.pathname);
      localStorage.setItem('auth_return_path', window.location.pathname);
    } else {
      // Se siamo sulla home o callback, impostiamo il ritorno a welcome
      localStorage.setItem('auth_return_path', '/welcome');
    }
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        scopes: 'public_profile,pages_show_list,pages_read_engagement,pages_read_user_content',
        redirectTo: callbackUrl
      }
    });

    if (error) {
      console.error('Error initiating Facebook login:', error);
      return { error };
    }
    
    console.log('OAuth flow initiated successfully');
    return { data };
  } catch (err) {
    console.error('Unexpected error during login flow:', err);
    return { error: err as Error };
  }
};

interface FacebookSDKProps {
  onSDKLoaded?: () => void;
}

const FacebookSDK: React.FC<FacebookSDKProps> = ({ onSDKLoaded }) => {
  useEffect(() => {
    // Check if FB SDK is already loaded
    if (window.FB) {
      console.log("Facebook SDK is already loaded");
      if (onSDKLoaded) onSDKLoaded();
      document.dispatchEvent(new Event('fb-sdk-loaded'));
      return;
    }

    // Function to load the Facebook SDK asynchronously
    const loadFacebookSDK = () => {
      console.log("Loading Facebook SDK...");
      // Add the Facebook SDK script
      window.fbAsyncInit = function() {
        window.FB.init({
          appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '1071003064434264', // Fallback to a default if env var not set
          xfbml: true,
          version: 'v22.0' // Use the latest stable version
        });
        
        console.log("Facebook SDK initialized successfully");
        
        // Notify that the SDK is loaded
        if (onSDKLoaded) onSDKLoaded();
        
        // Dispatch a custom event for backward compatibility
        document.dispatchEvent(new Event('fb-sdk-loaded'));
      };
      
      // Load the SDK asynchronously
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s) as HTMLScriptElement;
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        js.async = true;
        js.defer = true;
        fjs.parentNode?.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    };

    // Load the Facebook SDK
    loadFacebookSDK();
    
    // Cleanup function
    return () => {
      // Nothing to clean up
    };
  }, [onSDKLoaded]);

  return null; // This component doesn't render anything
};

export default FacebookSDK;
