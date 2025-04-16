import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-3 bg-white border-t">
      <div className="container max-w-[1100px] mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="text-center text-sm text-muted-foreground">
            © 2025 SentimentVerse. Questa è una demo.
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/" className="text-facebook hover:underline">
              Home
            </Link>
            <Link to="/privacy-policy" className="text-gray-600 hover:underline">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-gray-600 hover:underline">
              Termini di Servizio
            </Link>
            <Link to="/cookie-policy" className="text-gray-600 hover:underline">
              Cookie Policy
            </Link>
            <Link to="/delete-user-data" className="text-gray-600 hover:underline">
              Cancellazione Dati
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
