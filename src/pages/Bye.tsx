import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom'; // Per il pulsante di navigazione

const Bye: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] space-y-8">
      <img 
        src="/cat_bye.png" // Utilizzo dell'immagine PNG del gatto con gli occhiali
        alt="Gatto che saluta" 
        className="w-72 h-72 object-contain" // Mantengo le stesse dimensioni
      />
      <Link to="/"> {/* Link alla home page */} 
        <Button size="lg">Torna alla Home</Button>
      </Link>
    </div>
  );
};

export default Bye; 