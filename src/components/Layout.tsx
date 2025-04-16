import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './dashboard/Header';
import Footer from './dashboard/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LayoutProps {
  children: React.ReactNode;
}

// Elenco delle rotte pubbliche accessibili senza autenticazione
const PUBLIC_ROUTES = [
  '/',
  '/auth/facebook/callback',
  '/privacy-policy',
  '/terms-of-service',
  '/cookie-policy',
  '/delete-user-data',
  '/facebook/deauthorize',
  '/deletion_status',
  '/facebook/deletion_status',
  '/welcome',
  '/bye'
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isHomePage = location.pathname === '/';
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verifica l'autenticazione per le rotte protette
    const checkAuth = async () => {
      // Se è una rotta pubblica, non serve verificare l'autenticazione
      if (PUBLIC_ROUTES.includes(location.pathname)) {
        setIsLoading(false);
        return;
      }

      // Controlla se siamo in un processo di autenticazione attivo
      const isAuthenticating = sessionStorage.getItem('authenticating') === 'true';
      if (isAuthenticating) {
        console.log('Autenticazione in corso, skip della verifica auth');
        setIsLoading(false);
        return;
      }

      console.log("Verificando autenticazione per rotta protetta:", location.pathname);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("Utente non autenticato, reindirizzamento alla home");
        // Salva il percorso corrente prima del reindirizzamento
        localStorage.setItem('auth_return_path', location.pathname);
        
        toast({
          title: "Accesso richiesto",
          description: "Devi accedere con Facebook per visualizzare questa pagina.",
          variant: "destructive"
        });
        
        // Segnala che stiamo avviando un processo di autenticazione
        sessionStorage.setItem('authenticating', 'true');
        
        navigate('/', { replace: true });
      } else {
        sessionStorage.removeItem('authenticating');
        console.log("Utente autenticato:", session.user.id);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [location.pathname, navigate, toast]);

  if (isLoading && !PUBLIC_ROUTES.includes(location.pathname)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${isHomePage ? 'h-screen' : ''}`}>
      <Header />
      <main 
        className={`w-full max-w-[1100px] mx-auto px-4 
                   ${isHomePage ? 'flex-1 flex flex-col items-center justify-center py-0' : 'py-8'}`}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;