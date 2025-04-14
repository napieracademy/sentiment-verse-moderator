
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { fetchFacebookPages } from "@/utils/facebookToken";
import { toast } from "@/hooks/use-toast";
import { FacebookPage } from "../types";

export const useFacebookPages = () => {
  const navigate = useNavigate();
  const [pages, setPages] = useState<FacebookPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<FacebookPage | null>(null);

  useEffect(() => {
    // Check if user is authenticated with Supabase
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Autenticazione richiesta",
        description: "Devi accedere con Facebook per visualizzare le tue pagine.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    setLoading(true);
    
    // Usiamo la funzione di utilità per recuperare le pagine Facebook
    const { pages, error } = await fetchFacebookPages();
    
    if (error) {
      setLoading(false);
      return;
    }
    
    if (pages.length > 0) {
      setPages(pages);
      setSelectedPage(pages[0]);
      
      // Salva il token di accesso della pagina per usarlo nelle chiamate successive
      if (pages[0].access_token) {
        localStorage.setItem('pageAccessToken', pages[0].access_token);
      }
    }
    
    setLoading(false);
  };

  const handleSelectPage = (page: FacebookPage) => {
    setSelectedPage(page);
    
    // Salva il token di accesso della pagina selezionata
    if (page.access_token) {
      localStorage.setItem('pageAccessToken', page.access_token);
    }
  };

  return {
    pages,
    loading,
    selectedPage,
    setSelectedPage: handleSelectPage
  };
};
