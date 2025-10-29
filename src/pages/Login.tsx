import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf } from "lucide-react";
import { authService, UserRole } from "@/lib/auth";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company: '',
    country: '',
    email: 'user@example.com',
    role: 'buyer' as UserRole
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company || !formData.country) {
      toast.error("Please fill in all fields");
      return;
    }

    const user = {
      name: formData.company,
      email: formData.email,
      company: formData.company,
      country: formData.country,
      role: formData.role
    };

    authService.login(user);
    toast.success("Login successful!");

    if (formData.role === 'seller') {
      navigate('/seller/products');
    } else {
      navigate('/buyer/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Leaf className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Welcome to HerBlocX</CardTitle>
          <CardDescription>Log in to your account to start trading</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="company">Your Company Name</Label>
              <Input
                id="company"
                placeholder="Enter your company name"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="Enter your country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                required
              />
            </div>

            <div className="space-y-3">
              <Label>I'm primarily a...</Label>
              <RadioGroup
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
              >
                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted cursor-pointer">
                  <RadioGroupItem value="buyer" id="buyer" />
                  <Label htmlFor="buyer" className="cursor-pointer flex-1">Buyer</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted cursor-pointer">
                  <RadioGroupItem value="seller" id="seller" />
                  <Label htmlFor="seller" className="cursor-pointer flex-1">Seller</Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Log In
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary font-medium hover:underline">
                  Sign up here
                </Link>
              </p>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              By continuing, you agree to our{" "}
              <a href="#" className="underline hover:text-primary">Terms of Use</a> and{" "}
              <a href="#" className="underline hover:text-primary">Privacy Policy</a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
