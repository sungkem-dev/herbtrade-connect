import { Link } from "react-router-dom";
import { Web3Header } from "@/components/Web3Header";
import { Web3Footer } from "@/components/Web3Footer";
import { Web3Background } from "@/components/Web3Background";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Package, BarChart3, DollarSign, ShoppingBag } from "lucide-react";
import { authService } from "@/lib/auth";

const SellerProducts = () => {
  const user = authService.getUser();

  return (
    <div className="min-h-screen flex flex-col gradient-bg relative overflow-hidden">
      <Web3Background />
      <Web3Header />

      <div className="flex-1 container mx-auto px-4 py-8 pt-24 relative z-10">
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-gradient-hero">Welcome Back, {user?.name}!</h1>
            <p className="text-muted-foreground text-lg">
              Manage your products and track your business performance
            </p>
          </div>
          <Link to="/seller/add-product">
            <Button size="lg" className="btn-web3">
              <Plus className="mr-2 h-5 w-5" />
              Add Product
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { to: "/seller/products", icon: Package, label: "Products", value: "12", active: true },
            { to: "/seller/orders", icon: ShoppingBag, label: "Orders", value: "48", active: false },
            { to: "/seller/analytics", icon: BarChart3, label: "Analytics", value: "View", active: false },
            { to: "/seller/withdraw", icon: DollarSign, label: "Revenue", value: "$12.4K", active: false },
          ].map((item, index) => (
            <Link key={item.to} to={item.to}>
              <Card 
                className={`glass-card border-border/50 card-hover cursor-pointer animate-fade-in ${item.active ? 'border-primary/50 glow-primary' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="text-3xl font-bold">{item.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${item.active ? 'bg-primary/20' : 'bg-muted/50'}`}>
                      <item.icon className={`h-8 w-8 ${item.active ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="glass-card border-border/50 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-6">Your Products</h2>
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="mb-4">No products yet</p>
              <Link to="/seller/add-product">
                <Button className="btn-web3">Add Your First Product</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Web3Footer />
    </div>
  );
};

export default SellerProducts;