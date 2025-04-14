import React, { useState, useEffect } from 'react';
import Header from "@/components/dashboard/Header";
import Footer from "@/components/dashboard/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { 
  EyeOff, Eye, Trash2, RefreshCw, SmilePlus, Smile, Frown, Meh, Code, 
  Check, ChevronDown, ChevronUp, CheckSquare, ChevronRight, ChevronLeft
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  
  // Mappa di token specifici per pagina
  const pageTokens: Record<string, string> = {
    "121428567930871": "EAARrf6dn8hIBO0ncV0G3zZCy6Pk1bBXZCot0KhDFVcHvba6OguZANMYlJp3ozq7h5nTAF2o2h1H3lyftV7fc0Cy2NmvmBJowmXrVPU627ykxqz7aGxbyVZBq7fUimHdWOddcLCZAQ1kzSMSEEQMqHS3wDZBU4FqmCqLpls7C5TFB55tqMZBXey0PhtThrkN1mqCQthAJSyjshd2GqIZD", // Te la do io Firenze
    "111619452357834": "EAARrf6dn8hIBO0ncV0G3zZCy6Pk1bBXZCot0KhDFVcHvba6OguZANMYlJp3ozq7h5nTAF2o2h1H3lyftV7fc0Cy2NmvmBJowmXrVPU627ykxqz7aGxbyVZBq7fUimHdWOddcLCZAQ1kzSMSEEQMqHS3wDZBU4FqmCqLpls7C5TFB55tqMZBXey0PhtThrkN1mqCQthAJSyjshd2GqIZD"  // Metro - The Game (aggiornato con token funzionante)
  };
  
  // Informazioni statiche delle pagine
  const pageInfo: Record<string, {name: string, logo: string, color: string}> = {
    "121428567930871": {
      name: "Te la do io Firenze",
      logo: "https://scontent-fco2-1.xx.fbcdn.net/v/t39.30808-1/360090864_602948561987424_808889609597729734_n.jpg?stp=c183.183.714.714a_dst-jpg_s200x200_tt6",
      color: "blue"
    },
    "111619452357834": {
      name: "Metro - The Game",
      logo: "https://scontent-fco2-1.xx.fbcdn.net/v/t39.30808-1/352802013_210008308648923_7954954456104324277_n.jpg?stp=dst-jpg_s200x200_tt6",
      color: "green"
    }
  };
  
  // Cache dei dati delle pagine
  const [pagesCache, setPagesCache] = useState<Record<string, FacebookPage>>({});
  
  // Token corrente basato sulla pagina selezionata
  const [currentToken, setCurrentToken] = useState<string>(pageTokens[currentPageId] || "");
  const { toast } = useToast();
  
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
    // Utilizzo token specifico per la pagina se non viene fornito un token
    const effectiveToken = accessToken || pageTokens[pageId] || currentToken;
    
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
              comment.sentiment = analyzeSentiment(comment.message || '');
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
          allComments.push({
            comment,
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 p-6 bg-gray-50">
        <div className="container mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Moderazione Facebook</h1>
            <div className="flex items-center gap-3">
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
          
          {loading ? (
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center h-[300px] text-center">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mb-4" />
                <p className="text-muted-foreground">
                  Caricamento dati da Facebook...
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Informazioni sulla pagina */}
              {pageData && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      {pageData.picture?.data.url && (
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={pageData.picture.data.url} alt={pageData.name || 'Pagina Facebook'} />
                          <AvatarFallback>{pageData.name?.charAt(0) || 'FB'}</AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-xl">{pageData.name}</CardTitle>
                        <CardDescription>{pageData.bio || pageData.about || pageData.description}</CardDescription>
                        {pageData.category && (
                          <Badge variant="outline" className="mt-1">{pageData.category}</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white p-3 rounded border">
                        <div className="text-sm text-muted-foreground">ID Pagina</div>
                        <div className="font-medium">{pageData.id}</div>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <div className="text-sm text-muted-foreground">Fan</div>
                        <div className="font-medium">{pageData.fan_count?.toLocaleString() || 0}</div>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <div className="text-sm text-muted-foreground">Followers</div>
                        <div className="font-medium">{pageData.followers_count?.toLocaleString() || 0}</div>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <div className="text-sm text-muted-foreground">Commenti</div>
                        <div className="font-medium">{getAllComments().length}</div>
                      </div>
                    </div>
                    
                    {pageData.website && (
                      <div className="mt-4 text-sm">
                        <span className="text-muted-foreground">Website: </span>
                        <a href={pageData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {pageData.website}
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {/* Visualizzatore curl e JSON */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Richiesta Graph API utilizzata</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                    <pre className="whitespace-pre-wrap">{`curl -i -X GET "https://graph.facebook.com/v22.0/${currentPageId}?fields=id,name,about,bio,category,category_list,description,fan_count,followers_count,website,picture.type(large),published_posts.limit(10){id,created_time,updated_time,full_picture,permalink_url,from{id,name,picture},message,message_tags,likes.summary(true),comments.summary(true){id,from{id,name,picture},like_count,is_hidden,created_time,message},reactions.summary(true),shares,is_hidden}&access_token=${currentToken}"`}</pre>
                  </div>
                  
                  {responseObject && (
                    <div className="mt-4">
                      <Button 
                        variant="outline" 
                        className="w-full flex justify-between items-center"
                        onClick={() => setJsonCollapsed(!jsonCollapsed)}
                      >
                        <span className="flex items-center"><Code className="h-4 w-4 mr-2" /> Risposta JSON completa</span>
                        {jsonCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                      </Button>
                      
                      {!jsonCollapsed && (
                        <div className="bg-gray-100 p-3 rounded mt-2 max-h-96 overflow-y-auto">
                          <pre className="text-xs whitespace-pre-wrap">
                            {JSON.stringify(responseObject, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Tabs per contenuti */}
              <Tabs defaultValue="posts" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="posts">Post e Commenti</TabsTrigger>
                  <TabsTrigger value="all-comments">Tutti i Commenti</TabsTrigger>
                </TabsList>
                
                {/* Post and Comments View */}
                <TabsContent value="posts">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Posts List */}
                    <Card className="lg:col-span-1">
                      <CardHeader>
                        <CardTitle>Post della Pagina</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        {pageData?.published_posts?.data.length === 0 ? (
                          <div className="py-10 text-center text-muted-foreground">
                            Nessun post trovato
                          </div>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[120px]">Data</TableHead>
                                <TableHead>Post</TableHead>
                                <TableHead className="text-center w-[60px]">Commenti</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {pageData?.published_posts?.data.map((post) => (
                                <TableRow 
                                  key={post.id}
                                  className={`cursor-pointer hover:bg-gray-50 ${selectedPost?.id === post.id ? 'bg-blue-50' : ''}`}
                                  onClick={() => handlePostClick(post)}
                                >
                                  <TableCell className="whitespace-nowrap">{formatDate(post.created_time)}</TableCell>
                                  <TableCell className="max-w-[200px] truncate">
                                    {post.message || "(Nessun messaggio)"}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {post.comments?.data.length || 0}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </CardContent>
                    </Card>
                    
                    {/* Selected Post Comments */}
                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          {selectedPost && selectedPost.full_picture && (
                            <div className="flex-shrink-0">
                              <img 
                                src={selectedPost.full_picture} 
                                alt="Post thumbnail" 
                                className="h-16 w-16 object-cover rounded-md" 
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <CardTitle>
                              {selectedPost ? (
                                <>Commenti del Post</>
                              ) : (
                                <>Seleziona un post</>
                              )}
                            </CardTitle>
                            {selectedPost && (
                              <CardDescription className="mt-1">
                                {formatDate(selectedPost.created_time)} - {selectedPost.message}
                              </CardDescription>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        {!selectedPost ? (
                          <div className="py-10 text-center text-muted-foreground">
                            Seleziona un post dalla lista per visualizzare i commenti
                          </div>
                        ) : !selectedPost.comments?.data.length ? (
                          <div className="py-10 text-center text-muted-foreground">
                            Nessun commento per questo post
                          </div>
                        ) : (
                          <>
                            {/* Barra selezione multipla */}
                            <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id="selectAllComments"
                                  checked={bulkSelected}
                                  onCheckedChange={(checked) => {
                                    setBulkSelected(!!checked);
                                    if (checked && selectedPost.comments?.data) {
                                      const allIds = new Set(selectedPost.comments.data.map(c => c.id));
                                      setSelectedComments(allIds);
                                    } else {
                                      setSelectedComments(new Set());
                                    }
                                  }}
                                />
                                <label htmlFor="selectAllComments" className="text-sm cursor-pointer select-none">
                                  Seleziona tutti ({selectedPost.comments?.data.length || 0} commenti)
                                </label>
                              </div>
                              
                              {selectedComments.size > 0 && (
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBulkAction('hide')}
                                    title="Nascondi selezionati"
                                    className="h-8"
                                  >
                                    <EyeOff className="h-4 w-4 mr-1" /> Nascondi ({selectedComments.size})
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBulkAction('show')}
                                    title="Mostra selezionati"
                                    className="h-8"
                                  >
                                    <Eye className="h-4 w-4 mr-1" /> Mostra ({selectedComments.size})
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBulkAction('delete')}
                                    title="Elimina selezionati"
                                    className="h-8 text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" /> Elimina ({selectedComments.size})
                                  </Button>
                                </div>
                              )}
                            </div>
                            
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-[40px]">
                                    <span className="sr-only">Selezione</span>
                                  </TableHead>
                                  <TableHead className="w-[100px]">Data</TableHead>
                                  <TableHead className="w-[130px]">Utente</TableHead>
                                  <TableHead>Commento</TableHead>
                                  <TableHead className="w-[60px]">Sentiment</TableHead>
                                  <TableHead className="w-[100px]">Azioni</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {selectedPost.comments?.data.map((comment) => (
                                  <TableRow key={comment.id}>
                                    <TableCell>
                                      <Checkbox
                                        checked={selectedComments.has(comment.id)}
                                        onCheckedChange={() => toggleCommentSelection(comment.id)}
                                        aria-label="Seleziona commento"
                                      />
                                    </TableCell>
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
                                    <TableCell className={comment.is_hidden ? "text-muted-foreground italic" : ""}>
                                      {comment.is_hidden ? "[Commento nascosto]" : comment.message}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {getSentimentIcon(comment.sentiment)}
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex space-x-2">
                                        <Button
                                          variant="outline"
                                          size="icon"
                                          onClick={() => handleHideComment(comment)}
                                          title={comment.is_hidden ? "Mostra commento" : "Nascondi commento"}
                                        >
                                          {comment.is_hidden ? (
                                            <Eye className="h-4 w-4" />
                                          ) : (
                                            <EyeOff className="h-4 w-4" />
                                          )}
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="icon"
                                          onClick={() => handleDeleteComment(comment)}
                                          title="Elimina commento"
                                        >
                                          <Trash2 className="h-4 w-4 text-red-600" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                {/* All Comments View */}
                <TabsContent value="all-comments">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>Tutti i Commenti</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      {getAllComments().length === 0 ? (
                        <div className="py-10 text-center text-muted-foreground">
                          Nessun commento trovato
                        </div>
                      ) : (
                        <>
                          {/* Barra selezione multipla */}
                          <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id="selectAllCommentsGlobal"
                                checked={bulkSelected}
                                onCheckedChange={(checked) => {
                                  setBulkSelected(!!checked);
                                  if (checked) {
                                    const allIds = new Set(getAllComments().map(c => c.comment.id));
                                    setSelectedComments(allIds);
                                  } else {
                                    setSelectedComments(new Set());
                                  }
                                }}
                              />
                              <label htmlFor="selectAllCommentsGlobal" className="text-sm cursor-pointer select-none">
                                Seleziona tutti ({getAllComments().length} commenti)
                              </label>
                            </div>
                            
                            {selectedComments.size > 0 && (
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleBulkAction('hide')}
                                  title="Nascondi selezionati"
                                  className="h-8"
                                >
                                  <EyeOff className="h-4 w-4 mr-1" /> Nascondi ({selectedComments.size})
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleBulkAction('show')}
                                  title="Mostra selezionati"
                                  className="h-8"
                                >
                                  <Eye className="h-4 w-4 mr-1" /> Mostra ({selectedComments.size})
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleBulkAction('delete')}
                                  title="Elimina selezionati"
                                  className="h-8 text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" /> Elimina ({selectedComments.size})
                                </Button>
                              </div>
                            )}
                          </div>
                        
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
                                <TableHead className="w-[60px]">Sentiment</TableHead>
                                <TableHead className="w-[100px]">Azioni</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {getAllComments().map(({ comment, postId, postMessage }) => (
                                <TableRow key={comment.id}>
                                  <TableCell>
                                    <Checkbox
                                      checked={selectedComments.has(comment.id)}
                                      onCheckedChange={() => toggleCommentSelection(comment.id)}
                                      aria-label="Seleziona commento"
                                    />
                                  </TableCell>
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
                                  <TableCell className="text-center">
                                    {getSentimentIcon(comment.sentiment)}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex space-x-2">
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleHideComment(comment)}
                                        title={comment.is_hidden ? "Mostra commento" : "Nascondi commento"}
                                      >
                                        {comment.is_hidden ? (
                                          <Eye className="h-4 w-4" />
                                        ) : (
                                          <EyeOff className="h-4 w-4" />
                                        )}
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleDeleteComment(comment)}
                                        title="Elimina commento"
                                      >
                                        <Trash2 className="h-4 w-4 text-red-600" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FacebookData;