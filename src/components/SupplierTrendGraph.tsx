import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ComposedChart, Area } from "recharts";
import { MapPin, TrendingUp, TrendingDown, DollarSign, Package, Clock } from "lucide-react";

interface Supplier {
  id: string;
  name: string;
  location: string;
  avgPrice: number;
  priceChange: number;
  totalTransactions: number;
  monthlyVolume: number;
  rating: number;
  verified: boolean;
}

// Mock supplier data
const suppliers: Supplier[] = [
  { id: 'S1', name: 'Java Herbs Co.', location: 'East Java', avgPrice: 10.5, priceChange: 2.3, totalTransactions: 1250, monthlyVolume: 5000, rating: 4.8, verified: true },
  { id: 'S2', name: 'Sumatra Spices', location: 'North Sumatra', avgPrice: 12.8, priceChange: -1.5, totalTransactions: 890, monthlyVolume: 3200, rating: 4.6, verified: true },
  { id: 'S3', name: 'Kalimantan Natural', location: 'South Kalimantan', avgPrice: 15.2, priceChange: 3.8, totalTransactions: 650, monthlyVolume: 2100, rating: 4.9, verified: true },
  { id: 'S4', name: 'West Java Botanics', location: 'West Java', avgPrice: 11.9, priceChange: 0.5, totalTransactions: 1100, monthlyVolume: 4500, rating: 4.7, verified: false },
  { id: 'S5', name: 'Central Java Herbs', location: 'Middle Java', avgPrice: 9.8, priceChange: -0.8, totalTransactions: 780, monthlyVolume: 2800, rating: 4.5, verified: true },
];

// Generate monthly price trend data
const generateMonthlyTrends = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((month, index) => ({
    month,
    avgPrice: 10 + Math.random() * 5,
    volume: 1000 + Math.floor(Math.random() * 2000),
    transactions: 100 + Math.floor(Math.random() * 200),
  }));
};

// Generate location-based data
const locationData = [
  { location: 'East Java', suppliers: 45, avgPrice: 10.2, volume: 15000 },
  { location: 'West Java', suppliers: 38, avgPrice: 11.5, volume: 12000 },
  { location: 'North Sumatra', suppliers: 28, avgPrice: 12.8, volume: 8500 },
  { location: 'Middle Java', suppliers: 32, avgPrice: 9.8, volume: 10000 },
  { location: 'S. Kalimantan', suppliers: 18, avgPrice: 15.2, volume: 5500 },
];

export const SupplierTrendGraph = () => {
  const monthlyTrends = generateMonthlyTrends();

  return (
    <div className="space-y-6 mt-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Supplier Market Trends</h2>
        <p className="text-muted-foreground">Real-time analytics and market insights</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">161</p>
                <p className="text-sm text-muted-foreground">Active Suppliers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <DollarSign className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">$11.86</p>
                <p className="text-sm text-muted-foreground">Avg. Price/KG</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">51,000</p>
                <p className="text-sm text-muted-foreground">Monthly Volume (KG)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Clock className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">4,670</p>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price & Volume Trend Chart */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Price & Volume Trends (6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyTrends}>
                  <defs>
                    <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area yAxisId="right" type="monotone" dataKey="volume" fill="url(#volumeGradient)" stroke="hsl(var(--primary))" strokeWidth={2} />
                  <Line yAxisId="left" type="monotone" dataKey="avgPrice" stroke="#22c55e" strokeWidth={3} dot={{ fill: '#22c55e' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Location-based Chart */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Suppliers by Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locationData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis type="category" dataKey="location" stroke="hsl(var(--muted-foreground))" fontSize={11} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="suppliers" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Suppliers Table */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Top Suppliers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Supplier</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Location</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Avg. Price</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Change</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Transactions</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Volume/Month</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-b border-border/20 hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{supplier.name}</span>
                        {supplier.verified && (
                          <Badge variant="outline" className="text-xs bg-green-500/10 text-green-400 border-green-500/30">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="text-sm">{supplier.location}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-semibold">${supplier.avgPrice.toFixed(2)}</td>
                    <td className="py-4 px-4 text-right">
                      <div className={`flex items-center justify-end gap-1 ${supplier.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {supplier.priceChange >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                        <span className="text-sm font-medium">{supplier.priceChange >= 0 ? '+' : ''}{supplier.priceChange}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right text-muted-foreground">{supplier.totalTransactions.toLocaleString()}</td>
                    <td className="py-4 px-4 text-right text-muted-foreground">{supplier.monthlyVolume.toLocaleString()} KG</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
