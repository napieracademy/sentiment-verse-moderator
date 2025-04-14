
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Export the login function so other components can use it
export const handleFacebookLogin = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      scopes: 'public_profile,pages_show_list,pages_read_engagement,pages_read_user_content',
      redirectTo: window.location.origin + '/auth/facebook/callback'
    }
  });

  if (error) {
    console.error('Error logging in with Facebook:', error);
    return { error };
  }
  
  return { data };
};

interface FacebookSDKProps {
  onSDKLoaded?: () => void;
}

const FacebookSDK: React.FC<FacebookSDKProps> = ({ onSDKLoaded }) => {
  useEffect(() => {
    // Notify that the SDK is "loaded" (even though we're not actually loading it anymore)
    if (onSDKLoaded) {
      onSDKLoaded();
    }
    
    // Dispatch a custom event for backward compatibility
    document.dispatchEvent(new Event('fb-sdk-loaded'));
  }, [onSDKLoaded]);

  return null; // This component doesn't render anything
};

export default FacebookSDK;
