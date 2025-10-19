import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Package, BarChart3, DollarSign, ShoppingBag } from "lucide-react";
import { authService } from "@/lib/auth";

const SellerProducts = () => {
  const user = authService.getUser();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome Back, {user?.name}!</h1>
            <p className="text-muted-foreground text-lg">
              Manage your products and track your business performance
            </p>
          </div>
          <Link to="/seller/add-product">
            <Button size="lg" className="btn-hero">
              <Plus className="mr-2 h-5 w-5" />
              Add Product
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link to="/seller/products">
            <Card className="card-hover cursor-pointer border-2 border-primary">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Products</p>
                    <p className="text-3xl font-bold">12</p>
                  </div>
                  <Package className="h-12 w-12 text-primary" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/seller/orders">
            <Card className="card-hover cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Orders</p>
                    <p className="text-3xl font-bold">48</p>
                  </div>
                  <ShoppingBag className="h-12 w-12 text-accent" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/seller/analytics">
            <Card className="card-hover cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Analytics</p>
                    <p className="text-3xl font-bold">View</p>
                  </div>
                  <BarChart3 className="h-12 w-12 text-secondary" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/seller/withdraw">
            <Card className="card-hover cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-3xl font-bold">$12.4K</p>
                  </div>
                  <DollarSign className="h-12 w-12 text-success" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-6">Your Products</h2>
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="mb-4">No products yet</p>
              <Link to="/seller/add-product">
                <Button>Add Your First Product</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default SellerProducts;
