
const Footer = () => {
  return (
    <footer className="py-3 bg-white border-t">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="text-sm text-gray-500">
            © 2025 SentimentVerse. Questa è una demo.
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/privacy-policy" className="text-gray-600 hover:underline">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="text-gray-600 hover:underline">
              Termini di Servizio
            </a>
            <a href="/cookie-policy" className="text-gray-600 hover:underline">
              Cookie Policy
            </a>
            <a href="/delete-user-data" className="text-gray-600 hover:underline">
              Cancellazione Dati
            </a>
            <a href="/" className="text-facebook hover:underline">
              Torna alla Home
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
