
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
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

interface DashboardContentProps {
  activeTab: string;
}

const DashboardContent = ({ activeTab }: DashboardContentProps) => {
  return (
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
  );
};

export default DashboardContent;
