import { useLivePrices } from "@/hooks/useLivePrices";
import { TrendingUp, TrendingDown, Activity, Wifi, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LivePriceTickerProps {
  productIds: string[];
  productNames?: Record<string, string>;
}

export const LivePriceTicker = ({ productIds, productNames }: LivePriceTickerProps) => {
  const { prices, isConnected, lastUpdate } = useLivePrices({ 
    productIds, 
    updateInterval: 2500 
  });

  const defaultNames: Record<string, string> = {
    'CL001': 'TUR',
    'AP001': 'AND',
    'CV001': 'CIN',
    'PN001': 'PEP',
    'MF001': 'NUT',
  };

  const names = productNames || defaultNames;

  return (
    <div className="glass border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 py-2 overflow-x-auto scrollbar-hide">
          {/* Connection Status */}
          <div className="flex items-center gap-2 pr-4 border-r border-border/30 flex-shrink-0">
            {isConnected ? (
              <>
                <Wifi className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-xs text-primary">LIVE</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Connecting...</span>
              </>
            )}
          </div>

          {/* Price Ticker */}
          <div className="flex items-center gap-6 animate-marquee">
            {productIds.map((id) => {
              const priceData = prices[id];
              if (!priceData) return null;

              const isPositive = priceData.priceChange >= 0;

              return (
                <div 
                  key={id}
                  className="flex items-center gap-3 flex-shrink-0"
                >
                  <span className="text-sm font-medium text-muted-foreground">
                    {names[id] || id}
                  </span>
                  <span className={cn(
                    "text-sm font-bold transition-all duration-300",
                    isPositive ? "text-primary" : "text-destructive"
                  )}>
                    ${priceData.price.toFixed(2)}
                  </span>
                  <div className={cn(
                    "flex items-center gap-1 text-xs",
                    isPositive ? "text-primary" : "text-destructive"
                  )}>
                    {isPositive ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>{isPositive ? '+' : ''}{priceData.priceChangePercent.toFixed(2)}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Last Update */}
          <div className="flex items-center gap-2 pl-4 border-l border-border/30 flex-shrink-0 ml-auto">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {lastUpdate ? `Updated ${Math.floor((Date.now() - lastUpdate.getTime()) / 1000)}s ago` : 'Loading...'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Compact version for product cards
export const LivePriceBadge = ({ 
  productId, 
  className 
}: { 
  productId: string; 
  className?: string;
}) => {
  const { prices, isConnected } = useLivePrices({ 
    productIds: [productId], 
    updateInterval: 3000 
  });

  const priceData = prices[productId];

  if (!isConnected || !priceData) {
    return (
      <Badge variant="outline" className={cn("border-border/50 text-muted-foreground", className)}>
        <Activity className="h-3 w-3 mr-1 animate-pulse" />
        Loading...
      </Badge>
    );
  }

  const isPositive = priceData.priceChange >= 0;

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "transition-all duration-300",
        isPositive 
          ? "border-primary/30 text-primary bg-primary/10" 
          : "border-destructive/30 text-destructive bg-destructive/10",
        className
      )}
    >
      {isPositive ? (
        <TrendingUp className="h-3 w-3 mr-1" />
      ) : (
        <TrendingDown className="h-3 w-3 mr-1" />
      )}
      {isPositive ? '+' : ''}{priceData.priceChangePercent.toFixed(2)}%
    </Badge>
  );
};

// Detailed price display for product pages
export const LivePriceDisplay = ({ productId }: { productId: string }) => {
  const { prices, isConnected, lastUpdate } = useLivePrices({ 
    productIds: [productId], 
    updateInterval: 2000 
  });

  const priceData = prices[productId];

  if (!isConnected || !priceData) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-8 bg-muted/50 rounded w-32" />
        <div className="h-4 bg-muted/50 rounded w-24" />
      </div>
    );
  }

  const isPositive = priceData.priceChange >= 0;

  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-3">
        <span className={cn(
          "text-3xl font-bold transition-all duration-300",
          isPositive ? "text-primary" : "text-destructive"
        )}>
          ${priceData.price.toFixed(2)}
        </span>
        <div className={cn(
          "flex items-center gap-1 text-sm font-medium",
          isPositive ? "text-primary" : "text-destructive"
        )}>
          {isPositive ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <span>{isPositive ? '+' : ''}{priceData.priceChange.toFixed(2)}</span>
          <span>({isPositive ? '+' : ''}{priceData.priceChangePercent.toFixed(2)}%)</span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <span>24h High:</span>
          <span className="text-foreground">${priceData.high24h.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>24h Low:</span>
          <span className="text-foreground">${priceData.low24h.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>Volume:</span>
          <span className="text-foreground">{priceData.volume24h.toLocaleString()} KG</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        <span className="text-xs text-muted-foreground">
          Live • Updated {lastUpdate ? `${Math.floor((Date.now() - lastUpdate.getTime()) / 1000)}s ago` : '...'}
        </span>
      </div>
    </div>
  );
};
