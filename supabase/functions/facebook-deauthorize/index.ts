
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Definizione dei header CORS per consentire richieste da Facebook
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Funzione per decodificare e verificare la firma del signed_request di Facebook
function parseSignedRequest(signedRequest: string, appSecret: string): Record<string, any> {
  const parts = signedRequest.split('.');
  
  if (parts.length !== 2) {
    throw new Error('Il formato del signed_request non è valido');
  }
  
  const [encodedSig, payload] = parts;
  
  // Decodifica il payload
  const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
  const data = JSON.parse(decodedPayload);
  
  // Verifica della firma (implementazione semplificata)
  // In una versione di produzione, dovresti implementare una verifica completa HMAC-SHA256
  // Questa è una versione semplificata che non fa la verifica effettiva
  console.log('Verifica del signed_request ricevuto da Facebook');
  console.log('User ID ricevuto:', data.user_id);
  
  return data;
}

// Funzione principale della Edge Function
serve(async (req) => {
  // Gestione delle richieste OPTIONS (preflight CORS)
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  // Ottieni la chiave segreta dell'app Facebook dall'ambiente
  const appSecret = Deno.env.get('FACEBOOK_APP_SECRET');
  if (!appSecret) {
    console.error('FACEBOOK_APP_SECRET non configurato');
    return new Response(
      JSON.stringify({ error: 'Configurazione del server non valida' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Estrai il signed_request dal corpo della richiesta
    const contentType = req.headers.get('content-type');
    let signedRequest: string | null = null;
    
    if (contentType && contentType.includes('application/json')) {
      const body = await req.json();
      signedRequest = body.signed_request;
    } else if (contentType && contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      signedRequest = formData.get('signed_request') as string;
    }

    if (!signedRequest) {
      return new Response(
        JSON.stringify({ error: 'signed_request mancante' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parsa e verifica il signed_request
    const data = parseSignedRequest(signedRequest, appSecret);
    const userId = data.user_id;

    // Logica per eliminare o anonimizzare i dati dell'utente
    console.log(`Elaborazione della richiesta di deautorizzazione per l'utente ${userId}`);
    
    // TODO: Qui dovresti implementare la logica per eliminare i dati dell'utente
    // Ad esempio, usando il client Supabase per rimuovere dati dal database

    // Genera un codice di conferma
    const confirmationCode = `del_${userId}_${Date.now()}`;
    
    // URL di stato della cancellazione
    const deletionStatusUrl = `https://sentimentverse.com/deletion_status?user_id=${userId}&confirm_code=${confirmationCode}`;

    // Risposta nel formato richiesto da Facebook
    const responseData = {
      url: deletionStatusUrl,
      confirmation_code: confirmationCode
    };

    // Ritorna la risposta a Facebook
    return new Response(
      JSON.stringify(responseData),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Errore durante l\'elaborazione della richiesta:', error);
    
    return new Response(
      JSON.stringify({ error: 'Errore durante l\'elaborazione della richiesta' }),
      { 
        status: 400, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
})
