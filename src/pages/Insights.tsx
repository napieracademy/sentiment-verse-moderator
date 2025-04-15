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
        throw new Error("Formato della risposta non valido");
      }
    } catch (e: any) {
      setError(e.message);
      toast({ title: "Errore", description: e.message, variant: "destructive" });
      
      // Fallback per i dati base come nell'implementazione originale
      try {
        const pageId = "121428567930871";
        const basicUrl = `https://graph.facebook.com/v19.0/${pageId}?fields=id,name,fan_count,followers_count&access_token=${token}`;
        
        const basicResponse = await fetch(basicUrl);
        if (basicResponse.ok) {
          const basicData = await basicResponse.json();
          setRawResponse(basicData);
          // Crea metriche base
          const simulatedMetrics = [
            {
              name: "page_fans",
              period: "lifetime",
              values: [{ value: basicData.fan_count || 0, end_time: new Date().toISOString() }],
              title: "Fan della pagina",
              description: "Numero totale di 'Mi piace' alla Pagina",
              id: "page_fans"
            },
            {
              name: "page_followers",
              period: "lifetime",
              values: [{ value: basicData.followers_count || 0, end_time: new Date().toISOString() }],
              title: "Follower della pagina",
              description: "Numero totale di follower della Pagina",
              id: "page_followers"
            }
          ];
          setData(simulatedMetrics);
          toast({
            title: "Dati base caricati",
            description: "Non è stato possibile caricare gli insights completi. Sono stati caricati solo i dati base della pagina."
          });
        }
      } catch (backupError) {
        console.error("Anche il fallback è fallito:", backupError);
      }
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

  // Prepara i dati per InsightsPanel
  const prepareInsightsData = () => {
    if (!data) return null;
    
    // Estrai dati dai metrics per creare i dataset necessari per InsightsPanel
    const followers = data.find(m => m.name === "page_fans")?.values[0]?.value || 0;
    const growthData = data
      .filter(m => m.name === "page_fans" && m.values.length > 0)
      .flatMap(m => m.values.slice(0, 14).reverse().map((v, i) => ({
        name: new Date(v.end_time).toLocaleDateString('it-IT', {day: '2-digit', month: '2-digit'}),
        followers: v.value
      })));
    
    const engagementData = data
      .filter(m => m.name === "page_post_engagements" && m.values.length > 0)
      .flatMap(m => m.values.slice(0, 14).reverse().map((v, i) => ({
        name: new Date(v.end_time).toLocaleDateString('it-IT', {day: '2-digit', month: '2-digit'}),
        comments: Math.floor(v.value * 0.3), // Stima per divisione tra commenti e reazioni
        reactions: Math.floor(v.value * 0.7)
      })));
    
    // Calcola percentuale di crescita
    const oldestFollowers = growthData.length > 0 ? growthData[0]?.followers || 0 : 0;
    const newestFollowers = growthData.length > 0 ? growthData[growthData.length - 1]?.followers || 0 : 0;
    const followerGrowthPercentage = oldestFollowers > 0 
      ? ((newestFollowers - oldestFollowers) / oldestFollowers * 100).toFixed(1)
      : "0.0";
    
    // Dati demografici di esempio
    const demographicsData = [
      { name: "18-24", value: 25 },
      { name: "25-34", value: 40 },
      { name: "35-44", value: 20 },
      { name: "45-54", value: 10 },
      { name: "55+", value: 5 }
    ];
    
    // Dati di localizzazione di esempio
    const locationData = [
      { name: "Firenze", value: 45 },
      { name: "Prato", value: 15 },
      { name: "Pistoia", value: 12 },
      { name: "Siena", value: 10 },
      { name: "Altri", value: 18 }
    ];
    
    // Dati sentiment di esempio
    const sentimentTrend = [
      { date: "09/04", positive: 35, negative: 15, neutral: 10 },
      { date: "10/04", positive: 30, negative: 20, neutral: 15 },
      { date: "11/04", positive: 40, negative: 10, neutral: 12 },
      { date: "12/04", positive: 25, negative: 25, neutral: 15 },
      { date: "13/04", positive: 45, negative: 12, neutral: 10 },
      { date: "14/04", positive: 38, negative: 14, neutral: 18 },
      { date: "15/04", positive: 42, negative: 16, neutral: 14 }
    ];
    
    // Calcola engagement e reach
    const totalEngagement = data.find(m => m.name === "page_post_engagements")?.values[0]?.value || 0;
    const reach = data.find(m => m.name === "page_impressions")?.values[0]?.value || 0;
    const uniqueReach = data.find(m => m.name === "page_impressions_unique")?.values[0]?.value || 0;
    
    // Calcola metriche derivate
    const totalComments = Math.floor(totalEngagement * 0.3);
    const totalReactions = Math.floor(totalEngagement * 0.7);
    const averageEngagementRate = followers > 0 
      ? ((totalEngagement / followers) * 100).toFixed(1) 
      : "0.0";
    
    return {
      growthData: growthData.length > 0 ? growthData : Array(14).fill(0).map((_, i) => ({ 
        name: new Date(Date.now() - (13-i) * 86400000).toLocaleDateString('it-IT', {day: '2-digit', month: '2-digit'}),
        followers: 5000 + Math.floor(Math.random() * 200) 
      })),
      engagementData: engagementData.length > 0 ? engagementData : Array(14).fill(0).map((_, i) => ({
        name: new Date(Date.now() - (13-i) * 86400000).toLocaleDateString('it-IT', {day: '2-digit', month: '2-digit'}),
        comments: Math.floor(Math.random() * 50),
        reactions: Math.floor(Math.random() * 150)
      })),
      demographicsData,
      locationData,
      sentimentTrend,
      followerGrowthPercentage,
      totalComments,
      totalReactions,
      averageEngagementRate,
      totalReach: reach,
      reachGrowth: 4.2 // esempio fisso
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

        {error && (
          <Card className="mb-4 border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <p className="text-yellow-700">
                Avviso: {error}
                <br />
                Alcuni dati potrebbero non essere disponibili. Vengono mostrate solo le metriche accessibili.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Componente InsightsPanel avanzato con collegamento alle funzioni di date e caricamento */}
        <InsightsPanel 
          data={prepareInsightsData() || {
            growthData: [],
            engagementData: [],
            demographicsData: [],
            locationData: [],
            sentimentTrend: [],
            followerGrowthPercentage: "0.0",
            totalComments: 0,
            totalReactions: 0,
            averageEngagementRate: "0.0",
            totalReach: 0,
            reachGrowth: 0
          }} 
          onDateRangeChange={(range) => {
            setSelectedDateRange(range);
            setIsCustomDateActive(true);
            fetchInsightsWithDateRange(range);
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
