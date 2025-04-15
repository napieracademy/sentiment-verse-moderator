import React, { useEffect, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import InsightsPanel from "@/components/InsightsPanel";
import { format, subDays, parseISO } from "date-fns";

// Interfaccia per le metriche di Facebook
interface FacebookMetric {
  name: string;
  period: string;
  values: Array<{
    value: number;
    end_time: string;
  }>;
  title: string;
  description: string;
  id: string;
}

// Descrizioni delle metriche
const metricDescriptions: Record<string, string> = {
  page_impressions: "Totale visualizzazioni dei contenuti della Pagina",
  page_impressions_unique: "Persone uniche che hanno visualizzato contenuti della Pagina",
  page_impressions_paid: "Visualizzazioni ottenute tramite contenuti sponsorizzati",
  page_impressions_organic: "Visualizzazioni ottenute tramite contenuti non sponsorizzati",
  page_impressions_viral: "Visualizzazioni ottenute tramite condivisioni o attività virale",
  page_views_total: "Totale visualizzazioni della Pagina",
  page_views_logged_in_total: "Visualizzazioni della Pagina da parte di utenti loggati",
  page_fans: "Numero totale di 'Mi piace' alla Pagina",
  page_fan_adds: "Nuovi 'Mi piace' alla Pagina",
  page_fan_removes: "'Mi piace' rimossi dalla Pagina",
  page_post_engagements: "Totale interazioni con i post della Pagina",
  page_video_views: "Totale visualizzazioni dei video",
  page_video_views_paid: "Visualizzazioni video tramite contenuti sponsorizzati",
  page_video_views_organic: "Visualizzazioni video tramite contenuti non sponsorizzati"
};

const Insights: React.FC = () => {
  const [data, setData] = useState<FacebookMetric[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<any | null>(null);
  const { toast } = useToast();

  // Stato per le date e il periodo selezionato
  const [selectedDateRange, setSelectedDateRange] = useState<{
    from: Date;
    to?: Date;
  }>({
    from: subDays(new Date(), 14),
    to: new Date()
  });
  const [selectedTimeRange, setSelectedTimeRange] = useState('14d');
  const [isCustomDateActive, setIsCustomDateActive] = useState(false);

  // Token fisso per Te la do io Firenze
  const token = "EAARrf6dn8hIBO0ncV0G3zZCy6Pk1bBXZCot0KhDFVcHvba6OguZANMYlJp3ozq7h5nTAF2o2h1H3lyftV7fc0Cy2NmvmBJowmXrVPU627ykxqz7aGxbyVZBq7fUimHdWOddcLCZAQ1kzSMSEEQMqHS3wDZBU4FqmCqLpls7C5TFB55tqMZBXey0PhtThrkN1mqCQthAJSyjshd2GqIZD";
  
  // Funzione per calcolare le date in base al periodo selezionato
  const getDateRangeFromTimeRange = useCallback((range: string) => {
    const now = new Date();
    let from = now;
    
    switch(range) {
      case '7d':
        from = subDays(now, 7);
        break;
      case '14d':
        from = subDays(now, 14);
        break;
      case '30d':
        from = subDays(now, 30);
        break;
      case '90d':
        from = subDays(now, 90);
        break;
      default:
        from = subDays(now, 14);
    }
    
    return { from, to: now };
  }, []);

  // Funzione per formattare le date per l'API di Facebook (YYYY-MM-DD)
  const formatDateForApi = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
  };
  
  // Funzione per recuperare gli insight con date specifiche
  const fetchInsightsWithDateRange = useCallback(async (dateRange: { from: Date, to?: Date }, period: string = 'day') => {
    if (!dateRange.from || !dateRange.to) return;

    setLoading(true);
    setError(null);
    // Pulisci i dati precedenti prima di un nuovo fetch per evitare di mostrare dati vecchi in caso di errore
    setData(null); 
    setRawResponse(null);

    try {
      const pageId = "121428567930871"; // ID fisso per Te la do io Firenze
      const since = formatDateForApi(dateRange.from);
      const until = formatDateForApi(dateRange.to);

      console.log(`Recupero dati dal ${since} al ${until} con periodo ${period}`);

      // Utilizzo i parametri since e until per specificare il range di date
      const url = `https://graph.facebook.com/v19.0/${pageId}/insights?metric=page_impressions,page_impressions_unique,page_views_total,page_fans,page_fan_adds,page_fan_removes,page_post_engagements,page_video_views&period=${period}&since=${since}&until=${until}&access_token=${token}`;

      console.log("Chiamata API:", url.substring(0, url.indexOf("access_token=") + 13) + "***TOKEN***");

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Errore nel recupero degli insights.");
      }

      const json = await response.json();
      setRawResponse(json);

      // Se la risposta ha una proprietà 'data', estrai le metriche
      if (json.data && Array.isArray(json.data)) {
        const metrics = json.data.map((metric: FacebookMetric) => ({
          ...metric,
          description: metricDescriptions[metric.name] || "Nessuna descrizione disponibile"
        }));
        setData(metrics);

        toast({
          title: "Dati insights caricati",
          description: `Caricate ${metrics.length} metriche da Facebook per il periodo selezionato`,
        });
      } else {
        // Se json.data non è un array valido, consideralo un errore o dati vuoti
        setData([]); // Imposta dati vuoti invece di lanciare errore se la struttura non è quella attesa
        console.warn("Formato della risposta API non conteneva un array 'data'.", json);
        toast({
          title: "Dati parziali o non validi",
          description: "La risposta API non conteneva i dati attesi.",
          variant: "default" // Usiamo default invece di destructive
        });
      }
    } catch (e: any) {
      setError(e.message);
      toast({ title: "Errore API", description: e.message, variant: "destructive" });
      setData(null); // Assicura che i dati siano nulli in caso di errore completo
      // Rimosso il blocco di fallback che recuperava dati base e generava metriche simulate.
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  // La funzione fetchInsights originale ora utilizza la funzione con date
  const fetchInsights = useCallback(() => {
    if (isCustomDateActive && selectedDateRange.from && selectedDateRange.to) {
      // Usa date personalizzate
      fetchInsightsWithDateRange(selectedDateRange);
    } else {
      // Usa intervallo predefinito
      const dateRange = getDateRangeFromTimeRange(selectedTimeRange);
      fetchInsightsWithDateRange(dateRange);
    }
  }, [fetchInsightsWithDateRange, getDateRangeFromTimeRange, isCustomDateActive, selectedDateRange, selectedTimeRange]);

  useEffect(() => {
    fetchInsights();
  }, []);

  // Formatta i numeri per la visualizzazione
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  // Prepara i dati per InsightsPanel usando SOLO dati reali dall'API
  const prepareRealInsightsData = () => {
    if (!data) {
      // Se non ci sono dati (fetch iniziale fallito o in corso), ritorna una struttura vuota
      return {
        currentFollowers: 0,
        followerGrowthPercentage: "0.0",
        totalEngagement: 0,
        totalReach: 0,
        totalFanAdds: 0,
        totalFanRemoves: 0,
        totalPageViews: 0,
        growthData: [],
        totalEngagementData: [],
        totalReachData: [],
        videoViewsData: [],
        uniqueReachData: [],
        pageViewsData: [],
        fanAddsData: [],
        fanRemovesData: [],
      };
    }

    // Estrai le metriche specifiche
    const followersMetric = data.find(m => m.name === "page_fans");
    const engagementMetric = data.find(m => m.name === "page_post_engagements");
    const reachMetric = data.find(m => m.name === "page_impressions");
    const videoViewsMetric = data.find(m => m.name === "page_video_views");
    // Nuove metriche da estrarre
    const uniqueReachMetric = data.find(m => m.name === "page_impressions_unique");
    const pageViewsMetric = data.find(m => m.name === "page_views_total");
    const fanAddsMetric = data.find(m => m.name === "page_fan_adds");
    const fanRemovesMetric = data.find(m => m.name === "page_fan_removes");

    // Ultimo valore disponibile per le metriche chiave
    const currentFollowers = followersMetric?.values?.[followersMetric.values.length - 1]?.value || 0;
    const totalEngagement = engagementMetric?.values?.[engagementMetric.values.length - 1]?.value || 0;
    const totalReach = reachMetric?.values?.[reachMetric.values.length - 1]?.value || 0;

    // Prepara i dati per i grafici (serie temporali)
    const formatDataForChart = (metric: FacebookMetric | undefined) => {
      return metric?.values
        ?.slice(-90) // Massimo 90 punti dati
        .map(v => ({
          // Assicurati che end_time sia una data valida prima di formattarla
          name: v.end_time ? new Date(v.end_time).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' }) : 'N/D',
          value: v.value
        })) || [];
    };
    
    const growthData = formatDataForChart(followersMetric);
    const totalEngagementData = formatDataForChart(engagementMetric);
    const totalReachData = formatDataForChart(reachMetric);
    const videoViewsData = formatDataForChart(videoViewsMetric);
    // Nuovi dati per grafici
    const uniqueReachData = formatDataForChart(uniqueReachMetric);
    const pageViewsData = formatDataForChart(pageViewsMetric);
    const fanAddsData = formatDataForChart(fanAddsMetric);
    const fanRemovesData = formatDataForChart(fanRemovesMetric);

    // Calcola percentuale di crescita follower (solo se ci sono almeno 2 punti dati)
    let followerGrowthPercentage = "0.0";
    if (growthData.length >= 2) {
      const oldestFollowers = growthData[0]?.value || 0; // Usa 'value' ora
      const newestFollowers = growthData[growthData.length - 1]?.value || 0; // Usa 'value' ora
      if (oldestFollowers > 0) {
        followerGrowthPercentage = ((newestFollowers - oldestFollowers) / oldestFollowers * 100).toFixed(1);
      }
    }

    // Calcola somme per nuove metriche chiave (se dati presenti)
    const totalFanAdds = fanAddsMetric?.values?.reduce((sum, v) => sum + v.value, 0) || 0;
    const totalFanRemoves = fanRemovesMetric?.values?.reduce((sum, v) => sum + v.value, 0) || 0;
    const totalPageViews = pageViewsMetric?.values?.reduce((sum, v) => sum + v.value, 0) || 0;

    return {
      currentFollowers,
      followerGrowthPercentage,
      totalEngagement,
      totalReach,
      // Nuove metriche aggregate
      totalFanAdds,
      totalFanRemoves,
      totalPageViews,
      // Dati per grafici
      growthData, 
      totalEngagementData, 
      totalReachData, 
      videoViewsData, 
      // Nuovi dati per grafici
      uniqueReachData,
      pageViewsData,
      fanAddsData,
      fanRemovesData,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center h-[300px] text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mb-4" />
              <p className="text-muted-foreground">
                Caricamento dati insights da Facebook...
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-red-500 font-medium">Errore: {error}</div>
              <p className="mt-2 mb-4">
                L'accesso agli insights potrebbe richiedere autorizzazioni speciali o una pagina verificata con Facebook.
                Prova a usare le metriche di base o contatta l'assistenza di Facebook.
              </p>
              <Button onClick={fetchInsights} className="mt-2">
                Riprova
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Facebook Insights</h1>
          <Button onClick={fetchInsights} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Aggiorna Dati
          </Button>
        </div>

        {error && !data && ( // Mostra errore bloccante solo se non ci sono dati precedenti
          <Card className="mb-4 border-red-200 bg-red-50">
             <CardHeader>
                 <CardTitle className="text-red-700">Errore nel caricamento</CardTitle>
             </CardHeader>
            <CardContent className="p-4">
              <div className="text-red-600 font-medium">{error}</div>
              <p className="mt-2 mb-4 text-sm text-red-700">
                Impossibile caricare i dati degli insights. Verifica la connessione, il token di accesso o le autorizzazioni della pagina.
              </p>
              <Button onClick={fetchInsights} className="mt-2">
                Riprova
              </Button>
            </CardContent>
          </Card>
        )}

        {error && data && ( // Mostra avviso se c'è un errore ma dati (anche vecchi) sono presenti
             <Card className="mb-4 border-yellow-200 bg-yellow-50">
                <CardContent className="p-4">
                    <p className="text-yellow-700 text-sm">
                    Avviso durante l'aggiornamento: {error}
                    <br />
                    Potrebbero essere visualizzati dati non aggiornati.
                    </p>
                </CardContent>
             </Card>
         )}

        {/* Componente InsightsPanel avanzato */}
        {/* Passiamo i dati reali preparati */}
        {/* Dovrà essere modificato per visualizzare i nuovi grafici/metriche */}
        <InsightsPanel
          data={prepareRealInsightsData()}
          selectedTimeRange={selectedTimeRange}
          selectedDateRange={selectedDateRange}
          isCustomDateActive={isCustomDateActive}
          onDateRangeChange={(range) => {
            if (range?.from) {
              setSelectedDateRange(range);
              setIsCustomDateActive(true);
              fetchInsightsWithDateRange(range);
            }
          }}
          onTimeRangeChange={(range) => {
            setSelectedTimeRange(range);
            setIsCustomDateActive(false);
            const dateRange = getDateRangeFromTimeRange(range);
            fetchInsightsWithDateRange(dateRange);
          }}
          isLoadingData={loading}
        />
        
        {/* Visualizzazione JSON completa per debugging */}
        <Card className="mt-8 border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Risposta API originale</CardTitle>
            <CardDescription>Dati grezzi ricevuti dall'API Facebook</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-2 rounded border">
              <details>
                <summary className="cursor-pointer text-sm font-medium p-2">
                  Mostra dati API
                </summary>
                <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96 mt-2">
                  {JSON.stringify(rawResponse, null, 2)}
                </pre>
              </details>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Insights;
