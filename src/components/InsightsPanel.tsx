import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  BarChart, LineChart, PieChart, ResponsiveContainer, 
  Bar, Line, Pie, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, Legend, Cell
} from 'recharts';
import { 
  ArrowUpRight, ArrowDownRight, Users, MessageSquare, Eye,
  BarChart2, Download, TrendingUp, FileText, HelpCircle, Info,
  Filter, MoreHorizontal, DownloadCloud, FileSpreadsheet, Share2, RefreshCcw
} from 'lucide-react';

// Tipi per i dati reali
export interface InsightsData {
  growthData: Array<{ name: string; followers: number }>;
  engagementData: Array<{ name: string; comments: number; reactions: number }>;
  demographicsData: Array<{ name: string; value: number }>;
  locationData: Array<{ name: string; value: number }>;
  sentimentTrend: Array<{ date: string; positive: number; negative: number; neutral: number }>;
  followerGrowthPercentage: string;
  totalComments: number;
  totalReactions: number;
  averageEngagementRate: string;
  totalReach: number;
  reachGrowth: number;
}

interface InsightsPanelProps {
  data: InsightsData;
  onDateRangeChange?: (range: { from: Date; to?: Date }) => void;
  onTimeRangeChange?: (range: string) => void;
  isLoadingData?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const InsightsPanel = ({ 
  data, 
  onDateRangeChange,
  onTimeRangeChange,
  isLoadingData = false
}: InsightsPanelProps) => {
  const [timeRange, setTimeRange] = useState('14d');
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to?: Date;
  }>({
    from: subDays(new Date(), 14),
    to: new Date()
  });
  const [isCustomDateActive, setIsCustomDateActive] = useState(false);

  // Aggiorna dateRange quando cambiano i dati (quando arrivano nuovi dati dall'API)
  useEffect(() => {
    if (data && data.growthData && data.growthData.length > 0) {
      // Tenta di ottenere le date reali dai dati API
      try {
        const firstDate = data.growthData[0]?.name;
        const lastDate = data.growthData[data.growthData.length - 1]?.name;
        if (firstDate && lastDate) {
          console.log("Date dai dati API:", firstDate, lastDate);
        }
      } catch (e) {
        console.error("Errore nell'analisi delle date dai dati:", e);
      }
    }
  }, [data]);

