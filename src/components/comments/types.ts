
export type Sentiment = 'positive' | 'negative' | 'neutral';

export interface FacebookComment {
  id: string;
  message: string;
  created_time: string;
  from: {
    id: string;
    name: string;
    picture?: {
      data: {
        url: string;
      }
    };
  };
}

export interface FacebookPost {
  id: string;
  message: string;
  created_time: string;
  from: {
    id: string;
    name: string;
    picture?: {
      data: {
        url: string;
      }
    };
  };
}

// Facebook API response type
export interface FacebookApiResponse<T> {
  data: T[];
  error?: {
    message: string;
    type: string;
    code: number;
    fbtrace_id: string;
  };
}

// Our processed comment type
export interface Comment {
  id: string;
  postId: string;
  authorName: string;
  authorProfilePic: string;
  content: string;
  timestamp: string;
  sentiment: Sentiment;
  hidden: boolean;
  isPage?: boolean;
}

// Our processed post type
export interface Post {
  id: string;
  content: string;
  authorName: string;
  authorProfilePic: string;
  timestamp: string;
  isPage: boolean;
}

// Our processed mention type
export interface Mention {
  id: string;
  postId: string;
  postContent: string;
  authorName: string;
  authorProfilePic: string;
  authorType: string;
  timestamp: string;
  sentiment: Sentiment;
}

// Our processed rating type (derived from comments)
export interface Rating extends Comment {
  rating: number;
}
