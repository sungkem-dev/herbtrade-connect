import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Leaf, Shield, Globe, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 hero-gradient text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6 animate-fade-in">About HerBlocX</h1>
            <p className="text-xl max-w-2xl mx-auto animate-slide-up">
              Indonesia's Leading Digital Herbal Marketplace
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-3xl font-bold text-primary">Our Story</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  HerBlocX adalah platform marketplace digital yang menghubungkan pembeli dan penjual bahan baku herbal berkualitas tinggi dari seluruh Indonesia. Kami berkomitmen untuk menyederhanakan proses ekspor dan perdagangan herbal dengan teknologi blockchain yang menjamin transparansi dan keaslian produk.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Dengan jaringan supplier terverifikasi dan sistem sertifikasi internasional (GMP, BPOM, FDA, Halal, Organic), HerBlocX memastikan setiap transaksi Anda aman, terpercaya, dan sesuai standar global.
                </p>
                
                <div className="grid grid-cols-2 gap-6 pt-6">
                  <div className="text-center p-6 bg-card rounded-lg border hover-scale">
                    <div className="text-4xl font-bold text-primary mb-2">500+</div>
                    <div className="text-sm text-muted-foreground">Verified Suppliers</div>
                  </div>
                  <div className="text-center p-6 bg-card rounded-lg border hover-scale">
                    <div className="text-4xl font-bold text-primary mb-2">1000+</div>
                    <div className="text-sm text-muted-foreground">Products Available</div>
                  </div>
                </div>
              </div>

              {/* Illustration */}
              <div className="animate-scale-in">
                <img 
                  src="/hero-herbal.jpg" 
                  alt="Herbal products illustration" 
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-primary">Our Core Values</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center animate-fade-in p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Quality Assurance</h3>
                <p className="text-muted-foreground">Certified products with international standards</p>
              </div>
              
              <div className="text-center animate-fade-in p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Global Reach</h3>
                <p className="text-muted-foreground">Connect with buyers worldwide</p>
              </div>
              
              <div className="text-center animate-fade-in p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Leaf className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Sustainability</h3>
                <p className="text-muted-foreground">Eco-friendly and sustainable practices</p>
              </div>
              
              <div className="text-center animate-fade-in p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Transparency</h3>
                <p className="text-muted-foreground">Blockchain-powered tracking</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 px-4 md:px-8">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
              Apa Kata Mereka
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <Card className="animate-fade-in hover:shadow-lg transition-all duration-300">
                <CardContent className="pt-6 text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src="https://randomuser.me/api/portraits/men/1.jpg" alt="Rizky Pratama" />
                    <AvatarFallback>RP</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold mb-1">Rizky Pratama</h3>
                  <p className="text-sm text-muted-foreground mb-4">Herbal Buyer</p>
                  <p className="text-muted-foreground leading-relaxed">
                    "Produk herbalnya sangat berkualitas, pengiriman cepat, dan pelayanan ramah! HerBlocX benar-benar memudahkan proses pembelian bahan baku herbal untuk bisnis saya."
                  </p>
                </CardContent>
              </Card>

              {/* Testimonial 2 */}
              <Card className="animate-fade-in hover:shadow-lg transition-all duration-300">
                <CardContent className="pt-6 text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src="https://randomuser.me/api/portraits/women/2.jpg" alt="Siti Aisyah" />
                    <AvatarFallback>SA</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold mb-1">Siti Aisyah</h3>
                  <p className="text-sm text-muted-foreground mb-4">Supplier</p>
                  <p className="text-muted-foreground leading-relaxed">
                    "Sebagai supplier, HerBlocX memberikan platform yang sangat transparan dan terpercaya. Saya bisa menjangkau pembeli dari berbagai negara dengan mudah!"
                  </p>
                </CardContent>
              </Card>

              {/* Testimonial 3 */}
              <Card className="animate-fade-in hover:shadow-lg transition-all duration-300">
                <CardContent className="pt-6 text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src="https://randomuser.me/api/portraits/men/3.jpg" alt="Budi Santoso" />
                    <AvatarFallback>BS</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold mb-1">Budi Santoso</h3>
                  <p className="text-sm text-muted-foreground mb-4">Customer</p>
                  <p className="text-muted-foreground leading-relaxed">
                    "Pengalaman berbelanja di HerBlocX luar biasa! Semua produk tersertifikasi dan tracking pengiriman sangat akurat. Highly recommended!"
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
