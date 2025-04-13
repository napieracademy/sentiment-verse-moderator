
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  AlertTriangle, Check, Edit2, Plus, ShieldAlert, ShieldCheck, 
  Trash2, AlertCircle, MessageSquare, Clock, RefreshCw
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Mock data for automation rules
const initialRules = [
  {
    id: 1,
    name: 'Blocco Contenuti Offensivi',
    description: 'Rileva e nascondi automaticamente commenti con contenuti offensivi o inappropriati',
    isActive: true,
    type: 'moderation',
    categories: ['hate_speech', 'profanity', 'xenophobia', 'racism'],
    action: 'hide',
    triggers: 35,
    lastTriggered: '2025-04-12T14:23:00Z'
  },
  {
    id: 2,
    name: 'Filtro Anti-Spam',
    description: 'Identifica e rimuovi commenti con link sospetti o contenuti promozionali ripetitivi',
    isActive: true,
    type: 'moderation',
    categories: ['spam', 'excessive_links'],
    action: 'delete',
    triggers: 127,
    lastTriggered: '2025-04-13T09:45:00Z'
  },
  {
    id: 3,
    name: 'Protezione Anti-Molestie',
    description: 'Blocca automaticamente contenuti con insulti personali o molestie dirette',
    isActive: true,
    type: 'moderation',
    categories: ['harassment', 'bullying', 'threats'],
    action: 'hide',
    triggers: 12,
    lastTriggered: '2025-04-11T16:30:00Z'
  },
  {
    id: 4,
    name: 'Filtro Contenuti Misogini',
    description: 'Identifica e modera commenti con linguaggio sessista o misogino',
    isActive: false,
    type: 'moderation',
    categories: ['misogyny', 'sexism'],
    action: 'flag',
    triggers: 8,
    lastTriggered: '2025-04-10T11:20:00Z'
  },
  {
    id: 5,
    name: 'Rispondi ai Commenti Positivi',
    description: 'Risposta automatica ai commenti con sentiment positivo',
    isActive: true,
    type: 'engagement',
    categories: ['positive_sentiment'],
    action: 'reply',
    responseTemplate: 'Grazie per il tuo feedback positivo! Siamo felici che ti sia piaciuta la nostra esperienza.',
    triggers: 43,
    lastTriggered: '2025-04-13T08:15:00Z'
  }
];

