import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, RefreshCw, BarChart2, MessageSquare, ThumbsUp, Share2, Eye, Users, MousePointerClick } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // Potrebbe servire per selezione multipla futura
import { 
  DropdownMenu, 
  DropdownMenuCheckboxItem, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"; // Per visibilità colonne
import { Input } from "@/components/ui/input"; // Per filtro
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { it } from 'date-fns/locale';

// --- Interfacce Dati ---

// Interfaccia semplificata per un Post della Pagina (da popolare con più campi)
interface PagePost {
  id: string;
  created_time: string;
  message?: string;
  full_picture?: string;
  from?: { name: string; id: string };
  comments?: { summary?: { total_count: number } };
  likes?: { summary?: { total_count: number } }; // 'likes' è un'approssimazione per reazioni totali qui
  shares?: { count: number };
  insights?: PostInsightsData | null;
  isLoadingInsights?: boolean; // Flag per indicare caricamento insights per questa riga
}

// Interfaccia per gli Insights di un Post (Aggiornata con più metriche)
interface PostInsightsData {
  post_impressions?: number;
  post_impressions_unique?: number;
  post_engaged_users?: number;
  post_clicks_unique?: number;
  post_reactions_like_total?: number;
  post_reactions_love_total?: number;
  post_reactions_wow_total?: number;
  post_reactions_haha_total?: number;
  post_reactions_sorry_total?: number;
  post_reactions_anger_total?: number;
  post_video_views?: number; // Visualizzazioni di 3s
  post_video_avg_time_watched?: number; // Tempo medio visualizzazione (ms)
  post_negative_feedback_unique?: number; // Nascoste/Segnalate (utenti unici)
}

// Elenco metriche da richiedere all'API /insights (Escludendo deprecate)
const POST_INSIGHTS_METRICS = [
    'post_impressions',
    // 'post_impressions_unique', // Rimosso - Causa errore #100
    // 'post_engaged_users',       // Rimosso - Deprecata
    // 'post_clicks_unique',       // Rimosso - Deprecata
    'post_reactions_like_total',    
    'post_reactions_love_total',    
    'post_reactions_wow_total',     
    'post_reactions_haha_total',    
    'post_reactions_sorry_total',   
    'post_reactions_anger_total',   
    'post_video_views',             
    'post_video_avg_time_watched',  
].join(',');

// --- Definizione Colonne per TanStack Table ---

const columns: ColumnDef<PagePost>[] = [
  // Colonna Data
  {
    accessorKey: "created_time",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Data
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-xs whitespace-nowrap">
        {format(new Date(row.getValue("created_time")), "dd MMM yy, HH:mm", { locale: it })}
      </div>
    ),
  },
  // Colonna Messaggio
  {
    accessorKey: "message",
    header: "Anteprima Messaggio",
    cell: ({ row }) => (
        <div className="text-sm truncate max-w-[250px]" title={row.getValue("message") || ''}>
            {row.getValue("message") || "[Nessun testo / Media]"}
        </div>
    ),
    enableSorting: false, // Probabilmente non utile sortare per messaggio intero
  },
  // Colonna Reazioni (approssimate)
  {
    // Usiamo un accessorFn per estrarre il valore numerico
    accessorFn: (row) => row.likes?.summary?.total_count ?? 0,
    id: 'reactions',
    header: ({ column }) => (
        <div className="text-right">
             <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
             >
                Reazioni
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        </div>
    ),
    cell: ({ row }) => {
      const amount = row.original.likes?.summary?.total_count ?? 0;
      return <div className="text-right font-medium pr-4">{amount.toLocaleString()}</div>;
    },
  },
  // Colonna Commenti
  {
    accessorFn: (row) => row.comments?.summary?.total_count ?? 0,
    id: 'comments',
    header: ({ column }) => (
        <div className="text-right">
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Commenti
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        </div>
    ),
    cell: ({ row }) => {
      const amount = row.original.comments?.summary?.total_count ?? 0;
      return <div className="text-right font-medium pr-4">{amount.toLocaleString()}</div>;
    },
  },
  // Colonna Condivisioni
  {
    accessorFn: (row) => row.shares?.count ?? 0,
    id: 'shares',
    header: ({ column }) => (
        <div className="text-right">
             <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
             >
                Condivisioni
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        </div>
    ),
    cell: ({ row }) => {
      const amount = row.original.shares?.count ?? 0;
      return <div className="text-right font-medium pr-4">{amount.toLocaleString()}</div>;
    },
  },
  // Nuova Colonna: Impressioni Totali (da insights)
  {
    accessorFn: (row) => row.insights?.post_impressions ?? null,
    id: 'post_impressions',
    header: ({ column }) => (
        <div className="text-right">
             <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Impressioni
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        </div>
    ),
    cell: ({ row }) => {
      const isLoading = row.original.isLoadingInsights;
      const value = row.original.insights?.post_impressions;
      return (
          <div className="text-right font-medium pr-4">
              {isLoading ? <RefreshCw className="h-3 w-3 animate-spin inline-block"/> : (value !== undefined && value !== null ? value.toLocaleString() : 'N/D')}
          </div>
      );
    },
  },
  // Riattiviamo la colonna Video Views 
  {
    accessorFn: (row) => row.insights?.post_video_views ?? null,
    id: 'video_views',
    header: ({ column }) => (
        <div className="text-right">
             <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Vis. Video (3s)
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        </div>
    ),
    cell: ({ row }) => {
      const isLoading = row.original.isLoadingInsights;
      const value = row.original.insights?.post_video_views;
      return (
          <div className="text-right font-medium pr-4">
              {isLoading ? <RefreshCw className="h-3 w-3 animate-spin inline-block"/> : (value !== undefined && value !== null ? value.toLocaleString() : 'N/D')}
          </div>
      );
    },
  },
  // Nuova Colonna: Tempo Medio Visualizzazione Video (ms -> s) (da insights)
  {
    accessorFn: (row) => row.insights?.post_video_avg_time_watched ?? null,
    id: 'video_avg_time',
    header: ({ column }) => (
        <div className="text-right">
             <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                T.Medio Vis. (s)
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        </div>
    ),
    cell: ({ row }) => {
      const isLoading = row.original.isLoadingInsights;
      const valueMs = row.original.insights?.post_video_avg_time_watched;
      const valueSec = valueMs !== undefined && valueMs !== null ? (valueMs / 1000).toFixed(1) : null;
      return (
          <div className="text-right font-medium pr-4">
              {isLoading ? <RefreshCw className="h-3 w-3 animate-spin inline-block"/> : (valueSec !== null ? `${valueSec}s` : 'N/D')}
          </div>
      );
    },
  },
   // TODO: Potremmo aggiungere colonne separate per ogni tipo di reazione (Like, Love, etc.) se necessario
];

