
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare, Image, Eye } from "lucide-react";
import { PostItemProps } from "../../types/post";

export const PostItem: React.FC<PostItemProps> = ({ 
  post, 
  formatDate, 
  onViewDetails 
}) => {
  const getCommentsCount = () => {
    return post.comments?.data?.length || 0;
  };

  const getLikesCount = () => {
    return post.likes?.data?.length || 0;
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center">
          <div className="h-4 w-4 mr-2 text-gray-500">📅</div>
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
          {getLikesCount()}
        </Badge>
      </TableCell>
      <TableCell className="text-center">
        <Badge variant="secondary">
          <MessageSquare className="h-3 w-3 mr-1" /> 
          {getCommentsCount()}
        </Badge>
      </TableCell>
      <TableCell>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onViewDetails(post)}
        >
          <Eye className="h-3 w-3 mr-1" /> Dettagli
        </Button>
      </TableCell>
    </TableRow>
  );
};
