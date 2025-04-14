
// Type definitions for Facebook SDK
interface FacebookSDK {
  init: (params: {
    appId: string;
    autoLogAppEvents?: boolean;
    xfbml?: boolean;
    version?: string;
  }) => void;
  getLoginStatus: (callback: (response: any) => void) => void;
  login: (
    callback: (response: any) => void, 
    options?: { 
      scope: string;
      auth_type?: string; // Add auth_type as an optional property
    }
  ) => void;
  logout: (callback: (response: any) => void) => void;
  api: (
    path: string,
    params?: any,
    callback?: (response: any) => void
  ) => void;
}

interface Window {
  FB: FacebookSDK | undefined;
  fbAsyncInit?: () => void;
}
