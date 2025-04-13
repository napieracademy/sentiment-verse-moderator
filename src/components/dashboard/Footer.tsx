
const Footer = () => {
  return (
    <footer className="py-3 bg-white border-t">
      <div className="container">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            © 2025 SentimentVerse. Questa è una demo.
          </div>
          <div className="text-sm">
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
