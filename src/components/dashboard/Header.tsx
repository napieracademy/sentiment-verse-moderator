import { useState, useEffect } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { Bell, BarChart2, MessageSquare, Database, Heart, Activity, LogOut, User, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { handleFacebookLogin } from "@/components/FacebookSDK";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true);
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      setLoadingUser(false);
      console.log("Supabase User Data:", currentUser);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        console.log("Auth state changed, new user:", session?.user);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout effettuato",
        description: "La tua sessione è stata chiusa con successo.",
      });
      navigate('/bye');
    } catch (error) {
      console.error("Errore durante il logout:", error);
      toast({
        title: "Errore durante il logout",
        description: "Si è verificato un problema durante il logout. Riprova.",
        variant: "destructive"
      });
    }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      // Forziamo sempre il reindirizzamento alla pagina di benvenuto dopo il login dall'header
      // per mantenere coerente il flusso di onboarding
      localStorage.setItem('auth_return_path', '/welcome');
      
      const { error } = await handleFacebookLogin();
      if (error) {
        toast({
          title: "Errore di accesso",
          description: "Non è stato possibile accedere con Facebook. Riprova.",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'accesso. Riprova.",
        variant: "destructive"
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Array delle pagine principali per la navigazione
  const navigationItems = [
    { path: "/facebook-data", label: "Facebook Data", icon: Database },
    { path: "/insights", label: "Insights", icon: BarChart2 },
    { path: "/post-insights", label: "Post Insights", icon: Activity }
  ];

  return (
    <header className="border-b py-3 bg-white z-10">
      <div className="container flex justify-between items-center max-w-[1100px] mx-auto px-6">
        <div className="flex items-center space-x-6">
          <NavLink to="/" className="flex items-center">
            <Heart className="h-5 w-5 text-black mr-1" fill="currentColor" />
            <span className="font-bold">SentimentVerse</span>
          </NavLink>
          
          {/* Navigation Menu - visibile solo se l'utente è loggato */}
          {user && (
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors
                     ${isActive 
                       ? 'bg-blue-50 text-blue-700' 
                       : 'text-gray-700'
                     }`
                  }
                  end={item.path === "/"}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => setNotificationsVisible(!notificationsVisible)}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            </Button>
            
            {notificationsVisible && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20 border">
                <div className="p-3 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Notifiche</h3>
                    <Button variant="ghost" size="sm">Segna tutto come letto</Button>
                  </div>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {[
                    { id: 1, title: "Nuovo commento", desc: "Mario ha commentato il tuo post", time: "2 minuti fa", unread: true },
                    { id: 2, title: "Sentiment negativo", desc: "Rilevato commento con sentiment negativo", time: "10 minuti fa", unread: true },
                    { id: 3, title: "Aggiornamento automazione", desc: "L'automazione 'Risposte automatiche' è stata attivata", time: "1 ora fa", unread: false },
                    { id: 4, title: "Nuovo follower", desc: "Luigi ha iniziato a seguire la tua pagina", time: "3 ore fa", unread: false }
                  ].map(notif => (
                    <div key={notif.id} className={`p-3 hover:bg-gray-50 transition-colors cursor-pointer ${notif.unread ? 'border-l-4 border-blue-500' : ''}`}>
                      <div className="font-medium text-sm">{notif.title}</div>
                      <div className="text-xs text-gray-600">{notif.desc}</div>
                      <div className="text-xs text-gray-500 mt-1">{notif.time}</div>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t bg-gray-50">
                  <Button variant="ghost" size="sm" className="w-full text-sm">
                    Visualizza tutte le notifiche
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {loadingUser ? (
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-auto px-2 space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={user.user_metadata?.avatar_url || ''} 
                        alt={user.user_metadata?.name || user.email || 'User Avatar'} 
                      />
                      <AvatarFallback>
                        {user.user_metadata?.name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm font-medium">
                      {user.user_metadata?.name || user.email}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.user_metadata?.name || 'Utente'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={handleLogin} 
                size="sm" 
                disabled={isLoggingIn}
                className="flex items-center gap-2"
              >
                {isLoggingIn ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                    <span>Accesso...</span>
                  </>
                ) : (
                  <>
                    <Facebook className="h-4 w-4" />
                    <span>Login</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
