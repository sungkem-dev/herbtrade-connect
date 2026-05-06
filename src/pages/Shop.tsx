// @ts-nocheck
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Web3Header } from "@/components/Web3Header";
import { Web3Footer } from "@/components/Web3Footer";
import { Web3Background } from "@/components/Web3Background";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchProducts, Product, categories } from "@/lib/products";
import { isProductInSeason, isProductInPeakSeason, getCurrentSeason, getSeasonalProductIds } from "@/lib/seasons";
import { ShoppingCart, TrendingUp, TrendingDown, Coins, Clock, BarChart3, Verified, Package, Store, Leaf, MapPin, Badge } from "lucide-react";
import { toast } from "sonner";
import { SearchAutocomplete } from "@/components/SearchAutocomplete";
import { SupplierTrendGraph } from "@/components/SupplierTrendGraph";
import { ProductCardSkeleton, StatCardSkeleton } from "@/components/ui/loading-spinner";
import { LivePriceTicker, LivePriceBadge } from "@/components/LivePriceTicker";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

// Mock price data for blockchain display
const generateMockPriceChange = () => {
  const change = (Math.random() * 10 - 3).toFixed(2);
  return parseFloat(change);
};

// Mock seasonal products for fallback when database is empty
const mockSeasonalProducts: Product[] = [
  {
    id: "CL001",
    name: "Turmeric",
    scientific_name: "Curcuma longa",
    price: 12.50,
    image_url: "/turmeric.jpg",
    category: "East Java",
    location: "Malang, East Java",
    in_stock: true,
    on_sale: false,
    supplier_id: "SUP001",
    supplier_name: "Java Herbs Co.",
    supplier_location: "Malang, East Java",
    supplier_rating: 4.8,
    supplier_total_sales: 1250,
    supplier_verified: true,
    reviews: [],
    min_order_qty: 10,
    min_order_unit: "kg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "AP001",
    name: "Andrographis",
    scientific_name: "Andrographis paniculata",
    price: 8.75,
    image_url: "/andrographis.jpg",
    category: "West Java",
    location: "Bogor, West Java",
    in_stock: true,
    on_sale: true,
    supplier_id: "SUP002",
    supplier_name: "West Java Botanics",
    supplier_location: "Bogor, West Java",
    supplier_rating: 4.7,
    supplier_total_sales: 890,
    supplier_verified: true,
    reviews: [],
    min_order_qty: 5,
    min_order_unit: "kg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const Shop = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, loading: authLoading, isKycVerified, hasRole } = useAuth();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showInStock, setShowInStock] = useState(false);
  const [showOnSale, setShowOnSale] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      setIsLoading(true);
      try {
        const fetchedProducts = await fetchProducts();
        // If no products from Supabase, use mock data with graceful fallback
        setAllProducts(fetchedProducts.length > 0 ? fetchedProducts : mockSeasonalProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        // Graceful fallback to mock data on error
        setAllProducts(mockSeasonalProducts);
        toast.error("Failed to load products. Showing sample data.");
      } finally {
        setIsLoading(false);
      }
    };
    getProducts();
  }, []);

  const filteredProducts = allProducts.filter(product => {
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const stockMatch = !showInStock || product.in_stock;
    const saleMatch = !showOnSale || product.on_sale;
    const searchMatch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.scientific_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.location.toLowerCase().includes(searchQuery.toLowerCase());
    return priceMatch && categoryMatch && stockMatch && saleMatch && searchMatch;
  });

  const handleBuyerAction = async (callback: () => void) => {
    if (!user) {
      toast.error("Please login first. General accounts can browse, but trading requires Buyer KYC.", {
        action: {
          label: "Login",
          onClick: () => navigate("/login"),
        },
      });
      return;
    }

    const verified = await isKycVerified();
    const isBuyer = await hasRole("buyer");

    if (!verified || !isBuyer) {
      toast.error("Complete Buyer KYC to create purchase requests or add products to your cart.", {
        action: {
          label: "Start Buyer KYC",
          onClick: () => navigate("/kyc?role=buyer"),
        },
      });
      return;
    }

    callback();
  };

  // Generate mock blockchain data for each product
  const productsWithBlockchainData = filteredProducts.map(product => ({
    ...product,
    priceChange: generateMockPriceChange(),
    usdtPrice: product.price,
    volume24h: Math.floor(Math.random() * 1000) + 100,
    lastTrade: Math.floor(Math.random() * 60) + 1,
  }));

  return (
    <div className="min-h-screen flex flex-col gradient-bg relative overflow-hidden">
      <Web3Background />
      <Web3Header />

      <div className="flex-1 container mx-auto px-4 py-8 pt-24 relative z-10">
        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <SearchAutocomplete onSearch={setSearchQuery} />
        </div>

        {/* Live Price Ticker */}
        <LivePriceTicker productIds={allProducts.map(p => p.id)} />

        {/* Seasonal Banner - Always Rendered with Graceful Fallback */}
        {(() => {
          const currentSeason = getCurrentSeason();
          const seasonalIds = getSeasonalProductIds();
          const seasonalProducts = allProducts.filter(p => seasonalIds.includes(p.id));
          
          // Always render the seasonal banner, even if empty - show empty state or mock data
          const displayProducts = seasonalProducts.length > 0 ? seasonalProducts : mockSeasonalProducts.slice(0, 2);
          
          return (
            <Card className="glass-card border-primary/30 mb-8 overflow-hidden">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Leaf className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">🌿 Currently In Season — {currentSeason.nameId}</h3>
                    <p className="text-xs text-muted-foreground">{currentSeason.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {displayProducts.length > 0 ? (
                    displayProducts.map(p => (
                      <Link key={p.id} to={`/product/${p.id}`}>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm hover:bg-primary/20 transition-colors">
                          <span className="font-medium">{p.name}</span>
                          <span className="text-xs text-muted-foreground">${p.price}/kg</span>
                          {isProductInPeakSeason(p.id) && <span className="text-xs text-primary font-semibold">🔥 Peak</span>}
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="w-full text-center py-2 text-muted-foreground text-sm">
                      No seasonal products available. Browse all products below.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })()}
        
        {/* Market Stats Header */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {isLoading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <Card className="glass-card border-border/50 animate-fade-in" style={{ animationDelay: '0ms' }}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <BarChart3 className="h-4 w-4" />
                    Total Volume
                  </div>
                  <p className="text-xl font-bold">$124,500 <span className="text-xs text-primary">USD</span></p>
                </CardContent>
              </Card>
              <Card className="glass-card border-border/50 animate-fade-in" style={{ animationDelay: '50ms' }}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <Coins className="h-4 w-4" />
                    Listed Items
                  </div>
                  <p className="text-xl font-bold">{allProducts.length} <span className="text-xs text-muted-foreground">Products</span></p>
                </CardContent>
              </Card>
              <Card className="glass-card border-border/50 animate-fade-in" style={{ animationDelay: '100ms' }}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    24h Change
                  </div>
                  <p className="text-xl font-bold text-green-500">+5.24%</p>
                </CardContent>
              </Card>
              <Card className="glass-card border-border/50 animate-fade-in" style={{ animationDelay: '150ms' }}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <Clock className="h-4 w-4" />
                    Last Updated
                  </div>
                  <p className="text-xl font-bold">2m ago</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <Card className="glass-card border-border/50">
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Coins className="h-4 w-4 text-primary" />
                    Price Filter (USD)
                  </h3>
                  <div className="space-y-4">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={500}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm">
                      <span className="font-mono text-primary">{priceRange[0]} USD</span>
                      <span className="font-mono text-primary">{priceRange[1]} USD</span>
                    </div>
                    <Button variant="outline" className="w-full glass border-border/50 hover:bg-primary/10">
                      Apply Filter
                    </Button>
                  </div>
                </div>

                <div className="border-t border-border/50 pt-6">
                  <h3 className="font-semibold mb-4">Product Categories</h3>
                  <div className="space-y-3">
                    {categories.map(category => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCategories([...selectedCategories, category]);
                            } else {
                              setSelectedCategories(selectedCategories.filter(c => c !== category));
                            }
                          }}
                        />
                        <Label htmlFor={category} className="text-sm cursor-pointer">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border/50 pt-6">
                  <h3 className="font-semibold mb-4">Availability</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="in-stock"
                        checked={showInStock}
                        onCheckedChange={(checked: boolean) => setShowInStock(checked)}
                      />
                      <Label htmlFor="in-stock" className="text-sm cursor-pointer">In Stock</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="on-sale"
                        checked={showOnSale}
                        onCheckedChange={(checked: boolean) => setShowOnSale(checked)}
                      />
                      <Label htmlFor="on-sale" className="text-sm cursor-pointer">On Sale</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Product Grid */}
          <main className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productsWithBlockchainData.length > 0 ? (
                  productsWithBlockchainData.map((product) => (
                    <Card key={product.id} className="glass-card border-border/50 overflow-hidden group">
                      <Link to={`/product/${product.id}`}>
                        <div className="relative h-48 w-full overflow-hidden">
                          <img
                            src={product.image_url || "/placeholder.png"}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {product.on_sale && (
                            <div className="absolute top-2 left-2 bg-accent/80 text-accent-foreground px-2 py-1 rounded text-xs font-semibold">On Sale</div>
                          )}
                          {!product.in_stock && (
                            <div className="absolute top-2 right-2 bg-red-500/80 text-white px-2 py-1 rounded text-xs font-semibold">Out of Stock</div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground italic mb-2">{product.scientific_name}</p>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xl font-bold text-primary">${product.price.toFixed(2)}</span>
                            <LivePriceBadge productId={product.id} />
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-1" /> {product.location}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <Store className="h-4 w-4 mr-1" /> {product.supplier_name}
                            {product.supplier_verified && <Verified className="h-4 w-4 ml-1 text-blue-500" title="Verified Supplier" />}
                          </div>
                        </CardContent>
                      </Link>
                      <CardFooter className="p-4 pt-0">
                        <Button
                          className="w-full btn-web3"
                          onClick={() => handleBuyerAction(() => addToCart(product.id, product.min_order_qty || 1))}
                          disabled={!product.in_stock}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-muted-foreground">No products found matching your criteria.</p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>

        <SupplierTrendGraph />
      </div>

      <Web3Footer />
    </div>
  );
};

export default Shop;
