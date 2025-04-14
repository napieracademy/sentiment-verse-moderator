import { useState } from "react";
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
  ChevronDown, ChevronUp, User, Store, Book
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define types locally since mockData.ts is removed
type Sentiment = 'positive' | 'negative' | 'neutral';

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

type Post = {
  id: string;
  content: string;
  authorName: string;
  authorProfilePic: string;
  timestamp: string;
  isPage: boolean;
};

const mockPosts: Post[] = [
  {
    id: "post1",
    content: "Oggi offerta speciale sul nostro nuovo caffè! Venite a trovarci!",
    authorName: "Caffè Napoletano",
    authorProfilePic: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=60",
    timestamp: "2025-04-11T10:00:00Z",
    isPage: true
  },
  {
    id: "post2",
    content: "È arrivata la nostra nuova miscela premium. Da provare!",
    authorName: "Caffè Napoletano",
    authorProfilePic: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=60",
    timestamp: "2025-04-10T09:00:00Z",
    isPage: true
  },
  {
    id: "post3",
    content: "Come vi sembrano i nostri nuovi bicchieri eco-friendly?",
    authorName: "Caffè Napoletano",
    authorProfilePic: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=60",
    timestamp: "2025-04-09T14:30:00Z",
    isPage: true
  },
  {
    id: "post4",
    content: "Novità in arrivo la prossima settimana. Restate sintonizzati!",
    authorName: "Caffè Napoletano",
    authorProfilePic: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=60",
    timestamp: "2025-04-08T08:15:00Z",
    isPage: true
  },
  {
    id: "post5",
    content: "Grazie a tutti per essere venuti all'evento di ieri!",
    authorName: "Caffè Napoletano",
    authorProfilePic: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=60",
    timestamp: "2025-04-07T11:45:00Z", 
    isPage: true
  }
];

const mockComments: Comment[] = [
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

const mockMentions = [
  {
    id: "mention1",
    postId: "external1",
    postContent: "Ho appena provato il caffè da @Caffè Napoletano ed è fantastico!",
    authorName: "Maria Verdi",
    authorProfilePic: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60",
    authorType: "user",
    timestamp: "2025-04-12T13:20:00Z",
    sentiment: "positive" as Sentiment
  },
  {
    id: "mention2",
    postId: "external2",
    postContent: "Evento speciale oggi pomeriggio con @Caffè Napoletano. Vi aspettiamo!",
    authorName: "Eventi Milano",
    authorProfilePic: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=60",
    authorType: "page",
    timestamp: "2025-04-11T09:45:00Z",
    sentiment: "neutral" as Sentiment
  },
  {
    id: "mention3",
    postId: "external3",
    postContent: "Recensione del nuovo locale di @Caffè Napoletano. Leggi l'articolo completo sul nostro sito.",
    authorName: "Food Blog Italia",
    authorProfilePic: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=60",
    authorType: "page",
    timestamp: "2025-04-10T16:30:00Z",
    sentiment: "positive" as Sentiment
  }
];

const enhancedComments = mockComments.map(comment => ({
  ...comment,
  isPage: comment.id === "comment2" || comment.id === "comment5" || comment.id === "comment9",
}));

const CommentTable = () => {
  const { toast } = useToast();
  const [comments, setComments] = useState(enhancedComments);
  const [filter, setFilter] = useState<Sentiment | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [contentType, setContentType] = useState<"comments" | "mentions" | "ratings">("comments");
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({
    post1: true,
    post2: false,
    post3: false,
    post4: false,
    post5: false,
  });

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
    return mockPosts.find(post => post.id === postId);
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
    if (Object.keys(commentsByPost).length === 0) {
      return (
        <div className="text-center py-10 border rounded-md">
          <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2">Nessun commento trovato</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {mockPosts.map(post => {
          const postComments = commentsByPost[post.id] || [];
          if (postComments.length === 0) return null;

          return (
            <Card key={post.id} className="border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src={post.authorProfilePic}
                      alt={post.authorName}
                      className="h-10 w-10 rounded-full object-cover"
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
                    <span className="ml-1">{postComments.length} commenti</span>
                  </Button>
                </div>
                <div className="mt-2 text-sm border-l-4 border-gray-200 pl-3">
                  {post.content}
                </div>
              </CardHeader>
              
              {expandedPosts[post.id] && (
                <CardContent>
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
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    );
  };

  const renderMentionsView = () => {
    return (
      <div className="space-y-6">
        {mockMentions.length === 0 ? (
          <div className="text-center py-10 border rounded-md">
            <Tag className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2">Nessuna menzione trovata</p>
          </div>
        ) : (
          mockMentions.map(mention => (
            <Card key={mention.id} className="border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src={mention.authorProfilePic}
                      alt={mention.authorName}
                      className="h-10 w-10 rounded-full object-cover"
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
      </div>
    );
  };

  const renderRatingsView = () => {
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
          </div>
        ) : (
          ratings.map(rating => (
            <Card key={rating.id} className="border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src={rating.authorProfilePic}
                      alt={rating.authorName}
                      className="h-10 w-10 rounded-full object-cover"
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
          ))
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
