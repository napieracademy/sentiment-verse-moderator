import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Header from "@/components/dashboard/Header";
import Footer from "@/components/dashboard/Footer";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-bold">Benvenuto</h1>
        <div className="space-y-4">
          <Button asChild>
            <Link to="/page-data">
              Visualizza Dati Pagine Facebook
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
