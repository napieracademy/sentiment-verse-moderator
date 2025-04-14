
import React from "react";
import { 
  Table, TableHeader, TableBody, TableHead, 
  TableRow, TableCaption 
} from "@/components/ui/table";
import { 
  Card, CardHeader, CardTitle, CardContent, CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingState } from "./LoadingState";
import { PostItem } from "./posts/PostItem";
import { PostDetailsDialog } from "./posts/PostDetailsDialog";
import { usePagePosts } from "../hooks/usePagePosts";
import { PostsTableProps } from "../types/post";

export const PostsTable: React.FC<PostsTableProps> = ({ pageId, accessToken }) => {
  const { 
    loading, 
    pageData, 
    selectedPost, 
    isDialogOpen,
    fetchPagePosts,
    formatDate,
    handlePostClick,
    handleCloseDialog
  } = usePagePosts();

  const handleLoadPosts = () => {
    fetchPagePosts(pageId, accessToken);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Post della Pagina</CardTitle>
              <CardDescription>
                Visualizza tutti i post pubblicati sulla pagina
              </CardDescription>
            </div>
            <Button onClick={handleLoadPosts} disabled={loading}>
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Caricamento...
                </>
              ) : "Carica Post"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingState />
          ) : pageData?.published_posts?.data && pageData.published_posts.data.length > 0 ? (
            <div>
              <Table>
                <TableCaption>Lista dei post pubblicati sulla pagina</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Data</TableHead>
                    <TableHead>Contenuto</TableHead>
                    <TableHead>Immagine</TableHead>
                    <TableHead className="text-center">Like</TableHead>
                    <TableHead className="text-center">Commenti</TableHead>
                    <TableHead className="w-[100px]">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageData.published_posts.data.map((post) => (
                    <PostItem 
                      key={post.id} 
                      post={post} 
                      formatDate={formatDate}
                      onViewDetails={handlePostClick}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : pageData ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nessun post trovato per questa pagina</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Clicca su "Carica Post" per visualizzare i post della pagina</p>
            </div>
          )}
        </CardContent>
      </Card>

      <PostDetailsDialog
        post={selectedPost}
        formatDate={formatDate}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </div>
  );
};
