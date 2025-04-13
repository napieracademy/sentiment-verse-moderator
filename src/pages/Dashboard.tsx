
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MessageSquare, Mail, Shield, Zap, BarChart2, 
  Bell, Calendar, Search, Tag, Clock, Download, 
  Settings, Home, Users
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

import { 
  Sidebar, SidebarHeader, SidebarContent, SidebarFooter,
  SidebarProvider, SidebarTrigger, SidebarGroup, SidebarGroupLabel,
  SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton,
  SidebarInset
} from "@/components/ui/sidebar";

import PageOverview from "@/components/PageOverview";
import CommentTable from "@/components/CommentTable";
import SentimentChart from "@/components/SentimentChart";
import ContentPermissionInfo from "@/components/ContentPermissionInfo";
import ModerationSettings from "@/components/ModerationSettings";
import MessagesInbox from "@/components/MessagesInbox";
import AutomationRules from "@/components/AutomationRules";
import InsightsPanel from "@/components/InsightsPanel";
import SentimentMasonry from "@/components/SentimentMasonry";
import SentimentStats from "@/components/SentimentStats";

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    value: "comments"
  },
  {
    title: "Commenti",
    icon: MessageSquare,
    value: "comments" 
  },
  {
    title: "Messaggi",
    icon: Mail,
    value: "messages",
    badge: "3"
  },
  {
    title: "Moderazione",
    icon: Shield,
    value: "moderation"
  },
  {
    title: "Automazione",
    icon: Zap,
    value: "automation"
  },
  {
    title: "Analytics",
    icon: BarChart2,
    value: "insights"
  },
  {
    title: "Calendario",
    icon: Calendar,
    value: "calendar"
  },
  {
    title: "Utenti Attivi",
    icon: Users,
    value: "users"
  },
  {
    title: "Tag",
    icon: Tag,
    value: "tags"
  },
  {
    title: "Attività",
    icon: Clock,
    value: "activity"
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("comments");
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex flex-col w-full">
        {/* Header */}
        <header className="border-b py-3 px-6 bg-white z-10">
          <div className="container flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <SidebarTrigger className="mr-2" />
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
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative"
                  onClick={() => setNotificationsVisible(!notificationsVisible)}
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                </Button>
                
                {notificationsVisible && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20 border">
                    <div className="p-3 border-b">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">Notifiche</h3>
                        <Button variant="ghost" size="sm">Segna tutto come letto</Button>
                      </div>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {[
                        { id: 1, title: "Nuovo commento", desc: "Mario ha commentato il tuo post", time: "2 minuti fa", unread: true },
                        { id: 2, title: "Sentiment negativo", desc: "Rilevato commento con sentiment negativo", time: "10 minuti fa", unread: true },
                        { id: 3, title: "Aggiornamento automazione", desc: "L'automazione 'Risposte automatiche' è stata attivata", time: "1 ora fa", unread: false },
                        { id: 4, title: "Nuovo follower", desc: "Luigi ha iniziato a seguire la tua pagina", time: "3 ore fa", unread: false }
                      ].map(notif => (
                        <div key={notif.id} className={`p-3 hover:bg-gray-50 transition-colors cursor-pointer ${notif.unread ? 'border-l-4 border-blue-500' : ''}`}>
                          <div className="font-medium text-sm">{notif.title}</div>
                          <div className="text-xs text-gray-600">{notif.desc}</div>
                          <div className="text-xs text-gray-500 mt-1">{notif.time}</div>
                        </div>
                      ))}
                    </div>
                    <div className="p-2 border-t bg-gray-50">
                      <Button variant="ghost" size="sm" className="w-full text-sm">
                        Visualizza tutte le notifiche
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
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

        <div className="flex flex-1">
          {/* Sidebar */}
          <Sidebar side="left" variant="sidebar" collapsible="icon">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Menu principale</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menuItems.map((item) => (
                      <SidebarMenuItem key={item.value}>
                        <SidebarMenuButton 
                          isActive={activeTab === item.value}
                          tooltip={item.title}
                          onClick={() => setActiveTab(item.value)}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          {item.badge && (
                            <div className="ml-auto bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                              {item.badge}
                            </div>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              
              <SidebarGroup>
                <SidebarGroupLabel>Strumenti</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton tooltip="Esporta dati">
                        <Download className="h-4 w-4" />
                        <span>Esporta dati</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton tooltip="Ricerca">
                        <Search className="h-4 w-4" />
                        <span>Ricerca avanzata</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton tooltip="Impostazioni">
                        <Settings className="h-4 w-4" />
                        <span>Impostazioni</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <div className="p-4 text-xs text-gray-500">
                SentimentVerse v1.0.0
              </div>
            </SidebarFooter>
          </Sidebar>
          
          {/* Main Content */}
          <SidebarInset className="bg-gray-50">
            <main className="flex-1 p-6">
              <div className="container space-y-6">
                {activeTab === "comments" && (
                  <>
                    <PageOverview />
                    
                    <Alert>
                      <AlertTitle>Informazione</AlertTitle>
                      <AlertDescription>
                        Abbiamo rilevato un aumento del 15% nel sentiment positivo negli ultimi 7 giorni!
                      </AlertDescription>
                    </Alert>
                    
                    <ContentPermissionInfo />
                    
                    <CommentTable />
                    
                    <SentimentMasonry />
                  </>
                )}
                
                {activeTab === "messages" && (
                  <>
                    <h1 className="text-2xl font-bold mb-4">Messaggi</h1>
                    <MessagesInbox />
                  </>
                )}
                
                {activeTab === "moderation" && (
                  <>
                    <h1 className="text-2xl font-bold mb-4">Moderazione</h1>
                    <ModerationSettings />
                  </>
                )}
                
                {activeTab === "automation" && (
                  <>
                    <h1 className="text-2xl font-bold mb-4">Automazione</h1>
                    <AutomationRules />
                  </>
                )}
                
                {activeTab === "insights" && (
                  <>
                    <h1 className="text-2xl font-bold mb-4">Insights Analytics</h1>
                    <div className="grid gap-6">
                      <SentimentChart />
                      <SentimentStats />
                      <InsightsPanel />
                    </div>
                  </>
                )}
                
                {activeTab === "calendar" && (
                  <>
                    <h1 className="text-2xl font-bold mb-4">Calendario</h1>
                    <div className="bg-white p-6 rounded-lg border shadow-sm">
                      <p>Il modulo del calendario è in fase di sviluppo.</p>
                    </div>
                  </>
                )}
                
                {activeTab === "users" && (
                  <>
                    <h1 className="text-2xl font-bold mb-4">Utenti Attivi</h1>
                    <div className="bg-white p-6 rounded-lg border shadow-sm">
                      <p>Il modulo per la gestione degli utenti attivi è in fase di sviluppo.</p>
                    </div>
                  </>
                )}
                
                {activeTab === "tags" && (
                  <>
                    <h1 className="text-2xl font-bold mb-4">Tag e Categorie</h1>
                    <div className="bg-white p-6 rounded-lg border shadow-sm">
                      <p>Il modulo per la gestione dei tag è in fase di sviluppo.</p>
                    </div>
                  </>
                )}
                
                {activeTab === "activity" && (
                  <>
                    <h1 className="text-2xl font-bold mb-4">Timeline Attività</h1>
                    <div className="bg-white p-6 rounded-lg border shadow-sm">
                      <p>Il modulo per la visualizzazione della timeline delle attività è in fase di sviluppo.</p>
                    </div>
                  </>
                )}
              </div>
            </main>
          </SidebarInset>
        </div>

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
    </SidebarProvider>
  );
};

export default Dashboard;