  // Sostituisci i dati mock con quelli reali dalla prop data
  const growthData = data.growthData;
  const engagementData = data.engagementData;
  const demographicsData = data.demographicsData;
  const locationData = data.locationData;
  const sentimentTrend = data.sentimentTrend;
  const followerGrowthPercentage = data.followerGrowthPercentage;
  const totalComments = data.totalComments;
  const totalReactions = data.totalReactions;
  const averageEngagementRate = data.averageEngagementRate;
  const totalReach = data.totalReach;
  const reachGrowth = data.reachGrowth;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Insights</h2>
          <p className="text-muted-foreground">
            Analisi delle performance e dell'engagement della tua pagina
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Date picker personalizzato */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`flex items-center gap-1 h-10 ${isCustomDateActive ? "border-primary" : ""}`}
                onClick={() => setIsCustomDateActive(true)}
              >
                <CalendarIcon className="h-4 w-4" />
                {isCustomDateActive ? (
                  <span>
                    {dateRange.from ? format(dateRange.from, "dd/MM/yyyy", { locale: it }) : ""} - 
                    {dateRange.to ? format(dateRange.to, "dd/MM/yyyy", { locale: it }) : ""}
                  </span>
                ) : (
                  <span>Range personalizzato</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  setDateRange(range);
                  setIsCustomDateActive(true);
                  if (onDateRangeChange) {
                    onDateRangeChange(range);
                  }
                }}
                disabled={(date) => {
                  // Disabilita date future e date più vecchie di 2 anni
                  const twoYearsAgo = new Date();
                  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
                  return date > new Date() || date < twoYearsAgo;
                }}
                initialFocus
                locale={it}
                footer={
                  <div className="p-2 border-t flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">Max 90 giorni per richiesta</div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setIsCustomDateActive(false);
                        setTimeRange('14d');
                        if (onTimeRangeChange) {
                          onTimeRangeChange('14d');
                        }
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                }
              />
            </PopoverContent>
          </Popover>

          {/* Filtri avanzati */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtri avanzati</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Aggregazione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Giornaliera</SelectItem>
                    <SelectItem value="week">Settimanale</SelectItem>
                    <SelectItem value="days_28">28 giorni</SelectItem>
                    <SelectItem value="month">Mensile</SelectItem>
                    <SelectItem value="lifetime">Lifetime</SelectItem>
                  </SelectContent>
                </Select>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tipo di contenuto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutti i contenuti</SelectItem>
                    <SelectItem value="photo">Foto</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                    <SelectItem value="text">Solo testo</SelectItem>
                  </SelectContent>
                </Select>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button variant="outline" size="sm" className="w-full">
                  <RefreshCcw className="h-3.5 w-3.5 mr-1" />
                  Applica filtri
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Selectbox periodo predefinito */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <Select 
                    value={timeRange} 
                    onValueChange={(value) => {
                      setTimeRange(value);
                      setIsCustomDateActive(false);
                      if (onTimeRangeChange) {
                        onTimeRangeChange(value);
                      }
                    }}
                    disabled={isCustomDateActive}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Seleziona periodo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Ultimi 7 giorni</SelectItem>
                      <SelectItem value="14d">Ultimi 14 giorni</SelectItem>
                      <SelectItem value="30d">Ultimi 30 giorni</SelectItem>
                      <SelectItem value="90d">Ultimi 90 giorni (massimo)</SelectItem>
                    </SelectContent>
                  </Select>
                  <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                Il limite massimo per singola richiesta API Facebook è di 90 giorni.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Menu di esportazione avanzata */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <DownloadCloud className="h-4 w-4" />
                <span>Esporta</span>
                <MoreHorizontal className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Esporta dati</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <FileSpreadsheet className="h-4 w-4" />
                <span>Esporta in CSV</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <Download className="h-4 w-4" />
                <span>Esporta in Excel</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <Share2 className="h-4 w-4" />
                <span>Condividi report</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Info className="h-3.5 w-3.5 mr-1" />
                      <span>Limitazioni API Facebook</span>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Limitazioni API Facebook</h4>
                      <ul className="text-xs space-y-1.5 text-muted-foreground list-disc list-inside">
                        <li>Massimo 90 giorni di dati per singola richiesta API</li>
                        <li>Dati disponibili fino a 2 anni nel passato</li>
                        <li>Aggregazioni disponibili: day, week, days_28, month, lifetime</li>
                      </ul>
                      <p className="text-xs text-muted-foreground">Per periodi più lunghi di 90 giorni, è necessario suddividere le richieste.</p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Follower</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,231</div>
            <div className="flex items-center text-xs text-muted-foreground pt-1">
              {parseFloat(followerGrowthPercentage) > 0 ? (
                <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={parseFloat(followerGrowthPercentage) > 0 ? "text-emerald-500" : "text-red-500"}>
                {followerGrowthPercentage}%
              </span>
              <span className="ml-1">negli ultimi 14 giorni</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Commenti</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComments}</div>
            <div className="flex items-center text-xs text-muted-foreground pt-1">
              <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1" />
              <span className="text-emerald-500">12.5%</span>
              <span className="ml-1">rispetto al periodo precedente</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageEngagementRate}%</div>
            <div className="flex items-center text-xs text-muted-foreground pt-1">
              <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1" />
              <span className="text-emerald-500">3.2%</span>
              <span className="ml-1">rispetto al periodo precedente</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Reach</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReach.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground pt-1">
              <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1" />
              <span className="text-emerald-500">{reachGrowth}%</span>
              <span className="ml-1">rispetto al periodo precedente</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Insights Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <BarChart2 className="h-4 w-4" />
            <span>Panoramica</span>
          </TabsTrigger>
          <TabsTrigger value="sentiment" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>Sentiment</span>
          </TabsTrigger>
          <TabsTrigger value="audience" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Audience</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Crescita Follower</CardTitle>
                <CardDescription>
                  Trend di crescita dei follower negli ultimi 14 giorni
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={growthData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={['dataMin - 50', 'dataMax + 50']} />
                      <RechartsTooltip formatter={(value) => [`${value} follower`, 'Totale']} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="followers" 
                        name="Follower" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground flex gap-1 items-center">
                <Calendar className="h-4 w-4" />
                <span>Dati aggiornati al 13 Apr 2025</span>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Engagement</CardTitle>
                <CardDescription>
                  Commenti e reazioni nell'ultimo periodo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={engagementData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="comments" name="Commenti" fill="#3b82f6" />
                      <Bar dataKey="reactions" name="Reazioni" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Post Performance</CardTitle>
                <CardDescription>
                  Performance dei tuoi contenuti recenti
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-md p-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Nuovi orari estivi</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Top Post</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Pubblicato: 11 Apr 2025</div>
                    <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                      <div>
                        <div className="text-sm font-semibold">342</div>
                        <div className="text-xs text-gray-500">Reactions</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold">78</div>
                        <div className="text-xs text-gray-500">Commenti</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold">2.4k</div>
                        <div className="text-xs text-gray-500">Reach</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Nuovi prodotti in arrivo</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Trending</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Pubblicato: 8 Apr 2025</div>
                    <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                      <div>
                        <div className="text-sm font-semibold">287</div>
                        <div className="text-xs text-gray-500">Reactions</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold">56</div>
                        <div className="text-xs text-gray-500">Commenti</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold">1.9k</div>
                        <div className="text-xs text-gray-500">Reach</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Offerta speciale weekend</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Pubblicato: 5 Apr 2025</div>
                    <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                      <div>
                        <div className="text-sm font-semibold">198</div>
                        <div className="text-xs text-gray-500">Reactions</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold">43</div>
                        <div className="text-xs text-gray-500">Commenti</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold">1.3k</div>
                        <div className="text-xs text-gray-500">Reach</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Vedi tutti i post</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Sentiment Tab */}
        <TabsContent value="sentiment" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Trend Sentiment</CardTitle>
                <CardDescription>
                  Andamento del sentiment nei commenti degli ultimi 7 giorni
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={sentimentTrend}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="positive" 
                        name="Positivo" 
                        stroke="#10b981" 
                        strokeWidth={2} 
                        activeDot={{ r: 8 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="negative" 
                        name="Negativo" 
                        stroke="#ef4444" 
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="neutral" 
                        name="Neutro" 
                        stroke="#64748b" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Distribuzione Sentiment</CardTitle>
                <CardDescription>
                  Distribuzione percentuale del sentiment dei commenti
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Positivo', value: 58 },
                          { name: 'Negativo', value: 22 },
                          { name: 'Neutro', value: 20 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#ef4444" />
                        <Cell fill="#64748b" />
                      </Pie>
                      <RechartsTooltip formatter={(value) => [`${value}%`, 'Percentuale']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="text-sm text-center text-muted-foreground">
                Basato sull'analisi di 312 commenti negli ultimi 14 giorni
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Temi più discussi</CardTitle>
                <CardDescription>
                  Argomenti più menzionati nei commenti positivi e negativi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-3 flex items-center">
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                      Temi Positivi
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { topic: 'Qualità', score: 85 },
                        { topic: 'Servizio', score: 78 },
                        { topic: 'Atmosfera', score: 72 },
                        { topic: 'Prezzi', score: 65 },
                      ].map(item => (
                        <div key={item.topic} className="bg-gray-50 p-2 rounded">
                          <div className="flex justify-between text-sm">
                            <span>{item.topic}</span>
                            <span className="font-medium">{item.score}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5">
                            <div 
                              className="bg-green-500 h-1.5 rounded-full" 
                              style={{ width: `${item.score}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-3 flex items-center">
                      <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                      Temi Negativi
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { topic: 'Attesa', score: 68 },
                        { topic: 'Rumore', score: 52 },
                        { topic: 'Porzioni', score: 45 },
                        { topic: 'Parcheggio', score: 38 },
                      ].map(item => (
                        <div key={item.topic} className="bg-gray-50 p-2 rounded">
                          <div className="flex justify-between text-sm">
                            <span>{item.topic}</span>
                            <span className="font-medium">{item.score}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5">
                            <div 
                              className="bg-red-500 h-1.5 rounded-full" 
                              style={{ width: `${item.score}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Audience Tab */}
        <TabsContent value="audience" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Demografia</CardTitle>
                <CardDescription>
                  Distribuzione demografica dei tuoi follower
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={demographicsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {demographicsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value) => [`${value}%`, 'Percentuale']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Località</CardTitle>
                <CardDescription>
                  Distribuzione geografica dei tuoi follower
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={locationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {locationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value) => [`${value}%`, 'Percentuale']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Comportamento Audience</CardTitle>
                <CardDescription>
                  Quando i tuoi follower sono più attivi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { hour: '00:00', activity: 12 },
                        { hour: '03:00', activity: 5 },
                        { hour: '06:00', activity: 8 },
                        { hour: '09:00', activity: 45 },
                        { hour: '12:00', activity: 78 },
                        { hour: '15:00', activity: 85 },
                        { hour: '18:00', activity: 100 },
                        { hour: '21:00', activity: 65 },
                      ]}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <RechartsTooltip formatter={(value) => [`${value}%`, 'Attività']} />
                      <Legend />
                      <Bar 
                        dataKey="activity" 
                        name="Attività" 
                        fill="#8884d8" 
                        radius={[4, 4, 0, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <HelpCircle className="h-4 w-4" />
                  I dati mostrano quando la tua audience è più attiva
                </span>
                <Button variant="link" className="text-sm">Vedi dettagli</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InsightsPanel;