// --- Componente Principale ---

const PostInsights: React.FC = () => {
  // Stato combinato per post e insights
  const [postsWithInsights, setPostsWithInsights] = useState<PagePost[]>([]); 
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // State per TanStack Table
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({}); // Serve per gestire la selezione

  const token = "EAARrf6dn8hIBO0ncV0G3zZCy6Pk1bBXZCot0KhDFVcHvba6OguZANMYlJp3ozq7h5nTAF2o2h1H3lyftV7fc0Cy2NmvmBJowmXrVPU627ykxqz7aGxbyVZBq7fUimHdWOddcLCZAQ1kzSMSEEQMqHS3wDZBU4FqmCqLpls7C5TFB55tqMZBXey0PhtThrkN1mqCQthAJSyjshd2GqIZD";
  const pageId = "121428567930871";

  // --- Funzione Fetch Posts (Modificata per triggerare fetch insights) ---
  const fetchPosts = useCallback(async () => {
    setLoadingPosts(true);
    setError(null);
    setPostsWithInsights([]); // Pulisce lo stato combinato
    // Rimosso reset selezione tabella, gestito da Tanstack
    try {
      const fields = [
          'id',
          'created_time',
          'message',
          'full_picture',
          'from',
          'comments.summary(true)',
          'likes.summary(true){total_count}',
          'shares'
      ].join(',');
      const limit = 25;
      const url = `https://graph.facebook.com/v22.0/${pageId}/published_posts?fields=${fields}&limit=${limit}&access_token=${token}`;

      console.log("Fetching real posts...");
      const response = await fetch(url);
      const json = await response.json();

      if (!response.ok) {
        console.error("API Error Response:", json);
        throw new Error(json.error?.message || "Errore nel recupero dei post dalla pagina.");
      }
      if (!json.data || !Array.isArray(json.data)) {
          console.warn("API Response missing data array:", json);
          throw new Error("Formato risposta API non valido per i post.");
      }
      const validPosts = json.data.filter((post: any) => post.id);
      
      // Imposta i post iniziali (senza insights, con flag di caricamento)
      // Rimosso completamente blocco mockPosts per risolvere errore sintassi persistente
      const initialPosts = validPosts.map(post => ({ ...post, insights: null, isLoadingInsights: true }));
      setPostsWithInsights(initialPosts);
      
      toast({ 
          title: "Lista Post Caricata", 
          description: `${validPosts.length} post recuperati. Caricamento insights in corso...` 
      });

      // Avvia il caricamento degli insights per tutti i post recuperati
      // Usiamo Promise.all per aspettare che tutte le chiamate (mock) finiscano
      // NOTA: In produzione, questo può essere lento. Considerare batch API o caricamento on-demand.
      await Promise.all(
          initialPosts.map(async (post) => {
              try {
                  const postInsights = await fetchPostInsights(post.id);
                  // Aggiorna lo stato per questo specifico post
                  setPostsWithInsights(currentPosts => 
                      currentPosts.map(p => 
                          p.id === post.id 
                              ? { ...p, insights: postInsights, isLoadingInsights: false }
                              : p
                      )
                  );
              } catch (insightErr) {
                  console.error(`Errore caricamento insights per post ${post.id}:`, insightErr);
                   // Aggiorna lo stato per indicare errore caricamento insights per questo post
                  setPostsWithInsights(currentPosts => 
                      currentPosts.map(p => 
                          p.id === post.id 
                              ? { ...p, insights: null, isLoadingInsights: false } // Indica che il caricamento è finito (con errore)
                              : p
                      )
                  );
              }
          })
      );
       toast({ title: "Caricamento Insights Completato", description: "Metriche dettagliate caricate per i post." });

    } catch (err: any) {
      console.error("Fetch Posts Error:", err);
      setError(err.message || "Errore nel recupero dei post.");
      toast({ title: "Errore Post", description: err.message, variant: "destructive" });
    } finally {
      setLoadingPosts(false);
    }
  }, [toast, token, pageId]);

  // --- Funzione Fetch Post Insights (ora ritorna i dati invece di settare stato) ---
  const fetchPostInsights = useCallback(async (postId: string): Promise<PostInsightsData | null> => {
    if (!postId) return null;
    // Non gestisce più stati globali loading/error/insights
    try {
      // Chiamata API Reale
      console.log(`Fetching REAL insights for post ${postId} with metrics: ${POST_INSIGHTS_METRICS}`);
      const url = `https://graph.facebook.com/v22.0/${postId}/insights?metric=${POST_INSIGHTS_METRICS}&access_token=${token}`;
      
      const response = await fetch(url);
      const json = await response.json();

      if (!response.ok) {
          console.error(`API Error for post ${postId} insights:`, json);
          throw new Error(json.error?.message || `Errore API insights per post ${postId}`);
      }

      if (!json.data || !Array.isArray(json.data)) {
          console.warn(`API Response for post ${postId} insights missing data array:`, json);
          return null; // Nessun dato valido restituito
      }
      
      // Estrai i valori dalle metriche restituite
      const insightsResult: PostInsightsData = {};
      json.data.forEach((metric: any) => {
          // Assicurati che il nome della metrica esista e ci sia almeno un valore
          if (metric.name && metric.values && metric.values.length > 0 && metric.values[0].value !== undefined) {
              // Nota: Alcune metriche (es. reactions) potrebbero avere una struttura diversa
              // o non essere disponibili per tutti i post. Qui assumiamo la struttura base.
              // Convertiamo il nome API in camelCase se necessario o manteniamo quello API
              insightsResult[metric.name as keyof PostInsightsData] = metric.values[0].value;
          } else {
              console.log(`Metrica ${metric.name} non trovata o senza valore per post ${postId}`);
          }
      });

      // Logica aggiuntiva per reazioni se necessario (la richiesta attuale le chiede già singolarmente)

      console.log(`Insights retrieved for post ${postId}:`, insightsResult);
      return insightsResult; // Ritorna l'oggetto popolato

    } catch (err: any) {
      console.error(`Errore API insights per post ${postId}:`, err);
      // Non mostriamo toast qui per non intasare se falliscono molti post
      return null; // Ritorna null in caso di errore
    }
  }, [token]); // Tolto toast dalle dipendenze

  // --- Effetto Caricamento Post ---
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // --- Istanza TanStack Table ---
  const table = useReactTable({
    data: postsWithInsights, // Usa il nuovo stato combinato
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // Abilita paginazione se necessaria
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // --- Rendering ---
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8 space-y-6">
        {/* Header Pagina */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Analisi Insights per Post</h1>
          <Button onClick={fetchPosts} disabled={loadingPosts}>
            <RefreshCw className={`h-4 w-4 ${loadingPosts ? 'animate-spin' : ''} mr-2`} />
            {loadingPosts ? 'Caricamento...' : 'Aggiorna Lista Post'}
          </Button>
        </div>

        {/* Messaggio di Errore */}
        {error && !loadingPosts && (
           <Card className="border-destructive bg-red-50">
              <CardHeader><CardTitle className="text-destructive">Errore</CardTitle></CardHeader>
              <CardContent className="text-destructive">{error}</CardContent>
           </Card>
        )}

        {/* Layout Principale: Solo Tabella */}
        <Card> {/* Unica card per la tabella */} 
            <CardHeader>
                <CardTitle>Analisi Dettagliata Post</CardTitle>
                <CardDescription>Tabella con metriche base e insights per ogni post.</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Filtro e Visibilità Colonne (come prima) */}
                <div className="flex items-center py-4">
                    <Input
                    placeholder="Filtra per messaggio..."
                    value={(table.getColumn("message")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("message")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                    />
                    {/* Dropdown Visibilità Colonne */}
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                        Colonne <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => {
                            return (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) =>
                                column.toggleVisibility(!!value)
                                }
                            >
                                {column.id === 'created_time' ? 'Data' : 
                                 column.id === 'message' ? 'Messaggio' : 
                                 column.id === 'reactions' ? 'Reazioni' : 
                                 column.id === 'comments' ? 'Commenti' : 
                                 column.id === 'shares' ? 'Condivisioni' : 
                                 column.id === 'post_impressions' ? 'Impressioni' : 
                                 column.id === 'video_views' ? 'Vis. Video (3s)' : 
                                 column.id === 'video_avg_time' ? 'T.Medio Vis. (s)' : column.id}
                            </DropdownMenuCheckboxItem>
                            )
                        })}
                    </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                 {/* Tabella Dati */} 
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => {
                            return (
                              <TableHead key={header.id}>
                                {header.isPlaceholder
                                  ? null
                                  : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                              </TableHead>
                            )
                          })}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                          <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={columns.length}
                            className="h-24 text-center"
                          >
                            {loadingPosts ? "Caricamento post..." : "Nessun post trovato."}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                 {/* Paginazione (Opzionale, aggiunta di base) */}
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} di{" "}
                    {table.getFilteredRowModel().rows.length} righe selezionate.
                    </div>
                    <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Precedente
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Successivo
                    </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PostInsights; 