const AutomationRules = () => {
  const [rules, setRules] = useState(initialRules);
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<number | null>(null);
  const { toast } = useToast();
  
  const [newRuleData, setNewRuleData] = useState({
    name: '',
    description: '',
    type: 'moderation',
    categories: [] as string[],
    action: 'hide',
    isActive: true
  });

  const toggleRuleStatus = (ruleId: number) => {
    setRules(prevRules => 
      prevRules.map(rule => 
        rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
    
    const rule = rules.find(r => r.id === ruleId);
    toast({
      title: rule?.isActive ? "Regola disattivata" : "Regola attivata",
      description: `La regola "${rule?.name}" è stata ${rule?.isActive ? 'disattivata' : 'attivata'} con successo.`
    });
  };
  
  const deleteRule = (ruleId: number) => {
    const rule = rules.find(r => r.id === ruleId);
    setRules(prevRules => prevRules.filter(rule => rule.id !== ruleId));
    
    toast({
      title: "Regola eliminata",
      description: `La regola "${rule?.name}" è stata eliminata con successo.`,
      variant: "destructive"
    });
  };
  
  const handleAddRule = () => {
    const newRule = {
      ...newRuleData,
      id: Math.max(0, ...rules.map(r => r.id)) + 1,
      triggers: 0,
      lastTriggered: null
    };
    
    setRules([...rules, newRule]);
    setNewRuleData({
      name: '',
      description: '',
      type: 'moderation',
      categories: [],
      action: 'hide',
      isActive: true
    });
    setIsAddingRule(false);
    
    toast({
      title: "Nuova regola creata",
      description: `La regola "${newRule.name}" è stata creata con successo.`
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Mai';
    const date = new Date(dateString);
    return date.toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionLabel = (action: string) => {
    switch(action) {
      case 'hide': return 'Nascondi';
      case 'delete': return 'Elimina';
      case 'flag': return 'Segnala';
      case 'reply': return 'Rispondi';
      default: return action;
    }
  };

  const getActionColor = (action: string) => {
    switch(action) {
      case 'hide': return 'bg-orange-100 text-orange-700';
      case 'delete': return 'bg-red-100 text-red-700';
      case 'flag': return 'bg-yellow-100 text-yellow-700';
      case 'reply': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRuleTypeIcon = (type: string) => {
    switch(type) {
      case 'moderation':
        return <ShieldAlert className="h-5 w-5 text-red-500" />;
      case 'engagement':
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Automazione</h2>
          <p className="text-muted-foreground">
            Gestisci le regole automatiche per la moderazione e l'engagement della tua pagina
          </p>
        </div>
        <Button onClick={() => setIsAddingRule(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Nuova Regola</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Regole Attive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {rules.filter(r => r.isActive).length}/{rules.length}
              </div>
              <ShieldCheck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Contenuti Moderati (ultimi 30 giorni)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">182</div>
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Efficacia del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">94.5%</div>
              <Check className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rules List */}
      <div className="bg-white border rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h3 className="font-medium">Le tue regole di automazione</h3>
          <p className="text-sm text-gray-500">Gestisci le regole che moderano automaticamente i contenuti della tua pagina</p>
        </div>
        
        {rules.map(rule => (
          <div key={rule.id} className="p-4 border-b last:border-0">
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                {getRuleTypeIcon(rule.type)}
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{rule.name}</h4>
                    <Badge variant="outline" className={getActionColor(rule.action)}>
                      {getActionLabel(rule.action)}
                    </Badge>
                    {rule.isActive ? (
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">Attiva</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700">Inattiva</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{rule.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {rule.categories.map(category => (
                      <Badge key={category} variant="outline" className="text-xs">
                        {category.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {rule.triggers} attivazioni
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Ultima: {formatDate(rule.lastTriggered)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={rule.isActive}
                  onCheckedChange={() => toggleRuleStatus(rule.id)}
                  aria-label={`${rule.isActive ? 'Disattiva' : 'Attiva'} regola`}
                />
                <Button variant="outline" size="icon">
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => deleteRule(rule.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {rules.length === 0 && (
          <div className="p-8 text-center">
            <ShieldAlert className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-1">Nessuna regola configurata</h3>
            <p className="text-gray-500 mb-4">
              Crea la tua prima regola di automazione per moderare automaticamente la tua pagina
            </p>
            <Button onClick={() => setIsAddingRule(true)}>Crea Regola</Button>
          </div>
        )}
      </div>

      {/* Add New Rule Form */}
      {isAddingRule && (
        <Card>
          <CardHeader>
            <CardTitle>Crea nuova regola di automazione</CardTitle>
            <CardDescription>
              Configura una nuova regola per automatizzare la moderazione dei contenuti
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rule-name">Nome regola</Label>
              <Input 
                id="rule-name" 
                placeholder="Es. Blocco Contenuti Offensivi" 
                value={newRuleData.name}
                onChange={(e) => setNewRuleData({...newRuleData, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rule-description">Descrizione</Label>
              <Input 
                id="rule-description" 
                placeholder="Descrivi lo scopo della regola" 
                value={newRuleData.description}
                onChange={(e) => setNewRuleData({...newRuleData, description: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Tipo di regola</Label>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="type-moderation"
                    name="rule-type"
                    checked={newRuleData.type === 'moderation'}
                    onChange={() => setNewRuleData({...newRuleData, type: 'moderation'})}
                    className="h-4 w-4 text-blue-600"
                  />
                  <Label htmlFor="type-moderation" className="cursor-pointer">Moderazione</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="type-engagement"
                    name="rule-type"
                    checked={newRuleData.type === 'engagement'}
                    onChange={() => setNewRuleData({...newRuleData, type: 'engagement'})}
                    className="h-4 w-4 text-blue-600"
                  />
                  <Label htmlFor="type-engagement" className="cursor-pointer">Engagement</Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Categorie da rilevare</Label>
              <div className="grid grid-cols-2 gap-2">
                {['hate_speech', 'profanity', 'spam', 'xenophobia', 'racism', 'misogyny', 'sexism', 'harassment', 'threats', 'positive_sentiment'].map(category => (
                  <div key={category} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`category-${category}`}
                      checked={newRuleData.categories.includes(category)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewRuleData({
                            ...newRuleData, 
                            categories: [...newRuleData.categories, category]
                          });
                        } else {
                          setNewRuleData({
                            ...newRuleData, 
                            categories: newRuleData.categories.filter(cat => cat !== category)
                          });
                        }
                      }}
                      className="h-4 w-4 text-blue-600"
                    />
                    <Label htmlFor={`category-${category}`} className="cursor-pointer">
                      {category.replace('_', ' ')}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Azione da eseguire</Label>
              <div className="flex gap-4">
                {['hide', 'delete', 'flag', 'reply'].map(action => (
                  <div key={action} className="flex items-center gap-2">
                    <input
                      type="radio"
                      id={`action-${action}`}
                      name="rule-action"
                      checked={newRuleData.action === action}
                      onChange={() => setNewRuleData({...newRuleData, action})}
                      className="h-4 w-4 text-blue-600"
                    />
                    <Label htmlFor={`action-${action}`} className="cursor-pointer">
                      {getActionLabel(action)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch
                id="rule-active"
                checked={newRuleData.isActive}
                onCheckedChange={(checked) => setNewRuleData({...newRuleData, isActive: checked})}
              />
              <Label htmlFor="rule-active">Attiva regola immediatamente</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsAddingRule(false)}>
              Annulla
            </Button>
            <Button onClick={handleAddRule}>
              Crea Regola
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Recent Activity Log */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Attività recente</CardTitle>
          <CardDescription>
            Registro delle ultime 5 azioni automatiche eseguite
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Commento nascosto</p>
                <p className="text-xs text-gray-500">La regola "Blocco Contenuti Offensivi" ha nascosto un commento contenente linguaggio inappropriato</p>
                <p className="text-xs text-gray-400 mt-1">13 Apr 2025, 10:45</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <Trash2 className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Commento eliminato</p>
                <p className="text-xs text-gray-500">La regola "Filtro Anti-Spam" ha eliminato un commento con link sospetti</p>
                <p className="text-xs text-gray-400 mt-1">13 Apr 2025, 09:30</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <MessageSquare className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Risposta automatica inviata</p>
                <p className="text-xs text-gray-500">La regola "Rispondi ai Commenti Positivi" ha inviato una risposta automatica</p>
                <p className="text-xs text-gray-400 mt-1">13 Apr 2025, 08:15</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Commento nascosto</p>
                <p className="text-xs text-gray-500">La regola "Protezione Anti-Molestie" ha nascosto un commento contenente minacce</p>
                <p className="text-xs text-gray-400 mt-1">12 Apr 2025, 19:22</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <Trash2 className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Commento eliminato</p>
                <p className="text-xs text-gray-500">La regola "Filtro Anti-Spam" ha eliminato un commento con contenuto ripetitivo</p>
                <p className="text-xs text-gray-400 mt-1">12 Apr 2025, 16:05</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full flex gap-2 items-center">
            <RefreshCw className="h-4 w-4" />
            <span>Visualizza registro completo</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AutomationRules;
