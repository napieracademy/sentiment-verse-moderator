import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

const FacebookCallback: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Recuperiamo il percorso memorizzato (se esiste)
    const getSavedPath = () => {
      const savedPath = localStorage.getItem('auth_return_path');
      console.log('Saved return path:', savedPath);
      // Rimuoviamo il percorso salvato per evitare problemi futuri
      localStorage.removeItem('auth_return_path');
      // Torniamo al percorso salvato o alla pagina welcome come default
      return savedPath || '/welcome';
    };

    // Rimuoviamo il flag di autenticazione in corso
    const cleanupAuthState = () => {
      console.log('Clearing authentication state');
      sessionStorage.removeItem('authenticating');
    };
    
    // Get the hash from the URL
    const hash = window.location.hash;
    
    console.log('Processing Facebook auth callback, hash present:', !!hash);
    
    if (hash) {
      // The hash contains the access token from Supabase OAuth
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          console.log('Authentication successful, session established');
          cleanupAuthState();
          
          toast({
            title: "Autenticazione riuscita",
            description: "Accesso con Facebook completato con successo.",
          });
          
          // Reindirizza al percorso salvato o alla pagina welcome
          const returnPath = getSavedPath();
          console.log('Redirecting to:', returnPath);
          navigate(returnPath);
        } else {
          console.error('No session found after authentication');
          cleanupAuthState();
          
          toast({
            title: "Errore di autenticazione",
            description: "Sessione non trovata. Riprova.",
            variant: "destructive"
          });
          navigate('/');
        }
      });
    } else {
      // No hash found, something went wrong
      console.error('No hash data in callback URL');
      cleanupAuthState();
      
      toast({
        title: "Errore di autenticazione",
        description: "Nessun dato di autenticazione ricevuto.",
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
