
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

const FacebookCallback: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get the hash from the URL
    const hash = window.location.hash;
    
    if (hash) {
      // The hash contains the access token from Supabase OAuth
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          toast({
            title: "Autenticazione riuscita",
            description: "Accesso con Facebook completato con successo.",
          });
          
          // Redirect to page data
          navigate('/page-data');
        } else {
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
