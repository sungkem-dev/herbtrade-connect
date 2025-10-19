import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, DollarSign, ShoppingBag, Users } from "lucide-react";

const SellerAnalytics = () => {
  const analyticsData = [
    { title: 'Total Revenue', value: '161.2K', growth: '+12%', icon: DollarSign, color: 'text-success' },
    { title: 'Total Orders', value: '2,453', growth: '+8%', icon: ShoppingBag, color: 'text-primary' },
    { title: 'Total Products', value: '48', growth: '+5%', icon: TrendingUp, color: 'text-accent' },
    { title: 'Total Customers', value: '1,205', growth: '+15%', icon: Users, color: 'text-secondary' }
  ];

  const chartData = [
    { label: 'Jan', value: 250 },
    { label: 'Feb', value: 400 },
    { label: 'Mar', value: 600 },
    { label: 'Apr', value: 800 },
    { label: 'May', value: 750 },
    { label: 'Jun', value: 900 }
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">Business Analytics</h1>
        <p className="text-muted-foreground mb-8">Your analytics for your business</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {analyticsData.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="card-hover">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-full bg-muted ${item.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-medium text-success">{item.growth}</span>
                  </div>
                  <h3 className="text-sm text-muted-foreground mb-1">{item.title}</h3>
                  <p className="text-3xl font-bold">{item.value}</p>
                  <p className="text-xs text-muted-foreground mt-2">from last month</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Chart */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-6">Revenue Overview</h2>
            
            <div className="relative h-[400px] border rounded-lg p-8">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-sm text-muted-foreground py-8">
                <span>1000</span>
                <span>750</span>
                <span>500</span>
                <span>250</span>
                <span>0</span>
              </div>

              {/* Chart bars */}
              <div className="flex items-end justify-around h-full ml-12">
                {chartData.map((item, index) => {
                  const heightPercent = (item.value / maxValue) * 100;
                  return (
                    <div key={index} className="flex flex-col items-center flex-1 mx-2">
                      <div 
                        className="w-full bg-primary rounded-t-lg transition-all hover:bg-primary/80 cursor-pointer"
                        style={{ height: `${heightPercent}%` }}
                        title={`${item.label}: ${item.value}`}
                      />
                      <span className="text-sm text-muted-foreground mt-2">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default SellerAnalytics;
