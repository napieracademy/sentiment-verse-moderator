
import React, { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const DeleteUserData: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");

  useEffect(() => {
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user_id');
    const confirmCode = urlParams.get('confirm_code');
    
    if (!userId || !confirmCode) {
      setStatus("error");
      toast({
        title: "Errore",
        description: "Parametri mancanti. Impossibile elaborare la richiesta di eliminazione.",
        variant: "destructive",
      });
      return;
    }

    const deleteUserData = async () => {
      try {
        // Elimina i dati dell'utente dal localStorage
        localStorage.removeItem('fbUserData');
        localStorage.removeItem('fbAuthTimestamp');
        
        // Log dell'operazione
        console.log(`Eliminazione dati per l'utente Facebook ID: ${userId}`);
        console.log(`Codice di conferma: ${confirmCode}`);
        
        // In questa versione non memorizziamo dati degli utenti su Supabase
        // quindi non c'è bisogno di eliminare dati dal database
        
        setStatus("success");
        toast({
          title: "Eliminazione completata",
          description: "I tuoi dati sono stati eliminati con successo.",
        });
      } catch (error) {
        console.error("Errore durante l'eliminazione dei dati:", error);
        setStatus("error");
        toast({
          title: "Errore",
          description: "Si è verificato un errore durante l'eliminazione dei dati.",
          variant: "destructive",
        });
      }
    };
    
    // Esegui l'eliminazione dei dati
    deleteUserData();
  }, [toast]);

  const handleNavigateHome = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Eliminazione Dati Utente</h1>
        
        {status === "processing" && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-center">Elaborazione della richiesta di eliminazione dati...</p>
          </div>
        )}
        
        {status === "success" && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div className="text-center">
              <h2 className="text-lg font-medium">Dati eliminati con successo</h2>
              <p className="text-gray-500 mt-1">
                Tutti i tuoi dati personali sono stati rimossi dai nostri sistemi.
              </p>
            </div>
            <Button onClick={handleNavigateHome} className="mt-4">
              Torna alla Home
            </Button>
          </div>
        )}
        
        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <div className="text-center">
              <h2 className="text-lg font-medium">Si è verificato un errore</h2>
              <p className="text-gray-500 mt-1">
                Non è stato possibile elaborare la richiesta di eliminazione.
              </p>
            </div>
            <Button onClick={handleNavigateHome} className="mt-4">
              Torna alla Home
            </Button>
          </div>
        )}
        
        <div className="mt-8 text-xs text-gray-500">
          <p className="text-center">
            In conformità con il Regolamento Generale sulla Protezione dei Dati (GDPR) e con le 
            politiche di Facebook sulla cancellazione dei dati, SentimentVerse ti permette di 
            richiedere l'eliminazione di tutti i tuoi dati personali dai nostri sistemi.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserData;
