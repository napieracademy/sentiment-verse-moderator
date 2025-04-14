
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Book, Eye, EyeOff, Store, ThumbsUp, Trash2, User } from "lucide-react";
import { Rating } from "../types";

interface RatingCardProps {
  rating: Rating;
  onToggleHidden: (id: string) => void;
  onDelete: (id: string) => void;
}

export const RatingCard = ({ rating, onToggleHidden, onDelete }: RatingCardProps) => {
  return (
    <Card key={rating.id} className="border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between">
          <div className="flex items-center space-x-2">
            <img
              src={rating.authorProfilePic}
              alt={rating.authorName}
              className="h-10 w-10 rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(rating.authorName)}`;
              }}
            />
            <div>
              <div className="font-medium flex items-center">
                {rating.authorName}
                {rating.isPage ? (
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
                {format(new Date(rating.timestamp), "dd/MM/yyyy HH:mm")}
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="mx-0.5">
                  {i < rating.rating ? (
                    <ThumbsUp 
                      className={`h-4 w-4 ${rating.rating >= 4 ? "text-positive" : "text-negative"}`} 
                      fill={rating.rating >= 4 ? "currentColor" : "currentColor"} 
                    />
                  ) : (
                    <ThumbsUp className="h-4 w-4 text-gray-300" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="flex gap-2 items-center mb-2">
            <Book className="h-4 w-4 text-facebook" />
            <h4 className="font-medium text-sm">Recensione:</h4>
          </div>
          
          <p className="text-sm border-l-4 border-gray-200 pl-3">
            {rating.content}
          </p>
          
          <div className="flex justify-end mt-2 space-x-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-gray-50 hover:bg-gray-100"
              onClick={() => onToggleHidden(rating.id)}
              title={rating.hidden ? "Mostra recensione" : "Nascondi recensione"}
            >
              {rating.hidden ? (
                <Eye className="h-4 w-4 text-blue-600" />
              ) : (
                <EyeOff className="h-4 w-4 text-gray-600" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-gray-50 hover:bg-red-50"
              onClick={() => onDelete(rating.id)}
              title="Elimina recensione"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
