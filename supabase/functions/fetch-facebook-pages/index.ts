
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { accessToken, customToken } = await req.json();
    
    // Use either the custom token provided or fall back to the access token from auth
    const tokenToUse = customToken || accessToken;
    
    if (!tokenToUse) {
      return new Response(
        JSON.stringify({ error: 'Token di accesso mancante' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('Chiamata API Facebook con token fornito');
    
    // Ottieni le pagine dell'utente da Facebook
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v19.0/me/accounts?fields=id,name,category,picture,fan_count,link,about,description,followers_count,location&access_token=${tokenToUse}`,
      { method: 'GET' }
    );
    
    const pagesData = await pagesResponse.json();
    
    if (pagesData.error) {
      console.error('Errore API Facebook:', pagesData.error);
      return new Response(
        JSON.stringify({ error: pagesData.error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Recuperate ${pagesData.data.length} pagine Facebook`);
    
    return new Response(
      JSON.stringify({ pages: pagesData.data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Errore nella funzione fetch-facebook-pages:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
