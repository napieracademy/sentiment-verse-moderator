
import { mockSentimentTrend } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const SentimentChart = () => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Andamento del Sentiment nel Tempo</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={mockSentimentTrend}
            margin={{
              top: 5,
              right: 30,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getDate()}/${date.getMonth() + 1}`;
              }}
            />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => {
                const translatedName = name === 'positive' 
                  ? 'Positivi' 
                  : name === 'negative' 
                    ? 'Negativi' 
                    : 'Neutri';
                return [value, translatedName];
              }}
              labelFormatter={(label) => {
                const date = new Date(label);
                return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
              }}
            />
            <Legend 
              formatter={(value) => {
                return value === 'positive' 
                  ? 'Positivi' 
                  : value === 'negative' 
                    ? 'Negativi' 
                    : 'Neutri';
              }}
            />
            <Bar dataKey="positive" fill="#10B981" />
            <Bar dataKey="negative" fill="#EF4444" />
            <Bar dataKey="neutral" fill="#6B7280" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SentimentChart;
