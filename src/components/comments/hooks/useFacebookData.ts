
import { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import { Comment, FacebookApiResponse, FacebookComment, FacebookPost, Mention, Post } from '../types';
import { determineSentiment } from '../utils';

// Define global FB type to avoid TypeScript errors
interface FacebookSDK {
  api: (
    path: string,
    method: string,
    params: any,
    callback: (response: any) => void
  ) => void;
}

declare global {
  interface Window {
    FB?: FacebookSDK;
  }
}

export const useFacebookData = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [mentions, setMentions] = useState<Mention[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
  
  const fetchData = async () => {
    setLoading(true);
    setComments([]);
    setPosts([]);
    setMentions([]);
    setExpandedPosts({});
    
    const pageData = localStorage.getItem("selectedPage");
    const pageAccessToken = localStorage.getItem("pageAccessToken");
    
    if (!pageData || !pageAccessToken || typeof window.FB === 'undefined') {
      setLoading(false);
      return;
    }
    
    try {
      const page = JSON.parse(pageData);
      const pageId = page.id;
      
      // Fetch posts from the page
      window.FB.api(
        `/${pageId}/posts`,
        'GET',
        {
          fields: 'id,message,created_time,from{id,name,picture}',
          access_token: pageAccessToken,
          limit: 10
        },
        (postsResponse: FacebookApiResponse<FacebookPost>) => {
          if (postsResponse && !postsResponse.error && postsResponse.data) {
            const fetchedPosts = postsResponse.data
              .filter(post => post.message) // Only include posts with messages
              .map(post => ({
                id: post.id,
                content: post.message,
                authorName: post.from.name,
                authorProfilePic: post.from.picture?.data?.url || 
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(post.from.name)}`,
                timestamp: post.created_time,
                isPage: post.from.id === pageId
              }));
            
            setPosts(fetchedPosts);
            
            // For each post, fetch its comments
            const commentPromises = fetchedPosts.map(post => 
              new Promise<void>((resolve) => {
                window.FB.api(
                  `/${post.id}/comments`,
                  'GET',
                  {
                    fields: 'id,message,created_time,from{id,name,picture}',
                    access_token: pageAccessToken,
                    limit: 25
                  },
                  (commentsResponse: FacebookApiResponse<FacebookComment>) => {
                    if (commentsResponse && !commentsResponse.error && commentsResponse.data) {
                      const postComments = commentsResponse.data.map(comment => ({
                        id: comment.id,
                        postId: post.id,
                        authorName: comment.from.name,
                        authorProfilePic: comment.from.picture?.data?.url ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.from.name)}`,
                        content: comment.message,
                        timestamp: comment.created_time,
                        sentiment: determineSentiment(comment.message),
                        hidden: false,
                        isPage: comment.from.id === pageId
                      }));
                      
                      setComments(prev => [...prev, ...postComments]);
                      
                      // Expand the first post by default
                      if (fetchedPosts.length > 0) {
                        setExpandedPosts(prev => ({
                          ...prev,
                          [fetchedPosts[0].id]: true
                        }));
                      }
                    }
                    resolve();
                  }
                );
              })
            );
            
            Promise.all(commentPromises).then(() => {
              setLoading(false);
            });
          } else {
            toast({
              title: "Errore",
              description: postsResponse.error ? 
                `Impossibile recuperare i post della pagina: ${postsResponse.error.message}` :
                "Impossibile recuperare i post della pagina",
              variant: "destructive"
            });
            setLoading(false);
          }
        }
      );
      
      // Also fetch tagged posts (mentions)
      window.FB.api(
        `/${pageId}/tagged`,
        'GET',
        {
          fields: 'id,message,created_time,from{id,name,picture,category},story',
          access_token: pageAccessToken,
          limit: 10
        },
        (response: any) => {
          if (response && !response.error && response.data) {
            const fetchedMentions = response.data
              .filter((mention: any) => mention.message || mention.story)
              .map((mention: any) => ({
                id: mention.id,
                postId: `external_${mention.id}`,
                postContent: mention.message || mention.story,
                authorName: mention.from.name,
                authorProfilePic: mention.from.picture?.data?.url || 
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(mention.from.name)}`,
                authorType: mention.from.category ? "page" : "user",
                timestamp: mention.created_time,
                sentiment: determineSentiment(mention.message || mention.story)
              }));
            setMentions(fetchedMentions);
          }
        }
      );
    } catch (error) {
      console.error("Error fetching Facebook data:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il recupero dei dati",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handleToggleHidden = (commentId: string) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, hidden: !comment.hidden }
          : comment
      )
    );
    
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      toast({
        title: comment.hidden ? "Contenuto mostrato" : "Contenuto nascosto",
        description: `Il commento di ${comment.authorName} è stato ${comment.hidden ? "mostrato" : "nascosto"}.`,
      });
    }
  };

  const handleDelete = (commentId: string) => {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      // In a real implementation, you would call the Facebook API to delete the comment
      setComments(comments.filter((c) => c.id !== commentId));
      toast({
        title: "Contenuto eliminato",
        description: `Il commento di ${comment.authorName} è stato eliminato.`,
        variant: "destructive",
      });
    }
  };

  const togglePostExpansion = (postId: string) => {
    setExpandedPosts({
      ...expandedPosts,
      [postId]: !expandedPosts[postId],
    });
  };

  const handleRefresh = () => {
    fetchData();
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  return {
    comments,
    posts,
    mentions,
    loading,
    expandedPosts,
    handleToggleHidden,
    handleDelete,
    togglePostExpansion,
    handleRefresh
  };
};
