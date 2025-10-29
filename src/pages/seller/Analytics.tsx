import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Package, DollarSign, ShoppingCart } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Analytics = () => {
  const stats = [
    {
      title: "Total Revenue",
      value: "$48,100",
      change: "+20.1%",
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: "2,350",
      change: "+12.5%",
      icon: ShoppingCart,
    },
    {
      title: "Products Sold",
      value: "3,462",
      change: "+18.2%",
      icon: Package,
    },
    {
      title: "Growth Rate",
      value: "23.5%",
      change: "+5.2%",
      icon: TrendingUp,
    },
  ];

  // Revenue data for the chart (January to June)
  const revenueData = [
    { month: 'Jan', revenue: 5200 },
    { month: 'Feb', revenue: 6800 },
    { month: 'Mar', revenue: 7500 },
    { month: 'Apr', revenue: 8900 },
    { month: 'May', revenue: 9200 },
    { month: 'Jun', revenue: 10500 },
  ];

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">Business Analytics</h1>
          <p className="text-muted-foreground mb-8">Your analytics for your business</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title} className="hover-scale">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-sm font-semibold text-success">{stat.change}</span>
                    </div>
                    <h3 className="text-sm text-muted-foreground mb-2">{stat.title}</h3>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-2">from last month</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Revenue Chart */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
              <CardDescription>
                Monthly revenue from January to June
                <div className="mt-2 text-2xl font-bold text-primary">
                  Total: ${totalRevenue.toLocaleString()}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="month" 
                      className="text-sm"
                    />
                    <YAxis 
                      className="text-sm"
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`$${value}`, 'Revenue']}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Analytics;
