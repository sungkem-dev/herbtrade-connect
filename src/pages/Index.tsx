import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Shield, CheckCircle, Globe, Award } from "lucide-react";
import heroImage from "@/assets/hero-herbal.jpg";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(9, 78, 7, 0.7), rgba(9, 78, 7, 0.7)), url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="container mx-auto px-4 z-10 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in text-primary-foreground">
            Simplify Your Herbal Export with HerBlocX
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-slide-up">
            Connect with verified global suppliers and buyers. Trade with confidence using blockchain transparency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="btn-hero text-lg px-8 py-6">
                Claim Your Access Now!
              </Button>
            </Link>
            <Link to="/shop">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 backdrop-blur border-white text-white hover:bg-white/20">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose HerBlocX?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-hover border-2">
              <CardContent className="pt-6">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Verified Quality</h3>
                <p className="text-muted-foreground">
                  All products undergo rigorous quality checks and certification validation.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover border-2">
              <CardContent className="pt-6">
                <CheckCircle className="h-12 w-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-3">Blockchain Transparency</h3>
                <p className="text-muted-foreground">
                  Track every transaction with immutable blockchain records for complete trust.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover border-2">
              <CardContent className="pt-6">
                <Globe className="h-12 w-12 text-secondary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Global Network</h3>
                <p className="text-muted-foreground">
                  Connect with verified suppliers and buyers from around the world.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Award className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Certified & Compliant</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We ensure all products meet international standards and regulations
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {['GMP', 'CPOTB', 'BPOM', 'FDA', 'Halal'].map((cert) => (
              <Card key={cert} className="text-center p-6 card-hover">
                <Award className="h-10 w-10 text-accent mx-auto mb-2" />
                <p className="font-semibold">{cert}</p>
                <p className="text-xs text-muted-foreground">Certified</p>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <ul className="inline-flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <li>✓ GMP Certified</li>
              <li>✓ CPOTB Compliant</li>
              <li>✓ BPOM & FDA Export Approved</li>
              <li>✓ Phytosanitary Certification</li>
              <li>✓ Halal & Organic Certified</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-primary-foreground">Ready to Start Trading?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of verified buyers and sellers in the global herbal trade marketplace
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
