// This is a placeholder file with minimal mock data for components that still need it
// These can be replaced with real data from Facebook API gradually

export const mockSentimentTrend = [
  { date: '2025-04-01', positive: 24, negative: 12, neutral: 18 },
  { date: '2025-04-02', positive: 30, negative: 8, neutral: 22 },
  { date: '2025-04-03', positive: 26, negative: 10, neutral: 20 },
  { date: '2025-04-04', positive: 32, negative: 14, neutral: 16 },
  { date: '2025-04-05', positive: 28, negative: 11, neutral: 21 },
  { date: '2025-04-06', positive: 34, negative: 9, neutral: 19 },
  { date: '2025-04-07', positive: 36, negative: 7, neutral: 17 },
];

export const getSentimentStats = () => {
  return {
    positive: {
      count: 153,
      percentage: 58
    },
    neutral: {
      count: 52,
      percentage: 20
    },
    negative: {
      count: 57,
      percentage: 22
    },
    total: 262,
    engagementRate: '4.2%',
    commentsPerPost: '14',
  };
};

// Keeping other exports as empty arrays for compatibility
export const mockPosts = [];
export const mockComments = [];
export const mockMentions = [];
export const sentimentData = [];
export const commentTrends = [];
