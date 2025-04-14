
import React from "react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import {
  Card, CardHeader, CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThumbsUp, User } from "lucide-react";
import { PostDetailsDialogProps } from "../../types/post";

export const PostDetailsDialog: React.FC<PostDetailsDialogProps> = ({ 
  post, 
  formatDate,
  isOpen,
  onClose
}) => {
  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
                  <p className="text-sm">{post.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data pubblicazione</p>
                  <p className="text-sm">{formatDate(post.created_time)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Autore</p>
                  <p className="text-sm">{post.from?.name || "N/A"}</p>
                </div>
              </div>
            </div>

            {post.message && (
              <div>
                <h3 className="text-lg font-medium">Messaggio</h3>
                <div className="mt-2 p-3 bg-gray-50 rounded-md">
                  {post.message}
                </div>
              </div>
            )}

            {post.full_picture && (
              <div>
                <h3 className="text-lg font-medium">Immagine</h3>
                <div className="mt-2">
                  <img 
                    src={post.full_picture} 
                    alt="Post image" 
                    className="max-h-80 rounded-md object-contain"
                  />
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-medium">
                Like ({post.likes?.data?.length || 0})
              </h3>
              {post.likes?.data && post.likes.data.length > 0 ? (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {post.likes.data.map(like => (
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
                Commenti ({post.comments?.data?.length || 0})
              </h3>
              {post.comments?.data && post.comments.data.length > 0 ? (
                <div className="mt-2 space-y-3">
                  {post.comments.data.map(comment => (
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
  );
};
