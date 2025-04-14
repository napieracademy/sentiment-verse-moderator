
import { useState } from "react";
import Header from "@/components/dashboard/Header";
import Footer from "@/components/dashboard/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Check if page data exists in local storage
  const pageData = localStorage.getItem("selectedPage") ? 
    JSON.parse(localStorage.getItem("selectedPage") || "{}") : null;
    
  if (!pageData) {
    return (
      <div className="min-h-screen flex flex-col w-full">
        <Header />
        <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Nessuna pagina selezionata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <p className="text-center text-muted-foreground">
                  Non hai ancora selezionato una pagina Facebook da analizzare.
                </p>
                <Button onClick={() => navigate('/page-data')}>
                  Seleziona una pagina
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col w-full">
      <Header />
      <div className="flex flex-1 relative p-6 bg-gray-50">
        <main className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6">Dati di {pageData.name}</h1>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informazioni sulla Pagina</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    {pageData.picture?.data?.url && (
                      <img 
                        src={pageData.picture.data.url} 
                        alt={pageData.name}
                        className="h-16 w-16 rounded-lg object-cover" 
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-semibold">{pageData.name}</h3>
                      <p className="text-sm text-muted-foreground">{pageData.category}</p>
                      <p className="text-sm">
                        {pageData.followers_count || pageData.fan_count || 0} follower
                      </p>
                      {pageData.link && (
                        <a 
                          href={pageData.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Visita la pagina
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    {pageData.about && (
                      <div>
                        <h4 className="font-medium">Informazioni</h4>
                        <p className="text-sm mt-1">{pageData.about}</p>
                      </div>
                    )}
                    
                    {pageData.description && (
                      <div>
                        <h4 className="font-medium">Descrizione</h4>
                        <p className="text-sm mt-1">{pageData.description}</p>
                      </div>
                    )}
                    
                    {pageData.location && (
                      <div>
                        <h4 className="font-medium">Località</h4>
                        <p className="text-sm mt-1">
                          {pageData.location.city}, {pageData.location.country}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <div className="text-center p-6">
                <p className="text-muted-foreground">
                  Questa versione mostra solo i dati reali della tua pagina Facebook.
                </p>
                <Button onClick={() => navigate('/page-data')} className="mt-4">
                  Seleziona un'altra pagina
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
