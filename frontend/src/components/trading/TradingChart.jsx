import { useEffect, useRef, useState } from 'react';
import { createChart, CrosshairMode, CandlestickSeries } from 'lightweight-charts';
import { Button } from '@/components/ui/button';
import { Code2, TrendingUp, Maximize2 } from 'lucide-react';
import { toast } from 'sonner';

export const TradingChart = ({ symbol, positions, customIndicators, onShowIndicatorEditor }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const seriesRef = useRef();
  const [timeframe, setTimeframe] = useState('15');
  const wsRef = useRef(null);
  const [tpSlLines, setTpSlLines] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const dragInfoRef = useRef(null);

  // Generate realistic forex data
  const generateForexData = (symbolParam, count = 500) => {
    const data = [];
    let basePrice = symbolParam === 'XAUUSD' ? 2650 : symbolParam === 'EURUSD' ? 1.0850 : 1.2650;
    const volatility = symbolParam === 'XAUUSD' ? 2 : 0.0015;
    let time = Math.floor(Date.now() / 1000) - count * 60 * parseInt(timeframe);

    for (let i = 0; i < count; i++) {
      const change = (Math.random() - 0.5) * volatility * 2;
      basePrice += change;
      
      const open = basePrice;
      const close = basePrice + (Math.random() - 0.5) * volatility;
      const high = Math.max(open, close) + Math.random() * volatility;
      const low = Math.min(open, close) - Math.random() * volatility;

      data.push({
        time: time,
        open: parseFloat(open.toFixed(symbolParam === 'XAUUSD' ? 2 : 5)),
        high: parseFloat(high.toFixed(symbolParam === 'XAUUSD' ? 2 : 5)),
        low: parseFloat(low.toFixed(symbolParam === 'XAUUSD' ? 2 : 5)),
        close: parseFloat(close.toFixed(symbolParam === 'XAUUSD' ? 2 : 5)),
      });

      time += 60 * parseInt(timeframe);
      basePrice = close;
    }

    return data;
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { color: 'hsl(222, 13%, 12%)' },
        textColor: 'hsl(210, 40%, 98%)',
      },
      grid: {
        vertLines: { color: 'hsl(222, 13%, 18%)' },
        horzLines: { color: 'hsl(222, 13%, 18%)' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: 'hsl(217, 91%, 60%)',
          width: 1,
          style: 3,
        },
        horzLine: {
          color: 'hsl(217, 91%, 60%)',
          width: 1,
          style: 3,
        },
      },
      rightPriceScale: {
        borderColor: 'hsl(222, 13%, 20%)',
      },
      timeScale: {
        borderColor: 'hsl(222, 13%, 20%)',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    // Add candlestick series
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: 'hsl(141, 78%, 55%)',
      downColor: 'hsl(0, 84%, 60%)',
      borderVisible: false,
      wickUpColor: 'hsl(141, 78%, 55%)',
      wickDownColor: 'hsl(0, 84%, 60%)',
    });

    seriesRef.current = candlestickSeries;

    // Set initial data
    const initialData = generateForexData(symbol);
    candlestickSeries.setData(initialData);
    chart.timeScale().fitContent();

    // Simulate real-time updates
    const updateInterval = setInterval(() => {
      const lastBar = initialData[initialData.length - 1];
      const newTime = lastBar.time + 60 * parseInt(timeframe);
      const change = (Math.random() - 0.5) * (symbol === 'XAUUSD' ? 2 : 0.0015) * 2;
      const newPrice = lastBar.close + change;
      
      const newBar = {
        time: newTime,
        open: parseFloat(newPrice.toFixed(symbol === 'XAUUSD' ? 2 : 5)),
        high: parseFloat((newPrice + Math.abs(change)).toFixed(symbol === 'XAUUSD' ? 2 : 5)),
        low: parseFloat((newPrice - Math.abs(change)).toFixed(symbol === 'XAUUSD' ? 2 : 5)),
        close: parseFloat(newPrice.toFixed(symbol === 'XAUUSD' ? 2 : 5)),
      };

      initialData.push(newBar);
      if (initialData.length > 500) initialData.shift();
      
      candlestickSeries.update(newBar);
    }, 2000);

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    // Mouse event handlers for drag and drop TP/SL
    const handleMouseDown = (param) => {
      if (!param.point) return;
      
      const price = seriesRef.current.coordinateToPrice(param.point.y);
      // Check if clicking near a TP/SL line (within 10 pixels)
      // This is simplified - in production you'd check actual line positions
      setIsDragging(true);
      dragInfoRef.current = { startPrice: price };
    };

    const handleMouseMove = (param) => {
      if (!isDragging || !param.point) return;
      const price = seriesRef.current.coordinateToPrice(param.point.y);
      dragInfoRef.current.currentPrice = price;
    };

    const handleMouseUp = () => {
      if (isDragging && dragInfoRef.current) {
        // Update TP/SL based on drag
        toast.success(`TP/SL updated to ${dragInfoRef.current.currentPrice?.toFixed(5)}`);
      }
      setIsDragging(false);
      dragInfoRef.current = null;
    };

    chart.subscribeClick(handleMouseDown);

    return () => {
      clearInterval(updateInterval);
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [symbol, timeframe]);

  // Draw TP/SL lines for open positions
  useEffect(() => {
    if (!seriesRef.current || !positions.length) {
      setTpSlLines([]);
      return;
    }

    // Clear existing lines
    tpSlLines.forEach(line => line.remove?.());

    // Draw new lines
    const newLines = [];
    positions.forEach(position => {
      if (position.takeProfit) {
        const tpLine = seriesRef.current.createPriceLine({
          price: position.takeProfit,
          color: 'hsl(141, 78%, 55%)',
          lineWidth: 2,
          lineStyle: 2,
          axisLabelVisible: true,
          title: 'TP',
        });
        newLines.push(tpLine);
      }
      
      if (position.stopLoss) {
        const slLine = seriesRef.current.createPriceLine({
          price: position.stopLoss,
          color: 'hsl(0, 84%, 60%)',
          lineWidth: 2,
          lineStyle: 2,
          axisLabelVisible: true,
          title: 'SL',
        });
        newLines.push(slLine);
      }
    });

    setTpSlLines(newLines);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positions]);

  const timeframes = ['1', '5', '15', '30', '60', '240', 'D'];

  return (
    <div className="h-full flex flex-col gap-3">
      {/* Chart Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-foreground">{symbol}</h2>
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {timeframes.map(tf => (
              <Button
                key={tf}
                size="sm"
                variant={timeframe === tf ? 'default' : 'ghost'}
                onClick={() => setTimeframe(tf)}
                className="h-7 px-3 text-xs"
              >
                {tf}{tf === 'D' ? '' : 'M'}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onShowIndicatorEditor}
            className="gap-2"
          >
            <Code2 className="h-4 w-4" />
            Custom Indicators
          </Button>
          <Button size="sm" variant="outline" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Indicators
          </Button>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chart */}
      <div 
        ref={chartContainerRef} 
        className="flex-1 chart-container"
        style={{ cursor: isDragging ? 'ns-resize' : 'crosshair' }}
      />
    </div>
  );
};

export default TradingChart;