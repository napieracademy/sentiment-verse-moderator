
import { Button } from "@/components/ui/button";
import PageOverview from "@/components/PageOverview";
import CommentTable from "@/components/CommentTable";
import SentimentChart from "@/components/SentimentChart";
import SentimentStats from "@/components/SentimentStats";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SentimentChart />
            <div>
              <SentimentStats />
            </div>
          </div>
          
          <CommentTable />
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
