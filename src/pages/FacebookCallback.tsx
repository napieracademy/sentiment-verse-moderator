
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

const FacebookCallback: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Parse the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code && state) {
      // Validate state to prevent CSRF attacks
      const storedState = localStorage.getItem('fb_oauth_state');
      
      if (storedState !== state) {
        toast({
          title: "Errore di autenticazione",
          description: "La richiesta non è valida. Riprova.",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      // Clear the stored state
      localStorage.removeItem('fb_oauth_state');

      // Show success toast
      toast({
        title: "Autenticazione riuscita",
        description: "Accesso con Facebook completato con successo.",
        variant: "default"
      });

      // Redirect to page data page instead of selection
      navigate('/page-data');
    } else {
      // Handle error case
      toast({
        title: "Errore di autenticazione",
        description: "Nessun codice di autorizzazione ricevuto.",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [navigate, toast]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <p className="text-lg">Elaborazione dell'autenticazione...</p>
      </div>
    </div>
  );
};

export default FacebookCallback;
