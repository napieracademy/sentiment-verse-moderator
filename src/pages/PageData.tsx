
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "@/components/dashboard/Header";
import Footer from "@/components/dashboard/Footer";
import { PageList } from "@/features/pageData/components/PageList";
import { PageDetail } from "@/features/pageData/components/PageDetail";
import { LoadingState, EmptyState } from "@/features/pageData/components/LoadingState";
import { useFacebookPages } from "@/features/pageData/hooks/useFacebookPages";
import { Button } from "@/components/ui/button";

const PageData = () => {
  const navigate = useNavigate();
  const { pages, loading, selectedPage, setSelectedPage } = useFacebookPages();

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
            <LoadingState />
          ) : pages.length === 0 ? (
            <div className="space-y-4">
              <EmptyState />
              <div className="flex justify-center">
                <Button onClick={() => navigate('/')}>
                  Torna alla Home
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <PageList 
                  pages={pages} 
                  selectedPage={selectedPage}
                  onSelectPage={setSelectedPage}
                  loading={loading}
                />
              </div>
              
              <div className="lg:col-span-2">
                <PageDetail 
                  selectedPage={selectedPage} 
                  onGoToDashboard={handleGoToDashboard} 
                />
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
