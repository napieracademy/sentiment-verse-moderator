
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export const LoadingState = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-facebook" />
    </div>
  );
};

export const EmptyState = () => {
  return (
    <Card>
      <CardContent className="p-6 flex flex-col items-center justify-center text-center">
        <p className="text-muted-foreground mb-4">
          Non sono state trovate pagine associate al tuo account Facebook.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Una funzionalità per recuperare le tue pagine Facebook sarà implementata presto tramite Supabase Edge Functions.
        </p>
      </CardContent>
    </Card>
  );
};
