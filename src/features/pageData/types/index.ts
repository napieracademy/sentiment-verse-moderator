
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

export interface FacebookPost {
  id: string;
  created_time: string;
  full_picture?: string;
  message?: string;
  from?: {
    id: string;
    name: string;
  };
  message_tags?: {
    id: string;
    name: string;
    type: string;
    offset: number;
    length: number;
  }[];
  likes?: {
    data: Array<{
      name: string;
      pic_small?: string;
      pic_large?: string;
      username?: string;
      link?: string;
      id: string;
    }>
  };
  comments?: {
    data: Array<{
      id: string;
      from?: {
        id: string;
        name: string;
      };
      user_likes?: boolean;
      like_count?: number;
      is_private?: boolean;
      is_hidden?: boolean;
      created_time: string;
      message?: string;
      likes?: {
        data: Array<{
          id: string;
          name: string;
        }>
      };
    }>
  }
}

export interface FacebookPageWithPosts {
  id: string;
  bio?: string;
  published_posts?: {
    data: FacebookPost[];
  };
}
