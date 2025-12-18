import { Link } from "react-router-dom";
import { Web3Header } from "@/components/Web3Header";
import { Web3Footer } from "@/components/Web3Footer";
import { Web3Background } from "@/components/Web3Background";
import { Card, CardContent } from "@/components/ui/card";
import { BlockchainStats } from "@/components/BlockchainStats";
import { Portfolio } from "@/components/Portfolio";
import { Package, Plus, BarChart3, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import { authService } from "@/lib/auth";

const SellerDashboard = () => {
  const user = authService.getUser();

  const stats = [
    { label: "Total Revenue", value: "$12,450", icon: DollarSign, change: "+12.5%", color: "primary" },
    { label: "Total Orders", value: "156", icon: ShoppingCart, change: "+8.2%", color: "secondary" },
    { label: "Products Listed", value: "24", icon: Package, change: "+3", color: "accent" },
    { label: "Growth Rate", value: "23.5%", icon: TrendingUp, change: "+5.1%", color: "info" },
  ];

  return (
    <div className="min-h-screen gradient-bg relative">
      <Web3Background />
      <Web3Header />

      <div className="container mx-auto px-4 py-24 relative z-10">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome Back, <span className="text-gradient-hero">{user?.name}</span>!
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your products, track sales, and grow your herbal business on the blockchain.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card 
              key={stat.label} 
              className="glass-card border-border/50 card-hover animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p className="text-xs text-primary mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 bg-${stat.color}/20 rounded-xl`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/seller/add-product">
              <Card className="glass-card border-border/50 card-hover cursor-pointer h-full">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-primary/20 rounded-xl glow-primary">
                      <Plus className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Add Product</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        List new herbal product
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/seller/products">
              <Card className="glass-card border-border/50 card-hover cursor-pointer h-full">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-secondary/20 rounded-xl glow-secondary">
                      <Package className="h-8 w-8 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">My Products</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Manage your listings
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/seller/orders">
              <Card className="glass-card border-border/50 card-hover cursor-pointer h-full">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-accent/20 rounded-xl">
                      <ShoppingCart className="h-8 w-8 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Orders</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        View & fulfill orders
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/seller/analytics">
              <Card className="glass-card border-border/50 card-hover cursor-pointer h-full">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-info/20 rounded-xl">
                      <BarChart3 className="h-8 w-8 text-info" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Analytics</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        View performance
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Portfolio Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Your Portfolio</h2>
          <Portfolio />
        </div>

        {/* Blockchain Stats */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Network Activity</h2>
          <BlockchainStats />
        </div>
      </div>

      <Web3Footer />
    </div>
  );
};

export default SellerDashboard;
