import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Web3Header } from "@/components/Web3Header";
import { Web3Footer } from "@/components/Web3Footer";
import { Web3Background } from "@/components/Web3Background";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, Plus, X } from "lucide-react";
import { toast } from "sonner";

const AddProduct = () => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState<string[]>(['']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Product added successfully!");
    navigate('/seller/products');
  };

  return (
    <div className="min-h-screen flex flex-col gradient-bg relative overflow-hidden">
      <Web3Background />
      <Web3Header />

      <div className="flex-1 container mx-auto px-4 py-8 pt-24 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="animate-fade-in mb-8">
            <h1 className="text-4xl font-bold mb-2 text-gradient-hero">Add New Products</h1>
            <p className="text-muted-foreground">Add a new products to your shop catalogue!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Product Description */}
            <Card className="glass-card border-border/50 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-xl font-semibold">Product Description</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" placeholder="Enter product name" required className="bg-muted/30 border-border/50" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Product Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe your product" 
                    rows={4}
                    required 
                    className="bg-muted/30 border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Product Images</Label>
                  <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/20">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop images here or click to browse
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card className="glass-card border-border/50 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-xl font-semibold">Specifications</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="id">ID</Label>
                    <Input id="id" placeholder="Product ID" required className="bg-muted/30 border-border/50" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specification">Specification</Label>
                    <Input id="specification" placeholder="e.g., Essential oil content" className="bg-muted/30 border-border/50" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="packaging">Packaging</Label>
                    <Input id="packaging" placeholder="e.g., 25kg/fiber drum" required className="bg-muted/30 border-border/50" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ingredients">Effective Ingredients</Label>
                    <Input id="ingredients" placeholder="Main active ingredients" required className="bg-muted/30 border-border/50" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Certificates</Label>
                  {certificates.map((cert, index) => (
                    <div key={index} className="flex gap-2">
                      <Input 
                        placeholder="Certificate name (e.g., ISO9001, GMP)"
                        value={cert}
                        onChange={(e) => {
                          const newCerts = [...certificates];
                          newCerts[index] = e.target.value;
                          setCertificates(newCerts);
                        }}
                        className="bg-muted/30 border-border/50"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="shrink-0 border-border/50 bg-muted/30"
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                      {certificates.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setCertificates(certificates.filter((_, i) => i !== index))}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCertificates([...certificates, ''])}
                    className="border-border/50 bg-muted/30"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add more certificates
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Inventory */}
            <Card className="glass-card border-border/50 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-xl font-semibold">Inventory</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="variant">Product Variant</Label>
                  <Input id="variant" placeholder="e.g., Size, Weight" className="bg-muted/30 border-border/50" />
                </div>

                <Button type="button" variant="outline" size="sm" className="border-border/50 bg-muted/30">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Variant
                </Button>
              </CardContent>
            </Card>

            {/* Price & Location */}
            <Card className="glass-card border-border/50 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-xl font-semibold">Price & Location</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Pricing (USDT)</Label>
                    <Input id="price" type="number" step="0.01" placeholder="0.00" required className="bg-muted/30 border-border/50" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area">Cultivation Area</Label>
                    <Input id="area" placeholder="e.g., East Java" required className="bg-muted/30 border-border/50" />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="Specific location" required className="bg-muted/30 border-border/50" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping */}
            <Card className="glass-card border-border/50 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-xl font-semibold">Shipping Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Items Weight (kg)</Label>
                    <Input id="weight" type="number" step="0.01" placeholder="0.00" required className="bg-muted/30 border-border/50" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="length">Length (cm)</Label>
                    <Input id="length" type="number" placeholder="0" required className="bg-muted/30 border-border/50" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="breadth">Breadth (cm)</Label>
                    <Input id="breadth" type="number" placeholder="0" required className="bg-muted/30 border-border/50" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="width">Width (cm)</Label>
                    <Input id="width" type="number" placeholder="0" required className="bg-muted/30 border-border/50" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4 justify-end animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <Button type="button" variant="outline" onClick={() => navigate('/seller/products')} className="border-border/50 bg-muted/30">
                Discard
              </Button>
              <Button type="button" variant="outline" className="border-border/50 bg-muted/30">
                Schedule
              </Button>
              <Button type="submit" className="btn-web3">
                Add Product
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Web3Footer />
    </div>
  );
};

export default AddProduct;