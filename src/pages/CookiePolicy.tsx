import React from 'react';
import Footer from '@/components/dashboard/Footer';

const CookiePolicy: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
          
          <div className="prose prose-sm sm:prose lg:prose-lg">
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Cosa sono i cookie?</h2>
              <p>
                I cookie sono piccoli file di testo che vengono archiviati sul tuo dispositivo (computer, tablet o 
                smartphone) quando visiti un sito web. I cookie sono ampiamente utilizzati per far funzionare i siti 
                web in modo più efficiente, oltre che per fornire informazioni ai proprietari del sito.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Come utilizziamo i cookie</h2>
              <p>
                SentimentVerse utilizza i cookie per vari scopi, tra cui:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li><strong>Cookie essenziali:</strong> Necessari per il funzionamento del sito e per l'accesso alle sue funzionalità</li>
                <li><strong>Cookie di preferenze:</strong> Consentono al sito di ricordare le tue preferenze e scelte</li>
                <li><strong>Cookie statistici:</strong> Raccolgono informazioni su come utilizzi il nostro sito</li>
                <li><strong>Cookie di terze parti:</strong> Impostati da servizi di terze parti come Facebook e strumenti di analisi</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Cookie di Facebook</h2>
              <p>
                Poiché SentimentVerse si integra con Facebook, la piattaforma può impostare dei cookie sul tuo 
                dispositivo. Questi cookie vengono utilizzati per autenticare la tua identità, memorizzare l'accesso 
                e le preferenze, e facilitare le funzionalità dell'integrazione con Facebook.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Cookie utilizzati</h2>
              <table className="min-w-full bg-white mt-4 border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border">Nome</th>
                    <th className="py-2 px-4 border">Tipo</th>
                    <th className="py-2 px-4 border">Scopo</th>
                    <th className="py-2 px-4 border">Durata</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border">fbAuthToken</td>
                    <td className="py-2 px-4 border">Essenziale</td>
                    <td className="py-2 px-4 border">Memorizza il token di accesso Facebook</td>
                    <td className="py-2 px-4 border">60 giorni</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border">fbUserData</td>
                    <td className="py-2 px-4 border">Essenziale</td>
                    <td className="py-2 px-4 border">Memorizza le informazioni dell'utente Facebook</td>
                    <td className="py-2 px-4 border">60 giorni</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border">selectedPage</td>
                    <td className="py-2 px-4 border">Preferenza</td>
                    <td className="py-2 px-4 border">Memorizza l'ultima pagina Facebook selezionata</td>
                    <td className="py-2 px-4 border">30 giorni</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Come gestire i cookie</h2>
              <p>
                Puoi controllare e gestire i cookie in vari modi. La maggior parte dei browser web ti permette di 
                gestire le tue preferenze sui cookie. Puoi:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>Eliminare i cookie già presenti sul tuo dispositivo</li>
                <li>Bloccare l'installazione di nuovi cookie</li>
                <li>Configurare il browser per ricevere notifiche quando vengono impostati nuovi cookie</li>
              </ul>
              <p className="mt-4">
                Disabilitare i cookie potrebbe impedirti di utilizzare alcune funzionalità del nostro servizio, 
                in particolare quelle che richiedono l'autenticazione con Facebook.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Modifiche alla Cookie Policy</h2>
              <p>
                Possiamo aggiornare questa Cookie Policy di tanto in tanto. Ti invitiamo a consultare 
                regolarmente questa pagina per essere informato su eventuali modifiche.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Contatti</h2>
              <p>
                Se hai domande sulla nostra Cookie Policy, contattaci all'indirizzo: 
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

export default CookiePolicy;