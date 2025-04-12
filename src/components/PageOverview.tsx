
import { mockPages } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PageOverview = () => {
  // In a real app, this would be the selected page
  // For this demo, we'll use the first page from our mock data
  const page = mockPages[0];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Pagina Selezionata</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <img 
            src={page.profilePic} 
            alt={page.name}
            className="h-16 w-16 rounded-lg object-cover" 
          />
          <div>
            <h3 className="text-xl font-semibold">{page.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>{page.category}</span>
              <span className="mx-2">•</span>
              <span>{page.followers.toLocaleString('it-IT')} follower</span>
              <span className="mx-2">•</span>
              <span>ID: {page.id}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PageOverview;
