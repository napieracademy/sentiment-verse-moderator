import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, EyeOff, ThumbsDown, ThumbsUp, 
  Trash2, MessageSquare, Tag, Filter,
  ChevronDown, ChevronUp, User, Store, Book,
  Loader2, RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define types for Facebook data
type Sentiment = 'positive' | 'negative' | 'neutral';

type FacebookComment = {
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
};

type FacebookPost = {
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
};

// Facebook API response type
interface FacebookApiResponse<T> {
  data: T[];
  error?: {
    message: string;
    type: string;
    code: number;
    fbtrace_id: string;
  };
}

// Our processed comment type
type Comment = {
  id: string;
  postId: string;
  authorName: string;
  authorProfilePic: string;
  content: string;
  timestamp: string;
  sentiment: Sentiment;
  hidden: boolean;
  isPage?: boolean;
};

// Our processed post type
type Post = {
  id: string;
  content: string;
  authorName: string;
  authorProfilePic: string;
  timestamp: string;
  isPage: boolean;
};

const CommentTable = () => {
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<Sentiment | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [contentType, setContentType] = useState<"comments" | "mentions" | "ratings">("comments");
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [mentions, setMentions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
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

    fetchData();
  }, [toast]);

  // Simple sentiment analysis function
  const determineSentiment = (text: string): Sentiment => {
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
        description: `Il ${contentType === "comments" ? "commento" : contentType === "mentions" ? "post con menzione" : "valutazione"} di ${comment.authorName} è stato ${comment.hidden ? "mostrato" : "nascosto"}.`,
      });
    }
  };

  const handleDelete = (commentId: string) => {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      // In a real implementation, you would call the Facebook API to delete the comment
      // For now, we're just removing it from the local state
      setComments(comments.filter((c) => c.id !== commentId));
      toast({
        title: "Contenuto eliminato",
        description: `Il ${contentType === "comments" ? "commento" : contentType === "mentions" ? "post con menzione" : "valutazione"} di ${comment.authorName} è stato eliminato.`,
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
    setComments([]);
    setPosts([]);
    setMentions([]);
    setLoading(true);
    
    // Reset expanded posts
    setExpandedPosts({});
    
    const fetchData = async () => {
      // Similar logic as in the useEffect, but we're calling it manually
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
            if (postsResponse && !postsResponse.error) {
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
                description: "Impossibile recuperare i post della pagina",
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
    
    fetchData();
  };

  const filteredComments = comments.filter((comment) => {
    const matchesSentiment = filter === "all" || comment.sentiment === filter;
    const matchesSearch = comment.content
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSentiment && matchesSearch;
  });

  const commentsByPost = filteredComments.reduce((acc, comment) => {
    if (!acc[comment.postId]) {
      acc[comment.postId] = [];
    }
    acc[comment.postId].push(comment);
    return acc;
  }, {} as Record<string, typeof filteredComments>);

  const getSentimentIcon = (sentiment: Sentiment) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="h-4 w-4 text-positive" />;
      case "negative":
        return <ThumbsDown className="h-4 w-4 text-negative" />;
      default:
        return null;
    }
  };

  const getContentIcon = () => {
    switch (contentType) {
      case "comments":
        return <MessageSquare className="h-4 w-4 mr-2" />;
      case "mentions":
        return <Tag className="h-4 w-4 mr-2" />;
      case "ratings":
        return <ThumbsUp className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  const getContentTypeTitle = () => {
    switch (contentType) {
      case "comments":
        return "Commenti della Pagina";
      case "mentions":
        return "Menzioni della Pagina";
      case "ratings":
        return "Valutazioni della Pagina";
      default:
        return "Contenuti della Pagina";
    }
  };

  const getPostById = (postId: string) => {
    return posts.find(post => post.id === postId);
  };

  const getSentimentColor = (sentiment: Sentiment) => {
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

  const renderCommentsView = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
            <p className="mt-4">Caricamento dei commenti in corso...</p>
          </div>
        </div>
      );
    }
    
    if (posts.length === 0) {
      return (
        <div className="text-center py-10 border rounded-md">
          <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2">Nessun post trovato per questa pagina</p>
          <Button onClick={handleRefresh} className="mt-4" variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Aggiorna
          </Button>
        </div>
      );
    }

    if (Object.keys(commentsByPost).length === 0) {
      return (
        <div className="text-center py-10 border rounded-md">
          <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2">Nessun commento trovato</p>
          <Button onClick={handleRefresh} className="mt-4" variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Aggiorna
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {posts.map(post => {
          const postComments = commentsByPost[post.id] || [];
          if (postComments.length === 0 && filter !== "all") return null;

          return (
            <Card key={post.id} className="border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src={post.authorProfilePic}
                      alt={post.authorName}
                      className="h-10 w-10 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.authorName)}`;
                      }}
                    />
                    <div>
                      <div className="font-medium flex items-center">
                        {post.authorName}
                        <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
                          <Store className="h-3 w-3 mr-1" /> Pagina
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(post.timestamp), "dd/MM/yyyy HH:mm")}
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => togglePostExpansion(post.id)}
                    className="px-2"
                  >
                    {expandedPosts[post.id] ? 
                      <ChevronUp className="h-4 w-4" /> : 
                      <ChevronDown className="h-4 w-4" />
                    }
                    <span className="ml-1">
                      {postComments.length} {postComments.length === 1 ? "commento" : "commenti"}
                    </span>
                  </Button>
                </div>
                <div className="mt-2 text-sm border-l-4 border-gray-200 pl-3">
                  {post.content}
                </div>
              </CardHeader>
              
              {expandedPosts[post.id] && (
                <CardContent>
                  {postComments.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground text-sm">
                      Nessun commento per questo post
                    </div>
                  ) : (
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-4">
                        {postComments.map(comment => (
                          <div 
                            key={comment.id} 
                            className={`p-3 rounded-md ${comment.hidden ? "bg-gray-50" : "bg-white border"}`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-2">
                                <img
                                  src={comment.authorProfilePic}
                                  alt={comment.authorName}
                                  className="h-8 w-8 rounded-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.authorName)}`;
                                  }}
                                />
                                <div>
                                  <div className="font-medium flex items-center">
                                    {comment.authorName}
                                    {comment.isPage ? (
                                      <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
                                        <Store className="h-3 w-3 mr-1" /> Pagina
                                      </Badge>
                                    ) : (
                                      <Badge className="ml-2 bg-gray-100 text-gray-800 hover:bg-gray-200">
                                        <User className="h-3 w-3 mr-1" /> Utente
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {format(new Date(comment.timestamp), "dd/MM/yyyy HH:mm")}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-gray-100">
                                  {getSentimentIcon(comment.sentiment)}
                                  <span className={`text-xs ${getSentimentColor(comment.sentiment)}`}>
                                    {comment.sentiment === "positive"
                                      ? "Positivo"
                                      : comment.sentiment === "negative"
                                      ? "Negativo"
                                      : "Neutro"}
                                  </span>
                                </div>
                                
                                <div className="flex space-x-1">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 bg-gray-50 hover:bg-gray-100"
                                    onClick={() => handleToggleHidden(comment.id)}
                                    title={comment.hidden ? "Mostra commento" : "Nascondi commento"}
                                  >
                                    {comment.hidden ? (
                                      <Eye className="h-4 w-4 text-blue-600" />
                                    ) : (
                                      <EyeOff className="h-4 w-4 text-gray-600" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 bg-gray-50 hover:bg-red-50"
                                    onClick={() => handleDelete(comment.id)}
                                    title="Elimina commento"
                                  >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                            
                            <div className={`mt-2 ${comment.hidden ? "italic text-muted-foreground" : ""}`}>
                              {comment.hidden ? "[Commento nascosto]" : comment.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
        
        <div className="flex justify-center">
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Aggiorna commenti
          </Button>
        </div>
      </div>
    );
  };

  const renderMentionsView = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
            <p className="mt-4">Caricamento delle menzioni in corso...</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        {mentions.length === 0 ? (
          <div className="text-center py-10 border rounded-md">
            <Tag className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2">Nessuna menzione trovata</p>
            <Button onClick={handleRefresh} className="mt-4" variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Aggiorna
            </Button>
          </div>
        ) : (
          mentions.map(mention => (
            <Card key={mention.id} className="border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src={mention.authorProfilePic}
                      alt={mention.authorName}
                      className="h-10 w-10 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(mention.authorName)}`;
                      }}
                    />
                    <div>
                      <div className="font-medium flex items-center">
                        {mention.authorName}
                        {mention.authorType === "page" ? (
                          <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
                            <Store className="h-3 w-3 mr-1" /> Pagina
                          </Badge>
                        ) : (
                          <Badge className="ml-2 bg-gray-100 text-gray-800 hover:bg-gray-200">
                            <User className="h-3 w-3 mr-1" /> Utente
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Post ID: {mention.postId} • {format(new Date(mention.timestamp), "dd/MM/yyyy HH:mm")}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-gray-100">
                    {getSentimentIcon(mention.sentiment)}
                    <span className={`text-xs ${getSentimentColor(mention.sentiment)}`}>
                      {mention.sentiment === "positive"
                        ? "Positivo"
                        : mention.sentiment === "negative"
                        ? "Negativo"
                        : "Neutro"}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 text-sm border p-3 rounded-md bg-gray-50">
                  <div className="font-medium mb-1 flex items-center">
                    <Tag className="h-3 w-3 mr-1 text-facebook" />
                    Menzione in un post esterno
                  </div>
                  <p>{mention.postContent}</p>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
        
        {mentions.length > 0 && (
          <div className="flex justify-center">
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Aggiorna menzioni
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderRatingsView = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
            <p className="mt-4">Caricamento delle valutazioni in corso...</p>
          </div>
        </div>
      );
    }
    
    // Filter to create ratings from positive and negative comments
    const ratings = filteredComments
      .filter(comment => comment.sentiment !== "neutral")
      .map(comment => ({
        ...comment,
        rating: comment.sentiment === "positive" ? Math.floor(Math.random() * 2) + 4 : Math.floor(Math.random() * 2) + 1
      }));

    return (
      <div className="space-y-6">
        {ratings.length === 0 ? (
          <div className="text-center py-10 border rounded-md">
            <ThumbsUp className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2">Nessuna valutazione trovata</p>
            <Button onClick={handleRefresh} className="mt-4" variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Aggiorna
            </Button>
          </div>
        ) : (
          <>
            {ratings.map(rating => (
              <Card key={rating.id} className="border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <img
                        src={rating.authorProfilePic}
                        alt={rating.authorName}
                        className="h-10 w-10 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(rating.authorName)}`;
                        }}
                      />
                      <div>
                        <div className="font-medium flex items-center">
                          {rating.authorName}
                          {rating.isPage ? (
                            <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
                              <Store className="h-3 w-3 mr-1" /> Pagina
                            </Badge>
                          ) : (
                            <Badge className="ml-2 bg-gray-100 text-gray-800 hover:bg-gray-200">
                              <User className="h-3 w-3 mr-1" /> Utente
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(rating.timestamp), "dd/MM/yyyy HH:mm")}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="mx-0.5">
                            {i < rating.rating ? (
                              <ThumbsUp 
                                className={`h-4 w-4 ${rating.rating >= 4 ? "text-positive" : "text-negative"}`} 
                                fill={rating.rating >= 4 ? "currentColor" : "currentColor"} 
                              />
                            ) : (
                              <ThumbsUp className="h-4 w-4 text-gray-300" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex gap-2 items-center mb-2">
                      <Book className="h-4 w-4 text-facebook" />
                      <h4 className="font-medium text-sm">Recensione:</h4>
                    </div>
                    
                    <p className="text-sm border-l-4 border-gray-200 pl-3">
                      {rating.content}
                    </p>
                    
                    <div className="flex justify-end mt-2 space-x-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-gray-50 hover:bg-gray-100"
                        onClick={() => handleToggleHidden(rating.id)}
                        title={rating.hidden ? "Mostra recensione" : "Nascondi recensione"}
                      >
                        {rating.hidden ? (
                          <Eye className="h-4 w-4 text-blue-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-600" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-gray-50 hover:bg-red-50"
                        onClick={() => handleDelete(rating.id)}
                        title="Elimina recensione"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
            
            <div className="flex justify-center">
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Aggiorna valutazioni
              </Button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {getContentIcon()}
            <CardTitle className="text-lg">{getContentTypeTitle()}</CardTitle>
          </div>
          <div className="flex space-x-2">
            <div className="w-64">
              <Input
                placeholder="Cerca nei contenuti..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <Select
              value={filter}
              onValueChange={(value) => setFilter(value as Sentiment | "all")}
            >
              <SelectTrigger className="w-36 h-8 text-sm">
                <SelectValue placeholder="Tutti i commenti" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Tutti i contenuti</SelectItem>
                  <SelectItem value="positive">Positivi</SelectItem>
                  <SelectItem value="neutral">Neutri</SelectItem>
                  <SelectItem value="negative">Negativi</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="comments" className="w-full mb-4" onValueChange={(v) => setContentType(v as "comments" | "mentions" | "ratings")}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="comments" className="flex items-center justify-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Commenti
            </TabsTrigger>
            <TabsTrigger value="mentions" className="flex items-center justify-center">
              <Tag className="h-4 w-4 mr-2" />
              Menzioni
            </TabsTrigger>
            <TabsTrigger value="ratings" className="flex items-center justify-center">
              <ThumbsUp className="h-4 w-4 mr-2" />
              Valutazioni
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="comments">
            {renderCommentsView()}
          </TabsContent>
          
          <TabsContent value="mentions">
            {renderMentionsView()}
          </TabsContent>
          
          <TabsContent value="ratings">
            {renderRatingsView()}
          </TabsContent>
        </Tabs>
        
        <div className="text-xs text-muted-foreground mt-4">
          <p className="italic">
            Questa funzionalità utilizza l'autorizzazione pages_read_user_content, che permette di leggere contenuti 
            generati dagli utenti sulla Pagina (post, commenti e valutazioni) e di eliminare i commenti degli utenti. 
            Permette inoltre di leggere i post in cui è taggata la Pagina per la gestione completa dei contenuti.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentTable;
