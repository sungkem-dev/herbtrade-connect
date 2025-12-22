import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Web3Header } from "@/components/Web3Header";
import { Web3Footer } from "@/components/Web3Footer";
import { Web3Background } from "@/components/Web3Background";
import { Card, CardContent } from "@/components/ui/card";
import { BlockchainStats } from "@/components/BlockchainStats";
import { Portfolio } from "@/components/Portfolio";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";
import { PageTransition } from "@/components/PageTransition";
import { Package, Plus, BarChart3, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import { authService } from "@/lib/auth";

const SellerDashboard = () => {
  const user = authService.getUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

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

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <PageTransition>
          <div className="container mx-auto px-4 py-24 relative z-10">
            {/* Welcome Section */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-4xl font-bold mb-2">
                Welcome Back, <span className="text-gradient-hero">{user?.name}</span>!
              </h1>
              <p className="text-muted-foreground text-lg">
                Manage your products, track sales, and grow your herbal business on the blockchain.
              </p>
            </motion.div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Card className="glass-card border-border/50 card-hover">
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
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { to: "/seller/add-product", icon: Plus, title: "Add Product", desc: "List new herbal product", color: "primary", glow: "glow-primary" },
                  { to: "/seller/products", icon: Package, title: "My Products", desc: "Manage your listings", color: "secondary", glow: "glow-secondary" },
                  { to: "/seller/orders", icon: ShoppingCart, title: "Orders", desc: "View & fulfill orders", color: "accent", glow: "" },
                  { to: "/seller/analytics", icon: BarChart3, title: "Analytics", desc: "View performance", color: "info", glow: "" },
                ].map((item, index) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <Link to={item.to}>
                      <Card className="glass-card border-border/50 card-hover cursor-pointer h-full">
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center text-center space-y-4">
                            <div className={`p-4 bg-${item.color}/20 rounded-xl ${item.glow}`}>
                              <item.icon className={`h-8 w-8 text-${item.color}`} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{item.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Portfolio Section */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <h2 className="text-2xl font-bold mb-6">Your Portfolio</h2>
              <Portfolio />
            </motion.div>

            {/* Blockchain Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <h2 className="text-2xl font-bold mb-6">Network Activity</h2>
              <BlockchainStats />
            </motion.div>
          </div>
        </PageTransition>
      )}

      <Web3Footer />
    </div>
  );
};

export default SellerDashboard;
