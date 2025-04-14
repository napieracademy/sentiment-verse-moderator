
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type FacebookPage = {
  id: string;
  name: string;
  category: string;
  picture?: {
    data: {
      url: string;
    }
  };
  access_token: string;
};

const PageSelectionModal = ({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [pages, setPages] = useState<FacebookPage[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!open) return;
    
    const fetchPages = () => {
      setLoading(true);
      
      if (typeof window.FB === 'undefined') {
        toast({
          title: "Errore",
          description: "SDK di Facebook non caricato. Riprova più tardi.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      window.FB.getLoginStatus((response) => {
        if (response.status !== 'connected') {
          setLoading(false);
          return;
        }
        
        window.FB.api(
          '/me/accounts',
          { access_token: response.authResponse.accessToken },
          (response) => {
            if (response && !response.error) {
              if (response.data && response.data.length > 0) {
                setPages(response.data);
              } else {
                toast({
                  title: "Nessuna pagina trovata",
                  description: "Non hai accesso a nessuna pagina Facebook.",
                });
              }
            } else {
              toast({
                title: "Errore",
                description: "Impossibile recuperare le tue pagine: " + 
                  (response.error?.message || "errore sconosciuto"),
                variant: "destructive"
              });
            }
            setLoading(false);
          }
        );
      });
    };

    fetchPages();
  }, [open, toast]);

  const handleSelectPage = () => {
    if (!selectedPageId) return;
    
    const selectedPage = pages.find(page => page.id === selectedPageId);
    if (!selectedPage) {
      toast({
        title: "Errore",
        description: "Pagina non trovata",
        variant: "destructive"
      });
      return;
    }
    
    // Fetch more detailed page information with the page access token
    window.FB.api(
      `/${selectedPageId}`,
      'GET',
      {
        fields: 'id,name,category,picture,fan_count,link,about,description,followers_count,location',
        access_token: selectedPage.access_token
      },
      (response) => {
        if (response && !response.error) {
          localStorage.setItem("selectedPage", JSON.stringify(response));
          localStorage.setItem("pageAccessToken", selectedPage.access_token);
          onOpenChange(false);
          navigate('/dashboard');
        } else {
          toast({
            title: "Errore",
            description: "Impossibile recuperare i dettagli della pagina: " + 
              (response.error?.message || "errore sconosciuto"),
            variant: "destructive"
          });
        }
      }
    );
  };
  
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-white border-neutral-200 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-light text-neutral-800">
            Seleziona una Pagina
          </DialogTitle>
          <DialogDescription className="text-center text-neutral-500">
            Scegli la Pagina Facebook per l'analisi dei commenti
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-2 py-4 max-h-[300px] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-facebook" />
            </div>
          ) : pages.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-neutral-500">
                Non sono state trovate pagine associate al tuo account Facebook.
              </p>
              <p className="text-sm text-neutral-400 mt-2">
                Assicurati di essere amministratore di almeno una pagina Facebook.
              </p>
            </div>
          ) : (
            pages.map(page => (
              <div 
                key={page.id} 
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 
                  ${selectedPageId === page.id ? "bg-neutral-100 border border-neutral-300" : "hover:bg-neutral-50"}`} 
                onClick={() => setSelectedPageId(page.id)}
              >
                <img 
                  src={page.picture?.data?.url} 
                  alt={page.name} 
                  className="h-12 w-12 rounded-md object-cover" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(page.name)}&background=random`;
                  }}
                />
                <div className="flex-1">
                  <h4 className="font-medium text-neutral-800">{page.name}</h4>
                  <p className="text-sm text-neutral-500">
                    {page.category}
                  </p>
                </div>
                <div className="h-5 w-5 flex items-center justify-center">
                  {selectedPageId === page.id && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-neutral-800">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>}
                </div>
              </div>
            ))
          )}
        </div>
        
        <DialogFooter className="flex sm:flex-row sm:justify-end sm:space-x-2 pt-4 border-t border-neutral-100">
          <Button type="button" variant="outline" className="text-neutral-600 border-neutral-300 hover:bg-neutral-100" onClick={() => onOpenChange(false)}>
            Annulla
          </Button>
          <Button 
            type="button" 
            onClick={handleSelectPage} 
            disabled={!selectedPageId || loading} 
            className="bg-black text-white border border-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
          >
            Continua
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
};

export default PageSelectionModal;
