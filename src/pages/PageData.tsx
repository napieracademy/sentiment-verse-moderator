import React from 'react';
import Header from "@/components/dashboard/Header";
import Footer from "@/components/dashboard/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
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
      const pageId = "121428567930871";
      const accessToken = "EAARrf6dn8hIBOx7iZChFonJ7VsJySgd2JrW2bCt9B9eng4XxtUSckRCKE1kZBiiLY5ALcyfZCRt7f2lhB6kcsXgaRyWZANkcXzTMZBPM7ayEO7n6eqsfYSkrAcuctk9bPFZBlvZCa1KU2pqGEBpEsSZCIZAP8M0yLP6rqdysv3mDGYTsSCUZCPSW8H741iVylORYXvVmIzKm8ftbRJtaI0xuGbMfSnhn8CWAslsyGL12wZD";
      
      const response = await fetch(
        `https://graph.facebook.com/v22.0/${pageId}?fields=bio,published_posts.limit(10){created_time,full_picture,from,message,message_tags,likes{name,pic_small,pic_large,username,link},comments{from,user_likes,like_count,is_private,is_hidden,created_time,message,likes},can_reply_privately,is_hidden}&access_token=${accessToken}`
      );

      if (!response.ok) {
        throw new Error("Errore nel recupero dei dati Facebook");
      }

      const data = await response.json();
      setPageData(data);
      
      toast({
        title: "Successo",
        description: "Dati recuperati con successo",
      });
    } catch (error) {
      console.error("Errore durante il recupero dei dati:", error);
      toast({
        title: "Errore",
        description: "Impossibile recuperare i dati. Carico dati di esempio.",
        variant: "destructive"
      });
      
      // Carica dati di esempio in caso di errore
      loadExampleData();
    } finally {
      setLoading(false);
    }
  };

  // Funzione per caricare dati di esempio
  const loadExampleData = () => {
    // Dati di esempio per dimostrare l'interfaccia (simulazione risposta Facebook SDK Android)
    const exampleData: FacebookPage = {
      id: "121428567930871",
      bio: "Pagina ufficiale dell'app SentimentVerse - Strumento di analisi del sentiment per contenuti social",
      published_posts: {
        data: [
          {
            id: "121428567930871_10159123456789012",
            created_time: "2025-04-10T15:23:40+0000",
            full_picture: "https://via.placeholder.com/1200x630?text=Facebook+API+Demo",
            from: {
              name: "SentimentVerse App",
              id: "121428567930871"
            },
            message: "Ecco i risultati dell'ultima analisi del sentiment sui principali brand tech. Scarica il report completo dal nostro sito!",
            likes: {
              data: Array(78).fill(0).map((_, i) => ({
                name: `User ${i+100}`,
                id: `1000${i}`,
                username: i % 3 === 0 ? `user${i}` : undefined,
                link: `https://facebook.com/profile/${1000+i}`
              }))
            },
            comments: {
              data: [
                {
                  id: "121428567930871_10159123456789012_comment1",
                  from: {
                    name: "Maria Bianchi",
                    id: "2001"
                  },
                  user_likes: false,
                  like_count: 12,
                  is_private: false,
                  is_hidden: false,
                  created_time: "2025-04-10T15:45:12+0000",
                  message: "Ho trovato molto interessante la sezione sulla correlazione tra sentiment e ROI. Avete altri dati su questo?"
                },
                {
                  id: "121428567930871_10159123456789012_comment2",
                  from: {
                    name: "Carlo Rossi",
                    id: "2002"
                  },
                  user_likes: true,
                  like_count: 5,
                  is_private: false,
                  is_hidden: false,
                  created_time: "2025-04-10T16:13:27+0000",
                  message: "Ottimo lavoro! Utilizzo SentimentVerse quotidianamente per la mia azienda."
                }
              ]
            },
            is_hidden: false,
            can_reply_privately: true
          },
          {
            id: "121428567930871_10159123456789013",
            created_time: "2025-04-08T09:15:22+0000",
            full_picture: "https://via.placeholder.com/1200x630?text=Sentiment+Analysis+Webinar",
            from: {
              name: "SentimentVerse App",
              id: "121428567930871"
            },
            message: "Webinar gratuito: 'Come migliorare l'engagement utilizzando l'analisi del sentiment'. Iscriviti ora, posti limitati!",
            likes: {
              data: Array(145).fill(0).map((_, i) => ({
                name: `User ${i+200}`,
                id: `2000${i}`
              }))
            },
            comments: {
              data: [
                {
                  id: "121428567930871_10159123456789013_comment1",
                  from: {
                    name: "Francesca Verdi",
                    id: "3001"
                  },
                  user_likes: false,
                  like_count: 8,
                  is_private: false,
                  is_hidden: false,
                  created_time: "2025-04-08T09:30:45+0000",
                  message: "A che ora inizia il webinar? Non riesco a trovare l'informazione sulla pagina di registrazione."
                },
                {
                  id: "121428567930871_10159123456789013_comment2",
                  from: {
                    name: "SentimentVerse App",
                    id: "121428567930871"
                  },
                  user_likes: false,
                  like_count: 3,
                  is_private: false,
                  is_hidden: false,
                  created_time: "2025-04-08T09:45:12+0000",
                  message: "Il webinar inizierà alle 15:00 CEST. Grazie per il tuo interesse!"
                },
                {
                  id: "121428567930871_10159123456789013_comment3",
                  from: {
                    name: "Marco Neri",
                    id: "3003"
                  },
                  user_likes: true,
                  like_count: 2,
                  is_private: false,
                  is_hidden: false,
                  created_time: "2025-04-08T10:12:33+0000",
                  message: "Ho partecipato all'ultimo webinar ed è stato molto utile. Consiglio a tutti di iscriversi!"
                }
              ]
            },
            is_hidden: false,
            can_reply_privately: true
          }
        ]
      }
    };
    
    setPageData(exampleData);
  };

  // Carica i dati automaticamente all'avvio
  useEffect(() => {
    fetchPageData();
  }, []);

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
              {loading ? "Caricamento..." : "Aggiorna Dati"}
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Parametri richiesta Graph API</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
{`GraphRequest request = GraphRequest.newGraphPathRequest(
  accessToken,
  "/121428567930871",
  new GraphRequest.Callback() {
    @Override
    public void onCompleted(GraphResponse response) {
      // Insert your code here
    }
});

Bundle parameters = new Bundle();
parameters.putString("fields", "bio,published_posts.limit(10){created_time,full_picture,from,message,message_tags,likes{name,pic_small,pic_large,username,link},comments{from,user_likes,like_count,is_private,is_hidden,created_time,likes},can_reply_privately,is_hidden}");
request.setParameters(parameters);
request.executeAsync();`}
              </pre>
            </CardContent>
          </Card>
          
          {!pageData ? (
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center h-[300px] text-center">
                <p className="text-muted-foreground mb-4">
                  Caricamento dati da Graph API...
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