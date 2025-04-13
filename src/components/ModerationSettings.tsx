
import { useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { RadioGroup } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const ModerationSettings = () => {
  const [testComment, setTestComment] = useState("");
  const [moderationOptions, setModerationOptions] = useState({
    hideProfanity: false,
    hideNegativity: false,
    hideUrls: false,
    hideEmailsAndPhones: false,
    hideMentions: false,
    hideHashtags: false,
    hideImages: false,
    hideEmojis: false,
    hideKeywords: false,
    hideAllComments: false,
    deleteComments: false
  });

  const handleOptionChange = (option: string) => {
    setModerationOptions({
      ...moderationOptions,
      [option]: !moderationOptions[option as keyof typeof moderationOptions]
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Impostazioni Moderazione</h3>
        <p className="text-muted-foreground mb-6">
          Qui puoi definire le impostazioni di moderazione che verranno utilizzate per elaborare i nuovi commenti che riceverai sui tuoi post e annunci.
        </p>
      </div>

      <div>
        <h4 className="font-medium mb-4">Copia impostazioni da</h4>
        <Select>
          <SelectTrigger className="w-full max-w-sm">
            <SelectValue placeholder="Seleziona pagina" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="page1">Pagina Fitness</SelectItem>
            <SelectItem value="page2">Pagina Ristorante</SelectItem>
            <SelectItem value="page3">Blog Aziendale</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        <FormItem className="flex items-start space-x-3 space-y-0">
          <div>
            <Checkbox 
              id="hide-profanity" 
              checked={moderationOptions.hideProfanity}
              onCheckedChange={() => handleOptionChange('hideProfanity')}
            />
          </div>
          <Label className="font-normal" htmlFor="hide-profanity">
            Nascondi parolacce
          </Label>
        </FormItem>

        <FormItem className="flex items-start space-x-3 space-y-0">
          <div>
            <Checkbox 
              id="hide-negativity" 
              checked={moderationOptions.hideNegativity}
              onCheckedChange={() => handleOptionChange('hideNegativity')}
            />
          </div>
          <Label className="font-normal" htmlFor="hide-negativity">
            Nascondi negatività
          </Label>
        </FormItem>

        <FormItem className="flex items-start space-x-3 space-y-0">
          <div>
            <Checkbox 
              id="hide-urls" 
              checked={moderationOptions.hideUrls}
              onCheckedChange={() => handleOptionChange('hideUrls')}
            />
          </div>
          <Label className="font-normal" htmlFor="hide-urls">
            Nascondi URL
          </Label>
        </FormItem>

        <FormItem className="flex items-start space-x-3 space-y-0">
          <div>
            <Checkbox 
              id="hide-emails-phones" 
              checked={moderationOptions.hideEmailsAndPhones}
              onCheckedChange={() => handleOptionChange('hideEmailsAndPhones')}
            />
          </div>
          <Label className="font-normal" htmlFor="hide-emails-phones">
            Nascondi email e numeri di telefono
          </Label>
        </FormItem>

        <FormItem className="flex items-start space-x-3 space-y-0">
          <div>
            <Checkbox 
              id="hide-mentions" 
              checked={moderationOptions.hideMentions}
              onCheckedChange={() => handleOptionChange('hideMentions')}
            />
          </div>
          <Label className="font-normal" htmlFor="hide-mentions">
            Nascondi menzioni
          </Label>
        </FormItem>

        <FormItem className="flex items-start space-x-3 space-y-0">
          <div>
            <Checkbox 
              id="hide-hashtags" 
              checked={moderationOptions.hideHashtags}
              onCheckedChange={() => handleOptionChange('hideHashtags')}
            />
          </div>
          <Label className="font-normal" htmlFor="hide-hashtags">
            Nascondi hashtag
          </Label>
        </FormItem>

        <FormItem className="flex items-start space-x-3 space-y-0">
          <div>
            <Checkbox 
              id="hide-images" 
              checked={moderationOptions.hideImages}
              onCheckedChange={() => handleOptionChange('hideImages')}
            />
          </div>
          <Label className="font-normal" htmlFor="hide-images">
            Nascondi immagini
          </Label>
        </FormItem>

        <FormItem className="flex items-start space-x-3 space-y-0">
          <div>
            <Checkbox 
              id="hide-emojis" 
              checked={moderationOptions.hideEmojis}
              onCheckedChange={() => handleOptionChange('hideEmojis')}
            />
          </div>
          <Label className="font-normal" htmlFor="hide-emojis">
            Nascondi emoji
          </Label>
        </FormItem>

        <FormItem className="flex items-start space-x-3 space-y-0">
          <div>
            <Checkbox 
              id="hide-keywords" 
              checked={moderationOptions.hideKeywords}
              onCheckedChange={() => handleOptionChange('hideKeywords')}
            />
          </div>
          <Label className="font-normal" htmlFor="hide-keywords">
            Nascondi parole chiave
          </Label>
        </FormItem>

        <div className="border-t my-4 pt-4">
          <FormItem className="flex items-start space-x-3 space-y-0">
            <div>
              <Checkbox 
                id="hide-all-comments" 
                checked={moderationOptions.hideAllComments}
                onCheckedChange={() => handleOptionChange('hideAllComments')}
              />
            </div>
            <Label className="font-normal" htmlFor="hide-all-comments">
              Nascondi tutti i commenti
            </Label>
          </FormItem>
        </div>

        <div className="border-t my-4 pt-4">
          <FormItem className="flex items-start space-x-3 space-y-0">
            <div>
              <Checkbox 
                id="delete-comments" 
                checked={moderationOptions.deleteComments}
                onCheckedChange={() => handleOptionChange('deleteComments')}
              />
            </div>
            <div>
              <Label className="font-normal" htmlFor="delete-comments">
                Cancella commenti
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Elimina automaticamente (invece di nascondere) i commenti che attivano le tue impostazioni di moderazione.
              </p>
            </div>
          </FormItem>
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="font-medium mb-4">Testa le impostazioni di moderazione</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Qui puoi testare i commenti per vedere se attiveranno le tue impostazioni di moderazione abilitate.
        </p>
        
        <Textarea 
          placeholder="Scrivi il tuo commento qui..."
          className="h-32 mb-4"
          value={testComment}
          onChange={(e) => setTestComment(e.target.value)}
        />
        
        <Button variant="default">
          Testa commento
        </Button>
      </div>
    </div>
  );
};

export default ModerationSettings;
