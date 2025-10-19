import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ShoppingBag, Truck, Plus } from "lucide-react";
import { authService } from "@/lib/auth";

const BuyerDashboard = () => {
  const user = authService.getUser();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome Back, {user?.name}!</h1>
          <p className="text-muted-foreground text-lg">
            "Manage your products, track orders, and secure your transactions all in one place."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/shop">
            <Card className="card-hover cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <Plus className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Browse Products</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Explore our catalog
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/buyer/requests">
            <Card className="card-hover cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-accent/10 rounded-full">
                    <ShoppingBag className="h-8 w-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">View Buyer Request</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Check your requests
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/buyer/orders">
            <Card className="card-hover cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-secondary/10 rounded-full">
                    <Package className="h-8 w-8 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Manage Orders</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      View order history
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/tracking">
            <Card className="card-hover cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-success/10 rounded-full">
                    <Truck className="h-8 w-8 text-success" />
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

        <div className="mt-12">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
              <div className="text-center py-12 text-muted-foreground">
                <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>No recent orders</p>
                <Link to="/shop">
                  <Button className="mt-4">Start Shopping</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BuyerDashboard;
