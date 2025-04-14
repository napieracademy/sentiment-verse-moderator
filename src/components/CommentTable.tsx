
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Eye, EyeOff, ThumbsDown, ThumbsUp, 
  MessageSquare, Tag, Filter
} from "lucide-react";

// Import custom components
import { useFacebookData } from "./comments/hooks/useFacebookData";
import { CommentsView } from "./comments/views/CommentsView";
import { MentionsView } from "./comments/views/MentionsView";
import { RatingsView } from "./comments/views/RatingsView";
import { Sentiment } from "./comments/types";

// Global FB type declaration has been moved to useFacebookData.ts

const CommentTable = () => {
  const [filter, setFilter] = useState<Sentiment | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [contentType, setContentType] = useState<"comments" | "mentions" | "ratings">("comments");
  
  const {
    comments,
    posts,
    mentions,
    loading,
    expandedPosts,
    handleToggleHidden,
    handleDelete,
    togglePostExpansion,
    handleRefresh
  } = useFacebookData();

  // Filter comments based on search term and sentiment filter
  const filteredComments = comments.filter((comment) => {
    const matchesSentiment = filter === "all" || comment.sentiment === filter;
    const matchesSearch = comment.content
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSentiment && matchesSearch;
  });

  // Group comments by post
  const commentsByPost = filteredComments.reduce((acc, comment) => {
    if (!acc[comment.postId]) {
      acc[comment.postId] = [];
    }
    acc[comment.postId].push(comment);
    return acc;
  }, {} as Record<string, typeof filteredComments>);

  const getContentIcon = () => {
    switch (contentType) {
      case "comments":
        return <MessageSquare className="h-4 w-4 mr-2" />;
      case "mentions":
        return <Tag className="h-4 w-4 mr-2" />;
      case "ratings":
        return <ThumbsUp className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  const getContentTypeTitle = () => {
    switch (contentType) {
      case "comments":
        return "Commenti della Pagina";
      case "mentions":
        return "Menzioni della Pagina";
      case "ratings":
        return "Valutazioni della Pagina";
      default:
        return "Contenuti della Pagina";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {getContentIcon()}
            <CardTitle className="text-lg">{getContentTypeTitle()}</CardTitle>
          </div>
          <div className="flex space-x-2">
            <div className="w-64">
              <Input
                placeholder="Cerca nei contenuti..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <Select
              value={filter}
              onValueChange={(value) => setFilter(value as Sentiment | "all")}
            >
              <SelectTrigger className="w-36 h-8 text-sm">
                <SelectValue placeholder="Tutti i commenti" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Tutti i contenuti</SelectItem>
                  <SelectItem value="positive">Positivi</SelectItem>
                  <SelectItem value="neutral">Neutri</SelectItem>
                  <SelectItem value="negative">Negativi</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="comments" 
          className="w-full mb-4" 
          onValueChange={(v) => setContentType(v as "comments" | "mentions" | "ratings")}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="comments" className="flex items-center justify-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Commenti
            </TabsTrigger>
            <TabsTrigger value="mentions" className="flex items-center justify-center">
              <Tag className="h-4 w-4 mr-2" />
              Menzioni
            </TabsTrigger>
            <TabsTrigger value="ratings" className="flex items-center justify-center">
              <ThumbsUp className="h-4 w-4 mr-2" />
              Valutazioni
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="comments">
            <CommentsView 
              posts={posts}
              commentsByPost={commentsByPost}
              loading={loading}
              expandedPosts={expandedPosts}
              onToggleExpand={togglePostExpansion}
              onToggleHidden={handleToggleHidden}
              onDelete={handleDelete}
              onRefresh={handleRefresh}
            />
          </TabsContent>
          
          <TabsContent value="mentions">
            <MentionsView 
              mentions={mentions}
              loading={loading}
              onRefresh={handleRefresh}
            />
          </TabsContent>
          
          <TabsContent value="ratings">
            <RatingsView 
              comments={filteredComments}
              loading={loading}
              onToggleHidden={handleToggleHidden}
              onDelete={handleDelete}
              onRefresh={handleRefresh}
            />
          </TabsContent>
        </Tabs>
        
        <div className="text-xs text-muted-foreground mt-4">
          <p className="italic">
            Questa funzionalità utilizza l'autorizzazione pages_read_user_content, che permette di leggere contenuti 
            generati dagli utenti sulla Pagina (post, commenti e valutazioni) e di eliminare i commenti degli utenti. 
            Permette inoltre di leggere i post in cui è taggata la Pagina per la gestione completa dei contenuti.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentTable;
