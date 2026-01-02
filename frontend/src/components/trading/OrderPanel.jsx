import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';

export const OrderPanel = ({ symbol, onOpenPosition }) => {
  const [orderType, setOrderType] = useState('market');
  const [volume, setVolume] = useState(0.01);
  const [leverage, setLeverage] = useState(100);
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [useStopLoss, setUseStopLoss] = useState(false);
  const [useTakeProfit, setUseTakeProfit] = useState(false);

  const currentPrice = symbol === 'XAUUSD' ? 2650.50 : symbol === 'EURUSD' ? 1.08500 : 1.26500;
  const spread = symbol === 'XAUUSD' ? 0.30 : 0.00015;

  const handleTrade = (direction) => {
    const position = {
      symbol,
      type: direction,
      volume,
      entryPrice: direction === 'buy' ? currentPrice + spread : currentPrice,
      stopLoss: useStopLoss ? parseFloat(stopLoss) : null,
      takeProfit: useTakeProfit ? parseFloat(takeProfit) : null,
      leverage,
      timestamp: new Date(),
    };

    onOpenPosition(position);
    toast.success(`${direction.toUpperCase()} order opened for ${symbol}`, {
      description: `Volume: ${volume} lots at ${position.entryPrice.toFixed(symbol === 'XAUUSD' ? 2 : 5)}`
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">New Order</h3>
        <p className="text-sm text-muted-foreground">{symbol}</p>
      </div>

      {/* Order Form */}
      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Order Type */}
        <div className="space-y-2">
          <Label>Order Type</Label>
          <Tabs value={orderType} onValueChange={setOrderType} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="market">Market</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Current Price Display */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Sell</div>
            <div className="text-lg font-mono font-semibold text-destructive">
              {currentPrice.toFixed(symbol === 'XAUUSD' ? 2 : 5)}
            </div>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Buy</div>
            <div className="text-lg font-mono font-semibold text-[hsl(var(--success))]">
              {(currentPrice + spread).toFixed(symbol === 'XAUUSD' ? 2 : 5)}
            </div>
          </div>
        </div>

        {/* Volume */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Volume (Lots)</Label>
            <span className="text-sm text-muted-foreground">{volume}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setVolume(Math.max(0.01, volume - 0.01))}
              className="h-8 w-8 p-0"
            >
              -
            </Button>
            <Input
              type="number"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value) || 0.01)}
              step="0.01"
              min="0.01"
              className="text-center font-mono"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => setVolume(volume + 0.01)}
              className="h-8 w-8 p-0"
            >
              +
            </Button>
          </div>
          <div className="flex gap-2">
            {[0.01, 0.1, 0.5, 1.0].map(v => (
              <Button
                key={v}
                size="sm"
                variant="outline"
                onClick={() => setVolume(v)}
                className="flex-1 h-7 text-xs"
              >
                {v}
              </Button>
            ))}
          </div>
        </div>

        {/* Leverage */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Leverage</Label>
            <span className="text-sm font-semibold text-foreground">1:{leverage}</span>
          </div>
          <Slider
            value={[leverage]}
            onValueChange={([value]) => setLeverage(value)}
            min={1}
            max={2000}
            step={1}
            className="w-full"
          />
          <div className="flex gap-2">
            {[50, 100, 200, 500, 1000].map(l => (
              <Button
                key={l}
                size="sm"
                variant="outline"
                onClick={() => setLeverage(l)}
                className="flex-1 h-7 text-xs"
              >
                1:{l}
              </Button>
            ))}
          </div>
        </div>

        {/* Stop Loss */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Stop Loss</Label>
            <Switch checked={useStopLoss} onCheckedChange={setUseStopLoss} />
          </div>
          {useStopLoss && (
            <Input
              type="number"
              placeholder="Enter SL price"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              step={symbol === 'XAUUSD' ? '0.01' : '0.00001'}
              className="font-mono"
            />
          )}
        </div>

        {/* Take Profit */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Take Profit</Label>
            <Switch checked={useTakeProfit} onCheckedChange={setUseTakeProfit} />
          </div>
          {useTakeProfit && (
            <Input
              type="number"
              placeholder="Enter TP price"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              step={symbol === 'XAUUSD' ? '0.01' : '0.00001'}
              className="font-mono"
            />
          )}
        </div>

        {/* Trade Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          <Button
            size="lg"
            className="btn-sell h-14 flex flex-col gap-1"
            onClick={() => handleTrade('sell')}
          >
            <TrendingDown className="h-5 w-5" />
            <span className="text-xs">SELL</span>
          </Button>
          <Button
            size="lg"
            className="btn-buy h-14 flex flex-col gap-1"
            onClick={() => handleTrade('buy')}
          >
            <TrendingUp className="h-5 w-5" />
            <span className="text-xs">BUY</span>
          </Button>
        </div>

        {/* Quick Info */}
        <div className="space-y-2 text-xs text-muted-foreground pt-4 border-t border-border">
          <div className="flex justify-between">
            <span>Spread:</span>
            <span className="font-mono">{spread.toFixed(symbol === 'XAUUSD' ? 2 : 5)}</span>
          </div>
          <div className="flex justify-between">
            <span>Margin Required:</span>
            <span className="font-mono">${(currentPrice * volume * 100000 / leverage).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPanel;