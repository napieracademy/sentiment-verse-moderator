
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FacebookPage } from "../types";

interface PageListProps {
  pages: FacebookPage[];
  selectedPage: FacebookPage | null;
  onSelectPage: (page: FacebookPage) => void;
  loading: boolean;
}

export const PageList = ({ pages, selectedPage, onSelectPage, loading }: PageListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Pagine collegate</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {pages.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">Nessuna pagina trovata</p>
        ) : (
          <div className="max-h-[500px] overflow-y-auto">
            {pages.map((page) => (
              <div 
                key={page.id}
                className={`flex items-center p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${selectedPage?.id === page.id ? 'bg-blue-50' : ''}`}
                onClick={() => onSelectPage(page)}
              >
                {page.picture?.data?.url ? (
                  <img src={page.picture.data.url} alt={page.name} className="h-10 w-10 rounded-md object-cover" />
                ) : (
                  <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-500">
                    P
                  </div>
                )}
                <div className="ml-3 flex-1">
                  <p className="font-medium">{page.name}</p>
                  <p className="text-xs text-muted-foreground">{page.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
