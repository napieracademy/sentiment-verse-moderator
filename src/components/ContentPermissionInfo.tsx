
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Tag, ThumbsUp, Info, Users, Monitor, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const ContentPermissionInfo = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-2">
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Info className="h-5 w-5 text-facebook" />
              <CardTitle className="text-lg text-facebook">Gestione Contenuti Facebook</CardTitle>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 hover:bg-blue-100 h-8 w-8">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
          <CardDescription>
            Autorizzazione pages_read_user_content attiva
          </CardDescription>
          
          <CollapsibleContent>
            <div className="space-y-4 mt-4">
              <p className="text-sm">
                Con questa autorizzazione puoi visualizzare e gestire i seguenti contenuti della tua Pagina Facebook:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-start space-x-2 bg-white p-3 rounded-md border border-blue-100">
                  <MessageSquare className="h-5 w-5 text-facebook mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm">Commenti</h3>
                    <p className="text-xs text-muted-foreground">
                      Visualizza e modera commenti di utenti e Pagine sui tuoi post
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 bg-white p-3 rounded-md border border-blue-100">
                  <Tag className="h-5 w-5 text-facebook mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm">Menzioni</h3>
                    <p className="text-xs text-muted-foreground">
                      Analizza i post in cui la tua Pagina è stata taggata
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 bg-white p-3 rounded-md border border-blue-100">
                  <ThumbsUp className="h-5 w-5 text-facebook mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm">Valutazioni</h3>
                    <p className="text-xs text-muted-foreground">
                      Gestisci le recensioni e feedback sulla tua Pagina
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 bg-white p-3 rounded-md border border-blue-100">
                  <Users className="h-5 w-5 text-facebook mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm">Identificazione</h3>
                    <p className="text-xs text-muted-foreground">
                      Distingui tra commenti di utenti e altre Pagine
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 bg-white p-3 rounded-md border border-blue-100">
                  <Monitor className="h-5 w-5 text-facebook mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm">Analisi Dettagliata</h3>
                    <p className="text-xs text-muted-foreground">
                      Esplora in profondità tutti i contenuti relativi alla Pagina
                    </p>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground italic">
                L'autorizzazione pages_read_user_content consente a SentimentVerse di leggere tutti i contenuti generati dagli utenti sulla tua Pagina, 
                distinguere tra utenti e Pagine, e gestire i commenti in modo nidificato per post. Questo permette un'analisi approfondita 
                e una moderazione efficace di tutti i contenuti pubblici.
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardHeader>
    </Card>
  );
};

export default ContentPermissionInfo;
