
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mockPages } from "@/lib/mockData";
import { useNavigate } from "react-router-dom";

type PageSelectionModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const PageSelectionModal = ({ open, onOpenChange }: PageSelectionModalProps) => {
  const navigate = useNavigate();
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);

  const handleSelectPage = () => {
    if (!selectedPageId) return;
    onOpenChange(false);
    // In a real app, you'd pass the page ID via state or context
    // For this demo, we'll just navigate to the dashboard
    navigate('/dashboard');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Seleziona una Pagina
          </DialogTitle>
          <DialogDescription className="text-center">
            Scegli la Pagina Facebook di cui vuoi analizzare i commenti
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-2 py-4 max-h-[300px] overflow-y-auto">
          {mockPages.map((page) => (
            <div 
              key={page.id}
              className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer hover:bg-gray-100 ${
                selectedPageId === page.id ? "bg-blue-50 border border-facebook" : ""
              }`}
              onClick={() => setSelectedPageId(page.id)}
            >
              <img 
                src={page.profilePic} 
                alt={page.name} 
                className="h-12 w-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium">{page.name}</h4>
                <p className="text-sm text-muted-foreground">{page.category} · {page.followers} follower</p>
              </div>
              <div className="h-5 w-5 flex items-center justify-center">
                {selectedPageId === page.id && (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="h-5 w-5 text-facebook"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Annulla
          </Button>
          <Button
            type="button"
            className="fb-button"
            onClick={handleSelectPage}
            disabled={!selectedPageId}
          >
            Continua
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PageSelectionModal;
