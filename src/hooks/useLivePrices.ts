import { useState, useEffect, useCallback, useRef } from 'react';

interface PriceData {
  productId: string;
  price: number;
  priceChange: number;
  priceChangePercent: number;
  volume24h: number;
  lastUpdate: Date;
  high24h: number;
  low24h: number;
}

interface UseLivePricesOptions {
  productIds: string[];
  updateInterval?: number;
}

// Simulates WebSocket-like behavior with realistic price movements
export const useLivePrices = ({ productIds, updateInterval = 3000 }: UseLivePricesOptions) => {
  const [prices, setPrices] = useState<Record<string, PriceData>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const basePrice = useRef<Record<string, number>>({});

  // Initialize base prices
  useEffect(() => {
    const initialPrices: Record<string, number> = {
      'CL001': 9.99,   // Turmeric
      'AP001': 12.50,  // Andrographis
      'CV001': 15.99,  // Ceylon Cinnamon
      'PN001': 18.75,  // Black Pepper
      'MF001': 22.50,  // Nutmeg
    };

    productIds.forEach(id => {
      if (!basePrice.current[id]) {
        basePrice.current[id] = initialPrices[id] || 10 + Math.random() * 15;
      }
    });
  }, [productIds]);

  // Simulate realistic price movements
  const generatePriceUpdate = useCallback((productId: string): PriceData => {
    const base = basePrice.current[productId] || 10;
    
    // Random walk with mean reversion
    const volatility = 0.002; // 0.2% volatility per update
    const meanReversion = 0.1;
    const currentPrice = prices[productId]?.price || base;
    
    const randomChange = (Math.random() - 0.5) * 2 * volatility * base;
    const reversionForce = (base - currentPrice) * meanReversion * volatility;
    const newPrice = Math.max(base * 0.9, Math.min(base * 1.1, currentPrice + randomChange + reversionForce));
    
    const priceChange = newPrice - base;
    const priceChangePercent = (priceChange / base) * 100;
    
    // Generate realistic 24h stats
    const high24h = base * (1 + Math.random() * 0.05);
    const low24h = base * (1 - Math.random() * 0.05);
    const volume24h = Math.floor(1000 + Math.random() * 9000);

    return {
      productId,
      price: parseFloat(newPrice.toFixed(2)),
      priceChange: parseFloat(priceChange.toFixed(2)),
      priceChangePercent: parseFloat(priceChangePercent.toFixed(2)),
      volume24h,
      lastUpdate: new Date(),
      high24h: parseFloat(high24h.toFixed(2)),
      low24h: parseFloat(low24h.toFixed(2)),
    };
  }, [prices]);

  // Connect and start receiving updates
  useEffect(() => {
    // Simulate connection delay
    const connectionTimer = setTimeout(() => {
      setIsConnected(true);
      
      // Initial prices
      const initialData: Record<string, PriceData> = {};
      productIds.forEach(id => {
        initialData[id] = generatePriceUpdate(id);
      });
      setPrices(initialData);
      setLastUpdate(new Date());
    }, 500);

    return () => clearTimeout(connectionTimer);
  }, [productIds.join(',')]);

  // Continuous price updates
  useEffect(() => {
    if (!isConnected) return;

    const updateTimer = setInterval(() => {
      setPrices(prevPrices => {
        const newPrices = { ...prevPrices };
        
        // Update 1-3 random products each interval for realistic behavior
        const numUpdates = 1 + Math.floor(Math.random() * Math.min(3, productIds.length));
        const shuffled = [...productIds].sort(() => 0.5 - Math.random());
        
        for (let i = 0; i < numUpdates; i++) {
          const id = shuffled[i];
          if (id) {
            newPrices[id] = generatePriceUpdate(id);
          }
        }
        
        return newPrices;
      });
      setLastUpdate(new Date());
    }, updateInterval);

    return () => clearInterval(updateTimer);
  }, [isConnected, productIds, updateInterval, generatePriceUpdate]);

  // Manual refresh
  const refresh = useCallback(() => {
    const newPrices: Record<string, PriceData> = {};
    productIds.forEach(id => {
      newPrices[id] = generatePriceUpdate(id);
    });
    setPrices(newPrices);
    setLastUpdate(new Date());
  }, [productIds, generatePriceUpdate]);

  return {
    prices,
    isConnected,
    lastUpdate,
    refresh,
  };
};

// Hook for single product price
export const useLivePrice = (productId: string) => {
  const { prices, isConnected, lastUpdate, refresh } = useLivePrices({
    productIds: [productId],
    updateInterval: 2000,
  });

  return {
    price: prices[productId] || null,
    isConnected,
    lastUpdate,
    refresh,
  };
};
