
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, ThumbsUp } from "lucide-react";
import { Comment, Rating } from "../types";
import { RatingCard } from "../components/RatingCard";

interface RatingsViewProps {
  comments: Comment[];
  loading: boolean;
  onToggleHidden: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  onRefresh: () => void;
}

export const RatingsView = ({ 
  comments, 
  loading, 
  onToggleHidden,
  onDelete,
  onRefresh 
}: RatingsViewProps) => {
  // Filter to create ratings from positive and negative comments
  const ratings: Rating[] = comments
    .filter(comment => comment.sentiment !== "neutral")
    .map(comment => ({
      ...comment,
      rating: comment.sentiment === "positive" ? Math.floor(Math.random() * 2) + 4 : Math.floor(Math.random() * 2) + 1
    }));
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-4">Caricamento delle valutazioni in corso...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {ratings.length === 0 ? (
        <div className="text-center py-10 border rounded-md">
          <ThumbsUp className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2">Nessuna valutazione trovata</p>
          <Button onClick={onRefresh} className="mt-4" variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Aggiorna
          </Button>
        </div>
      ) : (
        <>
          {ratings.map(rating => (
            <RatingCard
              key={rating.id}
              rating={rating}
              onToggleHidden={onToggleHidden}
              onDelete={onDelete}
            />
          ))}
          
          <div className="flex justify-center">
            <Button onClick={onRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Aggiorna valutazioni
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
