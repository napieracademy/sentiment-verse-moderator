
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Tag, ThumbsDown, ThumbsUp } from "lucide-react";
import { Mention } from "../types";
import { MentionCard } from "../components/MentionCard";

interface MentionsViewProps {
  mentions: Mention[];
  loading: boolean;
  onRefresh: () => void;
}

export const MentionsView = ({ mentions, loading, onRefresh }: MentionsViewProps) => {
  const getSentimentIcon = (sentiment: Mention['sentiment']) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="h-4 w-4 text-positive" />;
      case "negative":
        return <ThumbsDown className="h-4 w-4 text-negative" />;
      default:
        return null;
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-4">Caricamento delle menzioni in corso...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {mentions.length === 0 ? (
        <div className="text-center py-10 border rounded-md">
          <Tag className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2">Nessuna menzione trovata</p>
          <Button onClick={onRefresh} className="mt-4" variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Aggiorna
          </Button>
        </div>
      ) : (
        <>
          {mentions.map(mention => (
            <MentionCard 
              key={mention.id}
              mention={mention}
              getSentimentIcon={getSentimentIcon}
            />
          ))}
          
          <div className="flex justify-center">
            <Button onClick={onRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Aggiorna menzioni
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
