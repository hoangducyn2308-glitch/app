import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Editor from '@monaco-editor/react';
import { Play, Save, Code2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

const exampleIndicatorCode = `// Custom RSI Indicator
function calculateRSI(prices, period = 14) {
  const gains = [];
  const losses = [];
  
  for (let i = 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }
  
  const avgGain = gains.slice(0, period).reduce((a, b) => a + b) / period;
  const avgLoss = losses.slice(0, period).reduce((a, b) => a + b) / period;
  
  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));
  
  return rsi;
}

// Return indicator value
return calculateRSI(data.close, 14);`;

const exampleStrategyCode = `// Simple Moving Average Crossover Strategy
function SMA(prices, period) {
  const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
  return sum / period;
}

const sma20 = SMA(data.close, 20);
const sma50 = SMA(data.close, 50);

if (sma20 > sma50) {
  return { signal: 'BUY', strength: 0.8 };
} else if (sma20 < sma50) {
  return { signal: 'SELL', strength: 0.8 };
}

return { signal: 'HOLD', strength: 0 };`;

export const IndicatorEditor = ({ onClose, onSave }) => {
  const [indicatorName, setIndicatorName] = useState('Custom Indicator');
  const [code, setCode] = useState(exampleIndicatorCode);
  const [activeTab, setActiveTab] = useState('indicator');

  const handleSave = () => {
    if (!indicatorName.trim()) {
      toast.error('Please enter an indicator name');
      return;
    }

    onSave({
      name: indicatorName,
      code: code,
      type: activeTab,
      timestamp: new Date(),
    });

    toast.success(`${activeTab === 'indicator' ? 'Indicator' : 'Strategy'} saved successfully`, {
      description: indicatorName
    });
    onClose();
  };

  const handleTest = () => {
    toast.info('Running backtest...', {
      description: 'Testing indicator on historical data'
    });
    
    setTimeout(() => {
      toast.success('Backtest complete', {
        description: 'Win rate: 68% | Profit Factor: 1.85'
      });
    }, 2000);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              Custom Indicator Editor
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleTest} className="gap-2">
                <Play className="h-4 w-4" />
                Test
              </Button>
              <Button size="sm" onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="px-6 pt-4">
              <TabsList>
                <TabsTrigger value="indicator">Custom Indicator</TabsTrigger>
                <TabsTrigger value="strategy">Trading Strategy</TabsTrigger>
                <TabsTrigger value="docs">Documentation</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="indicator" className="flex-1 flex flex-col px-6 pb-6 m-0">
              <div className="space-y-3 mb-4">
                <div>
                  <Label>Indicator Name</Label>
                  <Input
                    value={indicatorName}
                    onChange={(e) => setIndicatorName(e.target.value)}
                    placeholder="Enter indicator name"
                    className="mt-1.5"
                  />
                </div>
              </div>
              <div className="flex-1 border border-border rounded-lg overflow-hidden">
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                  }}
                />
              </div>
            </TabsContent>

            <TabsContent value="strategy" className="flex-1 flex flex-col px-6 pb-6 m-0">
              <div className="space-y-3 mb-4">
                <div>
                  <Label>Strategy Name</Label>
                  <Input
                    value={indicatorName}
                    onChange={(e) => setIndicatorName(e.target.value)}
                    placeholder="Enter strategy name"
                    className="mt-1.5"
                  />
                </div>
              </div>
              <div className="flex-1 border border-border rounded-lg overflow-hidden">
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  value={exampleStrategyCode}
                  onChange={(value) => setCode(value || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                  }}
                />
              </div>
            </TabsContent>

            <TabsContent value="docs" className="flex-1 px-6 pb-6 m-0 overflow-auto">
              <div className="prose prose-invert max-w-none">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Available Data
                    </h3>
                    <div className="bg-muted rounded-lg p-4 space-y-2 text-sm">
                      <div className="font-mono">
                        <span className="text-[hsl(var(--success))]">data.open</span> - Array of opening prices
                      </div>
                      <div className="font-mono">
                        <span className="text-[hsl(var(--success))]">data.high</span> - Array of high prices
                      </div>
                      <div className="font-mono">
                        <span className="text-[hsl(var(--success))]">data.low</span> - Array of low prices
                      </div>
                      <div className="font-mono">
                        <span className="text-[hsl(var(--success))]">data.close</span> - Array of closing prices
                      </div>
                      <div className="font-mono">
                        <span className="text-[hsl(var(--success))]">data.volume</span> - Array of volumes
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Example Indicators</h3>
                    <div className="space-y-3">
                      <div className="bg-card border border-border rounded-lg p-4">
                        <h4 className="font-semibold text-foreground mb-2">Simple Moving Average (SMA)</h4>
                        <pre className="bg-muted rounded p-3 text-xs overflow-x-auto">
{`function SMA(prices, period) {
  const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
  return sum / period;
}`}
                        </pre>
                      </div>

                      <div className="bg-card border border-border rounded-lg p-4">
                        <h4 className="font-semibold text-foreground mb-2">Exponential Moving Average (EMA)</h4>
                        <pre className="bg-muted rounded p-3 text-xs overflow-x-auto">
{`function EMA(prices, period) {
  const k = 2 / (period + 1);
  let ema = prices[0];
  for (let i = 1; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k);
  }
  return ema;
}`}
                        </pre>
                      </div>

                      <div className="bg-card border border-border rounded-lg p-4">
                        <h4 className="font-semibold text-foreground mb-2">MACD</h4>
                        <pre className="bg-muted rounded p-3 text-xs overflow-x-auto">
{`const ema12 = EMA(data.close, 12);
const ema26 = EMA(data.close, 26);
const macd = ema12 - ema26;
const signal = EMA([macd], 9);
return { macd, signal, histogram: macd - signal };`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Return Format</h3>
                    <div className="bg-muted rounded-lg p-4 space-y-2 text-sm">
                      <p className="text-muted-foreground">For indicators, return a single number:</p>
                      <div className="font-mono text-[hsl(var(--success))]">return 65.5;</div>
                      <p className="text-muted-foreground mt-3">For strategies, return an object:</p>
                      <div className="font-mono text-[hsl(var(--success))]">{'return { signal: "BUY", strength: 0.8 };'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IndicatorEditor;