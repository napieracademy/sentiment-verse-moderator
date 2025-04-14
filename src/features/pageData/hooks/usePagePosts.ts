
import { useState } from "react";
import { format } from "date-fns";
import { FacebookPageWithPosts, FacebookPost } from "../types";
import { useToast } from "@/hooks/use-toast";

export const usePagePosts = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [pageData, setPageData] = useState<FacebookPageWithPosts | null>(null);
  const [selectedPost, setSelectedPost] = useState<FacebookPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();

  const fetchPagePosts = async (pageId?: string, accessToken?: string) => {
    if (!pageId || !accessToken) {
      toast({
        title: "Errore",
        description: "ID pagina o token di accesso mancante",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://graph.facebook.com/v22.0/${pageId}?fields=bio,published_posts{created_time,full_picture,from,message,message_tags,likes{name,pic_small,pic_large,username,link},comments{from,user_likes,like_count,is_private,is_hidden,created_time,message,likes}}&access_token=${accessToken}`
      );

      if (!response.ok) {
        throw new Error("Errore nel recupero dei dati dalla pagina Facebook");
      }

      const data: FacebookPageWithPosts = await response.json();
      setPageData(data);
      
      toast({
        title: "Successo",
        description: "Dati della pagina recuperati con successo",
      });
    } catch (error) {
      console.error("Errore durante il recupero dei dati:", error);
      toast({
        title: "Errore",
        description: "Impossibile recuperare i dati della pagina",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm");
    } catch (e) {
      return dateString;
    }
  };

  const handlePostClick = (post: FacebookPost) => {
    setSelectedPost(post);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return {
    loading,
    pageData,
    selectedPost,
    isDialogOpen,
    fetchPagePosts,
    formatDate,
    handlePostClick,
    handleCloseDialog
  };
};
