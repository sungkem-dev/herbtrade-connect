import { useParams, Link } from "react-router-dom";
import { products } from "@/lib/products";
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

// Mock supplier detailed data
const getSupplierDetails = (supplierId: string) => {
  const mockSuppliers: Record<string, any> = {
    'SUP001': {
      id: 'SUP001',
      name: 'Java Herbs Co.',
      location: 'Malang, East Java',
      rating: 4.8,
      totalSales: 1250,
      verified: true,
      description: 'Premium herbal supplier specializing in turmeric and traditional Javanese herbs. Established in 2015 with a commitment to quality and sustainability.',
      avatar: '/turmeric.jpg',
      memberSince: '2015',
      responseTime: '< 2 hours',
      completionRate: 98,
      onTimeDelivery: 96,
      qualityScore: 4.9,
      certifications: ['ISO9001', 'GMP', 'Organic', 'Halal'],
      badges: ['Top Rated', 'Fast Responder', 'Verified Seller'],
    },
    'SUP002': {
      id: 'SUP002',
      name: 'West Java Botanics',
      location: 'Bogor, West Java',
      rating: 4.7,
      totalSales: 890,
      verified: true,
      description: 'Specializing in medicinal herbs from the highlands of West Java. Known for high-quality Andrographis and other immune-boosting herbs.',
      avatar: '/andrographis.jpg',
      memberSince: '2017',
      responseTime: '< 4 hours',
      completionRate: 95,
      onTimeDelivery: 94,
      qualityScore: 4.7,
      certifications: ['ISO9001', 'GMP', 'BPOM'],
      badges: ['Verified Seller', 'Quality Assured'],
    },
    'SUP003': {
      id: 'SUP003',
      name: 'Central Java Herbs',
      location: 'Semarang, Middle Java',
      rating: 4.9,
      totalSales: 1100,
      verified: true,
      description: 'Family-owned business with three generations of herbal expertise. We provide premium Ceylon cinnamon and traditional spices.',
      avatar: '/cinnamon.jpg',
      memberSince: '2010',
      responseTime: '< 1 hour',
      completionRate: 99,
      onTimeDelivery: 98,
      qualityScore: 4.9,
      certifications: ['ISO9001', 'Organic', 'Halal', 'Fair Trade'],
      badges: ['Top Rated', 'Fast Responder', 'Verified Seller', 'Premium'],
    },
  };
  return mockSuppliers[supplierId] || mockSuppliers['SUP001'];
};

// Mock reviews data
const mockReviews = [
  { id: 1, buyer: 'PT. Herbal Indonesia', rating: 5, comment: 'Excellent quality products and fast delivery. Highly recommended!', date: '2024-01-15', product: 'Turmeric', verified: true },
  { id: 2, buyer: 'Natural Foods Co.', rating: 5, comment: 'Great communication and the products exceeded our expectations.', date: '2024-01-10', product: 'Andrographis', verified: true },
  { id: 3, buyer: 'Global Spice Trading', rating: 4, comment: 'Good quality overall. Minor delay in shipping but was resolved quickly.', date: '2024-01-05', product: 'Turmeric', verified: true },
  { id: 4, buyer: 'Health Supplements Ltd.', rating: 5, comment: 'Consistent quality across multiple orders. Will continue to work with them.', date: '2023-12-28', product: 'Ceylon Cinnamon', verified: true },
  { id: 5, buyer: 'Asian Botanics', rating: 4, comment: 'Good products, reasonable pricing. Packaging could be improved.', date: '2023-12-20', product: 'Turmeric', verified: false },
];

// Mock transaction history
const mockTransactions = [
  { id: 'TX001', date: '2024-01-18', product: 'Turmeric', quantity: '500 KG', value: '$4,995', status: 'completed', txHash: '0x7a3b...f2d1' },
  { id: 'TX002', date: '2024-01-15', product: 'Andrographis', quantity: '200 KG', value: '$2,500', status: 'completed', txHash: '0x8b4c...e3f2' },
  { id: 'TX003', date: '2024-01-12', product: 'Ceylon Cinnamon', quantity: '150 KG', value: '$2,398', status: 'completed', txHash: '0x9c5d...d4g3' },
  { id: 'TX004', date: '2024-01-10', product: 'Turmeric', quantity: '1000 KG', value: '$9,990', status: 'processing', txHash: '0xa6e8...c5h4' },
  { id: 'TX005', date: '2024-01-08', product: 'Black Pepper', quantity: '300 KG', value: '$5,625', status: 'completed', txHash: '0xb7f9...b6i5' },
];

