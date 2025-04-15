import React, { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";

const DeletionStatus: React.FC = () => {
  const { toast } = useToast();
  const [status, setStatus] = useState<"pending" | "completed" | "error">("pending");
  const [userId, setUserId] = useState<string>("");
  const [confirmCode, setConfirmCode] = useState<string>("");

  useEffect(() => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const userIdParam = urlParams.get('user_id');
    const confirmCodeParam = urlParams.get('confirm_code');
    
    if (!userIdParam || !confirmCodeParam) {
      setStatus("error");
      toast({
        title: "Errore",
        description: "Parametri mancanti. Impossibile verificare lo stato della cancellazione.",
        variant: "destructive",
      });
      return;
    }

    setUserId(userIdParam);
    setConfirmCode(confirmCodeParam);
    
    // Simula una verifica del processo di cancellazione
    // In un'implementazione reale, dovresti controllare lo stato effettivo nel tuo sistema
    const checkDeletionStatus = async () => {
      try {
        // Qui potresti fare una chiamata API per verificare lo stato effettivo
        // Per questa demo, impostiamo semplicemente completato dopo un breve ritardo
        setTimeout(() => {
          setStatus("completed");
        }, 1500);
      } catch (error) {
        console.error("Errore durante la verifica dello stato di cancellazione:", error);
        setStatus("error");
        toast({
          title: "Errore",
          description: "Si è verificato un errore durante la verifica dello stato di cancellazione.",
          variant: "destructive",
        });
      }
    };
    
    checkDeletionStatus();
  }, [toast]);

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-6">Stato Cancellazione Dati</h1>
          
          {status === "pending" && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-center">Verificando lo stato della cancellazione dati...</p>
              {confirmCode && (
                <p className="text-sm mt-4 p-2 bg-gray-100 rounded text-center">
                  Codice di conferma: <span className="font-mono">{confirmCode}</span>
                </p>
              )}
            </div>
          )}
          
          {status === "completed" && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div className="text-center">
                <h2 className="text-lg font-medium">Cancellazione completata</h2>
                <p className="text-gray-500 mt-1">
                  Tutti i tuoi dati sono stati rimossi dai nostri sistemi.
                </p>
                {confirmCode && (
                  <p className="text-sm mt-4 p-2 bg-gray-100 rounded">
                    Codice di conferma: <span className="font-mono">{confirmCode}</span>
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
                  Non è stato possibile verificare lo stato della cancellazione.
                </p>
                <p className="text-sm mt-4">
                  Puoi contattarci all'indirizzo{" "}
                  <a href="mailto:privacy@sentimentverse.com" className="text-blue-500 hover:underline">
                    privacy@sentimentverse.com
                  </a>{" "}
                  per l'assistenza, citando il codice di conferma {confirmCode || "mancante"}.
                </p>
              </div>
            </div>
          )}
          
          <div className="mt-8 text-xs text-gray-500">
            <p className="text-center">
              In conformità con il Regolamento Generale sulla Protezione dei Dati (GDPR) e con le 
              politiche di Facebook sulla cancellazione dei dati, SentimentVerse fornisce questo 
              strumento per verificare lo stato della cancellazione dei tuoi dati personali.
            </p>
          </div>
        </div>
    </div>
  );
};

export default DeletionStatus;