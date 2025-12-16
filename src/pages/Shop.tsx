import { useState } from "react";
import { Link } from "react-router-dom";
import { Web3Header } from "@/components/Web3Header";
import { Web3Footer } from "@/components/Web3Footer";
import { Web3Background } from "@/components/Web3Background";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { products, categories } from "@/lib/products";
import { ShoppingCart } from "lucide-react";

const Shop = () => {
  const [priceRange, setPriceRange] = useState([0, 30]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showInStock, setShowInStock] = useState(false);
  const [showOnSale, setShowOnSale] = useState(false);

  const filteredProducts = products.filter(product => {
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const stockMatch = !showInStock || product.inStock;
    const saleMatch = !showOnSale || product.onSale;
    return priceMatch && categoryMatch && stockMatch && saleMatch;
  });

  return (
    <div className="min-h-screen flex flex-col gradient-bg relative overflow-hidden">
      <Web3Background />
      <Web3Header />

      <div className="flex-1 container mx-auto px-4 py-8 pt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Price Filter</h3>
                  <div className="space-y-4">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={30}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                    <Button variant="outline" className="w-full">Filter</Button>
                  </div>
                </div>

                <div>
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

                <div>
                  <h3 className="font-semibold mb-4">Product Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="in-stock"
                        checked={showInStock}
                        onCheckedChange={(checked) => setShowInStock(!!checked)}
                      />
                      <Label htmlFor="in-stock" className="text-sm cursor-pointer">
                        In Stock
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="on-sale"
                        checked={showOnSale}
                        onCheckedChange={(checked) => setShowOnSale(!!checked)}
                      />
                      <Label htmlFor="on-sale" className="text-sm cursor-pointer">
                        On Sale
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">{filteredProducts.length} Items</p>
              <Select defaultValue="latest">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Sort by latest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name: A to Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <Card key={product.id} className="card-hover">
                  <CardContent className="pt-6">
                    <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-sm text-muted-foreground italic">{product.scientificName}</p>
                      <p className="text-xs text-muted-foreground">{product.location}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">${product.price}</span>
                        {product.onSale && (
                          <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
                            On Sale
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="gap-2">
                    <Link to={`/product/${product.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">View Details</Button>
                    </Link>
                    <Button size="icon" className="btn-hero">
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Web3Footer />
    </div>
  );
};

export default Shop;
