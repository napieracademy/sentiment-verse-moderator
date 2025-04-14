
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronUp, Store } from "lucide-react";
import { Post, Comment } from "../types";
import { CommentItem } from "./CommentItem";

interface PostCardProps {
  post: Post;
  comments: Comment[];
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onToggleHidden: (id: string) => void;
  onDelete: (id: string) => void;
}

export const PostCard = ({ 
  post, 
  comments, 
  isExpanded, 
  onToggleExpand, 
  onToggleHidden, 
  onDelete 
}: PostCardProps) => {
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
            onClick={() => onToggleExpand(post.id)}
            className="px-2"
          >
            {isExpanded ? 
              <ChevronUp className="h-4 w-4" /> : 
              <ChevronDown className="h-4 w-4" />
            }
            <span className="ml-1">
              {comments.length} {comments.length === 1 ? "commento" : "commenti"}
            </span>
          </Button>
        </div>
        <div className="mt-2 text-sm border-l-4 border-gray-200 pl-3">
          {post.content}
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          {comments.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-sm">
              Nessun commento per questo post
            </div>
          ) : (
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {comments.map(comment => (
                  <CommentItem 
                    key={comment.id}
                    comment={comment}
                    onToggleHidden={onToggleHidden}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      )}
    </Card>
  );
};
