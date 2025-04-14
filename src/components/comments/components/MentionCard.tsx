
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { Store, Tag, User } from "lucide-react";
import { Mention } from "../types";
import { getSentimentColor } from "../utils";

interface MentionCardProps {
  mention: Mention;
  getSentimentIcon: (sentiment: Mention['sentiment']) => JSX.Element | null;
}

export const MentionCard = ({ mention, getSentimentIcon }: MentionCardProps) => {
  return (
    <Card key={mention.id} className="border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between">
          <div className="flex items-center space-x-2">
            <img
              src={mention.authorProfilePic}
              alt={mention.authorName}
              className="h-10 w-10 rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(mention.authorName)}`;
              }}
            />
            <div>
              <div className="font-medium flex items-center">
                {mention.authorName}
                {mention.authorType === "page" ? (
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
                Post ID: {mention.postId} • {format(new Date(mention.timestamp), "dd/MM/yyyy HH:mm")}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-gray-100">
            {getSentimentIcon(mention.sentiment)}
            <span className={`text-xs ${getSentimentColor(mention.sentiment)}`}>
              {mention.sentiment === "positive"
                ? "Positivo"
                : mention.sentiment === "negative"
                ? "Negativo"
                : "Neutro"}
            </span>
          </div>
        </div>
        
        <div className="mt-3 text-sm border p-3 rounded-md bg-gray-50">
          <div className="font-medium mb-1 flex items-center">
            <Tag className="h-3 w-3 mr-1 text-facebook" />
            Menzione in un post esterno
          </div>
          <p>{mention.postContent}</p>
        </div>
      </CardHeader>
    </Card>
  );
};
