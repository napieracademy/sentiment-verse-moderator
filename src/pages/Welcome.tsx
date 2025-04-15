import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom'; // Per il pulsante di navigazione

const Welcome: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] space-y-8">
      <img 
        src="/loggedin_sentimentvers.png" // Percorso aggiornato
        alt="Welcome Cat" 
        className="w-48 h-48 object-contain" // Dimensioni immagine
      />
      <Link to="/facebook-data"> {/* Link alla pagina dati come esempio */} 
        <Button size="lg">Vai ai Dati Facebook</Button> {/* Aumentata dimensione bottone */}
      </Link>
    </div>
  );
};

export default Welcome; 