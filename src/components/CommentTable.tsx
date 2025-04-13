
import { useState } from "react";
import { mockComments, Comment, Sentiment } from "@/lib/mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ThumbsDown, ThumbsUp, MoreHorizontal, Trash2, MessageSquare, Tag, Filter } from "lucide-react";
import { format } from "date-fns";
import { getSentimentColor } from "@/lib/mockData";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CommentTable = () => {
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [filter, setFilter] = useState<Sentiment | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [contentType, setContentType] = useState<"comments" | "mentions" | "ratings">("comments");

  const handleToggleHidden = (commentId: string) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, hidden: !comment.hidden }
          : comment
      )
    );
    
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      toast({
        title: comment.hidden ? "Contenuto mostrato" : "Contenuto nascosto",
        description: `Il ${contentType === "comments" ? "commento" : contentType === "mentions" ? "post con menzione" : "valutazione"} di ${comment.authorName} è stato ${comment.hidden ? "mostrato" : "nascosto"}.`,
      });
    }
  };

  const handleDelete = (commentId: string) => {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      setComments(comments.filter((c) => c.id !== commentId));
      toast({
        title: "Contenuto eliminato",
        description: `Il ${contentType === "comments" ? "commento" : contentType === "mentions" ? "post con menzione" : "valutazione"} di ${comment.authorName} è stato eliminato.`,
        variant: "destructive",
      });
    }
  };

  const filteredComments = comments.filter((comment) => {
    const matchesSentiment = filter === "all" || comment.sentiment === filter;
    const matchesSearch = comment.content
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSentiment && matchesSearch;
  });

  const getSentimentIcon = (sentiment: Sentiment) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="h-4 w-4 text-positive" />;
      case "negative":
        return <ThumbsDown className="h-4 w-4 text-negative" />;
      default:
        return null;
    }
  };

  const getContentIcon = () => {
    switch (contentType) {
      case "comments":
        return <MessageSquare className="h-4 w-4 mr-2" />;
      case "mentions":
        return <Tag className="h-4 w-4 mr-2" />;
      case "ratings":
        return <ThumbsUp className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  const getContentTypeTitle = () => {
    switch (contentType) {
      case "comments":
        return "Commenti della Pagina";
      case "mentions":
        return "Menzioni della Pagina";
      case "ratings":
        return "Valutazioni della Pagina";
      default:
        return "Contenuti della Pagina";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {getContentIcon()}
            <CardTitle className="text-lg">{getContentTypeTitle()}</CardTitle>
          </div>
          <div className="flex space-x-2">
            <div className="w-64">
              <Input
                placeholder="Cerca nei contenuti..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <Select
              value={filter}
              onValueChange={(value) => setFilter(value as Sentiment | "all")}
            >
              <SelectTrigger className="w-36 h-8 text-sm">
                <SelectValue placeholder="Tutti i commenti" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Tutti i contenuti</SelectItem>
                  <SelectItem value="positive">Positivi</SelectItem>
                  <SelectItem value="neutral">Neutri</SelectItem>
                  <SelectItem value="negative">Negativi</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="comments" className="w-full mb-4" onValueChange={(v) => setContentType(v as "comments" | "mentions" | "ratings")}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="comments" className="flex items-center justify-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Commenti
            </TabsTrigger>
            <TabsTrigger value="mentions" className="flex items-center justify-center">
              <Tag className="h-4 w-4 mr-2" />
              Menzioni
            </TabsTrigger>
            <TabsTrigger value="ratings" className="flex items-center justify-center">
              <ThumbsUp className="h-4 w-4 mr-2" />
              Valutazioni
            </TabsTrigger>
          </TabsList>
          
          <div className="rounded-md border mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30%]">Autore</TableHead>
                  <TableHead className="w-[40%]">
                    {contentType === "comments" ? "Commento" : contentType === "mentions" ? "Post con Menzione" : "Valutazione"}
                  </TableHead>
                  <TableHead>Sentiment</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Nessun contenuto trovato
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredComments.map((comment) => (
                    <TableRow 
                      key={comment.id}
                      className={comment.hidden ? "bg-gray-50" : ""}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <img
                            src={comment.authorProfilePic}
                            alt={comment.authorName}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                          <div>
                            <div>{comment.authorName}</div>
                            <div className="text-xs text-muted-foreground">
                              Post ID: {comment.postId}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className={comment.hidden ? "italic text-muted-foreground" : ""}>
                        {comment.hidden ? 
                          contentType === "comments" 
                            ? "[Commento nascosto]" 
                            : contentType === "mentions" 
                              ? "[Menzione nascosta]" 
                              : "[Valutazione nascosta]" 
                          : comment.content}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {getSentimentIcon(comment.sentiment)}
                          <span className={`text-sm ${getSentimentColor(comment.sentiment)}`}>
                            {comment.sentiment === "positive"
                              ? "Positivo"
                              : comment.sentiment === "negative"
                              ? "Negativo"
                              : "Neutro"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(comment.timestamp), "dd/MM/yyyy HH:mm")}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Opzioni</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleToggleHidden(comment.id)}
                            >
                              {comment.hidden ? (
                                <>
                                  <Eye className="mr-2 h-4 w-4" />
                                  <span>Mostra {contentType === "comments" ? "commento" : contentType === "mentions" ? "menzione" : "valutazione"}</span>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="mr-2 h-4 w-4" />
                                  <span>Nascondi {contentType === "comments" ? "commento" : contentType === "mentions" ? "menzione" : "valutazione"}</span>
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(comment.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Elimina {contentType === "comments" ? "commento" : contentType === "mentions" ? "menzione" : "valutazione"}</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Tabs>
        
        <div className="text-xs text-muted-foreground mt-4">
          <p className="italic">
            Questa funzionalità utilizza l'autorizzazione pages_read_user_content, che permette di leggere contenuti 
            generati dagli utenti sulla Pagina (post, commenti e valutazioni) e di eliminare i commenti degli utenti. 
            Permette inoltre di leggere i post in cui è taggata la Pagina per la gestione completa dei contenuti.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentTable;