const Supplier = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const supplier = getSupplierDetails(id || 'SUP001');
  const supplierProducts = products.filter(p => p.supplier.id === id);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Web3Background />
      <Web3Header />

      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Supplier Header */}
        <div className="glass-card p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <Avatar className="h-32 w-32 border-4 border-primary/30">
              <AvatarImage src={supplier.avatar} />
              <AvatarFallback className="bg-primary/20 text-primary text-3xl">
                {supplier.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{supplier.name}</h1>
                    {supplier.verified && (
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        <ShieldCheck className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{supplier.location}</span>
                    <span className="mx-2">•</span>
                    <Calendar className="h-4 w-4" />
                    <span>Member since {supplier.memberSince}</span>
                  </div>
                  <p className="text-muted-foreground max-w-2xl">{supplier.description}</p>
                </div>

                <Button className="btn-hero">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Supplier
                </Button>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {supplier.badges.map((badge: string) => (
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
                {supplier.rating}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Rating</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{supplier.totalSales.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Total Sales</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{supplier.responseTime}</div>
              <p className="text-xs text-muted-foreground mt-1">Response Time</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{supplier.completionRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">Completion Rate</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{supplier.onTimeDelivery}%</div>
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
              {supplier.certifications.map((cert: string) => (
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
              Products ({supplierProducts.length})
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-primary/20">
              <Star className="h-4 w-4 mr-2" />
              Reviews ({mockReviews.length})
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-primary/20">
              <TrendingUp className="h-4 w-4 mr-2" />
              Transaction History
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supplierProducts.length > 0 ? supplierProducts.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <Card className="glass-card border-border/50 card-hover overflow-hidden">
                    <div className="aspect-video relative">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.inStock && (
                        <Badge className="absolute top-3 right-3 bg-primary/20 text-primary border-primary/30">
                          In Stock
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{product.scientificName}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-primary">${product.price.toFixed(2)}</span>
                        <span className="text-xs text-muted-foreground">per KG</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )) : (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No products available from this supplier yet.</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <div className="space-y-4">
              {/* Rating Overview */}
              <Card className="glass-card border-border/50 mb-6">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-primary mb-2">{supplier.rating}</div>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`h-5 w-5 ${star <= Math.round(supplier.rating) ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">{mockReviews.length} reviews</p>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count = mockReviews.filter(r => r.rating === rating).length;
                        const percentage = (count / mockReviews.length) * 100;
                        return (
                          <div key={rating} className="flex items-center gap-3">
                            <span className="text-sm w-3">{rating}</span>
                            <Star className="h-4 w-4 text-primary fill-primary" />
                            <Progress value={percentage} className="flex-1 h-2" />
                            <span className="text-sm text-muted-foreground w-8">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Review List */}
              {mockReviews.map((review) => (
                <Card key={review.id} className="glass-card border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{review.buyer}</span>
                          {review.verified && (
                            <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{review.product}</span>
                          <span>•</span>
                          <span>{review.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            className={`h-4 w-4 ${star <= review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card className="glass-card border-border/50">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left p-4 text-muted-foreground font-medium">Date</th>
                        <th className="text-left p-4 text-muted-foreground font-medium">Product</th>
                        <th className="text-left p-4 text-muted-foreground font-medium">Quantity</th>
                        <th className="text-left p-4 text-muted-foreground font-medium">Value</th>
                        <th className="text-left p-4 text-muted-foreground font-medium">Status</th>
                        <th className="text-left p-4 text-muted-foreground font-medium">TX Hash</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockTransactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-border/30 hover:bg-primary/5">
                          <td className="p-4">{tx.date}</td>
                          <td className="p-4 font-medium">{tx.product}</td>
                          <td className="p-4">{tx.quantity}</td>
                          <td className="p-4 text-primary font-semibold">{tx.value}</td>
                          <td className="p-4">
                            <Badge className={tx.status === 'completed' ? 'status-success' : 'status-pending'}>
                              {tx.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <a 
                              href={`https://etherscan.io/tx/${tx.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-sm text-primary hover:underline flex items-center gap-1"
                            >
                              {tx.txHash}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Web3Footer />
    </div>
  );
};

export default Supplier;
