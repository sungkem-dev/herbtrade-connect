import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Web3Header } from "@/components/Web3Header";
import { Web3Footer } from "@/components/Web3Footer";
import { Web3Background } from "@/components/Web3Background";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MapPin,
  Star,
  CheckCircle2,
  Package,
  Users,
  TrendingUp,
  Filter
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export type ExtendedProfile = Tables<"profiles"> & {
  product_count: number;
  total_sales_value: number;
  average_rating: number;
};

const fetchSuppliers = async (): Promise<ExtendedProfile[]> => {
  const { data, error } = await supabase
    .from("profiles")
    .select(`
      *,
      product_count:products(count),
      total_sales_value:orders(total_amount)
    `)
    .eq("kyc_status", "verified"); // Only show verified suppliers

  if (error) {
    console.error("Error fetching suppliers:", error);
    return [];
  }

  return data.map((profile: any) => ({
    ...profile,
    product_count: profile.product_count[0]?.count || 0,
    total_sales_value: profile.total_sales_value.reduce((sum: number, order: { total_amount: number }) => sum + order.total_amount, 0),
    average_rating: 4.5, // Mock average rating for now, as it's not directly available
  }));
};

const locations = ["All Locations", "Indonesia", "India", "Thailand", "Brazil", "Greece", "Kenya"]; // These should ideally come from Supabase as well
const categories = ["All Categories", "Turmeric", "Ginger", "Herbs", "Ashwagandha", "Oregano", "Cinnamon"]; // These should ideally come from Supabase as well
const ratings = ["All Ratings", "4.5+", "4.0+", "3.5+"];

const Suppliers = () => {
  const [allSuppliers, setAllSuppliers] = useState<ExtendedProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedRating, setSelectedRating] = useState("All Ratings");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSuppliers = async () => {
      setIsLoading(true);
      const fetchedSuppliers = await fetchSuppliers();
      setAllSuppliers(fetchedSuppliers);
      setIsLoading(false);
    };
    getSuppliers();
  }, []);

  const filteredSuppliers = allSuppliers.filter((supplier) => {
    const matchesSearch = supplier.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.bio?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = selectedLocation === "All Locations" || supplier.country === selectedLocation;
    // Category matching is complex as it requires joining with products table, for now, we'll skip it or mock it.
    // const matchesCategory = selectedCategory === "All Categories" || 
    //   supplier.categories.some(cat => cat.toLowerCase().includes(selectedCategory.toLowerCase()));
    const matchesRating = selectedRating === "All Ratings" || 
      (selectedRating === "4.5+" && supplier.average_rating >= 4.5) ||
      (selectedRating === "4.0+" && supplier.average_rating >= 4.0) ||
      (selectedRating === "3.5+" && supplier.average_rating >= 3.5);
    
    return matchesSearch && matchesLocation && matchesRating; // && matchesCategory;
  });

  return (
    <div className="min-h-screen gradient-bg relative">
      <Web3Background />
      <Web3Header />

      <div className="container mx-auto px-4 py-24 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Verified Suppliers
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-hero">Trusted Suppliers</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Connect with verified herbal suppliers from around the world. All transactions are secured on the blockchain.
          </p>
        </div>

        {/* Filters */}
        <Card className="glass-card border-border/50 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search suppliers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50 border-border/50"
                />
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-[160px] bg-background/50 border-border/50">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[160px] bg-background/50 border-border/50">
                    <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedRating} onValueChange={setSelectedRating}>
                  <SelectTrigger className="w-[140px] bg-background/50 border-border/50">
                    <Star className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ratings.map((rating) => (
                      <SelectItem key={rating} value={rating}>{rating}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{allSuppliers.length}</p>
                <p className="text-xs text-muted-foreground">Total Suppliers</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-secondary/20 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{allSuppliers.filter(s => s.kyc_status === "verified").length}</p>
                <p className="text-xs text-muted-foreground">Verified</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-accent/20 rounded-lg">
                <Package className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{allSuppliers.reduce((acc, s) => acc + s.product_count, 0)}</p>
                <p className="text-xs text-muted-foreground">Products</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-info/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">{allSuppliers.reduce((acc, s) => acc + s.total_sales_value, 0).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Sales</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Suppliers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="glass-card border-border/50 p-4 rounded-lg animate-pulse">
                <div className="h-48 bg-gray-700 rounded-md mb-4"></div>
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6 mb-4"></div>
                <div className="h-10 bg-gray-700 rounded w-full"></div>
              </div>
            ))
          ) : filteredSuppliers.length > 0 ? (
            filteredSuppliers.map((supplier, index) => (
              <Card 
                key={supplier.id} 
                className="glass-card border-border/50 overflow-hidden card-hover animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={supplier.avatar_url || "/placeholder-avatar.png"}
                      alt={supplier.name || "Supplier"}
                      className="w-full h-48 object-cover"
                    />
                    {supplier.kyc_status === "verified" && (
                      <Badge className="absolute top-3 right-3 bg-primary/90 text-primary-foreground">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{supplier.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {supplier.country}
                        </div>
                      </div>
                      <div className="flex items-center bg-primary/10 px-2 py-1 rounded">
                        <Star className="h-4 w-4 text-primary fill-primary mr-1" />
                        <span className="text-sm font-medium">{supplier.average_rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {supplier.bio}
                    </p>

                    {/* Categories are not directly available from profile, skipping for now */}
                    {/* <div className="flex flex-wrap gap-1 mb-4">
                      {supplier.categories.slice(0, 3).map((cat) => (
                        <Badge key={cat} variant="outline" className="text-xs border-border/50">
                          {cat}
                        </Badge>
                      ))}
                    </div> */}

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span className="flex items-center">
                        <Package className="h-4 w-4 mr-1" />
                        {supplier.product_count} Products
                      </span>
                      <span className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {supplier.total_sales_value.toLocaleString()} Sales
                      </span>
                    </div>

                    <Link to={`/supplier/${supplier.id}`}>
                      <Button className="w-full btn-web3">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <div className="p-4 bg-muted/20 rounded-full w-fit mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No suppliers found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </div>
      </div>

      <Web3Footer />
    </div>
  );
};

export default Suppliers;
