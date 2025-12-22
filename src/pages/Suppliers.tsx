import { useState } from "react";
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

const suppliers = [
  {
    id: "1",
    name: "Herbal Roots Co.",
    location: "Indonesia",
    rating: 4.9,
    verified: true,
    products: 45,
    sales: 1250,
    categories: ["Turmeric", "Ginger", "Herbs"],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400",
    description: "Premium organic herbs sourced directly from Indonesian farms.",
  },
  {
    id: "2",
    name: "Nature's Best Botanicals",
    location: "India",
    rating: 4.8,
    verified: true,
    products: 78,
    sales: 2340,
    categories: ["Ashwagandha", "Tulsi", "Moringa"],
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400",
    description: "Authentic Ayurvedic herbs with centuries of tradition.",
  },
  {
    id: "3",
    name: "Green Valley Farms",
    location: "Thailand",
    rating: 4.7,
    verified: true,
    products: 32,
    sales: 890,
    categories: ["Lemongrass", "Galangal", "Kaffir Lime"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    description: "Fresh Thai herbs grown with sustainable farming practices.",
  },
  {
    id: "4",
    name: "Amazon Herb Collective",
    location: "Brazil",
    rating: 4.6,
    verified: false,
    products: 28,
    sales: 560,
    categories: ["Cat's Claw", "Guarana", "Acai"],
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    description: "Rare Amazonian herbs harvested responsibly.",
  },
  {
    id: "5",
    name: "Mediterranean Botanica",
    location: "Greece",
    rating: 4.9,
    verified: true,
    products: 56,
    sales: 1890,
    categories: ["Oregano", "Thyme", "Sage"],
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
    description: "Wild-crafted Mediterranean herbs with exceptional quality.",
  },
  {
    id: "6",
    name: "East African Spice Trade",
    location: "Kenya",
    rating: 4.5,
    verified: true,
    products: 41,
    sales: 720,
    categories: ["Cinnamon", "Cardamom", "Cloves"],
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    description: "Premium spices from the heart of East Africa.",
  },
];

const locations = ["All Locations", "Indonesia", "India", "Thailand", "Brazil", "Greece", "Kenya"];
const categories = ["All Categories", "Turmeric", "Ginger", "Herbs", "Ashwagandha", "Oregano", "Cinnamon"];
const ratings = ["All Ratings", "4.5+", "4.0+", "3.5+"];

const Suppliers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedRating, setSelectedRating] = useState("All Ratings");

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = selectedLocation === "All Locations" || supplier.location === selectedLocation;
    const matchesCategory = selectedCategory === "All Categories" || 
      supplier.categories.some(cat => cat.toLowerCase().includes(selectedCategory.toLowerCase()));
    const matchesRating = selectedRating === "All Ratings" || 
      (selectedRating === "4.5+" && supplier.rating >= 4.5) ||
      (selectedRating === "4.0+" && supplier.rating >= 4.0) ||
      (selectedRating === "3.5+" && supplier.rating >= 3.5);
    
    return matchesSearch && matchesLocation && matchesCategory && matchesRating;
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
                <p className="text-2xl font-bold">{suppliers.length}</p>
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
                <p className="text-2xl font-bold">{suppliers.filter(s => s.verified).length}</p>
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
                <p className="text-2xl font-bold">{suppliers.reduce((acc, s) => acc + s.products, 0)}</p>
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
                <p className="text-2xl font-bold">{suppliers.reduce((acc, s) => acc + s.sales, 0).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Sales</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Suppliers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map((supplier, index) => (
            <Card 
              key={supplier.id} 
              className="glass-card border-border/50 overflow-hidden card-hover animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={supplier.image}
                    alt={supplier.name}
                    className="w-full h-48 object-cover"
                  />
                  {supplier.verified && (
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
                        {supplier.location}
                      </div>
                    </div>
                    <div className="flex items-center bg-primary/10 px-2 py-1 rounded">
                      <Star className="h-4 w-4 text-primary fill-primary mr-1" />
                      <span className="text-sm font-medium">{supplier.rating}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {supplier.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {supplier.categories.slice(0, 3).map((cat) => (
                      <Badge key={cat} variant="outline" className="text-xs border-border/50">
                        {cat}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span className="flex items-center">
                      <Package className="h-4 w-4 mr-1" />
                      {supplier.products} Products
                    </span>
                    <span className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      {supplier.sales} Sales
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
          ))}
        </div>

        {filteredSuppliers.length === 0 && (
          <div className="text-center py-16">
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

      <Web3Footer />
    </div>
  );
};

export default Suppliers;
