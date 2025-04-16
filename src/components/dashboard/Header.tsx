import { useState, useEffect } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { BarChart2, Database, Heart, Activity, LogOut, Facebook } from "lucide-react";
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
        <div className="flex items-center">
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
    </header>
  );
};

export default Header;
