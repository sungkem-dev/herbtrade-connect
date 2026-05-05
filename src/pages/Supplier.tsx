import { useParams, Link } from "react-router-dom";
import { Web3Header } from "@/components/Web3Header";
import { Web3Footer } from "@/components/Web3Footer";
import { Web3Background } from "@/components/Web3Background";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Star,
  MapPin,
  ShieldCheck,
  Package,
  TrendingUp,
  Clock,
  MessageCircle,
  Award,
  Users,
  Calendar,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import { PageLoader, ProductCardSkeleton } from "@/components/ui/loading-spinner";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables, Enums } from "@/integrations/supabase/types";
import { Product, ProductReview } from "@/lib/products";
import { Order } from "@/contexts/OrderContext";

export type SupplierProfile = Tables<"profiles"> & {
  products: Product[];
  reviews: ProductReview[];
  orders: Order[];
};

const Supplier = () => {
  const { id } = useParams();
  const [supplier, setSupplier] = useState<SupplierProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSupplierData = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select(`
            *,
            products(
              id,
              name,
              scientific_name,
              price,
              image_url,
              category,
              location,
              in_stock,
              on_sale,
              min_order_qty,
              min_order_unit
            ),
            reviews:product_reviews(
              *,
              reviewer:profiles!product_reviews_user_id_fkey(
                name
              )
            ),
            orders:orders!orders_seller_id_fkey(
              id,
              created_at,
              total_amount,
              status,
              products(
                name
              )
            )
          `)
          .eq("id", id)
          .single();

        if (profileError) throw profileError;

        const formattedSupplier: SupplierProfile = {
          ...profileData,
          products: profileData.products.map((p: any) => ({
            ...p,
            supplier_name: profileData.name,
            supplier_location: profileData.country,
            supplier_rating: 4.5, // Mock rating for now
            supplier_total_sales: 0, // Mock for now
            supplier_verified: profileData.kyc_status === "verified",
            reviews: [], // Reviews are fetched separately for products
          })),
          reviews: profileData.reviews.map((r: any) => ({
            ...r,
            reviewer_name: r.reviewer?.name || "Anonymous",
          })),
          orders: profileData.orders.map((o: any) => ({
            ...o,
            product_name: o.products?.name || "Unknown Product",
            product_image: "", // Not directly available here
            buyer_name: "", // Not directly available here
            seller_name: profileData.name,
          })),
        };

        setSupplier(formattedSupplier);
      } catch (error) {
        console.error("Error fetching supplier data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupplierData();
  }, [id]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!supplier) {
    return (
      <div className="min-h-screen flex flex-col gradient-bg relative overflow-hidden">
        <Web3Background />
        <Web3Header />
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Supplier Not Found</h1>
            <Link to="/suppliers">
              <Button className="btn-hero">Back to Suppliers</Button>
            </Link>
          </div>
        </div>
        <Web3Footer />
      </div>
    );
  }

  // Mock data for fields not yet in Supabase schema or not directly fetched
  const mockSupplierDetails = {
    responseTime: "< 2 hours",
    completionRate: 98,
    onTimeDelivery: 96,
    qualityScore: 4.9,
    certifications: ["ISO9001", "GMP", "Organic", "Halal"], // Placeholder
    badges: ["Top Rated", "Fast Responder", "Verified Seller"], // Placeholder
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Web3Background />
      <Web3Header />

      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Supplier Header */}
        <div className="glass-card p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <Avatar className="h-32 w-32 border-4 border-primary/30">
              <AvatarImage src={supplier.avatar_url || "/placeholder-avatar.png"} />
              <AvatarFallback className="bg-primary/20 text-primary text-3xl">
                {supplier.name?.slice(0, 2).toUpperCase() || "NN"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{supplier.name}</h1>
                    {supplier.kyc_status === "verified" && (
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        <ShieldCheck className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{supplier.country}</span>
                    <span className="mx-2">•</span>
                    <Calendar className="h-4 w-4" />
                    <span>Member since {new Date(supplier.created_at).getFullYear()}</span>
                  </div>
                  <p className="text-muted-foreground max-w-2xl">{supplier.bio}</p>
                </div>

                <Button className="btn-hero">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Supplier
                </Button>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {mockSupplierDetails.badges.map((badge: string) => (
                  <Badge key={badge} variant="outline" className="border-primary/30 text-primary">
                    <Award className="h-3 w-3 mr-1" />
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="glass-card border-border/50">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary">
                <Star className="h-5 w-5 fill-primary" />
                {supplier.products.length > 0 ? (supplier.products.reduce((acc, p) => acc + p.reviews.reduce((rAcc, r) => rAcc + r.rating, 0) / p.reviews.length, 0) / supplier.products.length).toFixed(1) : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Rating</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{supplier.orders.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Total Sales</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{mockSupplierDetails.responseTime}</div>
              <p className="text-xs text-muted-foreground mt-1">Response Time</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{mockSupplierDetails.completionRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">Completion Rate</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{mockSupplierDetails.onTimeDelivery}%</div>
              <p className="text-xs text-muted-foreground mt-1">On-Time Delivery</p>
            </CardContent>
          </Card>
        </div>

        {/* Certifications */}
        <Card className="glass-card border-border/50 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Certifications & Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {mockSupplierDetails.certifications.map((cert: string) => (
                <Badge key={cert} className="bg-primary/10 text-primary border-primary/30 px-4 py-2">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {cert}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="glass border border-border/50">
            <TabsTrigger value="products" className="data-[state=active]:bg-primary/20">
              <Package className="h-4 w-4 mr-2" />
              Products ({supplier.products.length})
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-primary/20">
              <Star className="h-4 w-4 mr-2" />
              Reviews ({supplier.reviews.length})
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-primary/20">
              <TrendingUp className="h-4 w-4 mr-2" />
              Transaction History ({supplier.orders.length})
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supplier.products.length > 0 ? (
                supplier.products.map((product) => (
                  <Card key={product.id} className="glass-card border-border/50 overflow-hidden group">
                    <Link to={`/product/${product.id}`}>
                      <div className="relative h-48 w-full overflow-hidden">
                        <img
                          src={product.image_url || "/placeholder.png"}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {product.on_sale && (
                          <Badge className="absolute top-2 left-2 bg-accent/80 text-accent-foreground">On Sale</Badge>
                        )}
                        {!product.in_stock && (
                          <Badge className="absolute top-2 right-2 bg-red-500/80 text-white">Out of Stock</Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground italic mb-2">{product.scientific_name}</p>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xl font-bold text-primary">${product.price.toFixed(2)}</span>
                          {/* <LivePriceBadge productId={product.id} /> */}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1" /> {product.location}
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-muted-foreground">No products listed by this supplier.</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <div className="space-y-6">
              {supplier.reviews.length > 0 ? (
                supplier.reviews.map((review) => (
                  <Card key={review.id} className="glass-card border-border/50">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.reviewer?.avatar_url || "/placeholder-avatar.png"} />
                          <AvatarFallback>{review.reviewer_name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{review.reviewer_name}</p>
                          <div className="flex items-center text-yellow-400 text-sm">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                      <p className="text-xs text-muted-foreground mt-2">Reviewed on {new Date(review.created_at).toLocaleDateString()}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No reviews for this supplier yet.</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Transaction History Tab */}
          <TabsContent value="transactions">
            <div className="space-y-4">
              {supplier.orders.length > 0 ? (
                supplier.orders.map((order) => (
                  <Card key={order.id} className="glass-card border-border/50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold">Order ID: {order.id}</p>
                        <Badge variant={order.status === "success" ? "default" : "secondary"}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">Product: {order.product_name}</p>
                      <p className="text-muted-foreground">Total Amount: ${order.total_amount?.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground mt-2">Date: {new Date(order.created_at).toLocaleDateString()}</p>
                      <Link to={`/transaction/${order.id}`} className="text-primary hover:underline text-sm mt-2 block">
                        View Details <ExternalLink className="inline-block h-3 w-3 ml-1" />
                      </Link>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No transaction history for this supplier.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Web3Footer />
    </div>
  );
};

export default Supplier;
