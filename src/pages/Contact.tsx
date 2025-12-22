import { Web3Header } from "@/components/Web3Header";
import { Web3Footer } from "@/components/Web3Footer";
import { Web3Background } from "@/components/Web3Background";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send, Instagram, MessageCircle, Twitter, Linkedin, Facebook } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen flex flex-col gradient-bg relative overflow-hidden">
      <Web3Background />
      <Web3Header />
      
      <main className="flex-1 relative z-10 pt-20">
        {/* Hero Section */}
        <section className="py-20 hero-gradient text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold text-primary-foreground mb-6 animate-fade-in">Contact Us</h1>
            <p className="text-xl max-w-2xl mx-auto animate-slide-up">
              Get in touch with our team. We're here to help!
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Send Us a Message</CardTitle>
                  <CardDescription>Fill out the form below and we'll respond as soon as possible</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us how we can help you..."
                        className="min-h-[150px]"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-8 animate-scale-in">
                <Card className="hover-scale">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Email</h3>
                        <p className="text-muted-foreground">info@herblocx.com</p>
                        <p className="text-muted-foreground">support@herblocx.com</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover-scale">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Phone & WhatsApp</h3>
                        <p className="text-muted-foreground">+62 800-300-353</p>
                        <p className="text-muted-foreground">WhatsApp: +62 812-3456-7890</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover-scale">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Address</h3>
                        <p className="text-muted-foreground">
                          Jl. Herbal Nusantara No. 123<br />
                          Jakarta Selatan 12345<br />
                          Indonesia
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-primary text-primary-foreground hover-scale">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-lg mb-3">Business Hours</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Monday - Friday:</span>
                        <span>9:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saturday:</span>
                        <span>9:00 AM - 2:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sunday:</span>
                        <span>Closed</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Social Media Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto text-center">
            <h2 className="text-2xl font-bold text-primary mb-6 animate-fade-in">
              Connect With Us
            </h2>
            
            <div className="flex justify-center gap-4 mb-6 animate-fade-in">
              <a
                href="https://instagram.com/herblocx"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white hover:bg-primary/80 transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              
              <a
                href="https://wa.me/628123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white hover:bg-primary/80 transition-all duration-300 hover:scale-110"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              
              <a
                href="https://twitter.com/herblocx"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white hover:bg-primary/80 transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              
              <a
                href="https://linkedin.com/company/herblocx"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white hover:bg-primary/80 transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              
              <a
                href="https://facebook.com/herblocx"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white hover:bg-primary/80 transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
            
            <p className="text-muted-foreground animate-fade-in">
              Ikuti kami untuk update dan informasi seputar herbal 🌿
            </p>
          </div>
        </section>
      </main>
      
      <Web3Footer />
    </div>
  );
};

export default Contact;
