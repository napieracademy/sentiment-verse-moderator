
import { Sentiment } from './types';

// Simple sentiment analysis function
export const determineSentiment = (text: string): Sentiment => {
  if (!text) return 'neutral';
  
  const positiveWords = ['buono', 'ottimo', 'fantastico', 'eccellente', 'grazie', 'adoro', 'piace', 'bravo', 'gentile', 'bello'];
  const negativeWords = ['cattivo', 'pessimo', 'terribile', 'orribile', 'odio', 'scadente', 'male', 'lento', 'scarso', 'costoso'];
  
  text = text.toLowerCase();
  
  let positiveScore = 0;
  let negativeScore = 0;
  
  positiveWords.forEach(word => {
    if (text.includes(word)) positiveScore++;
  });
  
  negativeWords.forEach(word => {
    if (text.includes(word)) negativeScore++;
  });
  
  if (positiveScore > negativeScore) return 'positive';
  if (negativeScore > positiveScore) return 'negative';
  return 'neutral';
};

export const getSentimentColor = (sentiment: Sentiment): string => {
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

export const getAvatarFallback = (name: string): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;
};
