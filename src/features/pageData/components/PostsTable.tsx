
import { useState } from "react";
import { 
  Table, TableHeader, TableBody, TableHead, 
  TableRow, TableCell, TableCaption 
} from "@/components/ui/table";
import { 
  Card, CardHeader, CardTitle, CardContent, CardDescription 
} from "@/components/ui/card";
import { 
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, 
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronDown,
  MessageSquare,
  ThumbsUp,
  Image,
  Calendar,
  User,
  Eye
} from "lucide-react";
import { format } from "date-fns";
import { FacebookPageWithPosts, FacebookPost } from "../types";
import { useToast } from "@/hooks/use-toast";
import { LoadingState } from "./LoadingState";

interface PostsTableProps {
  pageId?: string;
  accessToken?: string;
}

export const PostsTable = ({ pageId, accessToken }: PostsTableProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [pageData, setPageData] = useState<FacebookPageWithPosts | null>(null);
  const [selectedPost, setSelectedPost] = useState<FacebookPost | null>(null);
  const { toast } = useToast();

  const fetchPagePosts = async () => {
    if (!pageId || !accessToken) {
      toast({
        title: "Errore",
        description: "ID pagina o token di accesso mancante",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://graph.facebook.com/v22.0/${pageId}?fields=bio,published_posts{created_time,full_picture,from,message,message_tags,likes{name,pic_small,pic_large,username,link},comments{from,user_likes,like_count,is_private,is_hidden,created_time,message,likes}}&access_token=${accessToken}`
      );

      if (!response.ok) {
        throw new Error("Errore nel recupero dei dati dalla pagina Facebook");
      }

      const data: FacebookPageWithPosts = await response.json();
      setPageData(data);
      
      toast({
        title: "Successo",
        description: "Dati della pagina recuperati con successo",
      });
    } catch (error) {
      console.error("Errore durante il recupero dei dati:", error);
      toast({
        title: "Errore",
        description: "Impossibile recuperare i dati della pagina",
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

  const getCommentsCount = (post: FacebookPost) => {
    return post.comments?.data?.length || 0;
  };

  const getLikesCount = (post: FacebookPost) => {
    return post.likes?.data?.length || 0;
  };

  const handlePostClick = (post: FacebookPost) => {
    setSelectedPost(post);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Post della Pagina</CardTitle>
              <CardDescription>
                Visualizza tutti i post pubblicati sulla pagina
              </CardDescription>
            </div>
            <Button onClick={fetchPagePosts} disabled={loading}>
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Caricamento...
                </>
              ) : "Carica Post"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingState />
          ) : pageData?.published_posts?.data && pageData.published_posts.data.length > 0 ? (
            <div>
              <Table>
                <TableCaption>Lista dei post pubblicati sulla pagina</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Data</TableHead>
                    <TableHead>Contenuto</TableHead>
                    <TableHead>Immagine</TableHead>
                    <TableHead className="text-center">Like</TableHead>
                    <TableHead className="text-center">Commenti</TableHead>
                    <TableHead className="w-[100px]">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageData.published_posts.data.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          {formatDate(post.created_time)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="line-clamp-2">
                          {post.message || <span className="text-gray-400">Nessun messaggio</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        {post.full_picture ? (
                          <div className="h-10 w-10 rounded overflow-hidden">
                            <img 
                              src={post.full_picture} 
                              alt="Post thumbnail" 
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100">
                            <Image className="h-3 w-3 mr-1" /> Nessuna
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">
                          <ThumbsUp className="h-3 w-3 mr-1" /> 
                          {getLikesCount(post)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">
                          <MessageSquare className="h-3 w-3 mr-1" /> 
                          {getCommentsCount(post)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handlePostClick(post)}
                            >
                              <Eye className="h-3 w-3 mr-1" /> Dettagli
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[80vh]">
                            <DialogHeader>
                              <DialogTitle>Dettagli Post</DialogTitle>
                            </DialogHeader>
                            <ScrollArea className="h-[60vh]">
                              <div className="space-y-6 p-2">
                                <div>
                                  <h3 className="text-lg font-medium">Informazioni</h3>
                                  <div className="grid grid-cols-2 gap-4 mt-2">
                                    <div>
                                      <p className="text-sm text-gray-500">ID Post</p>
                                      <p className="text-sm">{selectedPost?.id}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">Data pubblicazione</p>
                                      <p className="text-sm">{selectedPost?.created_time && formatDate(selectedPost.created_time)}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">Autore</p>
                                      <p className="text-sm">{selectedPost?.from?.name || "N/A"}</p>
                                    </div>
                                  </div>
                                </div>

                                {selectedPost?.message && (
                                  <div>
                                    <h3 className="text-lg font-medium">Messaggio</h3>
                                    <div className="mt-2 p-3 bg-gray-50 rounded-md">
                                      {selectedPost.message}
                                    </div>
                                  </div>
                                )}

                                {selectedPost?.full_picture && (
                                  <div>
                                    <h3 className="text-lg font-medium">Immagine</h3>
                                    <div className="mt-2">
                                      <img 
                                        src={selectedPost.full_picture} 
                                        alt="Post image" 
                                        className="max-h-80 rounded-md object-contain"
                                      />
                                    </div>
                                  </div>
                                )}

                                <div>
                                  <h3 className="text-lg font-medium">
                                    Like ({selectedPost?.likes?.data?.length || 0})
                                  </h3>
                                  {selectedPost?.likes?.data && selectedPost.likes.data.length > 0 ? (
                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                      {selectedPost.likes.data.map(like => (
                                        <div key={like.id} className="flex items-center p-2 bg-gray-50 rounded-md">
                                          <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                            {like.pic_small ? (
                                              <img 
                                                src={like.pic_small} 
                                                alt={like.name} 
                                                className="h-full w-full object-cover"
                                              />
                                            ) : (
                                              <User className="h-4 w-4 text-gray-500" />
                                            )}
                                          </div>
                                          <div className="ml-2">
                                            <p className="text-sm font-medium">{like.name}</p>
                                            {like.username && <p className="text-xs text-gray-500">@{like.username}</p>}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="mt-2 text-sm text-gray-500">Nessun like per questo post</p>
                                  )}
                                </div>

                                <div>
                                  <h3 className="text-lg font-medium">
                                    Commenti ({selectedPost?.comments?.data?.length || 0})
                                  </h3>
                                  {selectedPost?.comments?.data && selectedPost.comments.data.length > 0 ? (
                                    <div className="mt-2 space-y-3">
                                      {selectedPost.comments.data.map(comment => (
                                        <Card key={comment.id} className="overflow-hidden">
                                          <CardHeader className="p-3 pb-0">
                                            <div className="flex justify-between">
                                              <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                  <User className="h-4 w-4 text-gray-500" />
                                                </div>
                                                <div className="ml-2">
                                                  <p className="text-sm font-medium">{comment.from?.name || "Utente anonimo"}</p>
                                                  <p className="text-xs text-gray-500">{formatDate(comment.created_time)}</p>
                                                </div>
                                              </div>
                                              <div className="flex space-x-2">
                                                {comment.is_hidden && (
                                                  <Badge variant="outline" className="text-xs">Nascosto</Badge>
                                                )}
                                                <Badge variant="outline" className="bg-gray-100 text-xs">
                                                  <ThumbsUp className="h-3 w-3 mr-1" /> 
                                                  {comment.like_count || 0}
                                                </Badge>
                                              </div>
                                            </div>
                                          </CardHeader>
                                          <CardContent className="p-3 pt-2">
                                            <p className="text-sm">{comment.message || "Nessun messaggio"}</p>
                                          </CardContent>
                                        </Card>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="mt-2 text-sm text-gray-500">Nessun commento per questo post</p>
                                  )}
                                </div>
                              </div>
                            </ScrollArea>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : pageData ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nessun post trovato per questa pagina</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Clicca su "Carica Post" per visualizzare i post della pagina</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
