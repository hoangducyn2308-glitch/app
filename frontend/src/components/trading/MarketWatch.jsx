import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { TrendingUp, TrendingDown } from 'lucide-react';

const forexPairs = [
  { symbol: 'XAUUSD', name: 'Gold', price: 2650.50, change: 1.25 },
  { symbol: 'EURUSD', name: 'Euro vs Dollar', price: 1.08500, change: -0.15 },
  { symbol: 'GBPUSD', name: 'Pound vs Dollar', price: 1.26500, change: 0.32 },
  { symbol: 'USDJPY', name: 'Dollar vs Yen', price: 149.250, change: -0.08 },
  { symbol: 'AUDUSD', name: 'Aussie vs Dollar', price: 0.63200, change: 0.18 },
  { symbol: 'USDCAD', name: 'Dollar vs Canadian', price: 1.38500, change: -0.22 },
  { symbol: 'NZDUSD', name: 'Kiwi vs Dollar', price: 0.57800, change: 0.15 },
  { symbol: 'USDCHF', name: 'Dollar vs Franc', price: 0.88900, change: -0.11 },
];

export const MarketWatch = ({ selectedSymbol, onSelectSymbol }) => {
  const [search, setSearch] = useState('');
  const [prices, setPrices] = useState(forexPairs);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => prev.map(pair => ({
        ...pair,
        price: pair.price + (Math.random() - 0.5) * (pair.symbol === 'XAUUSD' ? 1 : 0.001),
        change: pair.change + (Math.random() - 0.5) * 0.1,
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const filteredPairs = prices.filter(pair =>
    pair.symbol.toLowerCase().includes(search.toLowerCase()) ||
    pair.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground mb-3">Market Watch</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search symbols..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Symbol List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredPairs.map(pair => {
            const isSelected = selectedSymbol === pair.symbol;
            const isPositive = pair.change >= 0;
            const decimals = pair.symbol === 'XAUUSD' || pair.symbol === 'USDJPY' ? 2 : 5;

            return (
              <button
                key={pair.symbol}
                onClick={() => onSelectSymbol(pair.symbol)}
                className={`w-full p-3 rounded-lg mb-1 transition-all hover:bg-muted/50 ${
                  isSelected ? 'bg-muted border border-border' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="text-left">
                    <div className="font-semibold text-sm text-foreground">{pair.symbol}</div>
                    <div className="text-xs text-muted-foreground truncate">{pair.name}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    {isPositive ? (
                      <TrendingUp className="h-3 w-3 text-[hsl(var(--success))]" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-destructive" />
                    )}
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div className="font-mono text-base font-semibold text-foreground">
                    {pair.price.toFixed(decimals)}
                  </div>
                  <div className={`text-xs font-medium ${
                    isPositive ? 'text-[hsl(var(--success))]' : 'text-destructive'
                  }`}>
                    {isPositive ? '+' : ''}{pair.change.toFixed(2)}%
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MarketWatch;