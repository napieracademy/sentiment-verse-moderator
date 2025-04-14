
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Facebook } from "lucide-react";
import Header from "@/components/dashboard/Header";
import Footer from "@/components/dashboard/Footer";
import { handleFacebookLogin } from "@/components/FacebookSDK";
import { useToast } from "@/hooks/use-toast";

const Index: React.FC = () => {
  const { toast } = useToast();

  const handleLogin = async () => {
    const { error } = await handleFacebookLogin();
    if (error) {
      toast({
        title: "Errore di accesso",
        description: "Non è stato possibile accedere con Facebook. Riprova.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 flex flex-col items-center justify-center space-y-8">
        <div className="text-center space-y-4 max-w-2xl">
          <h1 className="text-4xl font-bold">Dati Reali Facebook</h1>
          <p className="text-xl text-muted-foreground">
            Questa applicazione mostra solo i dati reali delle tue pagine Facebook,
            senza utilizzare dati di esempio o simulazioni.
          </p>
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          <Button size="lg" asChild>
            <Link to="/page-data">
              Visualizza Dati Pagine Facebook
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="flex items-center gap-2 border-facebook text-facebook hover:bg-facebook/10"
            onClick={handleLogin}
          >
            <Facebook size={18} />
            Accedi con Facebook
          </Button>
          
          <p className="text-sm text-muted-foreground">
            Accedi con Facebook per vedere i dati reali delle tue pagine
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
