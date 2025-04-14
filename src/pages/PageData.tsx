import React from 'react';
import Header from "@/components/dashboard/Header";
import Footer from "@/components/dashboard/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { format } from "date-fns";

// Definizione dei tipi
interface FacebookPage {
  id: string;
  bio?: string;
  published_posts?: {
    data: FacebookPost[];
  };
}

interface FacebookPost {
  id: string;
  created_time: string;
  full_picture?: string;
  from?: {
    name: string;
    id: string;
  };
  message?: string;
  message_tags?: any[];
  likes?: {
    data: {
      name: string;
      pic_small?: string;
      pic_large?: string;
      username?: string;
      link?: string;
      id: string;
    }[];
  };
  comments?: {
    data: FacebookComment[];
  };
  can_reply_privately?: boolean;
  is_hidden?: boolean;
}

interface FacebookComment {
  id: string;
  from?: {
    name: string;
    id: string;
  };
  user_likes?: boolean;
  like_count?: number;
  is_private?: boolean;
  is_hidden?: boolean;
  created_time: string;
  message?: string;
  likes?: {
    data: any[];
  };
}

const PageData = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [pageData, setPageData] = useState<FacebookPage | null>(null);
  const [selectedPost, setSelectedPost] = useState<FacebookPost | null>(null);
  const { toast } = useToast();

  // Funzione per caricare i dati dall'API
  const fetchPageData = async () => {
    setLoading(true);
    try {
      // I dati sono presi direttamente dal CURL fornito come esempio
      // In una vera app, si farebbe una chiamata API reale con token di accesso
      
      // Simula la risposta ricevuta dal server Facebook per l'ID 121428567930871
      const data: FacebookPage = {
        id: "121428567930871",
        bio: "Pagina Facebook ufficiale del progetto SentimentVerse",
        published_posts: {
          data: [
            {
              id: "post_1",
              created_time: "2025-04-12T08:30:00+0000",
              message: "Nuovo aggiornamento disponibile! Abbiamo migliorato l'analisi del sentiment e aggiunto nuove funzionalità.",
              full_picture: "https://via.placeholder.com/500x300?text=Nuovo+Aggiornamento",
              from: {
                name: "SentimentVerse",
                id: "121428567930871"
              },
              likes: {
                data: Array(42).fill(0).map((_, i) => ({
                  name: `Fan ${i+1}`,
                  id: `fan_${i+1}`,
                  username: `fan${i+1}`,
                  link: `https://facebook.com/fan${i+1}`
                }))
              },
              comments: {
                data: [
                  {
                    id: "comment_1_1",
                    message: "Fantastico! Non vedo l'ora di provare le nuove funzionalità.",
                    from: {
                      name: "Marco Bianchi",
                      id: "user_1001"
                    },
                    created_time: "2025-04-12T08:45:00+0000",
                    like_count: 8,
                    is_hidden: false
                  },
                  {
                    id: "comment_1_2",
                    message: "La vostra app è fantastica, la uso tutti i giorni per il mio business!",
                    from: {
                      name: "Giulia Rossi",
                      id: "user_1002"
                    },
                    created_time: "2025-04-12T09:15:00+0000",
                    like_count: 5,
                    is_hidden: false
                  },
                  {
                    id: "comment_1_3",
                    message: "Quando sarà disponibile anche per altre piattaforme?",
                    from: {
                      name: "Paolo Verdi",
                      id: "user_1003"
                    },
                    created_time: "2025-04-12T10:20:00+0000",
                    like_count: 2,
                    is_hidden: false
                  }
                ]
              },
              is_hidden: false,
              can_reply_privately: true
            },
            {
              id: "post_2",
              created_time: "2025-04-10T14:15:00+0000",
              message: "Siamo felici di annunciare che abbiamo raggiunto 10.000 utenti attivi! Grazie a tutti per il supporto. 🎉",
              full_picture: "https://via.placeholder.com/500x300?text=10000+Utenti",
              from: {
                name: "SentimentVerse",
                id: "121428567930871"
              },
              likes: {
                data: Array(87).fill(0).map((_, i) => ({
                  name: `Supporter ${i+1}`,
                  id: `supporter_${i+1}`
                }))
              },
              comments: {
                data: [
                  {
                    id: "comment_2_1",
                    message: "Congratulazioni! Un traguardo importante.",
                    from: {
                      name: "Sara Neri",
                      id: "user_2001"
                    },
                    created_time: "2025-04-10T14:30:00+0000",
                    like_count: 12,
                    is_hidden: false
                  },
                  {
                    id: "comment_2_2",
                    message: "Meritato successo per un'app eccellente!",
                    from: {
                      name: "Luca Gialli",
                      id: "user_2002"
                    },
                    created_time: "2025-04-10T15:05:00+0000",
                    like_count: 8,
                    is_hidden: false
                  }
                ]
              },
              is_hidden: false,
              can_reply_privately: true
            },
            {
              id: "post_3",
              created_time: "2025-04-08T11:00:00+0000",
              message: "Tutorial: Come utilizzare l'analisi del sentiment per migliorare l'engagement sui social media",
              full_picture: "https://via.placeholder.com/500x300?text=Tutorial+Sentiment",
              from: {
                name: "SentimentVerse",
                id: "121428567930871"
              },
              likes: {
                data: Array(63).fill(0).map((_, i) => ({
                  name: `Learner ${i+1}`,
                  id: `learner_${i+1}`
                }))
              },
              comments: {
                data: [
                  {
                    id: "comment_3_1",
                    message: "Grazie per questo tutorial! Mi ha aiutato molto.",
                    from: {
                      name: "Antonio Blu",
                      id: "user_3001"
                    },
                    created_time: "2025-04-08T11:45:00+0000",
                    like_count: 5,
                    is_hidden: false
                  },
                  {
                    id: "comment_3_2",
                    message: "Potreste fare un tutorial anche su come interpretare i dati storici?",
                    from: {
                      name: "Francesca Viola",
                      id: "user_3002"
                    },
                    created_time: "2025-04-08T12:30:00+0000",
                    like_count: 3,
                    is_hidden: false
                  },
                  {
                    id: "comment_3_3",
                    message: "Ho provato questa tecnica e ha funzionato alla grande! Il mio engagement è aumentato del 25%.",
                    from: {
                      name: "Michele Arancio",
                      id: "user_3003"
                    },
                    created_time: "2025-04-08T14:15:00+0000",
                    like_count: 7,
                    is_hidden: false
                  },
                  {
                    id: "comment_3_4",
                    message: "Adoro questi contenuti formativi, continuate così!",
                    from: {
                      name: "Elena Rosa",
                      id: "user_3004"
                    },
                    created_time: "2025-04-08T16:20:00+0000",
                    like_count: 4,
                    is_hidden: false
                  }
                ]
              },
              is_hidden: false,
              can_reply_privately: true
            },
            {
              id: "post_4",
              created_time: "2025-04-05T09:30:00+0000",
              message: "Sondaggio: Quale nuova funzionalità vorreste vedere in SentimentVerse? Commentate con le vostre idee!",
              from: {
                name: "SentimentVerse",
                id: "121428567930871"
              },
              likes: {
                data: Array(38).fill(0).map((_, i) => ({
                  name: `Voter ${i+1}`,
                  id: `voter_${i+1}`
                }))
              },
              comments: {
                data: [
                  {
                    id: "comment_4_1",
                    message: "Mi piacerebbe un'integrazione con altre piattaforme social.",
                    from: {
                      name: "Roberto Verde",
                      id: "user_4001"
                    },
                    created_time: "2025-04-05T09:45:00+0000",
                    like_count: 15,
                    is_hidden: false
                  },
                  {
                    id: "comment_4_2",
                    message: "Analisi dei trend settimanali automatizzata con report via email.",
                    from: {
                      name: "Claudia Celeste",
                      id: "user_4002"
                    },
                    created_time: "2025-04-05T10:10:00+0000",
                    like_count: 22,
                    is_hidden: false
                  },
                  {
                    id: "comment_4_3",
                    message: "Vorrei un'app mobile con notifiche in tempo reale.",
                    from: {
                      name: "Davide Marrone",
                      id: "user_4003"
                    },
                    created_time: "2025-04-05T11:05:00+0000",
                    like_count: 18,
                    is_hidden: false
                  },
                  {
                    id: "comment_4_4",
                    message: "Segmentazione dell'analisi per demografica e geolocalizzazione.",
                    from: {
                      name: "Laura Argento",
                      id: "user_4004"
                    },
                    created_time: "2025-04-05T12:30:00+0000",
                    like_count: 11,
                    is_hidden: false
                  },
                  {
                    id: "comment_4_5",
                    message: "Dashboard personalizzabile con i KPI che scelgo io.",
                    from: {
                      name: "Simone Rame",
                      id: "user_4005"
                    },
                    created_time: "2025-04-05T14:15:00+0000",
                    like_count: 9,
                    is_hidden: false
                  }
                ]
              },
              is_hidden: false,
              can_reply_privately: true
            },
            {
              id: "post_5",
              created_time: "2025-04-02T16:45:00+0000",
              message: "Case study: Come un'azienda ha migliorato la soddisfazione dei clienti del 40% usando SentimentVerse",
              full_picture: "https://via.placeholder.com/500x300?text=Case+Study",
              from: {
                name: "SentimentVerse",
                id: "121428567930871"
              },
              likes: {
                data: Array(74).fill(0).map((_, i) => ({
                  name: `Business ${i+1}`,
                  id: `business_${i+1}`
                }))
              },
              comments: {
                data: [
                  {
                    id: "comment_5_1",
                    message: "Risultati impressionanti! Potete condividere più dettagli sulla metodologia?",
                    from: {
                      name: "Marco Azzurro",
                      id: "user_5001"
                    },
                    created_time: "2025-04-02T17:10:00+0000",
                    like_count: 6,
                    is_hidden: false
                  },
                  {
                    id: "comment_5_2",
                    message: "Ho ottenuto risultati simili con la mia azienda. Grande strumento!",
                    from: {
                      name: "Valeria Indaco",
                      id: "user_5002"
                    },
                    created_time: "2025-04-02T18:30:00+0000",
                    like_count: 8,
                    is_hidden: false
                  },
                  {
                    id: "comment_5_3",
                    message: "Potete fare un case study anche per piccole imprese?",
                    from: {
                      name: "Giovanni Bianco",
                      id: "user_5003"
                    },
                    created_time: "2025-04-02T19:45:00+0000",
                    like_count: 12,
                    is_hidden: false
                  }
                ]
              },
              is_hidden: false,
              can_reply_privately: true
            }
          ]
        }
      };
      
      setPageData(data);
      
      toast({
        title: "Successo",
        description: "Dati recuperati con successo",
      });
    } catch (error) {
      console.error("Errore durante il recupero dei dati:", error);
      toast({
        title: "Errore",
        description: "Impossibile recuperare i dati",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm");
    } catch (e) {
      return dateString;
    }
  };

  const handlePostClick = (post: FacebookPost) => {
    setSelectedPost(post);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 p-6 bg-gray-50">
        <div className="container mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Dati Facebook</h1>
            <Button onClick={fetchPageData} disabled={loading}>
              {loading ? "Caricamento..." : "Carica Dati"}
            </Button>
          </div>
          
          {!pageData ? (
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center h-[400px] text-center">
                <p className="text-muted-foreground mb-4">
                  Clicca su "Carica Dati" per visualizzare i dati della pagina Facebook
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Informazioni della pagina */}
              <Card>
                <CardHeader>
                  <CardTitle>Informazioni Pagina</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Proprietà</TableHead>
                        <TableHead>Valore</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">ID</TableCell>
                        <TableCell>{pageData.id}</TableCell>
                      </TableRow>
                      {pageData.bio && (
                        <TableRow>
                          <TableCell className="font-medium">Bio</TableCell>
                          <TableCell>{pageData.bio}</TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell className="font-medium">Numero Post</TableCell>
                        <TableCell>{pageData.published_posts?.data.length || 0}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Totale Interazioni</TableCell>
                        <TableCell>
                          {pageData.published_posts?.data.reduce((sum, post) => {
                            const likes = post.likes?.data.length || 0;
                            const comments = post.comments?.data.length || 0;
                            return sum + likes + comments;
                          }, 0) || 0}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Tabs per contenuti della pagina */}
              <Tabs defaultValue="posts" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="posts">Post</TabsTrigger>
                  <TabsTrigger value="comments">Commenti</TabsTrigger>
                </TabsList>
                
                {/* Tabella dei Post */}
                <TabsContent value="posts">
                  <Card>
                    <CardHeader>
                      <CardTitle>Post della Pagina</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[180px]">Data</TableHead>
                            <TableHead>Messaggio</TableHead>
                            <TableHead className="text-center">Like</TableHead>
                            <TableHead className="text-center">Commenti</TableHead>
                            <TableHead className="text-center">Nascosto</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pageData.published_posts?.data.map((post) => (
                            <TableRow 
                              key={post.id}
                              className="cursor-pointer hover:bg-gray-50"
                              onClick={() => handlePostClick(post)}
                            >
                              <TableCell>{formatDate(post.created_time)}</TableCell>
                              <TableCell className="max-w-[300px] truncate">
                                {post.message || "(Nessun messaggio)"}
                              </TableCell>
                              <TableCell className="text-center">
                                {post.likes?.data.length || 0}
                              </TableCell>
                              <TableCell className="text-center">
                                {post.comments?.data.length || 0}
                              </TableCell>
                              <TableCell className="text-center">
                                {post.is_hidden ? "Sì" : "No"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Tabella dei Commenti */}
                <TabsContent value="comments">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tutti i Commenti</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[180px]">Data</TableHead>
                            <TableHead>Post</TableHead>
                            <TableHead>Utente</TableHead>
                            <TableHead>Commento</TableHead>
                            <TableHead className="text-center">Like</TableHead>
                            <TableHead className="text-center">Nascosto</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pageData.published_posts?.data.flatMap(post => 
                            post.comments?.data.map(comment => (
                              <TableRow key={comment.id}>
                                <TableCell>{formatDate(comment.created_time)}</TableCell>
                                <TableCell className="max-w-[150px] truncate">
                                  {post.message || "(Nessun messaggio)"}
                                </TableCell>
                                <TableCell>
                                  {comment.from?.name || "Utente sconosciuto"}
                                </TableCell>
                                <TableCell className="max-w-[250px] truncate">
                                  {comment.message || "(Nessun messaggio)"}
                                </TableCell>
                                <TableCell className="text-center">
                                  {comment.like_count || 0}
                                </TableCell>
                                <TableCell className="text-center">
                                  {comment.is_hidden ? "Sì" : "No"}
                                </TableCell>
                              </TableRow>
                            )) || []
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              {/* Dettagli del post selezionato */}
              {selectedPost && (
                <Card>
                  <CardHeader>
                    <CardTitle>Dettagli Post</CardTitle>
                    <Button 
                      variant="outline" 
                      className="absolute top-4 right-4"
                      onClick={() => setSelectedPost(null)}
                    >
                      Chiudi
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        {selectedPost.full_picture && (
                          <img 
                            src={selectedPost.full_picture} 
                            alt="Immagine post" 
                            className="w-48 h-48 object-cover rounded-md"
                          />
                        )}
                        <div className="space-y-2">
                          <p className="text-sm text-gray-500">{formatDate(selectedPost.created_time)}</p>
                          <p className="text-lg">{selectedPost.message}</p>
                          <div className="flex gap-4 text-sm text-gray-500">
                            <span>{selectedPost.likes?.data.length || 0} like</span>
                            <span>{selectedPost.comments?.data.length || 0} commenti</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <h3 className="font-semibold mb-2">Commenti</h3>
                        <div className="space-y-3 max-h-80 overflow-y-auto p-2">
                          {selectedPost.comments?.data.map(comment => (
                            <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                              <div className="flex justify-between">
                                <span className="font-medium">{comment.from?.name}</span>
                                <span className="text-xs text-gray-500">{formatDate(comment.created_time)}</span>
                              </div>
                              <p className="mt-1">{comment.message}</p>
                              <div className="mt-2 text-xs text-gray-500">
                                {comment.like_count || 0} like • 
                                {comment.is_hidden ? " Nascosto" : " Visibile"}
                              </div>
                            </div>
                          ))}
                          {!selectedPost.comments?.data.length && (
                            <p className="text-gray-500 text-center py-4">Nessun commento per questo post</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PageData;