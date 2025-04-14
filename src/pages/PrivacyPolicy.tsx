import React from 'react';
import Footer from '@/components/dashboard/Footer';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          
          <div className="prose prose-sm sm:prose lg:prose-lg">
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Introduzione</h2>
              <p>
                La presente Privacy Policy descrive come SentimentVerse raccoglie, utilizza e condivide i dati personali 
                quando utilizzi la nostra applicazione di moderazione dei commenti per Facebook.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Dati raccolti</h2>
              <p>
                Quando utilizzi SentimentVerse, raccogliamo le seguenti informazioni:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>Informazioni del tuo account Facebook, inclusi nome, email e ID</li>
                <li>Token di accesso per accedere ai dati delle pagine Facebook che gestisci</li>
                <li>Dati relativi ai commenti e alle interazioni sulle tue pagine Facebook</li>
                <li>Statistiche e analisi delle interazioni sui tuoi contenuti</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Utilizzo dei dati</h2>
              <p>
                Utilizziamo i dati raccolti per:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>Fornirti funzionalità di moderazione dei commenti</li>
                <li>Analizzare il sentimento dei commenti e delle interazioni</li>
                <li>Offrirti statistiche e approfondimenti sui tuoi contenuti</li>
                <li>Migliorare le nostre funzionalità e servizi</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Condivisione dei dati</h2>
              <p>
                Non vendiamo i tuoi dati personali. Condividiamo i dati solo nei seguenti casi:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>Con Facebook, secondo necessità per il funzionamento dell'app</li>
                <li>Con fornitori di servizi che ci aiutano a fornire i nostri servizi</li>
                <li>Quando richiesto dalla legge o per proteggere i nostri diritti</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Conservazione dei dati</h2>
              <p>
                Conserviamo i tuoi dati solo per il tempo necessario a fornirti i nostri servizi. 
                Puoi richiedere la cancellazione dei tuoi dati in qualsiasi momento attraverso 
                la funzione "Cancellazione Dati" disponibile nel footer della nostra applicazione.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">I tuoi diritti</h2>
              <p>
                In conformità con il GDPR e altre leggi sulla privacy, hai il diritto di:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>Accedere ai tuoi dati personali</li>
                <li>Correggere i tuoi dati personali</li>
                <li>Eliminare i tuoi dati personali</li>
                <li>Limitare o opporti al trattamento dei tuoi dati</li>
                <li>Richiedere la portabilità dei dati</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Modifiche alla Privacy Policy</h2>
              <p>
                Possiamo aggiornare questa Privacy Policy di tanto in tanto. Ti informeremo di eventuali 
                modifiche pubblicando la nuova Privacy Policy su questa pagina e aggiornando la data di 
                "Ultima modifica" qui sotto.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Contatti</h2>
              <p>
                Se hai domande sulla nostra Privacy Policy, contattaci all'indirizzo: 
                privacy@sentimentverse.com
              </p>
            </section>

            <p className="text-sm italic">Ultima modifica: 14 Aprile 2025</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;