// @ts-nocheck
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Web3Header } from "@/components/Web3Header";
import { Web3Footer } from "@/components/Web3Footer";
import { Web3Background } from "@/components/Web3Background";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, ShoppingCart, MapPin, Shield, Star, Package, LogIn, MessageCircle } from "lucide-react";
import { fetchProductById, Product, addProductReview } from "@/lib/products";
import { toast } from "sonner";
import { PriceChart } from "@/components/PriceChart";
import { TransactionHistory } from "@/components/TransactionHistory";
import { SupplierChat } from "@/components/SupplierChat";
import { OrderPlacement } from "@/components/OrderPlacement";
import { LivePriceDisplay } from "@/components/LivePriceTicker";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, loading: authLoading, isKycVerified, hasRole } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [quantityUnit, setQuantityUnit] = useState("kg");
  const [purchaseType, setPurchaseType] = useState("one-time");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  useEffect(() => {
    const getProduct = async () => {
      if (id) {
        setLoading(true);
        const fetchedProduct = await fetchProductById(id);
        setProduct(fetchedProduct);
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

  const requireBuyerKyc = async (actionLabel: string) => {
    if (!user) {
      toast.error(`Please login to ${actionLabel}. General accounts can browse before KYC.`, {
        action: {
          label: "Login",
          onClick: () => navigate("/login"),
        },
      });
      return false;
    }

    const verified = await isKycVerified();
    const isBuyer = await hasRole("buyer");

    if (!verified || !isBuyer) {
      toast.error("Complete Buyer KYC to create purchase requests or buy products.", {
        action: {
          label: "Start Buyer KYC",
          onClick: () => navigate("/kyc?role=buyer"),
        },
      });
      return false;
    }

    return true;
  };

  // Unit conversion multipliers
  const unitMultipliers: Record<string, number> = {
    kg: 1,
    kwintal: 100,
    ton: 1000,
  };

  const calculatePrice = () => {
    if (!product) return 0;
    return product.price * quantity * unitMultipliers[quantityUnit];
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex flex-col gradient-bg relative overflow-hidden">
        <Web3Background />
        <Web3Header />
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Loading Product...</h1>
          </div>
        </div>
        <Web3Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col gradient-bg relative overflow-hidden">
        <Web3Background />
        <Web3Header />
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
            <Link to="/shop">
              <Button className="btn-hero">Back to Marketplace</Button>
            </Link>
          </div>
        </div>
        <Web3Footer />
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!(await requireBuyerKyc("add items to cart"))) {
      return;
    }

    try {
      await addToCart(product.id, quantity * unitMultipliers[quantityUnit]);
      toast.success(`Added ${quantity} ${quantityUnit.toUpperCase()} of ${product.name} to cart!`);
      navigate("/buyer/requests");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleBuyNow = async () => {
    if (!(await requireBuyerKyc("make a purchase"))) {
      return;
    }
    setShowOrderModal(true);
  };

  const handleAddReview = async () => {
    if (!user) {
      toast.error("Please login to add a review.");
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Review cannot be empty.");
      return;
    }

    try {
      await addProductReview(product.id, user.id, reviewRating, reviewText);
      toast.success("Review added successfully!");
      setReviewText("");
      setReviewRating(5);
      // Re-fetch product to update reviews
      const fetchedProduct = await fetchProductById(product.id);
      setProduct(fetchedProduct);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col gradient-bg relative overflow-hidden">
      <Web3Background />
      <Web3Header />

      <div className="flex-1 container mx-auto px-4 py-8 pt-24 relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-primary">Marketplace</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Image */}
          <div>
            <div className="aspect-square bg-muted/30 rounded-2xl overflow-hidden border border-border/50 glass-card">
              <img src={product.image_url || "/placeholder.png"} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified Product
                </Badge>
                {product.on_sale && (
                  <Badge className="bg-accent/20 text-accent border-accent/30">🔥 On Sale</Badge>
                )}
              </div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-xl text-muted-foreground italic">{product.scientific_name}</p>
            </div>

            {/* Supplier Info */}
            <Link to={`/supplier/${product.supplier_id}`}>
              <Card className="glass-card border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Package className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold hover:text-primary transition-colors">{product.supplier_name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{product.supplier_location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-semibold">{product.supplier_rating.toFixed(1)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{product.supplier_total_sales} sales</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Price Display */}
            <div className="glass-card border-border/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">Price per KG</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                  +2.5% (24h)
                </Badge>
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold text-primary font-mono">${product.price.toFixed(2)}</span>
                <span className="text-lg text-primary">USD</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Total: <span className="text-foreground font-semibold">${calculatePrice().toFixed(2)} USD</span>
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Quantity & Unit</Label>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="glass border-border/50"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-xl font-semibold w-16 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="glass border-border/50"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Select value={quantityUnit} onValueChange={setQuantityUnit}>
                  <SelectTrigger className="w-[140px] glass border-border/50">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent className="glass">
                    <SelectItem value="kg">Kilogram (KG)</SelectItem>
                    <SelectItem value="kwintal">Kwintal (100 KG)</SelectItem>
                    <SelectItem value="ton">Ton (1000 KG)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground">
                Available stock: <span className="text-foreground font-medium">{product.in_stock ? "In Stock" : "Out of Stock"}</span>
              </p>
              <p className="text-sm font-medium text-accent">
                Min. Order: {product.min_order_qty?.toLocaleString() || 0} {product.min_order_unit}
              </p>
            </div>

            {/* Purchase Options */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Purchase Options</Label>
              <RadioGroup value={purchaseType} onValueChange={setPurchaseType}>
                <div className="flex items-center space-x-2 border border-border/50 rounded-lg p-4 cursor-pointer hover:bg-muted/30 glass">
                  <RadioGroupItem value="one-time" id="one-time" />
                  <Label htmlFor="one-time" className="cursor-pointer flex-1">
                    One time purchase
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border border-border/50 rounded-lg p-4 cursor-pointer hover:bg-muted/30 glass">
                  <RadioGroupItem value="subscribe" id="subscribe" />
                  <div className="flex-1">
                    <Label htmlFor="subscribe" className="cursor-pointer block">
                      Subscribe and delivery every 4 weeks
                    </Label>
                    <p className="text-sm text-accent mt-1">Save 10%</p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="flex gap-3">
              <Button size="lg" className="flex-1 btn-web3" onClick={handleAddToCart} disabled={!product.in_stock || !user}>
                <ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart
              </Button>
              <Button size="lg" className="flex-1 btn-web3-outline" onClick={handleBuyNow} disabled={!product.in_stock || !user}>
                Buy Now
              </Button>
            </div>

            {!user && (
              <div className="text-center text-sm text-muted-foreground">
                <LogIn className="inline-block h-4 w-4 mr-1" /> Please <Link to="/login" className="text-primary hover:underline">log in</Link> to add to cart or buy.
              </div>
            )}

            {user && !(isKycVerified() && hasRole("buyer")) && (
              <div className="text-center text-sm text-muted-foreground">
                <Shield className="inline-block h-4 w-4 mr-1" /> Complete <Link to="/kyc?role=buyer" className="text-primary hover:underline">Buyer KYC</Link> to enable transactions.
              </div>
            )}

            <Button variant="outline" className="w-full glass border-border/50" onClick={() => setShowChat(true)}>
              <MessageCircle className="h-4 w-4 mr-2" /> Chat with Supplier
            </Button>
          </div>
        </div>

        {/* Product Description */}
        <div className="glass-card border-border/50 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Description</h2>
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>
        </div>

        {/* Product Specifications */}
        <div className="glass-card border-border/50 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground">
            <div>
              <p><strong>Scientific Name:</strong> {product.scientific_name}</p>
              <p><strong>Category:</strong> {product.category}</p>
              <p><strong>Cultivation Area:</strong> {product.cultivation_area}</p>
              <p><strong>Location:</strong> {product.location}</p>
            </div>
            <div>
              {product.specifications && (
                <>
                  {product.specifications.essentialOil && <p><strong>Essential Oil:</strong> {product.specifications.essentialOil}</p>}
                  {product.specifications.curcumin && <p><strong>Curcumin:</strong> {product.specifications.curcumin}</p>}
                  {product.specifications.packing && <p><strong>Packing:</strong> {product.specifications.packing}</p>}
                  {product.specifications.effectiveIngredients && <p><strong>Effective Ingredients:</strong> {product.specifications.effectiveIngredients}</p>}
                  {product.specifications.certificate && <p><strong>Certificate:</strong> {product.specifications.certificate}</p>}
                  {product.specifications.model && <p><strong>Model:</strong> {product.specifications.model}</p>}
                  {product.specifications.casNo && <p><strong>CAS No:</strong> {product.specifications.casNo}</p>}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Price Chart */}
        <div className="glass-card border-border/50 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Price History</h2>
          <PriceChart productId={product.id} />
        </div>

        {/* Transaction History */}
        <div className="glass-card border-border/50 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>
          <TransactionHistory productId={product.id} />
        </div>

        {/* Product Reviews */}
        <div className="glass-card border-border/50 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Customer Reviews ({product.reviews.length})</h2>
          <div className="space-y-6 mt-6">
            {product.reviews.length > 0 ? (
              product.reviews.map((review, index) => (
                <div key={index} className="border-b border-border/30 pb-4 last:border-b-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="font-semibold">{review.reviewer_name}</div>
                    <div className="flex items-center text-yellow-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
            )}

            {user && (isKycVerified() && hasRole("buyer")) && (
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Add Your Review</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="rating">Your Rating:</Label>
                    <Select value={String(reviewRating)} onValueChange={(value) => setReviewRating(Number(value))}>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Rating" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <SelectItem key={rating} value={String(rating)}>{rating} Star{rating > 1 ? "s" : ""}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <textarea
                    className="w-full p-3 rounded-md border border-border/50 bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={4}
                    placeholder="Write your review here..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  ></textarea>
                  <Button onClick={handleAddReview} className="btn-web3">Submit Review</Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <LivePriceDisplay />
      </div>

      <Web3Footer />

      {showOrderModal && product && (
        <OrderPlacement
          product={product}
          quantity={quantity * unitMultipliers[quantityUnit]}
          unit={quantityUnit}
          totalPrice={calculatePrice()}
          onClose={() => setShowOrderModal(false)}
        />
      )}

      {showChat && product && (
        <SupplierChat
          supplierId={product.supplier_id}
          supplierName={product.supplier_name}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
};

export default ProductDetail;
