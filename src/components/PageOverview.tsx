
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ExternalLink } from "lucide-react";

interface FacebookPage {
  id: string;
  name: string;
  category: string;
  picture?: {
    data: {
      url: string;
    }
  };
  profilePic?: string;
  fan_count?: number;
  followers?: number;
  followers_count?: number;
  link?: string;
}

const PageOverview = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<FacebookPage | null>(null);

  useEffect(() => {
    // Fetch real Facebook page data
    // TODO: Implement Facebook API integration to fetch page details
    const storedPage = localStorage.getItem("selectedPage");
    if (storedPage) {
      try {
        const parsedPage = JSON.parse(storedPage);
        setPage(parsedPage);
      } catch (error) {
        console.error("Error parsing stored page:", error);
      }
    }
  }, []);

  const handleChangePage = () => {
    navigate("/page-data");
  };

  if (!page) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Pagina Facebook</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4 py-6">
            <p className="text-muted-foreground text-center">
              Nessuna pagina selezionata
            </p>
            <Button onClick={handleChangePage}>
              Seleziona una pagina
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const profilePicUrl = page.picture?.data?.url || page.profilePic;
  const followersCount = page.followers_count || page.followers || page.fan_count || 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Pagina Selezionata</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          {profilePicUrl ? (
            <img 
              src={profilePicUrl} 
              alt={page.name}
              className="h-16 w-16 rounded-lg object-cover" 
            />
          ) : (
            <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500">
              {page.name.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-xl font-semibold">{page.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>{page.category}</span>
              <span className="mx-2">•</span>
              <span>{followersCount.toLocaleString('it-IT')} follower</span>
              <span className="mx-2">•</span>
              <span>ID: {page.id}</span>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleChangePage}>
            Cambia
          </Button>
        </div>
        
        {page.link && (
          <a 
            href={page.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center text-sm text-blue-600 hover:underline mt-4"
          >
            <ExternalLink className="h-4 w-4 mr-1" /> 
            Visita la pagina su Facebook
          </a>
        )}
      </CardContent>
    </Card>
  );
};

export default PageOverview;
