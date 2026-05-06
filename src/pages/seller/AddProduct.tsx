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
import { Upload, Plus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  name: string;
  description: string;
  scientificName: string;
  category: string;
  price: string;
  location: string;
  cultivationArea: string;
  packaging: string;
  ingredients: string;
  weight: string;
  length: string;
  breadth: string;
  width: string;
  minOrderQty: string;
  minOrderUnit: string;
}

const AddProduct = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [certificates, setCertificates] = useState<string[]>(['']);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    scientificName: '',
    category: '',
    price: '',
    location: '',
    cultivationArea: '',
    packaging: '',
    ingredients: '',
    weight: '',
    length: '',
    breadth: '',
    width: '',
    minOrderQty: '',
    minOrderUnit: 'kg',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return false;
    }
    if (!formData.description.trim()) {
      toast.error("Product description is required");
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Valid price is required");
      return false;
    }
    if (!formData.location.trim()) {
      toast.error("Location is required");
      return false;
    }
    if (!formData.cultivationArea.trim()) {
      toast.error("Cultivation area is required");
      return false;
    }
    if (!formData.packaging.trim()) {
      toast.error("Packaging information is required");
      return false;
    }
    if (!formData.ingredients.trim()) {
      toast.error("Effective ingredients are required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!user) {
      toast.error("You must be logged in to add a product");
      navigate("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert product into Supabase
      const { data, error } = await supabase
        .from("products")
        .insert({
          name: formData.name,
          scientific_name: formData.scientificName || formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          location: formData.location,
          supplier_id: user.id,
          in_stock: true,
          on_sale: false,
          image_url: "/placeholder.png", // Placeholder - implement image upload later
          min_order_qty: parseInt(formData.minOrderQty) || 1,
          min_order_unit: formData.minOrderUnit,
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding product:", error);
        toast.error(`Failed to add product: ${error.message}`);
        return;
      }

      // If certificates were provided, you could store them in a separate table
      if (certificates.some(c => c.trim())) {
        console.log("Certificates to store:", certificates.filter(c => c.trim()));
        // TODO: Implement certificate storage in a future update
      }

      toast.success("Product added successfully!");
      navigate('/seller/products');
    } catch (error: any) {
      console.error("Unexpected error:", error);
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col gradient-bg relative overflow-hidden">
      <Web3Background />
      <Web3Header />

      <div className="flex-1 container mx-auto px-4 py-8 pt-24 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="animate-fade-in mb-8">
            <h1 className="text-4xl font-bold mb-2 text-gradient-hero">Add New Products</h1>
            <p className="text-muted-foreground">Add a new product to your shop catalogue!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Product Description */}
            <Card className="glass-card border-border/50 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-xl font-semibold">Product Description</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter product name" 
                    required 
                    className="bg-muted/30 border-border/50"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scientificName">Scientific Name</Label>
                  <Input 
                    id="scientificName" 
                    placeholder="e.g., Curcuma longa" 
                    className="bg-muted/30 border-border/50"
                    value={formData.scientificName}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Product Description *</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe your product" 
                    rows={4}
                    required 
                    className="bg-muted/30 border-border/50"
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Product Images</Label>
                  <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/20">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop images here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      (Image upload feature coming soon)
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
                    <Label htmlFor="category">Category</Label>
                    <Input 
                      id="category" 
                      placeholder="e.g., East Java" 
                      className="bg-muted/30 border-border/50"
                      value={formData.category}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ingredients">Effective Ingredients *</Label>
                    <Input 
                      id="ingredients" 
                      placeholder="Main active ingredients" 
                      required 
                      className="bg-muted/30 border-border/50"
                      value={formData.ingredients}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="packaging">Packaging *</Label>
                    <Input 
                      id="packaging" 
                      placeholder="e.g., 25kg/fiber drum" 
                      required 
                      className="bg-muted/30 border-border/50"
                      value={formData.packaging}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
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
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="shrink-0 border-border/50 bg-muted/30"
                        disabled={isSubmitting}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                      {certificates.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setCertificates(certificates.filter((_, i) => i !== index))}
                          disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add more certificates
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Price & Location */}
            <Card className="glass-card border-border/50 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-xl font-semibold">Price & Location</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Pricing (USDT) *</Label>
                    <Input 
                      id="price" 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      required 
                      className="bg-muted/30 border-border/50"
                      value={formData.price}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cultivationArea">Cultivation Area *</Label>
                    <Input 
                      id="cultivationArea" 
                      placeholder="e.g., East Java" 
                      required 
                      className="bg-muted/30 border-border/50"
                      value={formData.cultivationArea}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input 
                      id="location" 
                      placeholder="Specific location" 
                      required 
                      className="bg-muted/30 border-border/50"
                      value={formData.location}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minOrderQty">Minimum Order Quantity</Label>
                    <Input 
                      id="minOrderQty" 
                      type="number" 
                      placeholder="1" 
                      className="bg-muted/30 border-border/50"
                      value={formData.minOrderQty}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minOrderUnit">Unit</Label>
                    <Input 
                      id="minOrderUnit" 
                      placeholder="kg" 
                      className="bg-muted/30 border-border/50"
                      value={formData.minOrderUnit}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping */}
            <Card className="glass-card border-border/50 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-xl font-semibold">Shipping Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Items Weight (kg)</Label>
                    <Input 
                      id="weight" 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      className="bg-muted/30 border-border/50"
                      value={formData.weight}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="length">Length (cm)</Label>
                    <Input 
                      id="length" 
                      type="number" 
                      placeholder="0" 
                      className="bg-muted/30 border-border/50"
                      value={formData.length}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="breadth">Breadth (cm)</Label>
                    <Input 
                      id="breadth" 
                      type="number" 
                      placeholder="0" 
                      className="bg-muted/30 border-border/50"
                      value={formData.breadth}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="width">Width (cm)</Label>
                    <Input 
                      id="width" 
                      type="number" 
                      placeholder="0" 
                      className="bg-muted/30 border-border/50"
                      value={formData.width}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4 justify-end animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/seller/products')} 
                className="border-border/50 bg-muted/30"
                disabled={isSubmitting}
              >
                Discard
              </Button>
              <Button 
                type="submit" 
                className="btn-web3"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Product"
                )}
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
