
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import LoginModal from "@/components/LoginModal";

const Index = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b py-4 px-6">
        <div className="container flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-facebook p-2 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-white"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M13 8H7" />
                <path d="M13 12H7" />
              </svg>
            </div>
            <span className="font-bold text-xl">SentimentVerse</span>
          </div>
          <Button
            onClick={() => setIsLoginModalOpen(true)}
            className="fb-button"
          >
            Accedi con Facebook
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="container flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">
              Analisi del sentiment e moderazione intelligente con AI
            </h1>
            <p className="text-lg text-gray-600">
              Monitora, analizza e modera i commenti della tua Pagina Facebook
              con insight basati sull'analisi del sentiment in tempo reale grazie all'intelligenza artificiale avanzata.
            </p>
            <div className="pt-4">
              <Button
                onClick={() => setIsLoginModalOpen(true)}
                size="lg"
                className="fb-button"
              >
                Inizia Ora
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <img
              src="/lovable-uploads/8d0d556f-72f5-48e4-aa29-bab6cec904a9.png"
              alt="Sentiment Analysis Dashboard powered by AI"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Funzionalità Principali
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-facebook"
                >
                  <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Analisi del Sentiment</h3>
              <p className="text-gray-600">
                Classifica automaticamente i commenti come positivi, negativi o neutri per
                comprendere meglio il sentimento della tua community.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-facebook"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Moderazione Semplificata</h3>
              <p className="text-gray-600">
                Gestisci facilmente i commenti con funzionalità di moderazione rapida per
                nascondere o eliminare contenuti indesiderati.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-facebook"
                >
                  <path d="M3 3v18h18" />
                  <path d="M18 17V9" />
                  <path d="M13 17V5" />
                  <path d="M8 17v-3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Statistiche e Trend</h3>
              <p className="text-gray-600">
                Visualizza l'andamento del sentiment nel tempo e ottieni statistiche
                dettagliate sull'engagement della tua Pagina.
              </p>
            </div>

            <div className="p-6 border rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-facebook"
                >
                  <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
                  <path d="m8.5 8.5 7 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Automazione delle Risposte</h3>
              <p className="text-gray-600">
                Crea regole personalizzate per rispondere automaticamente ai commenti in base al loro sentiment e contenuto.
              </p>
            </div>

            <div className="p-6 border rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-facebook"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Filtri di Contenuto</h3>
              <p className="text-gray-600">
                Filtra automaticamente contenuti inappropriati e spam utilizzando regole personalizzabili per mantenere le conversazioni costruttive.
              </p>
            </div>

            <div className="p-6 border rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-facebook"
                >
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c0 2 1 3 3 3h6c2 0 3-1 3-3v-5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Intelligenza Artificiale Avanzata</h3>
              <p className="text-gray-600">
                Sfrutta algoritmi di AI avanzati per analizzare il sentiment e rilevare automaticamente espressioni specifiche rilevanti per il tuo settore.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Come Funziona
          </h2>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 md:space-x-6">
            <div className="flex flex-col items-center text-center max-w-xs">
              <div className="h-14 w-14 bg-facebook rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Connetti la tua Pagina</h3>
              <p className="text-gray-600">
                Accedi con Facebook e seleziona la Pagina che desideri analizzare.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center max-w-xs">
              <div className="h-14 w-14 bg-facebook rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Analisi Automatica</h3>
              <p className="text-gray-600">
                I commenti vengono analizzati automaticamente per determinare il sentiment.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center max-w-xs">
              <div className="h-14 w-14 bg-facebook rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Modera e Migliora</h3>
              <p className="text-gray-600">
                Utilizza le informazioni per moderare i commenti e migliorare l'engagement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-facebook text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">
            Pronto a trasformare il modo in cui gestisci i commenti?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            SentimentVerse ti aiuta a monitorare e moderare i commenti della tua Pagina
            Facebook con strumenti di analisi del sentiment avanzati.
          </p>
          <Button
            onClick={() => setIsLoginModalOpen(true)}
            size="lg"
            variant="outline"
            className="bg-white text-facebook hover:bg-gray-100"
          >
            Inizia Gratuitamente
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-white">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-facebook p-1.5 rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-white"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  <path d="M13 8H7" />
                  <path d="M13 12H7" />
                </svg>
              </div>
              <span className="font-bold">SentimentVerse</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2025 SentimentVerse. Tutti i diritti riservati. Questa è una demo.
            </div>
          </div>
        </div>
      </footer>

      <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
    </div>
  );
};

export default Index;
