import { useState } from "react";
import Sidebar from "@/components/trading/Sidebar";
import TradingChart from "@/components/trading/TradingChart";
import OrderPanel from "@/components/trading/OrderPanel";
import PositionsPanel from "@/components/trading/PositionsPanel";
import MarketWatch from "@/components/trading/MarketWatch";
import AccountInfo from "@/components/trading/AccountInfo";
import NewsPanel from "@/components/trading/NewsPanel";
import IndicatorEditor from "@/components/trading/IndicatorEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const TradingPlatform = () => {
  const [selectedSymbol, setSelectedSymbol] = useState("XAUUSD");
  const [positions, setPositions] = useState([]);
  const [showIndicatorEditor, setShowIndicatorEditor] = useState(false);
  const [customIndicators, setCustomIndicators] = useState([]);

  const handleOpenPosition = (position) => {
    setPositions([...positions, { ...position, id: Date.now() }]);
  };

  const handleClosePosition = (positionId) => {
    setPositions(positions.filter(p => p.id !== positionId));
  };

  const handleAddIndicator = (indicator) => {
    setCustomIndicators([...customIndicators, indicator]);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-background overflow-hidden">
      {/* Top Bar */}
      <div className="h-14 bg-card border-b border-border flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-foreground">Exness Pro</h1>
          <div className="text-sm text-muted-foreground hidden sm:block">Demo Account</div>
        </div>
        <AccountInfo />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Market Watch */}
        <div className="w-64 bg-card border-r border-border flex-shrink-0 hidden lg:block">
          <MarketWatch 
            selectedSymbol={selectedSymbol}
            onSelectSymbol={setSelectedSymbol}
          />
        </div>

        {/* Center - Chart & Trading */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Chart */}
          <div className="flex-1 p-4 overflow-hidden">
            <TradingChart 
              symbol={selectedSymbol}
              positions={positions}
              customIndicators={customIndicators}
              onShowIndicatorEditor={() => setShowIndicatorEditor(true)}
            />
          </div>

          {/* Bottom Panel - Positions/Orders/History */}
          <div className="h-64 border-t border-border bg-card flex-shrink-0">
            <Tabs defaultValue="positions" className="h-full flex flex-col">
              <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent px-4">
                <TabsTrigger value="positions">Positions ({positions.length})</TabsTrigger>
                <TabsTrigger value="orders">Pending Orders</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="news">Market News</TabsTrigger>
              </TabsList>
              <div className="flex-1 overflow-auto">
                <TabsContent value="positions" className="h-full m-0">
                  <PositionsPanel 
                    positions={positions}
                    onClosePosition={handleClosePosition}
                  />
                </TabsContent>
                <TabsContent value="orders" className="h-full m-0 p-4">
                  <div className="text-muted-foreground text-center py-8">
                    No pending orders
                  </div>
                </TabsContent>
                <TabsContent value="history" className="h-full m-0 p-4">
                  <div className="text-muted-foreground text-center py-8">
                    Trade history will appear here
                  </div>
                </TabsContent>
                <TabsContent value="news" className="h-full m-0">
                  <NewsPanel />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>

        {/* Right Sidebar - Order Panel */}
        <div className="w-80 bg-card border-l border-border flex-shrink-0 hidden xl:block">
          <OrderPanel 
            symbol={selectedSymbol}
            onOpenPosition={handleOpenPosition}
          />
        </div>
      </div>

      {/* Indicator Editor Modal */}
      {showIndicatorEditor && (
        <IndicatorEditor
          onClose={() => setShowIndicatorEditor(false)}
          onSave={handleAddIndicator}
        />
      )}
    </div>
  );
};

export default TradingPlatform;