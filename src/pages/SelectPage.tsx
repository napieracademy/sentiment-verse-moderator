
import { useState, useEffect } from "react";
import PageSelectionModal from "@/components/PageSelectionModal";
import { useNavigate } from "react-router-dom";

const SelectPage = () => {
  const navigate = useNavigate();
  const [isPageSelectionModalOpen, setIsPageSelectionModalOpen] = useState(false);
  
  useEffect(() => {
    // Open the page selection modal automatically
    setIsPageSelectionModalOpen(true);
  }, []);
  
  // When modal is closed without selecting, redirect back to home
  const handleModalOpenChange = (open: boolean) => {
    setIsPageSelectionModalOpen(open);
    if (!open) {
      navigate('/');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <PageSelectionModal 
        open={isPageSelectionModalOpen} 
        onOpenChange={handleModalOpenChange} 
      />
    </div>
  );
};

export default SelectPage;
