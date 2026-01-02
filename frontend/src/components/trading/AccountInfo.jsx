import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, PieChart, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export const AccountInfo = () => {
  const [balance, setBalance] = useState(10000);
  const [equity, setEquity] = useState(10000);
  const [margin, setMargin] = useState(0);
  const [freeMargin, setFreeMargin] = useState(10000);

  // Simulate account updates
  useEffect(() => {
    const interval = setInterval(() => {
      const fluctuation = (Math.random() - 0.5) * 10;
      setEquity(prev => Math.max(0, prev + fluctuation));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleDeposit = () => {
    toast.success('Redirecting to deposit page...');
  };

  const handleWithdraw = () => {
    toast.success('Instant withdrawal initiated');
  };

  return (
    <div className="flex items-center gap-4">
      {/* Account Stats */}
      <div className="hidden md:flex items-center gap-6 text-sm">
        <div>
          <div className="text-xs text-muted-foreground">Balance</div>
          <div className="font-mono font-semibold text-foreground">${balance.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Equity</div>
          <div className="font-mono font-semibold text-[hsl(var(--success))]">
            ${equity.toFixed(2)}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Free Margin</div>
          <div className="font-mono font-semibold text-foreground">${freeMargin.toFixed(2)}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleDeposit}
          className="gap-2"
        >
          <Wallet className="h-4 w-4" />
          <span className="hidden sm:inline">Deposit</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleWithdraw}
          className="gap-2"
        >
          <TrendingUp className="h-4 w-4" />
          <span className="hidden sm:inline">Withdraw</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" className="h-9 w-9 p-0">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Account Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <PieChart className="mr-2 h-4 w-4" />
              View Performance
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Wallet className="mr-2 h-4 w-4" />
              Transaction History
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toast.info('Settings coming soon')}>
              <Settings className="mr-2 h-4 w-4" />
              Preferences
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default AccountInfo;