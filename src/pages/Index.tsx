import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Facebook } from "lucide-react";
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center w-full max-w-3xl">
      <div className="flex justify-center">
        <img 
          src="/gatto_analyst.png" 
          alt="Gatto Calcolatore" 
          className="w-full max-w-sm h-auto object-contain"
        />
      </div>

      <div className="flex flex-col items-start space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">SentimentVers!</h1>
          <p className="text-xl text-muted-foreground">
            Modera e analizza i commenti delle tue pagine social con la potenza dell'intelligenza artificiale.
          </p>
        </div>
        
        <Button 
          variant="default"
          size="lg" 
          className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
          onClick={handleLogin}
        >
          <Facebook size={18} />
          Accedi con Facebook
        </Button>
        
        <p className="text-sm text-muted-foreground">
          Accedi con Facebook per vedere i dati reali delle tue pagine
        </p>
      </div>
    </div>
  );
};

export default Index;
