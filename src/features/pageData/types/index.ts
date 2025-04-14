
export interface FacebookPage {
  id: string;
  name: string;
  category: string;
  picture?: {
    data: {
      url: string;
    }
  };
  fan_count?: number;
  link?: string;
  about?: string;
  description?: string;
  followers_count?: number;
  location?: {
    city: string;
    country: string;
  };
  access_token?: string; // Token di accesso per la pagina
}
