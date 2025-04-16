import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom'; // Per il pulsante di navigazione

const Bye: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] space-y-8">
      <img 
        src="/loggedin_sentimentvers.png" // Stessa immagine di Welcome
        alt="Bye Cat" 
        className="w-48 h-48 object-contain" // Stesse dimensioni
      />
      <Link to="/"> {/* Link alla home page */} 
        <Button size="lg">Torna alla Home</Button>
      </Link>
    </div>
  );
};

export default Bye; 