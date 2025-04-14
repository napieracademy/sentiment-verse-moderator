
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { FacebookPage } from "../types";

interface PageDetailProps {
  selectedPage: FacebookPage | null;
  onGoToDashboard: () => void;
}

export const PageDetail = ({ selectedPage, onGoToDashboard }: PageDetailProps) => {
  if (!selectedPage) {
    return (
      <Card>
        <CardContent className="p-6 flex flex-col items-center justify-center h-[400px] text-center">
          <p className="text-muted-foreground mb-4">
            Seleziona una pagina dalla lista per visualizzarne i dettagli
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Dettagli Pagina</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-6">
          {selectedPage.picture?.data?.url ? (
            <img 
              src={selectedPage.picture.data.url} 
              alt={selectedPage.name}
              className="h-24 w-24 rounded-lg object-cover" 
            />
          ) : (
            <div className="h-24 w-24 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 text-xl">
              {selectedPage.name.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="text-2xl font-bold">{selectedPage.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <span>{selectedPage.category}</span>
              {selectedPage.followers_count && (
                <>
                  <span className="mx-2">•</span>
                  <span>{selectedPage.followers_count.toLocaleString('it-IT')} follower</span>
                </>
              )}
            </div>
            {selectedPage.link && (
              <a 
                href={selectedPage.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline mt-1 inline-block"
              >
                Visita pagina
              </a>
            )}
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Proprietà</TableHead>
              <TableHead>Valore</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">ID</TableCell>
              <TableCell>{selectedPage.id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Fan count</TableCell>
              <TableCell>{selectedPage.fan_count?.toLocaleString('it-IT') || 'N/A'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Follower count</TableCell>
              <TableCell>{selectedPage.followers_count?.toLocaleString('it-IT') || 'N/A'}</TableCell>
            </TableRow>
            {selectedPage.about && (
              <TableRow>
                <TableCell className="font-medium">About</TableCell>
                <TableCell>{selectedPage.about}</TableCell>
              </TableRow>
            )}
            {selectedPage.description && (
              <TableRow>
                <TableCell className="font-medium">Descrizione</TableCell>
                <TableCell>{selectedPage.description}</TableCell>
              </TableRow>
            )}
            {selectedPage.location && (
              <TableRow>
                <TableCell className="font-medium">Località</TableCell>
                <TableCell>
                  {selectedPage.location.city}, {selectedPage.location.country}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        <div className="mt-6">
          <Button onClick={onGoToDashboard}>
            Analizza questa pagina
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
