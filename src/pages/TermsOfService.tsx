import React from 'react';
import Footer from '@/components/dashboard/Footer';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Termini di Servizio</h1>
          
          <div className="prose prose-sm sm:prose lg:prose-lg">
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">1. Accettazione dei Termini</h2>
              <p>
                Utilizzando SentimentVerse, accetti questi Termini di Servizio nella loro interezza. 
                Se non sei d'accordo con questi termini, ti preghiamo di non utilizzare il nostro servizio.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">2. Descrizione del Servizio</h2>
              <p>
                SentimentVerse è un'applicazione che fornisce strumenti di moderazione e analisi per i commenti 
                e le interazioni sulle pagine Facebook. La nostra piattaforma consente di:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>Moderare automaticamente i commenti in base a regole personalizzabili</li>
                <li>Analizzare il sentimento delle interazioni degli utenti</li>
                <li>Visualizzare statistiche e approfondimenti sui contenuti</li>
                <li>Gestire più pagine Facebook da un'unica interfaccia</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">3. Account e Autorizzazioni Facebook</h2>
              <p>
                Per utilizzare SentimentVerse, devi concedere alla nostra applicazione le autorizzazioni 
                necessarie per accedere ai dati della tua pagina Facebook. Sei responsabile di:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>Mantenere protette le tue credenziali di accesso</li>
                <li>Assicurarti di avere il diritto di concedere l'accesso alle pagine che gestisci</li>
                <li>Rispettare le condizioni d'uso di Facebook mentre utilizzi il nostro servizio</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">4. Limitazioni d'Uso</h2>
              <p>
                Non è consentito utilizzare SentimentVerse per:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>Violare le leggi o i regolamenti applicabili</li>
                <li>Violare i diritti di terzi, inclusi diritti di proprietà intellettuale</li>
                <li>Raccogliere dati personali senza autorizzazione</li>
                <li>Interferire con il funzionamento normale del servizio</li>
                <li>Accedere a dati non autorizzati o tentare di compromettere la sicurezza della piattaforma</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">5. Proprietà Intellettuale</h2>
              <p>
                Tutti i diritti di proprietà intellettuale relativi a SentimentVerse, inclusi software, 
                design, logo, e contenuti, sono di proprietà di SentimentVerse o dei suoi licenzianti. 
                L'utilizzo del servizio non ti concede alcun diritto di proprietà su tali contenuti.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">6. Limitazione di Responsabilità</h2>
              <p>
                SentimentVerse è fornito "così com'è" e "come disponibile" senza garanzie di alcun tipo. 
                Non garantiamo che il servizio sarà ininterrotto, tempestivo, sicuro o privo di errori. 
                Non saremo responsabili per eventuali perdite o danni derivanti dall'uso del nostro servizio.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">7. Modifiche ai Termini</h2>
              <p>
                Ci riserviamo il diritto di modificare questi Termini di Servizio in qualsiasi momento. 
                Le modifiche saranno effettive immediatamente dopo la pubblicazione dei termini aggiornati. 
                L'uso continuo del servizio dopo tali modifiche costituisce accettazione dei nuovi termini.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">8. Legge Applicabile</h2>
              <p>
                Questi Termini di Servizio sono regolati e interpretati in conformità con le leggi italiane, 
                senza riguardo ai suoi principi di conflitto di leggi.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">9. Contatti</h2>
              <p>
                Se hai domande sui nostri Termini di Servizio, contattaci all'indirizzo: 
                legal@sentimentverse.com
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

export default TermsOfService;