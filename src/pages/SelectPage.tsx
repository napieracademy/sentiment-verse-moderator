
import { useState, useEffect } from "react";
import PageSelectionModal from "@/components/PageSelectionModal";
import { useNavigate } from "react-router-dom";

const SelectPage = () => {
  const navigate = useNavigate();
  const [isPageSelectionModalOpen, setIsPageSelectionModalOpen] = useState(false);
  
  useEffect(() => {
    setIsPageSelectionModalOpen(true);
  }, []);
  
  const handleModalOpenChange = (open: boolean) => {
    setIsPageSelectionModalOpen(open);
    if (!open) {
      navigate('/');
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
