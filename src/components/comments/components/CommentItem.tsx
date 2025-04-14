
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Trash2, ThumbsUp, ThumbsDown, User, Store } from "lucide-react";
import { Comment } from "../types";
import { getSentimentColor } from "../utils";

interface CommentItemProps {
  comment: Comment;
  onToggleHidden: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CommentItem = ({ comment, onToggleHidden, onDelete }: CommentItemProps) => {
  const getSentimentIcon = (sentiment: Comment['sentiment']) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="h-4 w-4 text-positive" />;
      case "negative":
        return <ThumbsDown className="h-4 w-4 text-negative" />;
      default:
        return null;
    }
  };
  
  return (
    <div 
      className={`p-3 rounded-md ${comment.hidden ? "bg-gray-50" : "bg-white border"}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-2">
          <img
            src={comment.authorProfilePic}
            alt={comment.authorName}
            className="h-8 w-8 rounded-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.authorName)}`;
            }}
          />
          <div>
            <div className="font-medium flex items-center">
              {comment.authorName}
              {comment.isPage ? (
                <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
                  <Store className="h-3 w-3 mr-1" /> Pagina
                </Badge>
              ) : (
                <Badge className="ml-2 bg-gray-100 text-gray-800 hover:bg-gray-200">
                  <User className="h-3 w-3 mr-1" /> Utente
                </Badge>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {format(new Date(comment.timestamp), "dd/MM/yyyy HH:mm")}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-gray-100">
            {getSentimentIcon(comment.sentiment)}
            <span className={`text-xs ${getSentimentColor(comment.sentiment)}`}>
              {comment.sentiment === "positive"
                ? "Positivo"
                : comment.sentiment === "negative"
                ? "Negativo"
                : "Neutro"}
            </span>
          </div>
          
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-gray-50 hover:bg-gray-100"
              onClick={() => onToggleHidden(comment.id)}
              title={comment.hidden ? "Mostra commento" : "Nascondi commento"}
            >
              {comment.hidden ? (
                <Eye className="h-4 w-4 text-blue-600" />
              ) : (
                <EyeOff className="h-4 w-4 text-gray-600" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-gray-50 hover:bg-red-50"
              onClick={() => onDelete(comment.id)}
              title="Elimina commento"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className={`mt-2 ${comment.hidden ? "italic text-muted-foreground" : ""}`}>
        {comment.hidden ? "[Commento nascosto]" : comment.content}
      </div>
    </div>
  );
};
