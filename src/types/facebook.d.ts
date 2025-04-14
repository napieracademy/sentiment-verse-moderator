
// Type definitions for Facebook SDK
interface FacebookSDK {
  init: (params: {
    appId: string;
    autoLogAppEvents?: boolean;
    xfbml?: boolean;
    version?: string;
  }) => void;
  getLoginStatus: (callback: (response: any) => void) => void;
  login: (callback: (response: any) => void, options?: { scope: string }) => void;
  logout: (callback: (response: any) => void) => void;
  api: (
    path: string,
    method: string,
    params: any,
    callback: (response: any) => void
  ) => void;
}

interface Window {
  FB?: FacebookSDK;
  fbAsyncInit?: () => void;
}
