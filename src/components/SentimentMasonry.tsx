
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSentimentStats } from "@/lib/mockData";
import { BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar } from "recharts";

const SentimentMasonry = () => {
  const stats = getSentimentStats();
  const mockTimeData = [
    { name: "Lun", commenti: 34, reazioni: 78 },
    { name: "Mar", commenti: 42, reazioni: 89 },
    { name: "Mer", commenti: 52, reazioni: 110 },
    { name: "Gio", commenti: 39, reazioni: 85 },
    { name: "Ven", commenti: 45, reazioni: 95 },
    { name: "Sab", commenti: 58, reazioni: 130 },
    { name: "Dom", commenti: 35, reazioni: 75 },
  ];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Statistiche di Sentiment</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min">
        {/* Card per l'andamento nel tempo - occupa 2 colonne */}
        <Card className="md:col-span-2 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Andamento delle Interazioni nel Tempo</CardTitle>
            <CardDescription>Commenti e reazioni degli ultimi 7 giorni</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockTimeData}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="commenti" name="Commenti" fill="#10B981" />
                <Bar dataKey="reazioni" name="Reazioni" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Card per la distribuzione del sentiment */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Distribuzione del Sentiment</CardTitle>
            <CardDescription>Panoramica dei commenti per tipo di sentiment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Positivi</span>
                  <span className="font-medium">{stats.positive.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-positive rounded-full h-2"
                    style={{ width: `${stats.positive.percentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Neutri</span>
                  <span className="font-medium">{stats.neutral.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-neutral rounded-full h-2"
                    style={{ width: `${stats.neutral.percentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Negativi</span>
                  <span className="font-medium">{stats.negative.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-negative rounded-full h-2"
                    style={{ width: `${stats.negative.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card per le parole chiave - altezza maggiore */}
        <Card className="row-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Parole chiave</CardTitle>
            <CardDescription>Termini più utilizzati nei commenti</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { word: "qualità", count: 42, sentiment: "positive" },
                { word: "servizio", count: 38, sentiment: "positive" },
                { word: "prezzo", count: 24, sentiment: "neutral" },
                { word: "attesa", count: 18, sentiment: "negative" },
                { word: "atmosfera", count: 16, sentiment: "positive" },
                { word: "locale", count: 14, sentiment: "neutral" },
                { word: "personale", count: 12, sentiment: "positive" },
                { word: "rumoroso", count: 10, sentiment: "negative" },
              ].map((item) => (
                <div key={item.word} className="flex items-center justify-between">
                  <span className={`text-${item.sentiment === "positive" ? "positive" : item.sentiment === "negative" ? "negative" : "neutral"} font-medium`}>
                    #{item.word}
                  </span>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Card per l'engagement */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Engagement</CardTitle>
            <CardDescription>Statistiche di interazione con la Pagina</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Tasso di engagement</p>
                <p className="text-2xl font-bold">{stats.engagementRate}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Commenti per post</p>
                <p className="text-2xl font-bold">{stats.commentsPerPost}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card per i commenti totali */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Commenti Totali</CardTitle>
            <CardDescription>Dettaglio numerico dei commenti</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Totali</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground text-positive">Positivi</p>
                <p className="text-2xl font-bold text-positive">{stats.positive.count}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground text-negative">Negativi</p>
                <p className="text-2xl font-bold text-negative">{stats.negative.count}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card per gli utenti più attivi */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Utenti più attivi</CardTitle>
            <CardDescription>Chi commenta di più la tua pagina</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Marco Rossi", comments: 12, sentiment: "positive" },
                { name: "Giulia Bianchi", comments: 8, sentiment: "neutral" },
                { name: "Luca Verdi", comments: 7, sentiment: "negative" },
                { name: "Sofia Conti", comments: 5, sentiment: "positive" },
              ].map((user, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                      <img
                        src={`https://i.pravatar.cc/150?img=${index + 10}`}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded bg-${user.sentiment === "positive" ? "green" : user.sentiment === "negative" ? "red" : "gray"}-100 text-${user.sentiment === "positive" ? "green" : user.sentiment === "negative" ? "red" : "gray"}-800`}>
                    {user.comments} commenti
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Card per i post più commentati */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Post più commentati</CardTitle>
            <CardDescription>I contenuti con maggiore interazione</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { title: "Nuovi orari estivi", comments: 28, reactions: 156 },
                { title: "Promozione weekend", comments: 23, reactions: 112 },
                { title: "Nuovi prodotti", comments: 18, reactions: 89 },
              ].map((post, index) => (
                <div key={index} className="border rounded-md p-3">
                  <div className="font-medium">{post.title}</div>
                  <div className="flex justify-between mt-2 text-sm">
                    <div className="flex items-center space-x-1">
                      <span className="text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                      </span>
                      <span>{post.comments}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                        </svg>
                      </span>
                      <span>{post.reactions}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SentimentMasonry;
