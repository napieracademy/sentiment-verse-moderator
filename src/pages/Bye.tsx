import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom'; // Per il pulsante di navigazione

const Bye: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] space-y-8">
      <img 
        src="/bye_cat.svg" // Utilizzo del file SVG creato
        alt="Gatto che saluta" 
        className="w-72 h-72 object-contain" // Dimensioni maggiori per mostrare meglio l'immagine SVG
      />
      <Link to="/"> {/* Link alla home page */} 
        <Button size="lg">Torna alla Home</Button>
      </Link>
    </div>
  );
};

export default Bye; 