import { ScrollArea } from '@/components/ui/scroll-area';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const newsItems = [
  {
    id: 1,
    title: 'Fed Signals Potential Rate Cuts',
    summary: 'Federal Reserve hints at possible interest rate adjustments in Q2 2024',
    impact: 'high',
    time: '15 min ago',
    sentiment: 'positive'
  },
  {
    id: 2,
    title: 'Gold Prices Surge on Safe Haven Demand',
    summary: 'XAU/USD reaches new highs as investors seek safe-haven assets',
    impact: 'high',
    time: '1 hour ago',
    sentiment: 'positive'
  },
  {
    id: 3,
    title: 'EUR/USD Under Pressure',
    summary: 'Euro weakens against dollar on ECB policy uncertainty',
    impact: 'medium',
    time: '2 hours ago',
    sentiment: 'negative'
  },
  {
    id: 4,
    title: 'Oil Prices Stabilize',
    summary: 'Crude oil finds support at key levels after recent volatility',
    impact: 'medium',
    time: '3 hours ago',
    sentiment: 'neutral'
  },
  {
    id: 5,
    title: 'UK Economic Data Beats Expectations',
    summary: 'GBP/USD rallies on stronger-than-expected retail sales figures',
    impact: 'high',
    time: '4 hours ago',
    sentiment: 'positive'
  },
  {
    id: 6,
    title: 'Japanese Yen Weakens Further',
    summary: 'USD/JPY continues upward trend as BoJ maintains dovish stance',
    impact: 'medium',
    time: '5 hours ago',
    sentiment: 'negative'
  },
];

export const NewsPanel = () => {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-3">
        {newsItems.map(news => {
          const impactColor = {
            high: 'bg-destructive/20 text-destructive border-destructive/50',
            medium: 'bg-accent/20 text-accent border-accent/50',
            low: 'bg-muted text-muted-foreground border-border'
          }[news.impact];

          const sentimentIcon = {
            positive: <TrendingUp className="h-4 w-4 text-[hsl(var(--success))]" />,
            negative: <TrendingDown className="h-4 w-4 text-destructive" />,
            neutral: <Clock className="h-4 w-4 text-muted-foreground" />
          }[news.sentiment];

          return (
            <div
              key={news.id}
              className="p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">{sentimentIcon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-semibold text-sm text-foreground leading-tight">
                      {news.title}
                    </h4>
                    <Badge variant="outline" className={`${impactColor} text-xs flex-shrink-0`}>
                      {news.impact}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {news.summary}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {news.time}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default NewsPanel;