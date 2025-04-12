
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
    navigate('/dashboard');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-white border-neutral-200 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-light text-neutral-800">
            Select a Page
          </DialogTitle>
          <DialogDescription className="text-center text-neutral-500">
            Choose the Facebook Page for comment sentiment analysis
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-2 py-4 max-h-[300px] overflow-y-auto">
          {mockPages.map((page) => (
            <div 
              key={page.id}
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 
                ${selectedPageId === page.id 
                  ? "bg-neutral-100 border border-neutral-300" 
                  : "hover:bg-neutral-50"}`}
              onClick={() => setSelectedPageId(page.id)}
            >
              <img 
                src={page.profilePic} 
                alt={page.name} 
                className="h-12 w-12 rounded-md object-cover grayscale-[50%]"
              />
              <div className="flex-1">
                <h4 className="font-medium text-neutral-800">{page.name}</h4>
                <p className="text-sm text-neutral-500">
                  {page.category} · {page.followers.toLocaleString('en-US')} followers
                </p>
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
                    className="h-5 w-5 text-neutral-800"
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
            className="text-neutral-600 border-neutral-300 hover:bg-neutral-100"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-neutral-900 text-white hover:bg-neutral-700"
            onClick={handleSelectPage}
            disabled={!selectedPageId}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PageSelectionModal;
