import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, subDays } from "date-fns";
import { it } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  LineChart, BarChart, ResponsiveContainer, 
  Line, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, Legend
} from 'recharts';
import { 
  ArrowUpRight, ArrowDownRight, Users, Eye, BarChart2,
  Download, TrendingUp, Info, HelpCircle,
  Filter, MoreHorizontal, DownloadCloud, FileSpreadsheet, Share2, RefreshCcw, Video
} from 'lucide-react';

// Interfaccia aggiornata per i dati reali ricevuti da Insights.tsx
export interface RealInsightsData {
  currentFollowers: number;
  followerGrowthPercentage: string;
  totalEngagement: number;
  totalReach: number;
  totalFanAdds: number;
  totalFanRemoves: number;
  totalPageViews: number;
  growthData: Array<{ name: string; value: number }>; // Nome generico 'value'
  totalEngagementData: Array<{ name: string; value: number }>; // Nome generico 'value'
  totalReachData: Array<{ name: string; value: number }>; // Nome generico 'value'
  videoViewsData: Array<{ name: string; value: number }>; // Aggiunto video views
  uniqueReachData: Array<{ name: string; value: number }>;
  pageViewsData: Array<{ name: string; value: number }>;
  fanAddsData: Array<{ name: string; value: number }>;
  fanRemovesData: Array<{ name: string; value: number }>;
}

interface InsightsPanelProps {
  data: RealInsightsData; // Usa la nuova interfaccia
  // Nuove props per ricevere lo stato dal padre
  selectedTimeRange: string;
  selectedDateRange: { from: Date; to?: Date };
  isCustomDateActive: boolean;
  // Callbacks per comunicare le modifiche al padre
  onDateRangeChange: (range: { from: Date; to?: Date }) => void; // R reso obbligatorio
  onTimeRangeChange: (range: string) => void; // Reso obbligatorio
  isLoadingData?: boolean; 
}

// Componente helper per visualizzare grafici o messaggio "Nessun dato"
const ChartContainer: React.FC<{ title: string; description: string; data: Array<any>; children: React.ReactElement; dataKey: string; dataName?: string }> = ({ title, description, data, children, dataKey, dataName }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {data && data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              {children}
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Nessun dato disponibile per questo periodo.
            </div>
          )}
        </div>
      </CardContent>
      {data && data.length > 0 && (
           <CardFooter className="text-xs text-muted-foreground flex gap-1 items-center">
               {/* Potremmo aggiungere qui la data dell'ultimo punto dati se necessario */}
           </CardFooter>
       )}
    </Card>
  );
};


