import React, { useState, useEffect } from 'react';
import Header from "@/components/dashboard/Header";
import Footer from "@/components/dashboard/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
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

const FacebookData = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [pageData, setPageData] = useState<FacebookPage | null>(null);
  const [selectedPost, setSelectedPost] = useState<FacebookPost | null>(null);
  const [responseObject, setResponseObject] = useState<any>(null);
  const { toast } = useToast();

  // Funzione per caricare i dati dall'API usando il curl fornito
  const fetchPageData = async () => {
    setLoading(true);
    try {
      const pageId = "121428567930871";
      const accessToken = "EAARrf6dn8hIBO4zrhcuxBgz8dHWfMasFULWaZAPINE6ZASia9dlFu2o4RuFHiae0SCqnG0yZB5j7hZAfYloXRRjuvVPIZAbTJ6e2kzHgwYTKoOteEaYUAl7909uOckBOGeEkxRdcWqcqz9yXd2gS0KOwauEmkxd5hbQR7GmG8InxVIIkzUuR9WplcMrwAzhm5PgTZAnX7DorZAItbQZD";
      
      console.log("Avvio richiesta API con token:", accessToken.substring(0, 10) + "...");
      
      // Questa è la richiesta esatta corrispondente al curl fornito
      const response = await fetch(
        `https://graph.facebook.com/v22.0/121428567930871?fields=bio,published_posts.limit(10){created_time,full_picture,from,message,message_tags,likes{name,pic_small,pic_large,username,link},comments{from,user_likes,like_count,is_private,is_hidden,created_time,message,likes},can_reply_privately,is_hidden}&access_token=${accessToken}`
      );

      if (!response.ok) {
        throw new Error("Errore nel recupero dei dati Facebook");
      }

      const data = await response.json();
      console.log("Risposta completa API:", data);
      
      if (data.error) {
        throw new Error(`Errore Facebook API: ${data.error.message}`);
      }
      
      setPageData(data);
      setResponseObject(data);
      
      toast({
        title: "Successo",
        description: "Dati recuperati con successo dalla Graph API",
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

  useEffect(() => {
    // Carica i dati all'avvio del componente
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
            <h1 className="text-3xl font-bold">Facebook Graph API Demo</h1>
            <Button onClick={fetchPageData} disabled={loading}>
              {loading ? "Caricamento..." : "Aggiorna Dati"}
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Richiesta curl utilizzata</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
{`curl -i -X GET \\
 "https://graph.facebook.com/v22.0/121428567930871?fields=bio%2Cpublished_posts.limit(10)%7Bcreated_time%2Cfull_picture%2Cfrom%2Cmessage%2Cmessage_tags%2Clikes%7Bname%2Cpic_small%2Cpic_large%2Cusername%2Clink%7D%2Ccomments%7Bfrom%2Cuser_likes%2Clike_count%2Cis_private%2Cis_hidden%2Ccreated_time%2Cmessage%2Clikes%7D%2Ccan_reply_privately%2Cis_hidden%7D&access_token=EAARrf6dn8hIBO4zrhcuxBgz8dHWfMasFULWaZAPINE6ZASia9dlFu2o4RuFHiae0SCqnG0yZB5j7hZAfYloXRRjuvVPIZAbTJ6e2kzHgwYTKoOteEaYUAl7909uOckBOGeEkxRdcWqcqz9yXd2gS0KOwauEmkxd5hbQR7GmG8InxVIIkzUuR9WplcMrwAzhm5PgTZAnX7DorZAItbQZD"`}
              </pre>
            </CardContent>
          </Card>
          
          {loading ? (
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center h-[300px] text-center">
                <p className="text-muted-foreground mb-4">
                  Caricamento dati da Graph API...
                </p>
              </CardContent>
            </Card>
          ) : !pageData ? (
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center h-[300px] text-center">
                <p className="text-muted-foreground mb-4">
                  Nessun dato disponibile. Clicca su "Aggiorna Dati" per effettuare la richiesta.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Risposta JSON completa */}
              <Card>
                <CardHeader>
                  <CardTitle>Risposta completa API</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
                    <pre className="text-xs whitespace-pre-wrap">
                      {JSON.stringify(responseObject, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>

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

export default FacebookData;