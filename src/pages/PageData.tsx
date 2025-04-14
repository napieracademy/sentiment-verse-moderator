
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import Header from "@/components/dashboard/Header";
import Footer from "@/components/dashboard/Footer";

interface FacebookPage {
  id: string;
  name: string;
  category: string;
  picture: {
    data: {
      url: string;
    }
  };
  fan_count: number;
  link: string;
  about?: string;
  description?: string;
  followers_count?: number;
  location?: {
    city: string;
    country: string;
  };
}

const PageData = () => {
  const navigate = useNavigate();
  const [pages, setPages] = useState<FacebookPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<FacebookPage | null>(null);

  useEffect(() => {
    // Check if the user is logged in to Facebook
    if (typeof window.FB === 'undefined') {
      toast({
        title: "Errore di inizializzazione",
        description: "Il componente Facebook SDK non è stato caricato correttamente.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    // Get user login status
    window.FB.getLoginStatus((response) => {
      if (response.status !== 'connected') {
        toast({
          title: "Autenticazione richiesta",
          description: "Devi accedere con Facebook per visualizzare le tue pagine.",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      // Get user's pages
      fetchUserPages(response.authResponse.accessToken);
    });
  }, [navigate]);

  const fetchUserPages = (accessToken: string) => {
    window.FB.api('/me/accounts', { access_token: accessToken }, (response) => {
      if (response && !response.error) {
        if (response.data && response.data.length > 0) {
          setPages(response.data);
          setSelectedPage(response.data[0]); // Select the first page by default
        } else {
          toast({
            title: "Nessuna pagina trovata",
            description: "Non hai accesso a nessuna pagina Facebook.",
          });
        }
      } else {
        toast({
          title: "Errore",
          description: "Impossibile recuperare le informazioni delle pagine: " + (response.error?.message || "errore sconosciuto"),
          variant: "destructive"
        });
      }
      setLoading(false);
    });
  };

  const fetchPageDetails = (pageId: string, accessToken: string) => {
    setLoading(true);
    
    window.FB.api(
      `/${pageId}`,
      'GET',
      {
        fields: 'id,name,category,picture,fan_count,link,about,description,followers_count,location',
        access_token: accessToken
      },
      (response) => {
        if (response && !response.error) {
          setSelectedPage(response);
        } else {
          toast({
            title: "Errore",
            description: "Impossibile recuperare i dettagli della pagina: " + (response.error?.message || "errore sconosciuto"),
            variant: "destructive"
          });
        }
        setLoading(false);
      }
    );
  };

  const handleSelectPage = (page: FacebookPage) => {
    window.FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
        fetchPageDetails(page.id, response.authResponse.accessToken);
      }
    });
  };

  const handleGoToDashboard = () => {
    if (selectedPage) {
      // Store selected page info in localStorage
      localStorage.setItem('selectedPage', JSON.stringify(selectedPage));
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 p-6 bg-gray-50">
        <div className="container mx-auto space-y-6">
          <h1 className="text-3xl font-bold mb-6">Le tue pagine Facebook</h1>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-facebook" />
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Pagine collegate</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {pages.length === 0 ? (
                      <p className="p-4 text-sm text-muted-foreground">Nessuna pagina trovata</p>
                    ) : (
                      <div className="max-h-[500px] overflow-y-auto">
                        {pages.map((page) => (
                          <div 
                            key={page.id}
                            className={`flex items-center p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${selectedPage?.id === page.id ? 'bg-blue-50' : ''}`}
                            onClick={() => handleSelectPage(page)}
                          >
                            {page.picture?.data?.url ? (
                              <img src={page.picture.data.url} alt={page.name} className="h-10 w-10 rounded-md object-cover" />
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-500">
                                P
                              </div>
                            )}
                            <div className="ml-3 flex-1">
                              <p className="font-medium">{page.name}</p>
                              <p className="text-xs text-muted-foreground">{page.category}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-2">
                {selectedPage ? (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">Dettagli Pagina</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-4 mb-6">
                        {selectedPage.picture?.data?.url ? (
                          <img 
                            src={selectedPage.picture.data.url} 
                            alt={selectedPage.name}
                            className="h-24 w-24 rounded-lg object-cover" 
                          />
                        ) : (
                          <div className="h-24 w-24 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 text-xl">
                            {selectedPage.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h3 className="text-2xl font-bold">{selectedPage.name}</h3>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <span>{selectedPage.category}</span>
                            {selectedPage.followers_count && (
                              <>
                                <span className="mx-2">•</span>
                                <span>{selectedPage.followers_count.toLocaleString('it-IT')} follower</span>
                              </>
                            )}
                          </div>
                          {selectedPage.link && (
                            <a 
                              href={selectedPage.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline mt-1 inline-block"
                            >
                              Visita pagina
                            </a>
                          )}
                        </div>
                      </div>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[200px]">Proprietà</TableHead>
                            <TableHead>Valore</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">ID</TableCell>
                            <TableCell>{selectedPage.id}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Fan count</TableCell>
                            <TableCell>{selectedPage.fan_count?.toLocaleString('it-IT') || 'N/A'}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Follower count</TableCell>
                            <TableCell>{selectedPage.followers_count?.toLocaleString('it-IT') || 'N/A'}</TableCell>
                          </TableRow>
                          {selectedPage.about && (
                            <TableRow>
                              <TableCell className="font-medium">About</TableCell>
                              <TableCell>{selectedPage.about}</TableCell>
                            </TableRow>
                          )}
                          {selectedPage.description && (
                            <TableRow>
                              <TableCell className="font-medium">Descrizione</TableCell>
                              <TableCell>{selectedPage.description}</TableCell>
                            </TableRow>
                          )}
                          {selectedPage.location && (
                            <TableRow>
                              <TableCell className="font-medium">Località</TableCell>
                              <TableCell>
                                {selectedPage.location.city}, {selectedPage.location.country}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                      
                      <div className="mt-6">
                        <Button onClick={handleGoToDashboard}>
                          Analizza questa pagina
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-6 flex flex-col items-center justify-center h-[400px] text-center">
                      <p className="text-muted-foreground mb-4">
                        Seleziona una pagina dalla lista per visualizzarne i dettagli
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PageData;
