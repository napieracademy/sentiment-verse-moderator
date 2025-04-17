import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { format, subDays, differenceInDays, parseISO, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { 
  EyeOff, Eye, Trash2, RefreshCw, SmilePlus, Smile, Frown, Meh, Code, 
  Check, ChevronDown, ChevronUp, CheckSquare, ChevronRight, ChevronLeft,
  MessageSquare, Send, X, Pencil, ThumbsUp, ThumbsDown, AlertTriangle,
  Settings, Shield, Filter, BellRing, MoreHorizontal, BarChart3, Download,
  Calendar, ArrowUpDown, TrendingUp
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Types for Facebook API data
interface FacebookPageSummary {
  id: string;
  name: string;
  category?: string;
  picture?: {
    data: {
      url: string;
    }
  };
  access_token?: string;
}

interface FacebookPage {
  id: string;
  name?: string;
  bio?: string;
  about?: string;
  category?: string;
  category_list?: { id: string, name: string }[];
  fan_count?: number;
  followers_count?: number;
  description?: string;
  website?: string;
  picture?: {
    data: {
      url: string;
      width?: number;
      height?: number;
    }
  };
  published_posts?: {
    data: FacebookPost[];
    summary?: {
      total_count: number;
    }
  };
}

interface FacebookPost {
  id: string;
  created_time: string;
  updated_time?: string;
  full_picture?: string;
  permalink_url?: string;
  from?: {
    name: string;
    id: string;
    picture?: {
      data: {
        url: string;
      }
    }
  };
  message?: string;
  message_tags?: any[];
  likes?: {
    data: any[];
    summary?: {
      total_count: number;
    }
  };
  comments?: {
    data: FacebookComment[];
    summary?: {
      total_count: number;
    }
  };
  reactions?: {
    data: any[];
    summary?: {
      total_count: number;
    }
  };
  shares?: {
    count: number;
  };
  is_hidden?: boolean;
}

interface FacebookComment {
  id: string;
  from?: {
    name: string;
    id: string;
    picture?: {
      data: {
        url: string;
      }
    }
  };
  like_count?: number;
  is_hidden?: boolean;
  created_time: string;
  message?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  selected?: boolean;
  user_likes?: boolean; // Indica se l'utente corrente ha messo mi piace
  flags?: CommentFlags; // Flag di moderazione
}

// Interfaccia per i flag di moderazione dei commenti
interface CommentFlags {
  isSpam?: boolean;
  isHateSpeech?: boolean;
  hasProfanity?: boolean;
  hasLinks?: boolean;
  isAdvertisement?: boolean;
  needsReview?: boolean;
}

// Impostazioni di moderazione automatica
interface ModerationSettings {
  enabled: boolean;
  autoHideSpam: boolean;
  autoHideHateSpeech: boolean;
  autoHideProfanity: boolean;
  autoHideLinks: boolean;
  autoHideAds: boolean;
  spamKeywords: string[];
  hateSpeechKeywords: string[];
  profanityKeywords: string[];
  adKeywords: string[];
  notifyOnFlagged: boolean;
}

// Analytics types
interface CommentMetrics {
  totalComments: number;
  totalHidden: number;
  totalFlagged: number;
  avgCommentsPerPost: number;
  positiveComments: number;
  negativeComments: number;
  neutralComments: number;
  avgSentiment: number; // -1 to 1
  mostEngagedPost: string;
  recentTrend: 'up' | 'down' | 'stable';
  commentsByDate: { date: string; count: number; positive: number; negative: number; neutral: number }[];
}

interface AnalyticsFilters {
  dateRange: '7d' | '30d' | '90d' | 'all';
  groupBy: 'day' | 'week' | 'month';
  includeHidden: boolean;
}

// Interfacce per i flussi di lavoro automatizzati
interface WorkflowRule {
  id: string;
  name: string;
  active: boolean;
  condition: {
    type: 'contains' | 'not_contains' | 'user' | 'sentiment' | 'has_links' | 'has_profanity' | 'is_spam';
    value: string;
  };
  action: {
    type: 'hide' | 'delete' | 'notify' | 'tag' | 'like';
    value?: string;
  };
  createdAt: string;
  lastRun?: string;
  runCount: number;
}

interface WorkflowExecution {
  id: string;
  ruleId: string;
  ruleName: string;
  commentId: string;
  postId: string;
  action: string;
  executedAt: string;
  success: boolean;
  commentPreview: string;
}

// Funzione per analizzare il sentiment testuale
const analyzeSentiment = (text: string): 'positive' | 'negative' | 'neutral' => {
  if (!text) return 'neutral';
  
  const positiveWords = ['buono', 'ottimo', 'fantastico', 'eccellente', 'grazie', 'adoro', 'piace', 'bravo', 'bella', 'bello', 'complimenti', 'utile'];
  const negativeWords = ['cattivo', 'pessimo', 'terribile', 'orribile', 'odio', 'scadente', 'male', 'lento', 'scarso', 'costoso', 'problema', 'difficile'];
  
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

// Funzione per rilevare contenuti problematici nei commenti
const detectContentIssues = (
  text: string, 
  settings: ModerationSettings
): CommentFlags => {
  if (!text) return {};
  
  const lowerText = text.toLowerCase();
  const flags: CommentFlags = {};
  
  // Rileva spam
  if (settings.spamKeywords.some(word => lowerText.includes(word.toLowerCase()))) {
    flags.isSpam = true;
  }
  
  // Rileva hate speech
  if (settings.hateSpeechKeywords.some(word => lowerText.includes(word.toLowerCase()))) {
    flags.isHateSpeech = true;
  }
  
  // Rileva volgarità
  if (settings.profanityKeywords.some(word => lowerText.includes(word.toLowerCase()))) {
    flags.hasProfanity = true;
  }
  
  // Rileva pubblicità
  if (settings.adKeywords.some(word => lowerText.includes(word.toLowerCase()))) {
    flags.isAdvertisement = true;
  }
  
  // Rileva link
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  if (urlRegex.test(text)) {
    flags.hasLinks = true;
  }
  
  // Se ci sono flag attivi, segna per revisione
  flags.needsReview = !!(
    flags.isSpam || 
    flags.isHateSpeech || 
    flags.hasProfanity || 
    flags.hasLinks || 
    flags.isAdvertisement
  );
  
  return flags;
};

// Valuta se un commento deve essere automaticamente nascosto in base alle impostazioni
const shouldAutoHide = (flags: CommentFlags, settings: ModerationSettings): boolean => {
  if (!settings.enabled) return false;
  
  return (
    (flags.isSpam && settings.autoHideSpam) ||
    (flags.isHateSpeech && settings.autoHideHateSpeech) ||
    (flags.hasProfanity && settings.autoHideProfanity) ||
    (flags.hasLinks && settings.autoHideLinks) ||
    (flags.isAdvertisement && settings.autoHideAds)
  );
};

const FacebookData = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [pagesLoading, setPagesLoading] = useState<boolean>(false);
  const [pageData, setPageData] = useState<FacebookPage | null>(null);
  const [availablePages, setAvailablePages] = useState<FacebookPageSummary[]>([]);
  const [currentPageId, setCurrentPageId] = useState<string>("121428567930871"); // Default page ID
  const [selectedPost, setSelectedPost] = useState<FacebookPost | null>(null);
  const [bulkSelected, setBulkSelected] = useState<boolean>(false);
  const [selectedComments, setSelectedComments] = useState<Set<string>>(new Set());
  const [jsonCollapsed, setJsonCollapsed] = useState<boolean>(true);
  const [responseObject, setResponseObject] = useState<any>(null);
  
  // Stati per la risposta ai commenti
  const [replyText, setReplyText] = useState<string>("");
  const [replyingTo, setReplyingTo] = useState<{ commentId: string, postId: string } | null>(null);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  
  // Stati per la modifica dei commenti
  const [editingComment, setEditingComment] = useState<{ commentId: string, postId: string } | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // Stati per la gestione dei Mi piace
  const [isLiking, setIsLiking] = useState<Record<string, boolean>>({});
  
  // Stati per la moderazione avanzata
  const [moderationSettings, setModerationSettings] = useState<ModerationSettings>({
    enabled: true,
    autoHideSpam: true,
    autoHideHateSpeech: true,
    autoHideProfanity: true,
    autoHideLinks: false,
    autoHideAds: true,
    spamKeywords: ['vinci', 'gratis', 'clicca qui', 'link in bio', 'guadagna', 'soldi facili'],
    hateSpeechKeywords: ['idiota', 'stupido', 'cretino', 'odio'],
    profanityKeywords: ['vaffanculo', 'cazzo', 'merda', 'stronzo', 'puttana'],
    adKeywords: ['promo', 'sconto', 'offerta', 'acquista', 'compra', 'spedizione', 'promozione'],
    notifyOnFlagged: true
  });
  const [showModerationDialog, setShowModerationDialog] = useState<boolean>(false);
  const [filteredView, setFilteredView] = useState<'all' | 'flagged'>('all');
  
  // Analytics states
  const [analyticsFilters, setAnalyticsFilters] = useState<AnalyticsFilters>({
    dateRange: '30d',
    groupBy: 'day',
    includeHidden: false
  });
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  
  // Mappa di token specifici per pagina
  const pageTokens: Record<string, string> = {
    "121428567930871": "EAARrf6dn8hIBO0ncV0G3zZCy6Pk1bBXZCot0KhDFVcHvba6OguZANMYlJp3ozq7h5nTAF2o2h1H3lyftV7fc0Cy2NmvmBJowmXrVPU627ykxqz7aGxbyVZBq7fUimHdWOddcLCZAQ1kzSMSEEQMqHS3wDZBU4FqmCqLpls7C5TFB55tqMZBXey0PhtThrkN1mqCQthAJSyjshd2GqIZD", // Te la do io Firenze
  };
  
  // Informazioni statiche delle pagine
  const pageInfo: Record<string, {name: string, logo: string, color: string}> = {
    "121428567930871": {
      name: "Te la do io Firenze",
      logo: "https://scontent-fco2-1.xx.fbcdn.net/v/t39.30808-1/360090864_602948561987424_808889609597729734_n.jpg?stp=c183.183.714.714a_dst-jpg_s200x200_tt6",
      color: "blue"
    },
  };
  
  // Cache dei dati delle pagine
  const [pagesCache, setPagesCache] = useState<Record<string, FacebookPage>>({});
  
  // Token corrente basato sulla pagina selezionata
  const [currentToken, setCurrentToken] = useState<string>(pageTokens[currentPageId] || "");
  const [customToken, setCustomToken] = useState<string>("");
  const { toast } = useToast();
  
  // Stati per i flussi di lavoro
  const [workflows, setWorkflows] = useState<WorkflowRule[]>([
    {
      id: '1',
      name: 'Nascondi commenti con link esterni',
      active: true,
      condition: {
        type: 'has_links',
        value: '',
      },
      action: {
        type: 'hide',
      },
      createdAt: new Date().toISOString(),
      runCount: 0,
    },
    {
      id: '2',
      name: 'Elimina commenti spam',
      active: true,
      condition: {
        type: 'is_spam',
        value: '',
      },
      action: {
        type: 'delete',
      },
      createdAt: new Date().toISOString(),
      runCount: 0,
    },
    {
      id: '3',
      name: 'Metti mi piace ai commenti positivi',
      active: false,
      condition: {
        type: 'sentiment',
        value: 'positive',
      },
      action: {
        type: 'like',
      },
      createdAt: new Date().toISOString(),
      runCount: 0,
    }
  ]);
  
  const [workflowExecutions, setWorkflowExecutions] = useState<WorkflowExecution[]>([]);
  const [showWorkflowDialog, setShowWorkflowDialog] = useState<boolean>(false);
  const [editingWorkflow, setEditingWorkflow] = useState<WorkflowRule | null>(null);
  const [isExecutingWorkflows, setIsExecutingWorkflows] = useState<boolean>(false);
  
  // Moderation actions
  const handleHideComment = (comment: FacebookComment) => {
    if (!pageData) return;
    
    // Find which post the comment belongs to if not in selected post
    let postWithComment: FacebookPost | undefined;
    
    if (selectedPost?.comments?.data.some(c => c.id === comment.id)) {
      postWithComment = selectedPost;
    } else if (!postWithComment) {
      postWithComment = pageData.published_posts?.data.find(post => 
        post.comments?.data.some(c => c.id === comment.id)
      );
    }
    
    if (!postWithComment) return;
    
    // Update the comment's hidden status in the post
    const updatedPostsData = pageData.published_posts?.data.map(post => {
      if (post.id === postWithComment?.id && post.comments?.data) {
        return {
          ...post,
          comments: {
            ...post.comments,
            data: post.comments.data.map(c => 
              c.id === comment.id ? {...c, is_hidden: !c.is_hidden} : c
            )
          }
        };
      }
      return post;
    });
    
    // Update pageData
    setPageData({
      ...pageData,
      published_posts: {
        ...pageData.published_posts,
        data: updatedPostsData || []
      }
    });
    
    // Update selectedPost if needed
    if (selectedPost && selectedPost.id === postWithComment.id) {
      setSelectedPost({
        ...selectedPost,
        comments: {
          ...selectedPost.comments,
          data: selectedPost.comments?.data.map(c => 
            c.id === comment.id ? {...c, is_hidden: !c.is_hidden} : c
          ) || []
        }
      });
    }
    
    toast({
      title: comment.is_hidden ? "Commento mostrato" : "Commento nascosto",
      description: `Il commento di ${comment.from?.name} è stato ${comment.is_hidden ? 'reso visibile' : 'nascosto'}.`
    });
  };
  
  const handleDeleteComment = (comment: FacebookComment) => {
    if (!pageData) return;
    
    // Find which post the comment belongs to if not in selected post
    let postWithComment: FacebookPost | undefined;
    
    if (selectedPost?.comments?.data.some(c => c.id === comment.id)) {
      postWithComment = selectedPost;
    } else if (!postWithComment) {
      postWithComment = pageData.published_posts?.data.find(post => 
        post.comments?.data.some(c => c.id === comment.id)
      );
    }
    
    if (!postWithComment) return;
    
    // Remove the comment from the post
    const updatedPostsData = pageData.published_posts?.data.map(post => {
      if (post.id === postWithComment?.id && post.comments?.data) {
        return {
          ...post,
          comments: {
            ...post.comments,
            data: post.comments.data.filter(c => c.id !== comment.id)
          }
        };
      }
      return post;
    });
    
    // Update pageData
    setPageData({
      ...pageData,
      published_posts: {
        ...pageData.published_posts,
        data: updatedPostsData || []
      }
    });
    
    // Update selectedPost if needed
    if (selectedPost && selectedPost.id === postWithComment.id) {
      setSelectedPost({
        ...selectedPost,
        comments: {
          ...selectedPost.comments,
          data: selectedPost.comments?.data.filter(c => c.id !== comment.id) || []
        }
      });
    }
    
    toast({
      title: "Commento eliminato",
      description: `Il commento di ${comment.from?.name} è stato eliminato.`,
      variant: "destructive"
    });
  };

  // Gestione selezione commenti per azioni bulk
  const toggleCommentSelection = (commentId: string) => {
    const newSelection = new Set(selectedComments);
    if (newSelection.has(commentId)) {
      newSelection.delete(commentId);
    } else {
      newSelection.add(commentId);
    }
    setSelectedComments(newSelection);
  };

  const handleBulkAction = (action: 'hide' | 'show' | 'delete') => {
    if (selectedComments.size === 0) return;
    
    if (action === 'delete') {
      // Conferma con toast
      toast({
        title: "Eliminazione multipla",
        description: `Eliminazione di ${selectedComments.size} commenti in corso...`,
      });
      
      // Eliminazione commenti selezionati
      const commentIds = Array.from(selectedComments);
      commentIds.forEach(id => {
        const commentToDelete = findCommentById(id);
        if (commentToDelete) {
          handleDeleteComment(commentToDelete);
        }
      });
      
      // Pulizia selezione
      setSelectedComments(new Set());
    } else {
      // Hide or show comments
      const shouldHide = action === 'hide';
      
      // Conferma con toast
      toast({
        title: shouldHide ? "Nascondi multipli" : "Mostra multipli",
        description: `${shouldHide ? 'Nascondo' : 'Mostro'} ${selectedComments.size} commenti...`,
      });
      
      // Processa ogni commento selezionato
      const commentIds = Array.from(selectedComments);
      commentIds.forEach(id => {
        const commentToUpdate = findCommentById(id);
        if (commentToUpdate && commentToUpdate.is_hidden !== shouldHide) {
          handleHideComment(commentToUpdate);
        }
      });
      
      // Pulizia selezione
      setSelectedComments(new Set());
    }
  };
  
  const findCommentById = (commentId: string): FacebookComment | null => {
    if (!pageData?.published_posts?.data) return null;
    
    for (const post of pageData.published_posts.data) {
      if (post.comments?.data) {
        const comment = post.comments.data.find(c => c.id === commentId);
        if (comment) return comment;
      }
    }
    
    return null;
  };

  // Fetch available Facebook pages
  const fetchAvailablePages = async () => {
    setPagesLoading(true);
    try {
      // Token fornito
      const accessToken = currentToken;
      
      console.log("Utilizzo il token per caricare le pagine:", accessToken.substring(0, 10) + "..." + accessToken.substring(accessToken.length - 5));
      
      // Controlla se esiste un token nel localStorage (per integrazioni future)
      const storedToken = localStorage.getItem("pageAccessToken");
      const effectiveToken = storedToken || accessToken;
      
      // Aggiorna il token corrente per la visualizzazione curl
      setCurrentToken(effectiveToken);
      
      // Prova a utilizzare la Facebook SDK se disponibile
      if (typeof window.FB !== 'undefined') {
        try {
          // Tentativo di ottenere le pagine tramite API reale
          window.FB.api(
            '/me/accounts',
            { access_token: effectiveToken },
            (response) => {
              if (response && !response.error && response.data?.length > 0) {
                setAvailablePages(response.data);
                
                // Se non c'è una pagina selezionata, seleziona la prima
                if (!pageData && response.data.length > 0) {
                  setCurrentPageId(response.data[0].id);
                  fetchPageData(response.data[0].id, response.data[0].access_token || effectiveToken);
                }
                
                toast({
                  title: "Pagine caricate",
                  description: `${response.data.length} pagine disponibili`,
                });
                
                setPagesLoading(false);
                return;
              } else {
                console.log("Fallback ai dati mock: API fallita o nessun dato", response?.error);
                // Continua con i dati mock se l'API fallisce
              }
            }
          );
        } catch (fbError) {
          console.error("Errore nell'usare Facebook SDK:", fbError);
          // Continua con i dati mock
        }
      }
      
      // Per questa demo, invece di chiamare me/accounts che potrebbe richiedere permessi speciali,
      // simuliamo la risposta con alcune pagine di esempio usando un array locale
      const mockPages: FacebookPageSummary[] = [
        {
          id: "121428567930871",
          name: "SentimentVerse App",
          category: "App",
          access_token: effectiveToken,
          picture: {
            data: {
              url: "https://via.placeholder.com/50?text=SV"
            }
          }
        },
        {
          id: "107339322530351",
          name: "Test Page 1",
          category: "Business",
          access_token: effectiveToken,
          picture: {
            data: {
              url: "https://via.placeholder.com/50?text=TP1"
            }
          }
        },
        {
          id: "103221992626709",
          name: "GraphAPI Demo",
          category: "Technology",
          access_token: effectiveToken,
          picture: {
            data: {
              url: "https://via.placeholder.com/50?text=GD"
            }
          }
        },
        {
          id: "105478923462105",
          name: "Community Manager",
          category: "Digital Marketing",
          access_token: effectiveToken,
          picture: {
            data: {
              url: "https://via.placeholder.com/50?text=CM"
            }
          }
        },
        {
          id: "109287745621088",
          name: "Social Analytics",
          category: "Software",
          access_token: effectiveToken,
          picture: {
            data: {
              url: "https://via.placeholder.com/50?text=SA"
            }
          }
        }
      ];
      
      // Simuliamo un breve ritardo di rete
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setAvailablePages(mockPages);
      
      // Se non c'è una pagina selezionata, seleziona la prima
      if (!pageData && mockPages.length > 0) {
        setCurrentPageId(mockPages[0].id);
        await fetchPageData(mockPages[0].id, effectiveToken);
      }
      
      toast({
        title: "Pagine caricate",
        description: `${mockPages.length} pagine disponibili`,
      });
    } catch (error) {
      console.error("Errore durante il recupero delle pagine:", error);
      
      let errorMessage = "Impossibile recuperare le pagine. Verifica il token di accesso.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Errore API",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setPagesLoading(false);
    }
  };

  // Fetch data from Facebook
  const fetchPageData = async (pageId = currentPageId, accessToken?: string) => {
    // Utilizzo token specifico per la pagina, o il token corrente se esiste, o il token dalla mappa
    const effectiveToken = accessToken || currentToken || pageTokens[pageId];
    
    // Check if we have cached data for this page
    if (pagesCache[pageId]) {
      console.log("Utilizzando dati in cache per la pagina:", pageId);
      setPageData(pagesCache[pageId]);
      
      // Set the first post as selected by default if there are posts
      if (pagesCache[pageId].published_posts?.data && pagesCache[pageId].published_posts.data.length > 0) {
        setSelectedPost(pagesCache[pageId].published_posts.data[0]);
      }
      
      toast({
        title: "Cache utilizzata",
        description: `Dati caricati dalla cache per: ${pageInfo[pageId]?.name || pageId}`,
      });
      
      return;
    }
    
    setLoading(true);
    setSelectedPost(null);
    setSelectedComments(new Set());
    setBulkSelected(false);
    
    try {
      console.log("Avvio richiesta API per la pagina:", pageId);
      console.log("Token utilizzato:", effectiveToken.substring(0, 10) + "..." + effectiveToken.substring(effectiveToken.length - 5));
      console.log("Lunghezza token:", effectiveToken.length, "caratteri");
      toast({
        title: "Debug Token",
        description: `Recupero pagina ${pageId} con token: ${effectiveToken.substring(0, 10)}...${effectiveToken.substring(effectiveToken.length - 5)} (${effectiveToken.length} caratteri)`,
      });
      
      // Prima verifichiamo che la pagina esista e abbia i campi base
      try {
        const checkPageResponse = await fetch(`https://graph.facebook.com/v22.0/${pageId}?fields=id,name&access_token=${effectiveToken}`);
        
        if (!checkPageResponse.ok) {
          const errorData = await checkPageResponse.json();
          console.error("Errore nella verifica iniziale della pagina:", errorData);
          
          // Gestione errori specifici
          if (errorData.error) {
            if (errorData.error.code === 190) {
              throw new Error("Token di accesso scaduto o non valido. Effettua nuovamente l'accesso.");
            } else if (errorData.error.code === 104) {
              throw new Error("Errore di autorizzazione: le autorizzazioni necessarie potrebbero essere mancanti.");
            } else if (errorData.error.code === 100) {
              throw new Error(`Pagina con ID ${pageId} non trovata o non accessibile.`);
            } else {
              throw new Error(`Errore Facebook API: ${errorData.error.message}`);
            }
          }
          
          throw new Error("Pagina Facebook non trovata o accesso negato");
        }
      } catch (checkError) {
        console.error("Errore nella verifica pagina:", checkError);
        throw new Error("Impossibile verificare la pagina Facebook: " + (checkError instanceof Error ? checkError.message : String(checkError)));
      }

      // Se arriviamo qui, la pagina esiste. Proviamo a recuperare tutti i dati
      const apiUrl = `https://graph.facebook.com/v22.0/${pageId}?fields=id,name,about,bio,category,category_list,description,fan_count,followers_count,website,picture.type(large),published_posts.limit(10){id,created_time,updated_time,full_picture,permalink_url,from{id,name,picture},message,message_tags,likes.summary(true),comments.summary(true){id,from{id,name,picture},like_count,is_hidden,created_time,message},reactions.summary(true),shares,is_hidden}&access_token=${effectiveToken}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Errore completo API:", errorData);
        
        // Gestione errori specifici nella richiesta principale
        if (errorData.error) {
          if (errorData.error.code === 190) {
            throw new Error("Token di accesso scaduto o non valido. Effettua nuovamente l'accesso.");
          } else if (errorData.error.code === 4) {
            throw new Error("Troppe richieste. Attendi qualche minuto prima di riprovare.");
          } else {
            throw new Error(`Errore Facebook API: ${errorData.error.message}`);
          }
        }
        
        throw new Error("Errore nel recupero dei dati Facebook");
      }

      const data = await response.json();
      console.log("Risposta API:", data);
      
      // Debug specifico per il formato della picture
      if (data.picture) {
        console.log("Formato picture per pagina", pageId, ":", data.picture);
      } else {
        console.log("Nessuna picture restituita per la pagina", pageId);
      }
      
      if (data.error) {
        throw new Error(`Errore Facebook API: ${data.error.message}`);
      }
      
      // Salva la risposta JSON completa
      setResponseObject(data);
      
      // Normalizziamo la struttura dei dati per gestire diversi formati di risposta
      const normalizedData = {
        ...data,
        // Gestiamo diversi formati della picture
        picture: data.picture ? 
          (data.picture.data ? 
            data.picture : 
            { data: { url: data.picture.url || data.picture || 'https://via.placeholder.com/50?text=FB' } }
          ) : 
          { data: { url: 'https://via.placeholder.com/50?text=FB' } }
      };
      
      // Aggiungi analisi del sentiment ai commenti
      if (normalizedData.published_posts?.data) {
        normalizedData.published_posts.data.forEach(post => {
          if (post.comments?.data) {
            post.comments.data.forEach(comment => {
              // Analisi del sentiment
              comment.sentiment = analyzeSentiment(comment.message || '');
              
              // Aggiunge moderazione automatica
              const flags = detectContentIssues(comment.message || '', moderationSettings);
              comment.flags = flags;
              
              // Nasconde automaticamente in base alle impostazioni
              if (shouldAutoHide(flags, moderationSettings)) {
                comment.is_hidden = true;
              }
            });
          }
        });
      }
      
      // Salva nella cache
      setPagesCache(prevCache => ({
        ...prevCache,
        [pageId]: normalizedData
      }));
      
      setPageData(normalizedData);
      
      // Set the first post as selected by default if there are posts
      if (normalizedData.published_posts?.data && normalizedData.published_posts.data.length > 0) {
        setSelectedPost(normalizedData.published_posts.data[0]);
      }
      
      toast({
        title: "Successo",
        description: "Dati recuperati con successo",
      });
    } catch (error) {
      console.error("Errore durante il recupero dei dati:", error);
      
      // Mostra un messaggio di errore più specifico
      let errorMessage = "Impossibile recuperare i dati. Verifica il token di accesso.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Errore API",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm");
    } catch (e) {
      return dateString;
    }
  };

  // Handle post selection
  const handlePostClick = (post: FacebookPost) => {
    setSelectedPost(post);
    // Reset della risposta e della modifica quando cambiamo post
    setReplyingTo(null);
    setReplyText("");
    setEditingComment(null);
    setEditText("");
  };

  // Funzione per cambiare pagina
  const handlePageChange = (pageId: string) => {
    if (pageId === currentPageId) return;
    
    // Trova la pagina selezionata
    const selectedPage = availablePages.find(page => page.id === pageId);
    
    if (selectedPage) {
      setCurrentPageId(pageId);
      
      // Utilizza il token specifico per questa pagina
      const pageToken = pageTokens[pageId] || selectedPage.access_token || currentToken;
      setCurrentToken(pageToken);
      
      // Log del token per debug (solo parziale per sicurezza)
      console.log(`Cambio a pagina ${pageId} con token: ${pageToken.substring(0, 10)}...`);
      
      // Recupera i dati della pagina con il token appropriato
      fetchPageData(pageId, pageToken);
      
      toast({
        title: "Pagina cambiata",
        description: `Visualizzazione della pagina: ${selectedPage.name}`,
      });
    } else {
      console.warn(`Pagina con ID ${pageId} non trovata nelle pagine disponibili`);
      // Usa il token specifico per questa pagina, se disponibile
      const pageToken = pageTokens[pageId] || currentToken;
      fetchPageData(pageId, pageToken);
    }
  };

  // Load data on page load
  useEffect(() => {
    // Prima recupera le pagine disponibili
    fetchAvailablePages();
    // Se il recupero pagine fallisce, carica comunque la pagina di default
    if (availablePages.length === 0) {
      fetchPageData();
    }
  }, []);

  // Get all comments across all posts
  const getAllComments = (): Array<{ comment: FacebookComment, postId: string, postMessage: string }> => {
    if (!pageData || !pageData.published_posts || !pageData.published_posts.data) {
      return [];
    }
    
    const allComments: Array<{ comment: FacebookComment, postId: string, postMessage: string }> = [];
    
    pageData.published_posts.data.forEach(post => {
      if (post.comments && post.comments.data) {
        post.comments.data.forEach(comment => {
          // Assicuriamo che ogni commento abbia un campo user_likes e flags, se non esistono già
          const commentWithFields = {
            ...comment,
            user_likes: comment.user_likes || false,
            flags: comment.flags || detectContentIssues(comment.message || '', moderationSettings)
          };
          
          allComments.push({
            comment: commentWithFields,
            postId: post.id,
            postMessage: post.message || '(Nessun messaggio)'
          });
        });
      }
    });
    
    return allComments;
  };

  // Funzione per ottenere icona sentiment
  const getSentimentIcon = (sentiment?: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive':
        return <Smile className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <Frown className="h-4 w-4 text-red-500" />;
      case 'neutral':
      default:
        return <Meh className="h-4 w-4 text-gray-500" />;
    }
  };

  // Funzione per iniziare a rispondere a un commento
  const handleSendReply = async () => {
    if (!replyingTo || !replyText.trim() || !pageData) return;
    
    setIsReplying(true);
    
    try {
      console.log(`Invio risposta al commento ${replyingTo.commentId}: "${replyText}"`);
      
      // In una implementazione reale, qui si farebbe la chiamata API:
      // const response = await fetch(
      //   `https://graph.facebook.com/v22.0/${replyingTo.commentId}/comments`,
      //   {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({
      //       message: replyText,
      //       access_token: currentToken
      //     })
      //   }
      // );
      
      // Simuliamo una risposta di successo
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Troviamo il post e il commento a cui stiamo rispondendo
      const targetPost = pageData.published_posts?.data.find(p => p.id === replyingTo.postId);
      
      if (targetPost && targetPost.comments?.data) {
        // Creiamo un nuovo ID per la risposta simulata
        const responseId = `response_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        
        // Creiamo un nuovo commento che rappresenta la risposta
        const newComment: FacebookComment = {
          id: responseId,
          created_time: new Date().toISOString(),
          message: replyText,
          from: {
            id: pageData.id,
            name: pageData.name || "Pagina Facebook",
            picture: pageData.picture
          },
          sentiment: analyzeSentiment(replyText),
          like_count: 0,
          is_hidden: false
        };
        
        // Aggiorniamo il post nel pageData
        const updatedPostsData = pageData.published_posts?.data.map(post => {
          if (post.id === targetPost.id) {
            return {
              ...post,
              comments: {
                ...post.comments,
                data: [...post.comments.data, newComment]
              }
            };
          }
          return post;
        });
        
        // Aggiorniamo pageData con il nuovo commento
        setPageData({
          ...pageData,
          published_posts: {
            ...pageData.published_posts,
            data: updatedPostsData || []
          }
        });
        
        // Aggiorniamo selectedPost se necessario
        if (selectedPost && selectedPost.id === targetPost.id) {
          setSelectedPost({
            ...selectedPost,
            comments: {
              ...selectedPost.comments,
              data: [...(selectedPost.comments?.data || []), newComment]
            }
          });
        }
        
        toast({
          title: "Risposta inviata",
          description: "La tua risposta è stata pubblicata con successo.",
        });
        
        // Reset form
        setReplyText("");
        setReplyingTo(null);
      }
    } catch (error) {
      console.error("Errore nell'invio della risposta:", error);
      toast({
        title: "Errore",
        description: "Impossibile inviare la risposta. Riprova più tardi.",
        variant: "destructive"
      });
    } finally {
      setIsReplying(false);
    }
  };

  // Funzione per iniziare a rispondere a un commento
  const handleReplyClick = (comment: FacebookComment, postId: string) => {
    setReplyingTo({ commentId: comment.id, postId });
    setReplyText(`@${comment.from?.name || 'Utente'} `);
  };

  // Funzione per iniziare a modificare un commento
  const handleEditClick = (comment: FacebookComment, postId: string) => {
    setEditingComment({ commentId: comment.id, postId });
    setEditText(comment.message || "");
    
    // Chiudiamo il form di risposta se è aperto
    setReplyingTo(null);
  };
  
  // Funzione per aggiornare un commento
  const handleUpdateComment = async () => {
    if (!editingComment || !editText.trim() || !pageData) return;
    
    setIsEditing(true);
    
    try {
      console.log(`Aggiornamento commento ${editingComment.commentId}: "${editText}"`);
      
      // In una implementazione reale, qui si farebbe la chiamata API:
      // const response = await fetch(
      //   `https://graph.facebook.com/v22.0/${editingComment.commentId}`,
      //   {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({
      //       message: editText,
      //       access_token: currentToken
      //     })
      //   }
      // );
      
      // Simuliamo una risposta di successo
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Troviamo il post e il commento che stiamo modificando
      const targetPost = pageData.published_posts?.data.find(p => p.id === editingComment.postId);
      
      if (targetPost && targetPost.comments?.data) {
        // Aggiorniamo il post nel pageData
        const updatedPostsData = pageData.published_posts?.data.map(post => {
          if (post.id === targetPost.id) {
            return {
              ...post,
              comments: {
                ...post.comments,
                data: post.comments.data.map(c => 
                  c.id === editingComment.commentId 
                    ? {...c, message: editText, sentiment: analyzeSentiment(editText)} 
                    : c
                )
              }
            };
          }
          return post;
        });
        
        // Aggiorniamo pageData con il commento modificato
        setPageData({
          ...pageData,
          published_posts: {
            ...pageData.published_posts,
            data: updatedPostsData || []
          }
        });
        
        // Aggiorniamo selectedPost se necessario
        if (selectedPost && selectedPost.id === targetPost.id) {
          setSelectedPost({
            ...selectedPost,
            comments: {
              ...selectedPost.comments,
              data: selectedPost.comments?.data.map(c => 
                c.id === editingComment.commentId 
                  ? {...c, message: editText, sentiment: analyzeSentiment(editText)} 
                  : c
              ) || []
            }
          });
        }
        
        toast({
          title: "Commento aggiornato",
          description: "Il commento è stato modificato con successo.",
        });
        
        // Reset form
        setEditText("");
        setEditingComment(null);
      }
    } catch (error) {
      console.error("Errore nell'aggiornamento del commento:", error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare il commento. Riprova più tardi.",
        variant: "destructive"
      });
    } finally {
      setIsEditing(false);
    }
  };

  // Funzione per aggiungere/rimuovere Mi piace a un commento
  const handleToggleLike = async (comment: FacebookComment, postId: string) => {
    if (!pageData) return;
    
    // Impostiamo lo stato di loading per il mi piace specifico
    setIsLiking(prev => ({ ...prev, [comment.id]: true }));
    
    try {
      const isLiked = comment.user_likes;
      console.log(`${isLiked ? 'Rimozione' : 'Aggiunta'} mi piace al commento ${comment.id}`);
      
      // In una implementazione reale, qui si farebbe la chiamata API:
      // const response = await fetch(
      //   `https://graph.facebook.com/v22.0/${comment.id}/likes`,
      //   {
      //     method: isLiked ? 'DELETE' : 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({
      //       access_token: currentToken
      //     })
      //   }
      // );
      
      // Simuliamo una risposta di successo
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Troviamo il post e il commento in questione
      const targetPost = pageData.published_posts?.data.find(p => p.id === postId);
      
      if (targetPost && targetPost.comments?.data) {
        // Aggiorniamo il post nel pageData
        const updatedPostsData = pageData.published_posts?.data.map(post => {
          if (post.id === targetPost.id) {
            return {
              ...post,
              comments: {
                ...post.comments,
                data: post.comments.data.map(c => {
                  if (c.id === comment.id) {
                    // Aggiorniamo il commento cambiando lo stato dei mi piace
                    return {
                      ...c, 
                      user_likes: !isLiked,
                      // Aggiorna il conteggio dei mi piace
                      like_count: (c.like_count || 0) + (isLiked ? -1 : 1)
                    };
                  }
                  return c;
                })
              }
            };
          }
          return post;
        });
        
        // Aggiorniamo pageData
        setPageData({
          ...pageData,
          published_posts: {
            ...pageData.published_posts,
            data: updatedPostsData || []
          }
        });
        
        // Aggiorniamo selectedPost se necessario
        if (selectedPost && selectedPost.id === targetPost.id) {
          setSelectedPost({
            ...selectedPost,
            comments: {
              ...selectedPost.comments,
              data: selectedPost.comments?.data.map(c => {
                if (c.id === comment.id) {
                  return {
                    ...c, 
                    user_likes: !isLiked,
                    like_count: (c.like_count || 0) + (isLiked ? -1 : 1)
                  };
                }
                return c;
              }) || []
            }
          });
        }
        
        toast({
          title: isLiked ? "Mi piace rimosso" : "Mi piace aggiunto",
          description: `Hai ${isLiked ? 'rimosso il tuo mi piace dal' : 'messo mi piace al'} commento.`,
        });
      }
    } catch (error) {
      console.error(`Errore durante ${comment.user_likes ? 'la rimozione' : 'l\'aggiunta'} del mi piace:`, error);
      toast({
        title: "Errore",
        description: `Impossibile ${comment.user_likes ? 'rimuovere' : 'aggiungere'} il mi piace. Riprova più tardi.`,
        variant: "destructive"
      });
    } finally {
      setIsLiking(prev => ({ ...prev, [comment.id]: false }));
    }
  };

  // Funzione per moderare automaticamente un commento
  const moderateComment = (comment: FacebookComment): FacebookComment => {
    if (!comment.message) return comment;
    
    // Analizza il commento per rilevare problemi
    const flags = detectContentIssues(comment.message, moderationSettings);
    
    // Se il commento è problematico, lo nascondiamo automaticamente in base alle impostazioni
    const shouldHide = shouldAutoHide(flags, moderationSettings);
    
    // Se ci sono flag di moderazione, notifichiamo l'utente
    if (flags.needsReview && moderationSettings.notifyOnFlagged) {
      // Determina il tipo di problemi rilevati
      const issues = [];
      if (flags.isSpam) issues.push("spam");
      if (flags.isHateSpeech) issues.push("linguaggio offensivo");
      if (flags.hasProfanity) issues.push("volgarità");
      if (flags.hasLinks) issues.push("link");
      if (flags.isAdvertisement) issues.push("pubblicità");
      
      const issuesList = issues.join(", ");
      
      toast({
        title: "Commento problematico rilevato",
        description: `Rilevati: ${issuesList}. ${shouldHide ? 'Commento nascosto automaticamente.' : ''}`,
        variant: "destructive"
      });
    }
    
    // Ritorna il commento con i flag aggiunti e possibilmente nascosto
    return {
      ...comment,
      flags,
      is_hidden: shouldHide ? true : comment.is_hidden
    };
  };

  // Funzione per verificare tutti i commenti di un post o pagina
  const moderateAllComments = () => {
    if (!pageData) return;
    
    let totalModerated = 0;
    let totalHidden = 0;
    
    // Aggiorna tutti i post
    const updatedPostsData = pageData.published_posts?.data.map(post => {
      if (post.comments?.data) {
        // Modera tutti i commenti del post
        const moderatedComments = post.comments.data.map(comment => {
          const wasHidden = comment.is_hidden;
          const moderatedComment = moderateComment(comment);
          
          // Conta commenti moderati e nascosti
          if (moderatedComment.flags?.needsReview) totalModerated++;
          if (!wasHidden && moderatedComment.is_hidden) totalHidden++;
          
          return moderatedComment;
        });
        
        // Ritorna il post con i commenti moderati
        return {
          ...post,
          comments: {
            ...post.comments,
            data: moderatedComments
          }
        };
      }
      return post;
    });
    
    // Aggiorna pageData
    setPageData({
      ...pageData,
      published_posts: {
        ...pageData.published_posts,
        data: updatedPostsData || []
      }
    });
    
    // Aggiorna selectedPost se necessario
    if (selectedPost && selectedPost.comments?.data) {
      const moderatedComments = selectedPost.comments.data.map(comment => moderateComment(comment));
      
      setSelectedPost({
        ...selectedPost,
        comments: {
          ...selectedPost.comments,
          data: moderatedComments
        }
      });
    }
    
    // Mostra notifica dei risultati
    toast({
      title: "Moderazione completata",
      description: `${totalModerated} commenti problematici rilevati, ${totalHidden} nascosti automaticamente.`,
    });
  };

  // Ottieni tutti i commenti con flag di moderazione
  const getFlaggedComments = (): Array<{ comment: FacebookComment, postId: string, postMessage: string }> => {
    const allComments = getAllComments();
    return allComments.filter(({ comment }) => comment.flags?.needsReview);
  };

  // Funzione per ottenere le bandierine di moderazione
  const getModerationFlags = (flags?: CommentFlags) => {
    if (!flags || !flags.needsReview) return null;
    
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-5 w-5 text-red-500">
            <AlertTriangle className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-medium">Problemi rilevati:</h4>
            <ul className="text-sm">
              {flags.isSpam && <li className="flex items-center gap-2"><AlertTriangle className="h-3 w-3 text-amber-500" /> Possibile spam</li>}
              {flags.isHateSpeech && <li className="flex items-center gap-2"><AlertTriangle className="h-3 w-3 text-red-500" /> Linguaggio offensivo</li>}
              {flags.hasProfanity && <li className="flex items-center gap-2"><AlertTriangle className="h-3 w-3 text-red-500" /> Volgarità</li>}
              {flags.hasLinks && <li className="flex items-center gap-2"><AlertTriangle className="h-3 w-3 text-blue-500" /> Contiene link</li>}
              {flags.isAdvertisement && <li className="flex items-center gap-2"><AlertTriangle className="h-3 w-3 text-amber-500" /> Possibile pubblicità</li>}
            </ul>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  // Calcola le metriche per l'analytics
  const calculateMetrics = (): CommentMetrics => {
    if (!pageData || !pageData.published_posts?.data) {
      return {
        totalComments: 0,
        totalHidden: 0,
        totalFlagged: 0,
        avgCommentsPerPost: 0,
        positiveComments: 0,
        negativeComments: 0,
        neutralComments: 0,
        avgSentiment: 0,
        mostEngagedPost: '',
        recentTrend: 'stable',
        commentsByDate: []
      };
    }
    
    // Array di tutti i commenti con data e informazioni sul post
    const allCommentsWithData = getAllComments();
    
    // Applica i filtri per data
    const filteredComments = allCommentsWithData.filter(({ comment }) => {
      // Se l'opzione includeHidden è disabilitata, filtriamo i commenti nascosti
      if (!analyticsFilters.includeHidden && comment.is_hidden) {
        return false;
      }
      
      if (analyticsFilters.dateRange === 'all') {
        return true;
      }
      
      const commentDate = parseISO(comment.created_time);
      const now = new Date();
      let daysToSubtract = 30; // default
      
      switch (analyticsFilters.dateRange) {
        case '7d':
          daysToSubtract = 7;
          break;
        case '30d':
          daysToSubtract = 30;
          break;
        case '90d':
          daysToSubtract = 90;
          break;
      }
      
      const startDate = subDays(now, daysToSubtract);
      
      return isWithinInterval(commentDate, {
        start: startOfDay(startDate),
        end: endOfDay(now)
      });
    });
    
    // Estrai solo i commenti dall'array filtrato
    const filteredCommentsOnly = filteredComments.map(c => c.comment);
    
    // Calcola le metriche base
    const totalComments = filteredCommentsOnly.length;
    const totalHidden = filteredCommentsOnly.filter(c => c.is_hidden).length;
    const totalFlagged = filteredCommentsOnly.filter(c => c.flags?.needsReview).length;
    
    const positiveComments = filteredCommentsOnly.filter(c => c.sentiment === 'positive').length;
    const negativeComments = filteredCommentsOnly.filter(c => c.sentiment === 'negative').length;
    const neutralComments = filteredCommentsOnly.filter(c => c.sentiment === 'neutral').length;
    
    // Calcola il sentiment medio (-1 a 1)
    const sentimentValues = {
      'positive': 1,
      'neutral': 0,
      'negative': -1
    };
    
    const avgSentiment = totalComments > 0
      ? filteredCommentsOnly.reduce((acc, comment) => 
          acc + (sentimentValues[comment.sentiment || 'neutral'] || 0), 0) / totalComments
      : 0;
    
    // Trova il post con più commenti
    const postCommentCounts = new Map<string, { count: number, message: string }>();
    
    filteredComments.forEach(({ comment, postId, postMessage }) => {
      const currentCount = postCommentCounts.get(postId)?.count || 0;
      postCommentCounts.set(postId, { 
        count: currentCount + 1,
        message: postMessage
      });
    });
    
    let mostEngagedPostId = '';
    let mostEngagedPostComments = 0;
    let mostEngagedPostMessage = '';
    
    postCommentCounts.forEach((value, key) => {
      if (value.count > mostEngagedPostComments) {
        mostEngagedPostId = key;
        mostEngagedPostComments = value.count;
        mostEngagedPostMessage = value.message;
      }
    });
    
    // Calcola i commenti per data per i grafici
    const commentsByDate = new Map<string, { 
      count: number; 
      positive: number;
      negative: number;
      neutral: number;
    }>();
    
    filteredComments.forEach(({ comment }) => {
      const dateKey = format(parseISO(comment.created_time), 'yyyy-MM-dd');
      
      const current = commentsByDate.get(dateKey) || { 
        count: 0, 
        positive: 0, 
        negative: 0, 
        neutral: 0 
      };
      
      current.count += 1;
      
      // Incrementa il contatore appropriato per il sentiment
      if (comment.sentiment === 'positive') {
        current.positive += 1;
      } else if (comment.sentiment === 'negative') {
        current.negative += 1;
      } else {
        current.neutral += 1;
      }
      
      commentsByDate.set(dateKey, current);
    });
    
    // Converti la mappa in un array ordinato per data
    const commentsByDateArray = Array.from(commentsByDate.entries())
      .map(([date, data]) => ({
        date,
        count: data.count,
        positive: data.positive,
        negative: data.negative,
        neutral: data.neutral
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
    
    // Calcola il trend recente (ultimi 7 giorni vs 7 giorni precedenti)
    let recentTrend: 'up' | 'down' | 'stable' = 'stable';
    
    if (commentsByDateArray.length > 0) {
      const now = new Date();
      const last7Days = subDays(now, 7);
      const previous7Days = subDays(now, 14);
      
      const recentComments = filteredCommentsOnly.filter(c => 
        parseISO(c.created_time) >= last7Days
      ).length;
      
      const previousComments = filteredCommentsOnly.filter(c => 
        parseISO(c.created_time) >= previous7Days && parseISO(c.created_time) < last7Days
      ).length;
      
      if (recentComments > previousComments * 1.1) { // 10% increase
        recentTrend = 'up';
      } else if (recentComments < previousComments * 0.9) { // 10% decrease
        recentTrend = 'down';
      }
    }
    
    // Calcola la media di commenti per post
    const numPosts = pageData.published_posts.data.length;
    const avgCommentsPerPost = numPosts > 0 ? totalComments / numPosts : 0;
    
    return {
      totalComments,
      totalHidden,
      totalFlagged,
      avgCommentsPerPost,
      positiveComments,
      negativeComments,
      neutralComments,
      avgSentiment,
      mostEngagedPost: mostEngagedPostMessage,
      recentTrend,
      commentsByDate: commentsByDateArray
    };
  };
  
  // Memorizza le metriche per evitare ricalcoli non necessari
  const metrics = useMemo(() => calculateMetrics(), [pageData, analyticsFilters]);
  
  // Funzione per esportare i dati in formato CSV
  const exportAnalyticsData = () => {
    if (!pageData) return;
    
    setExportLoading(true);
    
    try {
      // Ottiene tutti i commenti con le informazioni sul post
      const comments = getAllComments();
      
      // Prepara i dati in formato CSV
      const headers = [
        'ID Commento', 
        'Data', 
        'Utente', 
        'Commento', 
        'Post', 
        'ID Post',
        'Mi Piace', 
        'Sentiment', 
        'Nascosto', 
        'Problematico',
        'Tipo Problemi'
      ];
      
      const rows = comments.map(({ comment, postId, postMessage }) => {
        // Determina i tipi di problemi nel commento, se presenti
        const problemTypes = [];
        if (comment.flags?.isSpam) problemTypes.push('Spam');
        if (comment.flags?.isHateSpeech) problemTypes.push('Linguaggio Offensivo');
        if (comment.flags?.hasProfanity) problemTypes.push('Volgarità');
        if (comment.flags?.hasLinks) problemTypes.push('Link');
        if (comment.flags?.isAdvertisement) problemTypes.push('Pubblicità');
        
        return [
          comment.id,
          format(parseISO(comment.created_time), 'yyyy-MM-dd HH:mm:ss'),
          comment.from?.name || 'Anonimo',
          comment.message || '',
          postMessage,
          postId,
          comment.like_count || 0,
          comment.sentiment || 'neutral',
          comment.is_hidden ? 'Sì' : 'No',
          comment.flags?.needsReview ? 'Sì' : 'No',
          problemTypes.join(', ')
        ];
      });
      
      // Crea il contenuto CSV
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => 
          // Gestisce i valori con virgole racchiudendoli in virgolette
          typeof cell === 'string' && cell.includes(',') 
            ? `"${cell.replace(/"/g, '""')}"` 
            : cell
        ).join(','))
      ].join('\n');
      
      // Crea un blob e scarica il file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `facebook_comments_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export completato",
        description: "I dati sono stati esportati con successo in formato CSV.",
      });
    } catch (error) {
      console.error("Errore durante l'esportazione dei dati:", error);
      toast({
        title: "Errore di esportazione",
        description: "Si è verificato un errore durante l'esportazione dei dati.",
        variant: "destructive"
      });
    } finally {
      setExportLoading(false);
    }
  };
  
  // Visualizza i dati dei commenti nel tempo come grafico semplificato
  const renderCommentTrendChart = () => {
    const { commentsByDate } = metrics;
    
    if (commentsByDate.length === 0) {
      return (
        <div className="py-10 text-center text-muted-foreground">
          Nessun dato disponibile per il periodo selezionato
        </div>
      );
    }
    
    // Determina l'altezza massima per il grafico
    const maxCount = Math.max(...commentsByDate.map(d => d.count));
    const chartHeight = 200;
    
    return (
      <div className="mt-6 relative">
        <div className="flex justify-between mb-2">
          <div className="text-xs text-muted-foreground">Commenti nel tempo</div>
          <div className="text-xs text-muted-foreground">Totale: {metrics.totalComments}</div>
        </div>
        
        <div className="h-[200px] relative">
          {/* Asse Y */}
          <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between text-xs text-gray-500">
            <div>{maxCount}</div>
            <div>{Math.floor(maxCount / 2)}</div>
            <div>0</div>
          </div>
          
          {/* Grafico a barre */}
          <div className="absolute left-12 right-0 top-0 bottom-0 flex items-end">
            {commentsByDate.map((day, i) => {
              const barHeight = day.count > 0 ? (day.count / maxCount) * chartHeight : 0;
              const barPositiveHeight = day.positive > 0 ? (day.positive / day.count) * barHeight : 0;
              const barNegativeHeight = day.negative > 0 ? (day.negative / day.count) * barHeight : 0;
              const barNeutralHeight = barHeight - barPositiveHeight - barNegativeHeight;
              
              return (
                <TooltipProvider key={day.date}>
                  <Tooltip>
                    <TooltipTrigger className="flex-1 flex flex-col items-center">
                      <div className="w-full px-0.5 flex-1 flex flex-col justify-end">
                        <div 
                          className="w-full bg-green-400 rounded-t-sm" 
                          style={{ height: `${barPositiveHeight}px` }}
                        />
                        <div 
                          className="w-full bg-gray-400" 
                          style={{ height: `${barNeutralHeight}px` }}
                        />
                        <div 
                          className="w-full bg-red-400 rounded-b-sm" 
                          style={{ height: `${barNegativeHeight}px` }}
                        />
                      </div>
                      <div className="text-[9px] mt-1 text-gray-500">
                        {format(parseISO(day.date), 'dd/MM')}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-xs">
                        <div className="font-semibold">{format(parseISO(day.date), 'dd/MM/yyyy')}</div>
                        <div>Totale: {day.count}</div>
                        <div className="flex items-center">
                          <span className="h-2 w-2 bg-green-400 rounded-full mr-1" /> Positivi: {day.positive}
                        </div>
                        <div className="flex items-center">
                          <span className="h-2 w-2 bg-gray-400 rounded-full mr-1" /> Neutrali: {day.neutral}
                        </div>
                        <div className="flex items-center">
                          <span className="h-2 w-2 bg-red-400 rounded-full mr-1" /> Negativi: {day.negative}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  
  // Visualizza la distribuzione del sentiment
  const renderSentimentDistribution = () => {
    const { positiveComments, negativeComments, neutralComments, totalComments } = metrics;
    
    if (totalComments === 0) {
      return (
        <div className="py-10 text-center text-muted-foreground">
          Nessun dato disponibile per il periodo selezionato
        </div>
      );
    }
    
    // Calcola le percentuali
    const positivePercentage = (positiveComments / totalComments) * 100;
    const negativePercentage = (negativeComments / totalComments) * 100;
    const neutralPercentage = (neutralComments / totalComments) * 100;
    
    return (
      <div className="mt-6">
        <div className="text-xs text-muted-foreground mb-2">Distribuzione del sentiment</div>
        
        <div className="flex h-8 rounded-lg overflow-hidden">
          <div 
            className="bg-green-400 h-full flex items-center justify-center text-xs text-white font-medium"
            style={{ width: `${positivePercentage}%` }}
          >
            {positivePercentage >= 10 ? `${Math.round(positivePercentage)}%` : ''}
          </div>
          <div 
            className="bg-gray-400 h-full flex items-center justify-center text-xs text-white font-medium"
            style={{ width: `${neutralPercentage}%` }}
          >
            {neutralPercentage >= 10 ? `${Math.round(neutralPercentage)}%` : ''}
          </div>
          <div 
            className="bg-red-400 h-full flex items-center justify-center text-xs text-white font-medium"
            style={{ width: `${negativePercentage}%` }}
          >
            {negativePercentage >= 10 ? `${Math.round(negativePercentage)}%` : ''}
          </div>
        </div>
        
        <div className="flex justify-between mt-2">
          <div className="flex items-center text-xs">
            <span className="h-2 w-2 bg-green-400 rounded-full mr-1" /> 
            Positivi: {positiveComments} ({Math.round(positivePercentage)}%)
          </div>
          <div className="flex items-center text-xs">
            <span className="h-2 w-2 bg-gray-400 rounded-full mr-1" /> 
            Neutrali: {neutralComments} ({Math.round(neutralPercentage)}%)
          </div>
          <div className="flex items-center text-xs">
            <span className="h-2 w-2 bg-red-400 rounded-full mr-1" /> 
            Negativi: {negativeComments} ({Math.round(negativePercentage)}%)
          </div>
        </div>
      </div>
    );
  };

  // Funzione per controllare se un commento soddisfa una condizione
  const checkWorkflowCondition = (comment: FacebookComment, rule: WorkflowRule): boolean => {
    if (!comment) return false;
    
    switch (rule.condition.type) {
      case 'contains':
        return !!comment.message?.toLowerCase().includes(rule.condition.value.toLowerCase());
      
      case 'not_contains':
        return !!comment.message && !comment.message.toLowerCase().includes(rule.condition.value.toLowerCase());
      
      case 'user':
        return comment.from?.id === rule.condition.value || comment.from?.name === rule.condition.value;
      
      case 'sentiment':
        return comment.sentiment === rule.condition.value;
      
      case 'has_links':
        return !!comment.flags?.hasLinks;
      
      case 'has_profanity':
        return !!comment.flags?.hasProfanity;
      
      case 'is_spam':
        return !!comment.flags?.isSpam;
      
      default:
        return false;
    }
  };
  
  // Esegui un'azione automatica su un commento
  const executeWorkflowAction = async (comment: FacebookComment, postId: string, rule: WorkflowRule): Promise<boolean> => {
    if (!comment || !postId || !rule) return false;
    
    try {
      // Record incremento di esecuzione
      const updatedRule = { 
        ...rule, 
        lastRun: new Date().toISOString(),
        runCount: rule.runCount + 1 
      };
      
      // Aggiorna la regola con il nuovo conteggio
      setWorkflows(prev => prev.map(r => r.id === rule.id ? updatedRule : r));
      
      // Esegui l'azione appropriata
      switch (rule.action.type) {
        case 'hide':
          // Se il commento è già nascosto non fare nulla
          if (!comment.is_hidden) {
            handleHideComment(comment);
          }
          break;
        
        case 'delete':
          handleDeleteComment(comment);
          break;
        
        case 'like':
          // Se l'utente ha già messo mi piace non fare nulla
          if (!comment.user_likes) {
            await handleToggleLike(comment, postId);
          }
          break;
        
        case 'notify':
          // Simuliamo una notifica con un toast
          toast({
            title: `Notifica automatica: ${rule.name}`,
            description: `Commento di ${comment.from?.name} richiede attenzione: "${comment.message?.substring(0, 50)}${comment.message && comment.message.length > 50 ? '...' : ''}"`,
            variant: "default"
          });
          break;
        
        default:
          return false;
      }
      
      // Aggiungi al log delle esecuzioni
      const execution: WorkflowExecution = {
        id: `exec_${Date.now()}`,
        ruleId: rule.id,
        ruleName: rule.name,
        commentId: comment.id,
        postId: postId,
        action: rule.action.type,
        executedAt: new Date().toISOString(),
        success: true,
        commentPreview: comment.message?.substring(0, 50) + (comment.message && comment.message.length > 50 ? '...' : '') || '(Nessun testo)'
      };
      
      setWorkflowExecutions(prev => [execution, ...prev].slice(0, 100)); // Mantieni solo le ultime 100 esecuzioni
      
      return true;
    } catch (error) {
      console.error("Errore nell'esecuzione del workflow:", error);
      
      // Aggiungi al log delle esecuzioni fallite
      const execution: WorkflowExecution = {
        id: `exec_${Date.now()}`,
        ruleId: rule.id,
        ruleName: rule.name,
        commentId: comment.id,
        postId: postId,
        action: rule.action.type,
        executedAt: new Date().toISOString(),
        success: false,
        commentPreview: comment.message?.substring(0, 50) + (comment.message && comment.message.length > 50 ? '...' : '') || '(Nessun testo)'
      };
      
      setWorkflowExecutions(prev => [execution, ...prev].slice(0, 100));
      
      return false;
    }
  };
  
  // Esegui tutti i flussi di lavoro attivi su tutti i commenti
  const runAllWorkflows = async () => {
    if (!pageData || isExecutingWorkflows) return;
    
    setIsExecutingWorkflows(true);
    
    try {
      const activeWorkflows = workflows.filter(w => w.active);
      if (activeWorkflows.length === 0) {
        toast({
          title: "Nessun workflow attivo",
          description: "Attiva almeno un workflow per eseguire azioni automatiche.",
          variant: "default"
        });
        return;
      }
      
      let actionsExecuted = 0;
      const allComments = getAllComments();
      
      // Per ogni commento, verifica tutte le regole attive
      for (const { comment, postId } of allComments) {
        for (const rule of activeWorkflows) {
          // Verifica se il commento soddisfa la condizione della regola
          if (checkWorkflowCondition(comment, rule)) {
            // Esegui l'azione associata alla regola
            const success = await executeWorkflowAction(comment, postId, rule);
            if (success) actionsExecuted++;
          }
        }
      }
      
      toast({
        title: "Workflow completati",
        description: `Eseguite ${actionsExecuted} azioni automatiche su ${allComments.length} commenti.`,
        variant: "default"
      });
    } catch (error) {
      console.error("Errore nell'esecuzione dei workflow:", error);
      toast({
        title: "Errore workflow",
        description: "Si è verificato un errore durante l'esecuzione dei workflow.",
        variant: "destructive"
      });
    } finally {
      setIsExecutingWorkflows(false);
    }
  };
  
  // Aggiungi o modifica un workflow
  const saveWorkflow = (workflow: WorkflowRule) => {
    if (workflow.id) {
      // Modifica di un workflow esistente
      setWorkflows(prev => prev.map(w => w.id === workflow.id ? workflow : w));
    } else {
      // Nuovo workflow
      const newWorkflow = {
        ...workflow,
        id: `workflow_${Date.now()}`,
        createdAt: new Date().toISOString(),
        runCount: 0
      };
      setWorkflows(prev => [...prev, newWorkflow]);
    }
    
    setEditingWorkflow(null);
    setShowWorkflowDialog(false);
    
    toast({
      title: "Workflow salvato",
      description: "Il workflow è stato salvato con successo.",
      variant: "default"
    });
  };
  
  // Elimina un workflow
  const deleteWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.filter(w => w.id !== workflowId));
    
    toast({
      title: "Workflow eliminato",
      description: "Il workflow è stato eliminato con successo.",
      variant: "default"
    });
  };
  
  // Cambia lo stato attivo/inattivo di un workflow
  const toggleWorkflowActive = (workflowId: string) => {
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId ? { ...w, active: !w.active } : w
    ));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 p-6 bg-white">
        <div className="container mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Moderazione Facebook</h1>
            <div className="flex items-center gap-3">
              {/* Aggiungiamo i controlli di moderazione */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>Moderazione</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => moderateAllComments()}>
                    <Filter className="h-4 w-4 mr-2" />
                    <span>Modera tutti i commenti</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilteredView(filteredView === 'all' ? 'flagged' : 'all')}>
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    <span>{filteredView === 'all' ? 'Mostra solo problematici' : 'Mostra tutti i commenti'}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowModerationDialog(true)}>
                    <Settings className="h-4 w-4 mr-2" />
                    <span>Impostazioni moderazione</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Page Selector Cards */}
              <div className="flex gap-4">
                {Object.entries(pageInfo).map(([id, info]) => (
                  <div 
                    key={id}
                    className={`cursor-pointer rounded-lg p-2 px-4 flex items-center gap-3 border-2 transition-all ${
                      currentPageId === id 
                        ? `border-${info.color}-500 bg-${info.color}-50` 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                    onClick={() => {
                      if (currentPageId !== id) {
                        const token = pageTokens[id];
                        setCurrentPageId(id);
                        setCurrentToken(token);
                        fetchPageData(id, token);
                      }
                    }}
                  >
                    <Avatar className={`h-12 w-12 border-2 ${currentPageId === id ? `border-${info.color}-400` : 'border-gray-200'}`}>
                      <AvatarImage src={info.logo} alt={info.name} />
                      <AvatarFallback>{info.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{info.name}</div>
                      <div className="text-xs text-gray-500">{
                        pagesCache[id] 
                          ? `${pagesCache[id].fan_count?.toLocaleString() || 0} fan` 
                          : 'Carica dati'
                      }</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button onClick={() => {
                // Rimuovi dalla cache la pagina corrente per forzare il ricaricamento
                setPagesCache(prevCache => {
                  const newCache = {...prevCache};
                  delete newCache[currentPageId];
                  return newCache;
                });
                fetchPageData();
              }} disabled={loading}>
                {loading ? "Caricamento..." : "Aggiorna Dati"}
              </Button>
            </div>
          </div>
          
          {/* ... existing card sections ... */}
          
          {/* Dialog delle impostazioni di moderazione */}
          <Dialog open={showModerationDialog} onOpenChange={setShowModerationDialog}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Impostazioni di Moderazione</DialogTitle>
                <DialogDescription>
                  Configura come la moderazione automatica deve gestire i commenti problematici.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="moderation-enabled" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" /> Moderazione automatica
                  </Label>
                  <Switch 
                    id="moderation-enabled" 
                    checked={moderationSettings.enabled}
                    onCheckedChange={(checked) => setModerationSettings(prev => ({ ...prev, enabled: checked }))}
                  />
                </div>
                
                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-medium">Azioni Automatiche</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="hide-spam">Nascondi spam</Label>
                      <Switch 
                        id="hide-spam" 
                        checked={moderationSettings.autoHideSpam}
                        onCheckedChange={(checked) => setModerationSettings(prev => ({ ...prev, autoHideSpam: checked }))}
                        disabled={!moderationSettings.enabled}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="hide-hate">Nascondi hate speech</Label>
                      <Switch 
                        id="hide-hate" 
                        checked={moderationSettings.autoHideHateSpeech}
                        onCheckedChange={(checked) => setModerationSettings(prev => ({ ...prev, autoHideHateSpeech: checked }))}
                        disabled={!moderationSettings.enabled}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="hide-profanity">Nascondi volgarità</Label>
                      <Switch 
                        id="hide-profanity" 
                        checked={moderationSettings.autoHideProfanity}
                        onCheckedChange={(checked) => setModerationSettings(prev => ({ ...prev, autoHideProfanity: checked }))}
                        disabled={!moderationSettings.enabled}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="hide-links">Nascondi link</Label>
                      <Switch 
                        id="hide-links" 
                        checked={moderationSettings.autoHideLinks}
                        onCheckedChange={(checked) => setModerationSettings(prev => ({ ...prev, autoHideLinks: checked }))}
                        disabled={!moderationSettings.enabled}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="hide-ads">Nascondi pubblicità</Label>
                      <Switch 
                        id="hide-ads" 
                        checked={moderationSettings.autoHideAds}
                        onCheckedChange={(checked) => setModerationSettings(prev => ({ ...prev, autoHideAds: checked }))}
                        disabled={!moderationSettings.enabled}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-flagged">Notifica problemi</Label>
                      <Switch 
                        id="notify-flagged" 
                        checked={moderationSettings.notifyOnFlagged}
                        onCheckedChange={(checked) => setModerationSettings(prev => ({ ...prev, notifyOnFlagged: checked }))}
                        disabled={!moderationSettings.enabled}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-medium">Parole Chiave</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="spam-keywords">Spam</Label>
                      <Input 
                        id="spam-keywords" 
                        value={moderationSettings.spamKeywords.join(', ')}
                        onChange={(e) => setModerationSettings(prev => ({ 
                          ...prev, 
                          spamKeywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean)
                        }))}
                        placeholder="vinci, gratis, clicca qui..."
                        disabled={!moderationSettings.enabled}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="hate-keywords">Linguaggio Offensivo</Label>
                      <Input 
                        id="hate-keywords" 
                        value={moderationSettings.hateSpeechKeywords.join(', ')}
                        onChange={(e) => setModerationSettings(prev => ({ 
                          ...prev, 
                          hateSpeechKeywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean)
                        }))}
                        placeholder="idiota, stupido..."
                        disabled={!moderationSettings.enabled}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="profanity-keywords">Volgarità</Label>
                      <Input 
                        id="profanity-keywords" 
                        value={moderationSettings.profanityKeywords.join(', ')}
                        onChange={(e) => setModerationSettings(prev => ({ 
                          ...prev, 
                          profanityKeywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean)
                        }))}
                        placeholder="parole volgari..."
                        disabled={!moderationSettings.enabled}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="ad-keywords">Pubblicità</Label>
                      <Input 
                        id="ad-keywords" 
                        value={moderationSettings.adKeywords.join(', ')}
                        onChange={(e) => setModerationSettings(prev => ({ 
                          ...prev, 
                          adKeywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean)
                        }))}
                        placeholder="promo, sconto, offerta..."
                        disabled={!moderationSettings.enabled}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowModerationDialog(false)}>
                  Annulla
                </Button>
                <Button onClick={() => {
                  toast({
                    title: "Impostazioni salvate",
                    description: "Le impostazioni di moderazione sono state aggiornate.",
                  });
                  moderateAllComments();
                  setShowModerationDialog(false);
                }}>
                  Salva e Applica
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* ... existing tabs and content sections ... */}
          
          {/* Tabs per contenuti */}
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="posts">Post e Commenti</TabsTrigger>
              <TabsTrigger value="all-comments">Tutti i Commenti</TabsTrigger>
              <TabsTrigger value="flagged-comments" className="relative">
                Commenti Problematici
                {getFlaggedComments().length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {getFlaggedComments().length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <span className="flex items-center gap-1">
                  <BarChart3 className="h-4 w-4" /> Analytics
                </span>
              </TabsTrigger>
              <TabsTrigger value="workflows">
                <span className="flex items-center gap-1">
                  <Settings className="h-4 w-4" /> Workflow
                </span>
              </TabsTrigger>
            </TabsList>
            
            {/* Post and Comments View */}
            <TabsContent value="posts">
              {/* ... existing code ... */}
              
              {/* Nei commenti del post */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <span className="sr-only">Selezione</span>
                    </TableHead>
                    <TableHead className="w-[100px]">Data</TableHead>
                    <TableHead className="w-[130px]">Utente</TableHead>
                    <TableHead>Commento</TableHead>
                    <TableHead className="w-[70px]" title="Mi piace">👍</TableHead>
                    <TableHead className="w-[60px]">Sentiment</TableHead>
                    <TableHead className="w-[40px]">Mod</TableHead>
                    <TableHead className="w-[200px]">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedPost.comments?.data.map((comment) => (
                    <TableRow 
                      key={comment.id}
                      className={comment.flags?.needsReview ? "bg-red-50" : ""}
                    >
                      {/* ... existing code ... */}
                      <TableCell className="text-center">
                        {getSentimentIcon(comment.sentiment)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getModerationFlags(comment.flags)}
                      </TableCell>
                      <TableCell>
                        {/* ... existing code ... */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* ... existing code ... */}
            </TabsContent>
            
            {/* All Comments View */}
            <TabsContent value="all-comments">
              {/* ... existing code ... */}
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <span className="sr-only">Selezione</span>
                    </TableHead>
                    <TableHead className="w-[100px]">Data</TableHead>
                    <TableHead className="w-[130px]">Utente</TableHead>
                    <TableHead className="w-[180px]">Post</TableHead>
                    <TableHead>Commento</TableHead>
                    <TableHead className="w-[70px]" title="Mi piace">👍</TableHead>
                    <TableHead className="w-[60px]">Sentiment</TableHead>
                    <TableHead className="w-[40px]">Mod</TableHead>
                    <TableHead className="w-[200px]">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getAllComments().map(({ comment, postId, postMessage }) => (
                    <TableRow 
                      key={comment.id}
                      className={comment.flags?.needsReview ? "bg-red-50" : ""}
                    >
                      {/* ... existing code ... */}
                      <TableCell className="text-center">
                        {getSentimentIcon(comment.sentiment)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getModerationFlags(comment.flags)}
                      </TableCell>
                      <TableCell>
                        {/* ... existing code ... */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            {/* Flagged Comments View */}
            <TabsContent value="flagged-comments">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>Commenti Problematici</CardTitle>
                    <Badge variant="outline" className="ml-2">
                      {getFlaggedComments().length} commenti da revisionare
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {getFlaggedComments().length === 0 ? (
                    <div className="py-10 text-center text-muted-foreground">
                      Nessun commento problematico rilevato
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Data</TableHead>
                          <TableHead className="w-[130px]">Utente</TableHead>
                          <TableHead className="w-[180px]">Post</TableHead>
                          <TableHead>Commento</TableHead>
                          <TableHead className="w-[120px]">Problemi</TableHead>
                          <TableHead className="w-[200px]">Azioni</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getFlaggedComments().map(({ comment, postId, postMessage }) => (
                          <TableRow key={comment.id}>
                            <TableCell className="whitespace-nowrap">{formatDate(comment.created_time)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {comment.from?.picture?.data?.url ? (
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={comment.from.picture.data.url} alt={comment.from.name} />
                                    <AvatarFallback>{comment.from.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                ) : (
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback>{comment.from?.name.charAt(0) || '?'}</AvatarFallback>
                                  </Avatar>
                                )}
                                <span>{comment.from?.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[180px] truncate">
                              <span 
                                className="cursor-pointer hover:text-blue-600 hover:underline"
                                onClick={() => {
                                  const post = pageData?.published_posts?.data.find(p => p.id === postId);
                                  if (post) {
                                    setSelectedPost(post);
                                    const tabsList = document.querySelector('[role="tablist"]');
                                    const postsTab = tabsList?.querySelector('[value="posts"]') as HTMLElement;
                                    if (postsTab) postsTab.click();
                                  }
                                }}
                              >
                                {postMessage}
                              </span>
                            </TableCell>
                            <TableCell className={comment.is_hidden ? "text-muted-foreground italic" : ""}>
                              {comment.is_hidden ? "[Commento nascosto]" : comment.message}
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1 text-xs">
                                {comment.flags?.isSpam && <Badge variant="outline" className="bg-amber-50 text-amber-800">Spam</Badge>}
                                {comment.flags?.isHateSpeech && <Badge variant="outline" className="bg-red-50 text-red-800">Linguaggio Offensivo</Badge>}
                                {comment.flags?.hasProfanity && <Badge variant="outline" className="bg-red-50 text-red-800">Volgarità</Badge>}
                                {comment.flags?.hasLinks && <Badge variant="outline" className="bg-blue-50 text-blue-800">Link</Badge>}
                                {comment.flags?.isAdvertisement && <Badge variant="outline" className="bg-amber-50 text-amber-800">Pubblicità</Badge>}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleHideComment(comment)}
                                  title={comment.is_hidden ? "Approva commento" : "Nascondi commento"}
                                >
                                  {comment.is_hidden ? (
                                    <Check className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <EyeOff className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    // Implementazione: segna come gestito (rimuove i flag)
                                    if (!pageData) return;
                                    
                                    // Aggiorna il commento rimuovendo i flag di moderazione
                                    const updatedPostsData = pageData.published_posts?.data.map(post => {
                                      if (post.id === postId && post.comments?.data) {
                                        return {
                                          ...post,
                                          comments: {
                                            ...post.comments,
                                            data: post.comments.data.map(c => 
                                              c.id === comment.id ? {...c, flags: { needsReview: false }} : c
                                            )
                                          }
                                        };
                                      }
                                      return post;
                                    });
                                    
                                    // Aggiorna pageData
                                    setPageData({
                                      ...pageData,
                                      published_posts: {
                                        ...pageData.published_posts,
                                        data: updatedPostsData || []
                                      }
                                    });
                                    
                                    toast({
                                      title: "Commento approvato",
                                      description: "Il commento è stato segnato come revisionato.",
                                    });
                                  }}
                                  title="Segna come revisionato"
                                >
                                  Approva
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteComment(comment)}
                                  title="Elimina commento"
                                  className="text-red-600"
                                >
                                  Elimina
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle>Analytics e Metriche</CardTitle>
                      <div className="flex gap-2">
                        <Button 
                          onClick={exportAnalyticsData} 
                          variant="outline" 
                          size="sm"
                          disabled={exportLoading}
                        >
                          {exportLoading ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Esportazione...
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-2" /> Esporta dati
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    <CardDescription>
                      Panoramica delle interazioni degli utenti sulla pagina Facebook
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Filtri */}
                      <div className="flex flex-wrap gap-4 pb-4 border-b">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="date-range" className="text-sm flex items-center gap-1">
                            <Calendar className="h-4 w-4" /> Periodo
                          </Label>
                          <Select 
                            value={analyticsFilters.dateRange}
                            onValueChange={(value) => setAnalyticsFilters(prev => ({ 
                              ...prev, 
                              dateRange: value as AnalyticsFilters['dateRange'] 
                            }))}
                          >
                            <SelectTrigger id="date-range" className="h-8 w-[100px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="7d">7 giorni</SelectItem>
                              <SelectItem value="30d">30 giorni</SelectItem>
                              <SelectItem value="90d">90 giorni</SelectItem>
                              <SelectItem value="all">Tutti</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Label htmlFor="group-by" className="text-sm flex items-center gap-1">
                            <ArrowUpDown className="h-4 w-4" /> Raggruppa
                          </Label>
                          <Select 
                            value={analyticsFilters.groupBy}
                            onValueChange={(value) => setAnalyticsFilters(prev => ({ 
                              ...prev, 
                              groupBy: value as AnalyticsFilters['groupBy'] 
                            }))}
                          >
                            <SelectTrigger id="group-by" className="h-8 w-[100px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="day">Giorno</SelectItem>
                              <SelectItem value="week">Settimana</SelectItem>
                              <SelectItem value="month">Mese</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Label htmlFor="include-hidden" className="text-sm flex items-center gap-1">
                            <Eye className="h-4 w-4" /> Includi nascosti
                          </Label>
                          <Switch 
                            id="include-hidden"
                            checked={analyticsFilters.includeHidden}
                            onCheckedChange={(checked) => setAnalyticsFilters(prev => ({ 
                              ...prev, 
                              includeHidden: checked 
                            }))}
                          />
                        </div>
                      </div>
                      
                      {/* KPI */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="p-6">
                            <div className="text-sm font-medium text-muted-foreground">Totale Commenti</div>
                            <div className="text-3xl font-bold mt-1">{metrics.totalComments}</div>
                            <div className="flex items-center text-xs mt-2">
                              <Badge 
                                variant={metrics.recentTrend === 'up' ? 'default' : metrics.recentTrend === 'down' ? 'destructive' : 'outline'}
                                className="mr-2"
                              >
                                {metrics.recentTrend === 'up' ? (
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                ) : metrics.recentTrend === 'down' ? (
                                  <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                                ) : null}
                                {metrics.recentTrend === 'up' ? 'In crescita' : metrics.recentTrend === 'down' ? 'In calo' : 'Stabile'}
                              </Badge>
                              rispetto al periodo precedente
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-6">
                            <div className="text-sm font-medium text-muted-foreground">Sentiment Medio</div>
                            <div className="flex items-center mt-1">
                              <div className="text-3xl font-bold">{
                                metrics.avgSentiment > 0.1 ? 'Positivo' : 
                                metrics.avgSentiment < -0.1 ? 'Negativo' : 'Neutro'
                              }</div>
                              <div className="ml-2">
                                {metrics.avgSentiment > 0.1 ? (
                                  <Smile className="h-6 w-6 text-green-500" />
                                ) : metrics.avgSentiment < -0.1 ? (
                                  <Frown className="h-6 w-6 text-red-500" />
                                ) : (
                                  <Meh className="h-6 w-6 text-gray-500" />
                                )}
                              </div>
                            </div>
                            <div className="text-xs mt-2 text-muted-foreground">
                              Valore: {metrics.avgSentiment.toFixed(2)} (da -1 a +1)
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-6">
                            <div className="text-sm font-medium text-muted-foreground">Commenti per Post</div>
                            <div className="text-3xl font-bold mt-1">{Math.round(metrics.avgCommentsPerPost * 10) / 10}</div>
                            <div className="text-xs mt-2 text-muted-foreground">
                              Media su {pageData?.published_posts?.data.length || 0} post
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      {/* Grafici e dati aggiuntivi */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="pt-6">
                            {renderCommentTrendChart()}
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-6">
                            <div className="text-sm font-medium text-muted-foreground mb-4">Metriche di Moderazione</div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-xs text-muted-foreground">Commenti Nascosti</div>
                                <div className="text-xl font-semibold">{metrics.totalHidden}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {metrics.totalComments > 0 
                                    ? Math.round((metrics.totalHidden / metrics.totalComments) * 100) 
                                    : 0}% del totale
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-xs text-muted-foreground">Commenti Problematici</div>
                                <div className="text-xl font-semibold">{metrics.totalFlagged}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {metrics.totalComments > 0 
                                    ? Math.round((metrics.totalFlagged / metrics.totalComments) * 100) 
                                    : 0}% del totale
                                </div>
                              </div>
                            </div>
                            
                            {renderSentimentDistribution()}
                          </CardContent>
                        </Card>
                      </div>
                      
                      {/* Dati aggiuntivi */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">Post Più Commentato</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {metrics.mostEngagedPost ? (
                              <div className="text-sm">
                                "{metrics.mostEngagedPost.length > 100 
                                  ? metrics.mostEngagedPost.substring(0, 100) + '...' 
                                  : metrics.mostEngagedPost}"
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground">
                                Nessun dato disponibile
                              </div>
                            )}
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">Sommario Commenti</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="py-1">Totale commenti</TableCell>
                                  <TableCell className="py-1 text-right">{metrics.totalComments}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="py-1">Commenti positivi</TableCell>
                                  <TableCell className="py-1 text-right">{metrics.positiveComments}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="py-1">Commenti neutrali</TableCell>
                                  <TableCell className="py-1 text-right">{metrics.neutralComments}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="py-1">Commenti negativi</TableCell>
                                  <TableCell className="py-1 text-right">{metrics.negativeComments}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Workflows Tab */}
            <TabsContent value="workflows">
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle>Flussi di Lavoro Automatici</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          onClick={runAllWorkflows}
                          size="sm"
                          disabled={isExecutingWorkflows}
                        >
                          {isExecutingWorkflows ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Esecuzione...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2" /> Esegui tutti
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => {
                            setEditingWorkflow({
                              id: '',
                              name: 'Nuovo workflow',
                              active: true,
                              condition: {
                                type: 'contains',
                                value: '',
                              },
                              action: {
                                type: 'hide',
                              },
                              createdAt: '',
                              runCount: 0
                            });
                            setShowWorkflowDialog(true);
                          }}
                          variant="outline"
                          size="sm"
                        >
                          <SmilePlus className="h-4 w-4 mr-2" /> Nuovo workflow
                        </Button>
                      </div>
                    </div>
                    <CardDescription>
                      Configura azioni automatiche da eseguire sui commenti in base a condizioni specifiche
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="border rounded-md">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[80px]">Stato</TableHead>
                              <TableHead>Nome</TableHead>
                              <TableHead>Condizione</TableHead>
                              <TableHead>Azione</TableHead>
                              <TableHead className="text-right">Esecuzioni</TableHead>
                              <TableHead className="w-[150px]">Azioni</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {workflows.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                                  Nessun workflow configurato
                                </TableCell>
                              </TableRow>
                            ) : (
                              workflows.map(workflow => (
                                <TableRow key={workflow.id}>
                                  <TableCell>
                                    <Switch
                                      checked={workflow.active}
                                      onCheckedChange={() => toggleWorkflowActive(workflow.id)}
                                    />
                                  </TableCell>
                                  <TableCell className="font-medium">{workflow.name}</TableCell>
                                  <TableCell>
                                    {workflow.condition.type === 'contains' && (
                                      <span>Il commento contiene: <strong>{workflow.condition.value}</strong></span>
                                    )}
                                    {workflow.condition.type === 'not_contains' && (
                                      <span>Il commento non contiene: <strong>{workflow.condition.value}</strong></span>
                                    )}
                                    {workflow.condition.type === 'user' && (
                                      <span>Commento dell'utente: <strong>{workflow.condition.value}</strong></span>
                                    )}
                                    {workflow.condition.type === 'sentiment' && (
                                      <span>Sentiment <strong>{workflow.condition.value === 'positive' ? 'positivo' : workflow.condition.value === 'negative' ? 'negativo' : 'neutro'}</strong></span>
                                    )}
                                    {workflow.condition.type === 'has_links' && (
                                      <span>Contiene link</span>
                                    )}
                                    {workflow.condition.type === 'has_profanity' && (
                                      <span>Contiene volgarità</span>
                                    )}
                                    {workflow.condition.type === 'is_spam' && (
                                      <span>Rilevato come spam</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {workflow.action.type === 'hide' && (
                                      <Badge variant="outline">Nascondi commento</Badge>
                                    )}
                                    {workflow.action.type === 'delete' && (
                                      <Badge variant="destructive">Elimina commento</Badge>
                                    )}
                                    {workflow.action.type === 'notify' && (
                                      <Badge variant="outline" className="bg-blue-50 text-blue-700">Notifica</Badge>
                                    )}
                                    {workflow.action.type === 'like' && (
                                      <Badge variant="outline" className="bg-green-50 text-green-700">Metti mi piace</Badge>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {workflow.runCount} 
                                    {workflow.lastRun && (
                                      <div className="text-xs text-muted-foreground">
                                        Ultima: {format(parseISO(workflow.lastRun), "dd/MM HH:mm")}
                                      </div>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setEditingWorkflow(workflow);
                                          setShowWorkflowDialog(true);
                                        }}
                                      >
                                        <Pencil className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deleteWorkflow(workflow.id)}
                                      >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Log Esecuzioni</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Data</TableHead>
                                <TableHead>Workflow</TableHead>
                                <TableHead>Azione</TableHead>
                                <TableHead>Commento</TableHead>
                                <TableHead className="text-right">Stato</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {workflowExecutions.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                                    Nessuna esecuzione registrata
                                  </TableCell>
                                </TableRow>
                              ) : (
                                workflowExecutions.slice(0, 10).map(execution => (
                                  <TableRow key={execution.id}>
                                    <TableCell className="text-xs">
                                      {format(parseISO(execution.executedAt), "dd/MM/yyyy HH:mm:ss")}
                                    </TableCell>
                                    <TableCell>{execution.ruleName}</TableCell>
                                    <TableCell>
                                      {execution.action === 'hide' && (
                                        <Badge variant="outline">Nascondi</Badge>
                                      )}
                                      {execution.action === 'delete' && (
                                        <Badge variant="destructive">Elimina</Badge>
                                      )}
                                      {execution.action === 'notify' && (
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700">Notifica</Badge>
                                      )}
                                      {execution.action === 'like' && (
                                        <Badge variant="outline" className="bg-green-50 text-green-700">Mi piace</Badge>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      <div className="text-xs truncate max-w-[300px]">
                                        {execution.commentPreview}
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {execution.success ? (
                                        <Badge variant="outline" className="bg-green-50 text-green-700">Successo</Badge>
                                      ) : (
                                        <Badge variant="outline" className="bg-red-50 text-red-700">Fallito</Badge>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Dialog modifica workflow */}
          <Dialog open={showWorkflowDialog} onOpenChange={setShowWorkflowDialog}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingWorkflow?.id ? "Modifica workflow" : "Nuovo workflow"}
                </DialogTitle>
                <DialogDescription>
                  Configura le condizioni e le azioni automatiche per il workflow.
                </DialogDescription>
              </DialogHeader>
              
              {editingWorkflow && (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="workflow-name">Nome del workflow</Label>
                    <Input
                      id="workflow-name"
                      value={editingWorkflow.name}
                      onChange={(e) => setEditingWorkflow({ ...editingWorkflow, name: e.target.value })}
                      placeholder="Nome descrittivo..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="workflow-condition">Condizione</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Select
                        value={editingWorkflow.condition.type}
                        onValueChange={(value) => setEditingWorkflow({
                          ...editingWorkflow,
                          condition: {
                            ...editingWorkflow.condition,
                            type: value as WorkflowRule['condition']['type']
                          }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="contains">Contiene testo</SelectItem>
                          <SelectItem value="not_contains">Non contiene testo</SelectItem>
                          <SelectItem value="user">Utente specifico</SelectItem>
                          <SelectItem value="sentiment">Sentiment</SelectItem>
                          <SelectItem value="has_links">Contiene link</SelectItem>
                          <SelectItem value="has_profanity">Contiene volgarità</SelectItem>
                          <SelectItem value="is_spam">È spam</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {/* Mostra il campo valore solo per le condizioni che lo richiedono */}
                      {(editingWorkflow.condition.type === 'contains' || 
                        editingWorkflow.condition.type === 'not_contains' || 
                        editingWorkflow.condition.type === 'user') && (
                        <Input
                          value={editingWorkflow.condition.value}
                          onChange={(e) => setEditingWorkflow({
                            ...editingWorkflow,
                            condition: {
                              ...editingWorkflow.condition,
                              value: e.target.value
                            }
                          })}
                          placeholder="Valore..."
                        />
                      )}
                      
                      {editingWorkflow.condition.type === 'sentiment' && (
                        <Select
                          value={editingWorkflow.condition.value}
                          onValueChange={(value) => setEditingWorkflow({
                            ...editingWorkflow,
                            condition: {
                              ...editingWorkflow.condition,
                              value
                            }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="positive">Positivo</SelectItem>
                            <SelectItem value="neutral">Neutro</SelectItem>
                            <SelectItem value="negative">Negativo</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="workflow-action">Azione</Label>
                    <Select
                      value={editingWorkflow.action.type}
                      onValueChange={(value) => setEditingWorkflow({
                        ...editingWorkflow,
                        action: {
                          ...editingWorkflow.action,
                          type: value as WorkflowRule['action']['type']
                        }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hide">Nascondi commento</SelectItem>
                        <SelectItem value="delete">Elimina commento</SelectItem>
                        <SelectItem value="notify">Invia notifica</SelectItem>
                        <SelectItem value="like">Metti mi piace</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-4">
                    <Switch
                      id="workflow-active"
                      checked={editingWorkflow.active}
                      onCheckedChange={(checked) => setEditingWorkflow({
                        ...editingWorkflow,
                        active: checked
                      })}
                    />
                    <Label htmlFor="workflow-active">Workflow attivo</Label>
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowWorkflowDialog(false)}>
                  Annulla
                </Button>
                <Button onClick={() => saveWorkflow(editingWorkflow!)}>
                  Salva workflow
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
};

export default FacebookData;