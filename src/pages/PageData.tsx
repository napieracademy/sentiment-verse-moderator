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

  // Funzione per caricare i dati dell'API
  const fetchPageData = async () => {
    setLoading(true);
    try {
      const pageId = "121428567930871";
      // In una vera app, utilizzerebbe un token d'accesso salvato
      const accessToken = "YOUR_ACCESS_TOKEN"; // In produzione questo verrebbe recuperato in modo sicuro
      
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
        description: "Impossibile recuperare i dati. Utilizza i dati di esempio.",
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
    // Dati di esempio per dimostrare l'interfaccia
    const exampleData: FacebookPage = {
      id: "121428567930871",
      bio: "Pagina di esempio per SentimentVerse",
      published_posts: {
        data: [
          {
            id: "post123",
            created_time: "2025-04-14T10:30:00+0000",
            message: "Questo è un post di esempio per mostrare i dati nella tabella",
            full_picture: "https://via.placeholder.com/150",
            from: {
              name: "SentimentVerse",
              id: "121428567930871"
            },
            likes: {
              data: Array(15).fill(0).map((_, i) => ({
                name: `Utente ${i+1}`,
                id: `user${i+1}`
              }))
            },
            comments: {
              data: [
                {
                  id: "comment1",
                  message: "Ottimo post!",
                  from: {
                    name: "Mario Rossi",
                    id: "user123"
                  },
                  created_time: "2025-04-14T11:00:00+0000",
                  like_count: 3
                },
                {
                  id: "comment2",
                  message: "Mi piace molto questo contenuto",
                  from: {
                    name: "Giulia Bianchi",
                    id: "user456"
                  },
                  created_time: "2025-04-14T11:15:00+0000",
                  like_count: 1
                }
              ]
            }
          },
          {
            id: "post456",
            created_time: "2025-04-13T14:20:00+0000",
            message: "Un altro post di esempio con commenti e like",
            from: {
              name: "SentimentVerse",
              id: "121428567930871"
            },
            likes: {
              data: Array(8).fill(0).map((_, i) => ({
                name: `Follower ${i+1}`,
                id: `follower${i+1}`
              }))
            },
            comments: {
              data: [
                {
                  id: "comment3",
                  message: "Interessante!",
                  from: {
                    name: "Luca Verdi",
                    id: "user789"
                  },
                  created_time: "2025-04-13T15:00:00+0000",
                  like_count: 2
                }
              ]
            }
          }
        ]
      }
    };
    
    setPageData(exampleData);
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