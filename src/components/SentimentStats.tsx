
import { getSentimentStats } from "@/lib/mockData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SentimentStats = () => {
  const stats = getSentimentStats();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Distribuzione del Sentiment</CardTitle>
          <CardDescription>Panoramica dei commenti per tipo di sentiment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Positivi</span>
                <span className="font-medium">{stats.positive.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-positive rounded-full h-2"
                  style={{ width: `${stats.positive.percentage}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Neutri</span>
                <span className="font-medium">{stats.neutral.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-neutral rounded-full h-2"
                  style={{ width: `${stats.neutral.percentage}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Negativi</span>
                <span className="font-medium">{stats.negative.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-negative rounded-full h-2"
                  style={{ width: `${stats.negative.percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Engagement</CardTitle>
          <CardDescription>Statistiche di interazione con la Pagina</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tasso di engagement</p>
              <p className="text-2xl font-bold">{stats.engagementRate}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Commenti per post</p>
              <p className="text-2xl font-bold">{stats.commentsPerPost}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Commenti Totali</CardTitle>
          <CardDescription>Dettaglio numerico dei commenti</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Totali</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground text-positive">Positivi</p>
              <p className="text-2xl font-bold text-positive">{stats.positive.count}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground text-negative">Negativi</p>
              <p className="text-2xl font-bold text-negative">{stats.negative.count}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SentimentStats;
