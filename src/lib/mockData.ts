
import { ThumbsDown, ThumbsUp } from 'lucide-react';

export type Sentiment = 'positive' | 'negative' | 'neutral';

export type Comment = {
  id: string;
  postId: string;
  authorName: string;
  authorProfilePic: string;
  content: string;
  timestamp: string;
  sentiment: Sentiment;
  hidden: boolean;
};

export type Page = {
  id: string;
  name: string;
  profilePic: string;
  category: string;
  followers: number;
};

export type SentimentData = {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
};

// Mock Facebook pages
export const mockPages: Page[] = [
  {
    id: '123456789',
    name: 'Caffè Napoletano',
    profilePic: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=60',
    category: 'Coffee Shop',
    followers: 5231,
  },
  {
    id: '987654321',
    name: 'Pizzeria Bella Napoli',
    profilePic: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=60',
    category: 'Italian Restaurant',
    followers: 12453,
  },
  {
    id: '456789123',
    name: 'Boutique Milano',
    profilePic: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=60',
    category: 'Clothing Store',
    followers: 8765,
  },
];

// Mock comments with sentiment analysis
export const mockComments: Comment[] = [
  {
    id: 'comment1',
    postId: 'post1',
    authorName: 'Marco Rossi',
    authorProfilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60',
    content: 'Il caffè qui è fantastico! Il migliore della città!',
    timestamp: '2025-04-11T14:23:00Z',
    sentiment: 'positive',
    hidden: false,
  },
  {
    id: 'comment2',
    postId: 'post1',
    authorName: 'Giulia Bianchi',
    authorProfilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop&q=60',
    content: 'Servizio lento e personale scortese. Non tornerò.',
    timestamp: '2025-04-11T16:45:00Z',
    sentiment: 'negative',
    hidden: false,
  },
  {
    id: 'comment3',
    postId: 'post2',
    authorName: 'Luca Verdi',
    authorProfilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60',
    content: 'Ho provato il nuovo menu. Il cappuccino era buono ma un po\' caro.',
    timestamp: '2025-04-10T09:30:00Z',
    sentiment: 'neutral',
    hidden: false,
  },
  {
    id: 'comment4',
    postId: 'post2',
    authorName: 'Sophia Conti',
    authorProfilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60',
    content: 'Questo posto è incredibile! Caffè eccellente e atmosfera fantastica.',
    timestamp: '2025-04-10T11:15:00Z',
    sentiment: 'positive',
    hidden: false,
  },
  {
    id: 'comment5',
    postId: 'post3',
    authorName: 'Alessandro Romano',
    authorProfilePic: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=800&auto=format&fit=crop&q=60',
    content: 'Mi dispiace, ma l\'espresso di oggi era troppo amaro e freddo.',
    timestamp: '2025-04-09T15:40:00Z',
    sentiment: 'negative',
    hidden: false,
  },
  {
    id: 'comment6',
    postId: 'post3',
    authorName: 'Elena Ferrari',
    authorProfilePic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60',
    content: 'Sono passata oggi per un caffè veloce. Tutto nella norma.',
    timestamp: '2025-04-09T16:20:00Z',
    sentiment: 'neutral',
    hidden: false,
  },
  {
    id: 'comment7',
    postId: 'post4',
    authorName: 'Roberto Marino',
    authorProfilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=60',
    content: 'I dolci qui sono straordinari! Tornerò sicuramente per provare altro!',
    timestamp: '2025-04-08T10:05:00Z',
    sentiment: 'positive',
    hidden: false,
  },
  {
    id: 'comment8',
    postId: 'post4',
    authorName: 'Francesca Rizzo',
    authorProfilePic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60', 
    content: 'Il caffè era decente ma il personale sembrava stressato.',
    timestamp: '2025-04-08T14:50:00Z',
    sentiment: 'neutral',
    hidden: false,
  },
  {
    id: 'comment9',
    postId: 'post5',
    authorName: 'Giovanni Russo',
    authorProfilePic: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=800&auto=format&fit=crop&q=60',
    content: 'Pessima esperienza. Il caffè era freddo e il cameriere maleducato.',
    timestamp: '2025-04-07T13:25:00Z',
    sentiment: 'negative',
    hidden: false,
  },
  {
    id: 'comment10',
    postId: 'post5',
    authorName: 'Anna Esposito',
    authorProfilePic: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop&q=60',
    content: 'Adoro questo posto! Il caffè migliore e lo staff più gentile!',
    timestamp: '2025-04-07T17:10:00Z',
    sentiment: 'positive',
    hidden: false,
  }
];

// Mock sentiment data over time
export const mockSentimentTrend: SentimentData[] = [
  { date: '2025-04-07', positive: 15, negative: 7, neutral: 8 },
  { date: '2025-04-08', positive: 18, negative: 5, neutral: 9 },
  { date: '2025-04-09', positive: 12, negative: 10, neutral: 7 },
  { date: '2025-04-10', positive: 20, negative: 8, neutral: 12 },
  { date: '2025-04-11', positive: 22, negative: 6, neutral: 9 },
  { date: '2025-04-12', positive: 25, negative: 4, neutral: 11 },
];

// Calculate sentiment statistics
export const getSentimentStats = () => {
  const total = mockComments.length;
  const positive = mockComments.filter(c => c.sentiment === 'positive').length;
  const negative = mockComments.filter(c => c.sentiment === 'negative').length;
  const neutral = mockComments.filter(c => c.sentiment === 'neutral').length;
  
  return {
    total,
    positive: {
      count: positive,
      percentage: Math.round((positive / total) * 100)
    },
    negative: {
      count: negative,
      percentage: Math.round((negative / total) * 100)
    },
    neutral: {
      count: neutral,
      percentage: Math.round((neutral / total) * 100)
    },
    engagementRate: '4.2%',
    commentsPerPost: '8.5'
  };
};

export const getSentimentIcon = (sentiment: Sentiment) => {
  switch (sentiment) {
    case 'positive':
      return ThumbsUp;
    case 'negative':
      return ThumbsDown;
    default:
      return null;
  }
};

export const getSentimentColor = (sentiment: Sentiment) => {
  switch (sentiment) {
    case 'positive':
      return 'text-positive';
    case 'negative':
      return 'text-negative';
    case 'neutral':
      return 'text-neutral';
    default:
      return '';
  }
};
