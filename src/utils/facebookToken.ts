
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";

// Token fornito dall'utente
const CUSTOM_FACEBOOK_TOKEN = "EAARrf6dn8hIBO3VpaegCmhrCv4f3MVNq70aKE7m1UnYxCFfRZBWV0U7GOdVbkiSFyqn4jo5OUCQFoGQSzmgV7r2bZAqZAct6E9p4pS8tkWSXuUUE8SdoZBeZAGpIG8hLLUsMJ82TrvMEfSTxLIZB7RRKdevqQ9Rac4cahALQ11JkqxNaETAnGLZBH4zXqoDKiXQAxdVzEt1v5eXtja9QD6MMXf4DkePCUICrM9XBeih";

export const fetchFacebookPages = async () => {
  try {
    // Otteniamo il token di accesso da Supabase (se disponibile)
    const { data: { session } } = await supabase.auth.getSession();
    const providerToken = session?.provider_token;
    
    // Chiamata all'edge function con il token personalizzato
    const { data, error } = await supabase.functions.invoke('fetch-facebook-pages', {
      body: { 
        accessToken: providerToken,
        customToken: CUSTOM_FACEBOOK_TOKEN 
      }
    });
    
    if (error) {
      console.error("Errore nella chiamata all'edge function:", error);
      toast({
        title: "Errore",
        description: "Non è stato possibile recuperare le pagine Facebook.",
        variant: "destructive"
      });
      return { pages: [], error };
    }
    
    return { pages: data?.pages || [], error: null };
  } catch (error) {
    console.error("Errore durante il recupero delle pagine:", error);
    toast({
      title: "Errore",
      description: "Si è verificato un errore durante il recupero delle pagine Facebook.",
      variant: "destructive"
    });
    return { pages: [], error };
  }
};