const InsightsPanel = ({ 
  data, 
  onDateRangeChange,
  onTimeRangeChange,
  isLoadingData = false,
  // Ricevi le props di stato dal padre
  selectedTimeRange,
  selectedDateRange,
  isCustomDateActive
}: InsightsPanelProps) => {
  // Estrai i dati reali dalla prop 'data'
  const {
    currentFollowers,
    followerGrowthPercentage,
    totalEngagement,
    totalReach,
    totalFanAdds,
    totalFanRemoves,
    totalPageViews,
    growthData,
    totalEngagementData,
    totalReachData,
    videoViewsData,
    uniqueReachData,
    pageViewsData,
    fanAddsData,
    fanRemovesData
  } = data;

  // Combina dati fan adds/removes per grafico
  const fanActivityData = React.useMemo(() => {
      const combined: { [key: string]: { name: string, adds?: number, removes?: number } } = {};
      fanAddsData.forEach(d => {
          if (!combined[d.name]) combined[d.name] = { name: d.name };
          combined[d.name].adds = d.value;
      });
      fanRemovesData.forEach(d => {
          if (!combined[d.name]) combined[d.name] = { name: d.name };
          combined[d.name].removes = d.value; // Valore negativo per visualizzazione?
      });
      // Ordina per data se necessario (assumendo che 'name' sia la data)
      return Object.values(combined).sort((a, b) => a.name.localeCompare(b.name));
  }, [fanAddsData, fanRemovesData]);

  return (
    <div className="space-y-6">
      {/* Controlli Data/Periodo */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Insights</h2>
          <p className="text-muted-foreground">
            Performance reali della tua pagina Facebook
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Date picker personalizzato - Mantenuto con posizionamento corretto */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`flex items-center gap-1 h-10 ${isCustomDateActive ? "border-primary" : ""}`}
                disabled={isLoadingData} // Disabilita durante il caricamento
                onClick={() => {
                   // Segnala al padre l'intenzione di cambiare range (tramite callback)
                   // Il padre aggiornerà selectedDateRange e isCustomDateActive
                   // e li ripasserà come props aggiornate.
                   // Non serve più calcolare date qui, lo fa il padre.
                   // Chiamiamo onDateRangeChange con il range attuale per signalare
                   onDateRangeChange(selectedDateRange);
                }}
              >
                <CalendarIcon className="h-4 w-4" />
                {/* Usa la prop isCustomDateActive e selectedDateRange */} 
                {isCustomDateActive && selectedDateRange.from ? (
                  <span>
                    {format(selectedDateRange.from, "dd/MM/yy", { locale: it })} - 
                    {selectedDateRange.to ? format(selectedDateRange.to, "dd/MM/yy", { locale: it }) : ""}
                  </span>
                ) : (
                  <span>Range personalizzato</span>
                )}
              </Button>
            </PopoverTrigger>
             {/* Posizionato sotto, allineato a destra */}
            <PopoverContent className="w-auto p-0" align="end" side="bottom" sideOffset={5}>
              <Calendar
                mode="range"
                // Usa la prop selectedDateRange
                selected={selectedDateRange} 
                onSelect={(range) => {
                   // Chiama direttamente la callback del padre se il range è valido
                   if (range?.from) { 
                      onDateRangeChange(range);
                   } 
                }}
                disabled={(date) => {
                  const twoYearsAgo = new Date();
                  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
                  return date > new Date() || date < twoYearsAgo;
                }}
                initialFocus
                locale={it}
                footer={
                  <div className="p-2 border-t flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">Max 90 giorni</div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // Segnala al padre di resettare al periodo default (14d)
                        onTimeRangeChange('14d');
                      }}
                    >
                      Reset Periodo
                    </Button>
                  </div>
                }
              />
            </PopoverContent>
          </Popover>

          {/* Selectbox periodo predefinito */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <Select 
                    // Usa la prop selectedTimeRange, mostra vuoto se custom è attivo
                    value={isCustomDateActive ? '' : selectedTimeRange} 
                    onValueChange={(value) => {
                       // Chiama la callback del padre se un valore valido è selezionato
                       if (value) { 
                           onTimeRangeChange(value);
                       }
                    }}
                    disabled={isLoadingData} // Disabilita durante il caricamento
                  >
                    <SelectTrigger className="w-[180px]">
                       {/* Modifica: Mostra testo custom o il valore selezionato */}
                       {isCustomDateActive ? (
                           <span className="text-muted-foreground">Range Personalizzato</span>
                       ) : (
                           <SelectValue placeholder="Seleziona periodo" />
                       )}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Ultimi 7 giorni</SelectItem>
                      <SelectItem value="14d">Ultimi 14 giorni</SelectItem>
                      <SelectItem value="30d">Ultimi 30 giorni</SelectItem>
                      <SelectItem value="90d">Ultimi 90 giorni</SelectItem>
                       {/* Rimosso: Opzione vuota non più necessaria qui */}
                       {/* {isCustomDateActive && <SelectItem value="" disabled>Range Personalizzato</SelectItem>} */}
                    </SelectContent>
                  </Select>
                   {/* Tooltip Help rimosso per semplicità, può essere aggiunto se necessario */}
                </div>
              </TooltipTrigger>
               {/* Tooltip Content rimosso per semplicità */}
            </Tooltip>
          </TooltipProvider>
          
           {/* Rimosso Menu filtri avanzati e Esportazione per semplicità */}
        </div>
      </div>

      {/* Key Metrics Reali - Aggiunte nuove card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4"> {/* Aumentato a 5 colonne */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Follower Attuali</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentFollowers.toLocaleString()}</div>
             {/* Mostra crescita solo se calcolata */}
            {parseFloat(followerGrowthPercentage) !== 0 && (
                 <div className={`flex items-center text-xs ${parseFloat(followerGrowthPercentage) > 0 ? "text-emerald-500" : "text-red-500"} pt-1`}>
                    {parseFloat(followerGrowthPercentage) > 0 ? (
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                     ) : (
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                     )}
                    <span>{followerGrowthPercentage}%</span>
                    <span className="text-muted-foreground ml-1">nel periodo</span>
                 </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Nuovi Fan</CardTitle>
             <Users className="h-4 w-4 text-muted-foreground" /> 
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFanAdds.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground pt-1">
              Totale nel periodo selezionato
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Visualizzazioni Pagina</CardTitle>
             <Eye className="h-4 w-4 text-muted-foreground" /> 
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPageViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground pt-1">
              Totale nel periodo selezionato
            </p>
          </CardContent>
        </Card>
      </div>

       {/* Grafici Reali - Aggiunti nuovi grafici */} 
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Grafico Crescita Follower */}
          <ChartContainer title="Crescita Follower" description="Follower totali nel periodo selezionato" data={growthData} dataKey="value" dataName="Follower">
             <LineChart data={growthData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
               <CartesianGrid strokeDasharray="3 3" />
               <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
               <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => value.toLocaleString()} domain={['dataMin - 10', 'dataMax + 10']}/>
               <RechartsTooltip formatter={(value: number) => [`${value.toLocaleString()}`, "Follower"]}/>
               <Legend />
               <Line type="monotone" dataKey="value" name="Follower" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 6 }}/>
             </LineChart>
          </ChartContainer>

          {/* Grafico Engagement Totale */}
           <ChartContainer title="Engagement Totale" description="Interazioni totali (like, commenti, condivisioni, ecc.) nel periodo" data={totalEngagementData} dataKey="value" dataName="Engagement">
               <BarChart data={totalEngagementData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="3 3" />
                 <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                 <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => value.toLocaleString()} />
                 <RechartsTooltip formatter={(value: number) => [`${value.toLocaleString()}`, "Engagement"]}/>
                 <Legend />
                 <Bar dataKey="value" name="Engagement" fill="#10b981" radius={[4, 4, 0, 0]} />
               </BarChart>
           </ChartContainer>

           {/* Grafico Reach Totale */}
           <ChartContainer title="Reach Totale" description="Visualizzazioni totali dei contenuti nel periodo" data={totalReachData} dataKey="value" dataName="Reach">
               <LineChart data={totalReachData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="3 3" />
                 <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                 <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => value.toLocaleString()} />
                 <RechartsTooltip formatter={(value: number) => [`${value.toLocaleString()}`, "Reach"]}/>
                 <Legend />
                 <Line type="monotone" dataKey="value" name="Reach" stroke="#f97316" strokeWidth={2} dot={false} activeDot={{ r: 6 }}/>
               </LineChart>
           </ChartContainer>

           {/* Grafico Visualizzazioni Video */}
           <ChartContainer title="Visualizzazioni Video" description="Visualizzazioni totali dei video nel periodo" data={videoViewsData} dataKey="value" dataName="Visualizzazioni">
               <LineChart data={videoViewsData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="3 3" />
                 <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                 <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => value.toLocaleString()} />
                 <RechartsTooltip formatter={(value: number) => [`${value.toLocaleString()}`, "Visualizzazioni"]}/>
                 <Legend />
                 <Line type="monotone" dataKey="value" name="Visualizzazioni" stroke="#8b5cf6" strokeWidth={2} dot={false} activeDot={{ r: 6 }}/>
               </LineChart>
           </ChartContainer>

           {/* Nuovo Grafico: Reach Unica */} 
           <ChartContainer title="Reach Unica" description="Persone uniche raggiunte dai contenuti nel periodo" data={uniqueReachData} dataKey="value" dataName="Persone Raggiunte">
                <LineChart data={uniqueReachData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="3 3" />
                 <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                 <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => value.toLocaleString()} />
                 <RechartsTooltip formatter={(value: number) => [`${value.toLocaleString()}`, "Persone Raggiunte"]}/>
                 <Legend />
                 <Line type="monotone" dataKey="value" name="Persone Raggiunte" stroke="#ea580c" strokeWidth={2} dot={false} activeDot={{ r: 6 }}/>
               </LineChart>
           </ChartContainer>
           
            {/* Nuovo Grafico: Visualizzazioni Pagina */} 
           <ChartContainer title="Visualizzazioni Pagina" description="Visualizzazioni totali del profilo della pagina" data={pageViewsData} dataKey="value" dataName="Visualizzazioni">
                <LineChart data={pageViewsData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="3 3" />
                 <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                 <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => value.toLocaleString()} />
                 <RechartsTooltip formatter={(value: number) => [`${value.toLocaleString()}`, "Visualizzazioni"]}/>
                 <Legend />
                 <Line type="monotone" dataKey="value" name="Visualizzazioni" stroke="#ca8a04" strokeWidth={2} dot={false} activeDot={{ r: 6 }}/>
               </LineChart>
           </ChartContainer>
           
            {/* Nuovo Grafico: Fan Aggiunti/Rimossi */} 
           <ChartContainer title="Fan Aggiunti / Rimossi" description="Nuovi 'Mi Piace' e 'Non Mi Piace Più' nel periodo" data={fanActivityData} dataKey="adds" dataName="Nuovi Fan">
                <BarChart data={fanActivityData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => value.toLocaleString()} />
                  <RechartsTooltip formatter={(value: number, name) => [`${value.toLocaleString()}`, name === 'adds' ? 'Nuovi Fan' : 'Fan Rimossi']}/>
                  <Legend />
                  <Bar dataKey="adds" name="Nuovi Fan" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="removes" name="Fan Rimossi" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
           </ChartContainer>
           
       </div>
       
    </div>
  );
};

export default InsightsPanel;
