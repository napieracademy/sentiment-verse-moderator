
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare, RefreshCw } from "lucide-react";
import { Comment, Post } from "../types";
import { PostCard } from "../components/PostCard";

interface CommentsViewProps {
  posts: Post[];
  commentsByPost: Record<string, Comment[]>;
  loading: boolean;
  expandedPosts: Record<string, boolean>;
  onToggleExpand: (postId: string) => void;
  onToggleHidden: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  onRefresh: () => void;
}

export const CommentsView = ({
  posts,
  commentsByPost,
  loading,
  expandedPosts,
  onToggleExpand,
  onToggleHidden,
  onDelete,
  onRefresh
}: CommentsViewProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-4">Caricamento dei commenti in corso...</p>
        </div>
      </div>
    );
  }
  
  if (posts.length === 0) {
    return (
      <div className="text-center py-10 border rounded-md">
        <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-2">Nessun post trovato per questa pagina</p>
        <Button onClick={onRefresh} className="mt-4" variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Aggiorna
        </Button>
      </div>
    );
  }

  if (Object.keys(commentsByPost).length === 0) {
    return (
      <div className="text-center py-10 border rounded-md">
        <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-2">Nessun commento trovato</p>
        <Button onClick={onRefresh} className="mt-4" variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Aggiorna
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map(post => {
        const postComments = commentsByPost[post.id] || [];
        if (postComments.length === 0) return null;

        return (
          <PostCard 
            key={post.id}
            post={post}
            comments={postComments}
            isExpanded={expandedPosts[post.id]}
            onToggleExpand={onToggleExpand}
            onToggleHidden={onToggleHidden}
            onDelete={onDelete}
          />
        );
      })}
      
      <div className="flex justify-center">
        <Button onClick={onRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Aggiorna commenti
        </Button>
      </div>
    </div>
  );
};
