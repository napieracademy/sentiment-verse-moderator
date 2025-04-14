
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type LoginModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const LoginModal = ({ open, onOpenChange }: LoginModalProps) => {
  const [step, setStep] = useState<'login' | 'permissions'>('login');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<{name?: string, id?: string} | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFacebookLogin = () => {
    setLoading(true);
    
    if (!window.FB) {
      toast({
        title: "Errore",
        description: "SDK di Facebook non caricato correttamente",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }
    
    window.FB.login(function(response: any) {
      if (response.authResponse) {
        console.log('Welcome! Fetching your information....');
        window.FB.api('/me', function(response: any) {
          console.log('Good to see you, ' + response.name + '.');
          setUserData({
            name: response.name,
            id: response.id
          });
          setStep('permissions');
          setLoading(false);
        });
      } else {
        console.log('User cancelled login or did not fully authorize.');
        toast({
          title: "Accesso annullato",
          description: "L'utente ha annullato l'accesso o non ha autorizzato completamente",
          variant: "destructive"
        });
        setLoading(false);
      }
    }, {scope: 'public_profile,pages_show_list,pages_read_engagement,pages_read_user_content'});
  };

  const handlePermissionGrant = () => {
    onOpenChange(false);
    navigate('/select-page');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {step === 'login' ? 'Accedi con Facebook' : 'Autorizza SentimentVerse'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {step === 'login' 
              ? 'Utilizza il tuo account Facebook per accedere' 
              : 'SentimentVerse richiede i seguenti permessi'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 py-4">
          {step === 'login' ? (
            <>
              <div className="flex items-center justify-center mb-4">
                <svg viewBox="0 0 36 36" className="w-16 h-16 fill-facebook" xmlns="http://www.w3.org/2000/svg">
                  <path d="M36 18C36 8.059 27.941 0 18 0S0 8.059 0 18c0 8.983 6.589 16.435 15.188 17.784V23.16h-4.57V18h4.57v-3.958c0-4.511 2.687-7.006 6.797-7.006 1.97 0 4.028.352 4.028.352v4.429h-2.269c-2.237 0-2.933 1.387-2.933 2.81V18h4.991l-.797 5.16h-4.194v12.624C29.411 34.435 36 26.983 36 18Z"></path>
                </svg>
              </div>
              
              {/* Real Facebook Login Button */}
              <div className="flex justify-center">
                <Button 
                  onClick={handleFacebookLogin} 
                  disabled={loading}
                  className="fb-button flex items-center justify-center w-full bg-facebook text-white hover:bg-facebook/90"
                >
                  {loading ? "Caricamento..." : "Continua con Facebook"}
                </Button>
              </div>
              
              {/* Alternative login form - kept for design consistency */}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500 mb-4">Oppure accedi direttamente</p>
                <div className="grid w-full items-center gap-3">
                  <input 
                    type="email"
                    placeholder="Email o numero di telefono"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                  <input 
                    type="password"
                    placeholder="Password"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                
                <Button 
                  onClick={handleFacebookLogin} 
                  className="w-full fb-button mt-3"
                >
                  Accedi
                </Button>
                
                <div className="text-center text-sm text-muted-foreground mt-2">
                  <a href="#" className="text-facebook hover:underline">Password dimenticata?</a>
                </div>
                
                <hr className="my-4" />
                
                <div className="text-center">
                  <Button variant="outline" className="bg-green-600 text-white hover:bg-green-700">
                    Crea nuovo account
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="h-5 w-5 mt-0.5">
                    <svg viewBox="0 0 36 36" className="h-5 w-5 fill-facebook" xmlns="http://www.w3.org/2000/svg">
                      <path d="M36 18C36 8.059 27.941 0 18 0S0 8.059 0 18c0 8.983 6.589 16.435 15.188 17.784V23.16h-4.57V18h4.57v-3.958c0-4.511 2.687-7.006 6.797-7.006 1.97 0 4.028.352 4.028.352v4.429h-2.269c-2.237 0-2.933 1.387-2.933 2.81V18h4.991l-.797 5.16h-4.194v12.624C29.411 34.435 36 26.983 36 18Z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">SentimentVerse vuole accedere a:</p>
                  </div>
                </div>
                
                <div className="pl-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Elenco delle Pagine gestite</p>
                      <p className="text-muted-foreground">pages_show_list</p>
                    </div>
                    <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Engagement della Pagina</p>
                      <p className="text-muted-foreground">pages_read_engagement</p>
                    </div>
                    <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Contenuto pubblico</p>
                      <p className="text-muted-foreground">pages_read_user_content</p>
                      <div className="mt-2 text-xs text-neutral-500 max-w-sm">
                        L'autorizzazione pages_read_user_content consente alla nostra app di leggere contenuti generati dagli utenti sulla Pagina, ad esempio post, commenti e valutazioni, e di eliminare i commenti degli utenti sui post della Pagina. Permette inoltre di leggere i post in cui è taggata la Pagina. L'uso consentito per questa autorizzazione è la lettura dei contenuti degli utenti e di altre Pagine sulla Pagina se necessario per la gestione della Pagina.
                      </div>
                    </div>
                    <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground mt-4">
                <p>
                  SentimentVerse utilizza questi dati per fornire servizi di analisi del sentiment e moderazione dei commenti
                  per le tue Pagine. Questi permessi ci permettono di leggere contenuti generati dagli utenti per la gestione della Pagina 
                  e di raccogliere dati statistici aggregati, privi di riferimenti personali, per migliorare il nostro servizio.
                  I dati non saranno condivisi con terze parti. Questa applicazione è soggetta ai 
                  <a href="#" className="text-facebook hover:underline"> Termini di Servizio</a> e alla 
                  <a href="#" className="text-facebook hover:underline"> Privacy Policy</a>.
                </p>
              </div>
            </>
          )}
        </div>
        
        {step === 'permissions' && (
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setStep('login')}
            >
              Annulla
            </Button>
            <Button
              type="button"
              className="fb-button"
              onClick={handlePermissionGrant}
            >
              {userData?.name ? `Continua come ${userData.name}` : 'Continua'}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
