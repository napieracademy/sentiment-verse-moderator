import { useState, useEffect } from "react";
import PageSelectionModal from "@/components/PageSelectionModal";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const SelectPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPageSelectionModalOpen, setIsPageSelectionModalOpen] = useState(false);
  
  useEffect(() => {
    setIsPageSelectionModalOpen(true);
  }, []);
  
  const handleModalOpenChange = (open: boolean) => {
    setIsPageSelectionModalOpen(open);
    if (!open) {
      toast({
        title: "Selezione annullata",
        description: "Nessuna pagina selezionata. Puoi scegliere una pagina in qualsiasi momento.",
      });
      navigate('/welcome');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 to-neutral-100 opacity-50" />
      <PageSelectionModal 
        open={isPageSelectionModalOpen} 
        onOpenChange={handleModalOpenChange} 
      />
    </div>
  );
};

export default SelectPage;
