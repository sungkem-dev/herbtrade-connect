import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Web3Header } from "@/components/Web3Header";
import { Web3Footer } from "@/components/Web3Footer";
import { Web3Background } from "@/components/Web3Background";
import {
  ArrowRight,
  Shield,
  Globe,
  Zap,
  Lock,
  Database,
  Layers,
  CheckCircle,
  Leaf,
  Award,
} from "lucide-react";

const Index = () => {
  const sectionsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el: HTMLDivElement) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      <Web3Background />
      <Web3Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div
            ref={addToRefs}
            className="animate-on-scroll"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-8">
              <Leaf className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary">Web3 Herbal Marketplace</span>
            </div>
          </div>

          <h1
            ref={addToRefs}
            className="animate-on-scroll text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
            style={{ animationDelay: "0.2s" }}
          >
            <span className="text-gradient-hero">Revolutionizing</span>
            <br />
            <span className="text-foreground">Herbal Trade</span>
          </h1>

          <p
            ref={addToRefs}
            className="animate-on-scroll text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            style={{ animationDelay: "0.3s" }}
          >
            Connect with verified global suppliers and buyers. Trade with confidence
            using blockchain transparency and smart contracts.
          </p>

          <div
            ref={addToRefs}
            className="animate-on-scroll flex flex-col sm:flex-row gap-4 justify-center"
            style={{ animationDelay: "0.4s" }}
          >
            <Link to="/login">
              <Button className="btn-web3 text-lg gap-2">
                Launch App
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/shop">
              <Button className="btn-web3-outline text-lg">
                Explore Marketplace
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div
            ref={addToRefs}
            className="animate-on-scroll grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto"
            style={{ animationDelay: "0.5s" }}
          >
            {[
              { value: "$2.5M+", label: "Total Volume" },
              { value: "1,200+", label: "Active Traders" },
              { value: "50+", label: "Countries" },
              { value: "99.9%", label: "Uptime" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-gradient-hero">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1">
            <div className="w-1.5 h-2.5 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <div
            ref={addToRefs}
            className="animate-on-scroll text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              About <span className="text-gradient-hero">HerBlocX</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Indonesia's leading digital herbal marketplace powered by blockchain technology
            </p>
          </div>

          <div
            ref={addToRefs}
            className="animate-on-scroll glass-card p-8 md:p-12 max-w-4xl mx-auto"
          >
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              HerBlocX is revolutionizing the herbal trade industry by combining
              traditional Indonesian herbal expertise with cutting-edge blockchain
              technology. Our platform ensures transparent, secure, and efficient
              trading for suppliers and buyers worldwide.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              With smart contracts and immutable records, every transaction is
              verified, every product is authenticated, and every participant is
              protected.
            </p>
          </div>
        </div>
      </section>

      {/* Blockchain Features */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <div
            ref={addToRefs}
            className="animate-on-scroll text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Blockchain <span className="text-gradient-hero">Features</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Powered by decentralized technology for maximum security and transparency
            </p>
          </div>

          <div
            ref={addToRefs}
            className="animate-on-scroll grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Shield,
                title: "Smart Contracts",
                description:
                  "Automated, trustless transactions executed on-chain with complete transparency.",
              },
              {
                icon: Database,
                title: "Immutable Records",
                description:
                  "Every transaction is permanently recorded on the blockchain for full audit trail.",
              },
              {
                icon: Lock,
                title: "Secure Escrow",
                description:
                  "Funds are protected in smart contract escrow until delivery is confirmed.",
              },
              {
                icon: Zap,
                title: "Instant Settlement",
                description:
                  "Fast, low-cost transactions with near-instant finality and settlement.",
              },
              {
                icon: Globe,
                title: "Global Access",
                description:
                  "Trade with verified partners anywhere in the world without intermediaries.",
              },
              {
                icon: Layers,
                title: "Multi-Chain Support",
                description:
                  "Connect your preferred wallet and transact across multiple networks.",
              },
            ].map((feature) => (
              <Card
                key={feature.title}
                className="glass-card border-border/50 card-hover"
              >
                <CardContent className="pt-6">
                  <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4 glow-primary">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div ref={addToRefs} className="animate-on-scroll">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Complete <span className="text-gradient-hero">Ecosystem</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                From sourcing to delivery, HerBlocX provides a complete solution
                for the herbal trade industry.
              </p>

              <div className="space-y-4">
                {[
                  "Verified supplier network across Indonesia",
                  "Quality certification and product authentication",
                  "Real-time tracking and logistics integration",
                  "Secure payment processing with multiple options",
                  "Regulatory compliance and export documentation",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                    <p className="text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div
              ref={addToRefs}
              className="animate-on-scroll grid grid-cols-2 gap-4"
            >
              {[
                { label: "Suppliers", value: "500+" },
                { label: "Products", value: "2,000+" },
                { label: "Transactions", value: "10,000+" },
                { label: "Certifications", value: "15+" },
              ].map((stat) => (
                <Card
                  key={stat.label}
                  className="glass-card border-border/50 text-center p-6"
                >
                  <p className="text-3xl font-bold text-gradient-hero mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <div
            ref={addToRefs}
            className="animate-on-scroll text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Security & <span className="text-gradient-hero">Transparency</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Enterprise-grade security with complete transparency
            </p>
          </div>

          <div
            ref={addToRefs}
            className="animate-on-scroll glass-card p-8 md:p-12 max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
              {["GMP", "CPOTB", "BPOM", "FDA", "Halal"].map((cert) => (
                <div key={cert} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center glow-primary">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <p className="font-semibold">{cert}</p>
                  <p className="text-xs text-muted-foreground">Certified</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              {[
                "GMP Certified",
                "CPOTB Compliant",
                "BPOM & FDA Export Approved",
                "Phytosanitary Certification",
                "Halal & Organic Certified",
              ].map((item) => (
                <div key={item} className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <div
            ref={addToRefs}
            className="animate-on-scroll glass-card p-12 md:p-20 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Join the <span className="text-gradient-hero">Future</span>?
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
                Start trading on the most advanced herbal marketplace today.
                Connect your wallet and explore the ecosystem.
              </p>
              <Link to="/login">
                <Button className="btn-web3 text-lg gap-2">
                  Get Started Now
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Web3Footer />
    </div>
  );
};

export default Index;
