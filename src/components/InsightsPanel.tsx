
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart, LineChart, PieChart, ResponsiveContainer, 
  Bar, Line, Pie, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, Cell
} from 'recharts';
import { 
  ArrowUpRight, ArrowDownRight, Users, MessageSquare, Eye,
  BarChart2, Download, Calendar, TrendingUp, FileText, HelpCircle
} from 'lucide-react';
import { mockSentimentTrend } from '@/lib/mockData';

// Additional mock data for insights
const growthData = [
  { name: '1 Apr', followers: 5120 },
  { name: '3 Apr', followers: 5145 },
  { name: '5 Apr', followers: 5180 },
  { name: '7 Apr', followers: 5187 },
  { name: '9 Apr', followers: 5210 },
  { name: '11 Apr', followers: 5225 },
  { name: '13 Apr', followers: 5231 },
];

const engagementData = [
  { name: '1 Apr', comments: 34, reactions: 87 },
  { name: '3 Apr', comments: 42, reactions: 103 },
  { name: '5 Apr', comments: 51, reactions: 129 },
  { name: '7 Apr', comments: 38, reactions: 98 },
  { name: '9 Apr', comments: 45, reactions: 112 },
  { name: '11 Apr', comments: 53, reactions: 142 },
  { name: '13 Apr', comments: 49, reactions: 131 },
];

const demographicsData = [
  { name: '18-24', value: 15 },
  { name: '25-34', value: 35 },
  { name: '35-44', value: 25 },
  { name: '45-54', value: 15 },
  { name: '55+', value: 10 },
];

const locationData = [
  { name: 'Roma', value: 35 },
  { name: 'Milano', value: 25 },
  { name: 'Napoli', value: 15 },
  { name: 'Torino', value: 10 },
  { name: 'Bologna', value: 8 },
  { name: 'Altri', value: 7 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const InsightsPanel = () => {
  const [timeRange, setTimeRange] = useState('14d');

  // Calculate summary stats
  const followerGrowth = growthData[growthData.length - 1].followers - growthData[0].followers;
  const followerGrowthPercentage = ((followerGrowth / growthData[0].followers) * 100).toFixed(1);
  
  const totalComments = engagementData.reduce((sum, day) => sum + day.comments, 0);
  const totalReactions = engagementData.reduce((sum, day) => sum + day.reactions, 0);
  
  const averageEngagementRate = (((totalComments + totalReactions) / 7) / growthData[growthData.length - 1].followers * 100).toFixed(1);
  
  const totalReach = 12450;
  const reachGrowth = 8.3;

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
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleziona periodo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Ultimi 7 giorni</SelectItem>
              <SelectItem value="14d">Ultimi 14 giorni</SelectItem>
              <SelectItem value="30d">Ultimi 30 giorni</SelectItem>
              <SelectItem value="90d">Ultimi 90 giorni</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>Esporta</span>
          </Button>
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
                      <Tooltip formatter={(value) => [`${value} follower`, 'Totale']} />
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
                      <Tooltip />
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
                      data={mockSentimentTrend}
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
                      <Tooltip />
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
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentuale']} />
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
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentuale']} />
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
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentuale']} />
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
                      <Tooltip formatter={(value) => [`${value}%`, 'Attività']} />
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
