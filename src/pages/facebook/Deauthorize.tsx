import React, { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";

const Deauthorize: React.FC = () => {
  const { toast } = useToast();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [confirmationCode, setConfirmationCode] = useState<string>("");

  useEffect(() => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const signedRequest = urlParams.get('signed_request');
    
    if (!signedRequest) {
      setStatus("error");
      toast({
        title: "Errore",
        description: "Richiesta non valida. Manca il parametro signed_request.",
        variant: "destructive",
      });
      return;
    }

    const processDeauthorization = async () => {
      try {
        // Use Supabase Edge function to process the deauthorization
        const response = await fetch('https://prjxycapfsjjvxdzgkmp.supabase.co/functions/v1/facebook-deauthorize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ signed_request: signedRequest }),
        });

        if (!response.ok) {
          throw new Error(`Errore nella richiesta: ${response.status}`);
        }

        const data = await response.json();
        setConfirmationCode(data.confirmation_code);
        
        // Elimina i dati dell'utente dal localStorage
        localStorage.removeItem('fbUserData');
        localStorage.removeItem('fbAuthTimestamp');
        
        setStatus("success");
        toast({
          title: "Deautorizzazione completata",
          description: "L'app Facebook è stata rimossa e i tuoi dati sono stati cancellati.",
        });
      } catch (error) {
        console.error("Errore durante l'elaborazione della deautorizzazione:", error);
        setStatus("error");
        toast({
          title: "Errore",
          description: "Si è verificato un errore durante l'elaborazione della richiesta.",
          variant: "destructive",
        });
      }
    };
    
    processDeauthorization();
  }, [toast]);

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-6">Deautorizzazione App Facebook</h1>
          
          {status === "processing" && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-center">Elaborazione della richiesta di deautorizzazione...</p>
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
                <h2 className="text-lg font-medium">Deautorizzazione completata</h2>
                <p className="text-gray-500 mt-1">
                  L'app è stata rimossa e i tuoi dati sono stati cancellati dai nostri sistemi.
                </p>
                {confirmationCode && (
                  <p className="text-sm mt-4 p-2 bg-gray-100 rounded">
                    Codice di conferma: <span className="font-mono">{confirmationCode}</span>
                  </p>
                )}
              </div>
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
                  Non è stato possibile elaborare la richiesta di deautorizzazione.
                </p>
                <p className="text-sm mt-4">
                  Puoi contattarci all'indirizzo{" "}
                  <a href="mailto:privacy@sentimentverse.com" className="text-blue-500 hover:underline">
                    privacy@sentimentverse.com
                  </a>{" "}
                  per l'assistenza.
                </p>
              </div>
            </div>
          )}
          
          <div className="mt-8 text-xs text-gray-500">
            <p className="text-center">
              In conformità con le politiche di Facebook sulla privacy e sulla cancellazione dei dati, 
              abbiamo elaborato la tua richiesta di deautorizzazione dell'app e rimosso i tuoi dati dai nostri sistemi.
            </p>
          </div>
        </div>
    </div>
  );
};

export default Deauthorize;