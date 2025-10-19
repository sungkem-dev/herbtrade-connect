import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { products } from "@/lib/products";
import { toast } from "sonner";

const Product = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const [purchaseType, setPurchaseType] = useState("one-time");

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
            <Link to="/shop">
              <Button>Back to Shop</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    toast.success(`Added ${quantity}x ${product.name} to cart!`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-xl text-muted-foreground italic">{product.scientificName}</p>
            </div>

            <div className="text-4xl font-bold text-primary">
              ${product.price}
            </div>

            <div className="space-y-4">
              <Label>Purchase Options</Label>
              <RadioGroup value={purchaseType} onValueChange={setPurchaseType}>
                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted">
                  <RadioGroupItem value="one-time" id="one-time" />
                  <Label htmlFor="one-time" className="cursor-pointer flex-1">
                    One time purchase
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted">
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

            <div className="space-y-2">
              <Label>Quantity</Label>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button size="lg" className="w-full btn-hero" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-4">Product Description</h3>
                <p className="text-muted-foreground mb-4">{product.description}</p>

                <h3 className="font-semibold text-lg mb-4 mt-6">Specifications</h3>
                <div className="space-y-2 text-sm">
                  {product.specifications.essentialOil && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Essential Oil:</span>
                      <span>{product.specifications.essentialOil}</span>
                    </div>
                  )}
                  {product.specifications.curcumin && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Curcumin:</span>
                      <span>{product.specifications.curcumin}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Packing:</span>
                    <span>{product.specifications.packing}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Effective Ingredients:</span>
                    <span>{product.specifications.effectiveIngredients}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Certificate:</span>
                    <span>{product.specifications.certificate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Model:</span>
                    <span>{product.specifications.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CAS No:</span>
                    <span>{product.specifications.casNo}</span>
                  </div>
                </div>

                <h3 className="font-semibold text-lg mb-2 mt-6">Cultivation Area</h3>
                <p className="text-sm">{product.cultivationArea}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Product;
