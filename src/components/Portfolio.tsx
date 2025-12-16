import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, 
  Copy, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Coins,
  Check
} from "lucide-react";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const portfolioData = [
  { date: "Jan", value: 12500 },
  { date: "Feb", value: 14200 },
  { date: "Mar", value: 13800 },
  { date: "Apr", value: 16500 },
  { date: "May", value: 18200 },
  { date: "Jun", value: 21000 },
];

const tokens = [
  { symbol: "HERB", name: "HerBlocX Token", balance: "1,250.00", value: "$12,500.00", change: "+5.2%" },
  { symbol: "ETH", name: "Ethereum", balance: "2.5", value: "$4,750.00", change: "+2.1%" },
  { symbol: "USDT", name: "Tether", balance: "3,750.00", value: "$3,750.00", change: "0.0%" },
];

export const Portfolio = () => {
  const [copied, setCopied] = useState(false);
  const walletAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD87";

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    toast.success("Wallet address copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card border-border/50 col-span-1 md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Portfolio Value
            </CardTitle>
            <Badge variant="outline" className="status-success">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +12.5%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-3xl font-bold text-gradient-hero">$21,000.00</p>
              <p className="text-sm text-muted-foreground">Total Balance</p>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 20%)" />
                  <XAxis dataKey="date" stroke="hsl(220, 10%, 50%)" fontSize={12} />
                  <YAxis stroke="hsl(220, 10%, 50%)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(220, 20%, 10%)",
                      border: "1px solid hsl(220, 15%, 20%)",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(142, 70%, 45%)"
                    strokeWidth={2}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Wallet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Connected Wallet</p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm truncate flex-1">
                  {walletAddress.slice(0, 10)}...{walletAddress.slice(-8)}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Quick Actions</p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="btn-web3-outline text-xs py-2 px-3">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  Send
                </Button>
                <Button variant="outline" size="sm" className="btn-web3-outline text-xs py-2 px-3">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  Receive
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Token Balances */}
      <Card className="glass-card border-border/50">
        <CardHeader className="flex flex-row items-center gap-3 pb-4">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Coins className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-lg">Token Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tokens.map((token) => (
              <div
                key={token.symbol}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">
                      {token.symbol.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{token.symbol}</p>
                    <p className="text-sm text-muted-foreground">{token.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{token.balance}</p>
                  <div className="flex items-center gap-2 justify-end">
                    <p className="text-sm text-muted-foreground">{token.value}</p>
                    <Badge
                      variant="outline"
                      className={
                        token.change.startsWith("+")
                          ? "status-success text-xs"
                          : token.change === "0.0%"
                          ? "text-xs"
                          : "status-pending text-xs"
                      }
                    >
                      {token.change}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
