import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, TrendingUp, TrendingDown, Edit } from 'lucide-react';
import { toast } from 'sonner';

export const PositionsPanel = ({ positions, onClosePosition }) => {
  const [currentPrices, setCurrentPrices] = useState({});

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const prices = {};
      positions.forEach(pos => {
        const volatility = pos.symbol === 'XAUUSD' ? 0.5 : 0.0005;
        const change = (Math.random() - 0.5) * volatility;
        prices[pos.id] = pos.entryPrice + change;
      });
      setCurrentPrices(prices);
    }, 1000);

    return () => clearInterval(interval);
  }, [positions]);

  const calculatePnL = (position) => {
    const currentPrice = currentPrices[position.id] || position.entryPrice;
    const priceChange = position.type === 'buy' 
      ? currentPrice - position.entryPrice
      : position.entryPrice - currentPrice;
    
    const pipValue = position.symbol === 'XAUUSD' ? 1 : 100000;
    return priceChange * position.volume * pipValue;
  };

  const handleClosePosition = (position) => {
    const pnl = calculatePnL(position);
    onClosePosition(position.id);
    toast.success('Position closed', {
      description: `P&L: ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)}`
    });
  };

  if (positions.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        No open positions
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 sticky top-0">
          <tr className="border-b border-border">
            <th className="text-left p-3 font-medium text-muted-foreground">Symbol</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
            <th className="text-right p-3 font-medium text-muted-foreground">Volume</th>
            <th className="text-right p-3 font-medium text-muted-foreground">Entry Price</th>
            <th className="text-right p-3 font-medium text-muted-foreground">Current Price</th>
            <th className="text-right p-3 font-medium text-muted-foreground">P&L</th>
            <th className="text-right p-3 font-medium text-muted-foreground">SL</th>
            <th className="text-right p-3 font-medium text-muted-foreground">TP</th>
            <th className="text-center p-3 font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {positions.map(position => {
            const pnl = calculatePnL(position);
            const currentPrice = currentPrices[position.id] || position.entryPrice;
            const decimals = position.symbol === 'XAUUSD' ? 2 : 5;

            return (
              <tr key={position.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{position.symbol}</div>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    {position.type === 'buy' ? (
                      <>
                        <TrendingUp className="h-4 w-4 text-[hsl(var(--success))]" />
                        <span className="text-[hsl(var(--success))] font-medium uppercase">{position.type}</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-4 w-4 text-destructive" />
                        <span className="text-destructive font-medium uppercase">{position.type}</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="p-3 text-right font-mono">{position.volume}</td>
                <td className="p-3 text-right font-mono">{position.entryPrice.toFixed(decimals)}</td>
                <td className="p-3 text-right font-mono animate-pulse-subtle">
                  {currentPrice.toFixed(decimals)}
                </td>
                <td className={`p-3 text-right font-mono font-semibold ${pnl >= 0 ? 'profit-text' : 'loss-text'}`}>
                  {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                </td>
                <td className="p-3 text-right font-mono text-muted-foreground">
                  {position.stopLoss ? position.stopLoss.toFixed(decimals) : '-'}
                </td>
                <td className="p-3 text-right font-mono text-muted-foreground">
                  {position.takeProfit ? position.takeProfit.toFixed(decimals) : '-'}
                </td>
                <td className="p-3">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => toast.info('Edit feature coming soon')}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive"
                      onClick={() => handleClosePosition(position)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PositionsPanel;