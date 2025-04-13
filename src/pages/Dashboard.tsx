
import { Button } from "@/components/ui/button";
import PageOverview from "@/components/PageOverview";
import CommentTable from "@/components/CommentTable";
import SentimentChart from "@/components/SentimentChart";
import SentimentStats from "@/components/SentimentStats";
import ContentPermissionInfo from "@/components/ContentPermissionInfo";
import ModerationSettings from "@/components/ModerationSettings";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MessageSquare, Mail, Shield, Zap, BarChart2 } from "lucide-react";
import { useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("comments");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b py-3 px-6 bg-white">
        <div className="container flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-facebook p-1.5 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-white"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M13 8H7" />
                <path d="M13 12H7" />
              </svg>
            </div>
            <span className="font-bold">SentimentVerse</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/select-page')}
              variant="outline"
              size="sm"
              className="text-sm"
            >
              Cambia Pagina
            </Button>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format&fit=crop&q=60"
                  alt="User Avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-sm font-medium">Mario Rossi</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">
        <div className="container space-y-6">
          <PageOverview />
          
          <ContentPermissionInfo />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SentimentChart />
            <div>
              <SentimentStats />
            </div>
          </div>
          
          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="comments" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="comments" className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>Commenti</span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Messaggi</span>
              </TabsTrigger>
              <TabsTrigger value="moderation" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Moderazione</span>
              </TabsTrigger>
              <TabsTrigger value="automation" className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Automazione</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center space-x-2">
                <BarChart2 className="h-4 w-4" />
                <span>Insights</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="comments">
              <CommentTable />
            </TabsContent>
            
            <TabsContent value="messages">
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="flex items-center justify-center h-60">
                  <div className="text-center">
                    <Mail className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Messaggi della Pagina</h3>
                    <p className="text-muted-foreground max-w-md">
                      Visualizza e gestisci tutti i messaggi privati inviati alla tua Pagina Facebook.
                      Questa funzionalità richiede l'autorizzazione pages_messaging.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="moderation">
              <ModerationSettings />
            </TabsContent>
            
            <TabsContent value="automation">
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="flex items-center justify-center h-60">
                  <div className="text-center">
                    <Zap className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Automazione Risposte</h3>
                    <p className="text-muted-foreground max-w-md">
                      Configura risposte automatiche, messaggi programmati e flussi di lavoro 
                      per gestire automaticamente le interazioni con gli utenti.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="insights">
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="flex items-center justify-center h-60">
                  <div className="text-center">
                    <BarChart2 className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Analisi Approfondite</h3>
                    <p className="text-muted-foreground max-w-md">
                      Ottieni insight dettagliati sulle performance dei contenuti, 
                      l'engagement degli utenti e le tendenze di crescita della tua Pagina.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-3 bg-white border-t">
        <div className="container">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              © 2025 SentimentVerse. Questa è una demo.
            </div>
            <div className="text-sm">
              <a href="/" className="text-facebook hover:underline">
                Torna alla Home
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
