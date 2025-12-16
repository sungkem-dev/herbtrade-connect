import { Link } from "react-router-dom";
import { Web3Header } from "@/components/Web3Header";
import { Web3Footer } from "@/components/Web3Footer";
import { Web3Background } from "@/components/Web3Background";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BlockchainStats } from "@/components/BlockchainStats";
import { Portfolio } from "@/components/Portfolio";
import { Package, ShoppingBag, Truck, Plus } from "lucide-react";
import { authService } from "@/lib/auth";

const BuyerDashboard = () => {
  const user = authService.getUser();

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
            Manage your portfolio, track transactions, and explore the marketplace.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link to="/shop">
            <Card className="glass-card border-border/50 card-hover cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-primary/20 rounded-xl glow-primary">
                    <Plus className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Browse Products</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Explore marketplace
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/buyer/requests">
            <Card className="glass-card border-border/50 card-hover cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-secondary/20 rounded-xl glow-secondary">
                    <ShoppingBag className="h-8 w-8 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Buyer Requests</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      View your requests
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/buyer/orders">
            <Card className="glass-card border-border/50 card-hover cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-accent/20 rounded-xl">
                    <Package className="h-8 w-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Order History</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Track your orders
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/tracking">
            <Card className="glass-card border-border/50 card-hover cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-info/20 rounded-xl">
                    <Truck className="h-8 w-8 text-info" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Track Shipment</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Monitor deliveries
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
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

export default BuyerDashboard;
