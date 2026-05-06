import { useState, useEffect } from "react";
import { Web3Header } from "@/components/Web3Header";
import { Web3Footer } from "@/components/Web3Footer";
import { Web3Background } from "@/components/Web3Background";
import { PageTransition } from "@/components/PageTransition";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, Sparkles, ShoppingBag, DollarSign, Users, Leaf, ArrowLeft, Star, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchProducts, categories, Product } from "@/lib/products";
import { getCurrentSeason, getSeasonalProductIds, getUpcomingHarvestProducts, getProductSeasonInfo, getMonthName, getCurrentMonth } from "@/lib/seasons";
import { motion } from "framer-motion";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "👋 Hello! I'm your HerBlocX AI Assistant. I can help you find the perfect herbal products, provide market insights, and answer questions about seasonal availability. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  // Load products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };
    loadProducts();
  }, []);

  const generateBuyerResponse = (input: string): string => {
    const lower = input.toLowerCase();
    const matchedProduct = products.find(
      (p) => lower.includes(p.name.toLowerCase()) || lower.includes(p.scientific_name.toLowerCase())
    );

    if (matchedProduct) {
      const avgRating = matchedProduct.reviews.length > 0
        ? (matchedProduct.reviews.reduce((s, r) => s + r.rating, 0) / matchedProduct.reviews.length).toFixed(1)
        : "No ratings yet";
      return `📦 Found "${matchedProduct.name}"! 
      
Scientific Name: ${matchedProduct.scientific_name}
Price: $${matchedProduct.price}/kg
Location: ${matchedProduct.location}
Supplier: ${matchedProduct.supplier_name}
Rating: ${avgRating}⭐
Status: ${matchedProduct.in_stock ? "✅ In Stock" : "❌ Out of Stock"}

Would you like to add this to your cart or view more details?`;
    }

    const seasonalIds = getSeasonalProductIds();
    const currentSeason = getCurrentSeason();
    const seasonalProducts = products.filter((p) => seasonalIds.includes(p.id));

    if (lower.includes("season") || lower.includes("harvest")) {
      return `🌿 Current Season: ${currentSeason.nameId}
${currentSeason.description}

📊 Seasonal Products Available:
${seasonalProducts.slice(0, 3).map((p) => `• ${p.name} - $${p.price}/kg`).join("\n")}

These products are at their peak availability and quality right now!`;
    }

    if (lower.includes("price") || lower.includes("cost")) {
      const avgPrice = (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2);
      return `💰 Market Pricing Overview:
Average Price: $${avgPrice}/kg
Price Range: $${Math.min(...products.map(p => p.price)).toFixed(2)} - $${Math.max(...products.map(p => p.price)).toFixed(2)}/kg

Top 3 Most Affordable:
${products.sort((a, b) => a.price - b.price).slice(0, 3).map((p) => `• ${p.name}: $${p.price}/kg`).join("\n")}`;
    }

    if (lower.includes("supplier") || lower.includes("seller")) {
      const topSuppliers = [...new Map(products.map((p) => [p.supplier_name, p])).values()].slice(0, 3);
      return `🏪 Top Suppliers:
${topSuppliers.map((p) => `• ${p.supplier_name} (${p.location}) - Rating: ${p.supplier_rating}⭐`).join("\n")}

All suppliers are verified and offer quality herbal products. Browse their catalogs to find the best deals!`;
    }

    if (lower.includes("help") || lower.includes("what can")) {
      return `🤖 I can help you with:
• 🔍 Find specific products by name
• 📊 Get market pricing information
• 🌿 Learn about seasonal availability
• 🏪 Discover top suppliers
• 📈 View market trends
• ❓ Answer general questions about herbal products

Just ask me anything about our marketplace!`;
    }

    return `I'm here to help! You can ask me about:
• Specific products (e.g., "Show me turmeric")
• Current season and harvest information
• Market prices and trends
• Supplier recommendations
• Product availability

What would you like to know?`;
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: generateBuyerResponse(input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col gradient-bg relative overflow-hidden">
      <Web3Background />
      <Web3Header />

      <div className="flex-1 container mx-auto px-4 py-8 pt-24 relative z-10">
        <PageTransition>
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <Link to="/buyer/dashboard" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-gradient-hero">AI Market Assistant</h1>
              </div>
              <p className="text-muted-foreground">Get personalized recommendations and market insights powered by AI</p>
            </div>

            {/* Chat Container */}
            <Card className="glass-card border-border/50 flex flex-col h-[600px]">
              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-foreground px-4 py-3 rounded-lg">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>

              {/* Input */}
              <div className="border-t border-border/50 p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask me about products, prices, seasons..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={isLoading}
                    className="bg-muted/30 border-border/50"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !input.trim()}
                    className="btn-web3"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => setInput("What products are in season now?")}
                className="p-4 rounded-lg glass border border-border/50 hover:border-primary/50 transition-colors text-left group"
              >
                <Leaf className="h-5 w-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium">Seasonal Products</p>
              </button>
              <button
                onClick={() => setInput("Show me the cheapest products")}
                className="p-4 rounded-lg glass border border-border/50 hover:border-primary/50 transition-colors text-left group"
              >
                <DollarSign className="h-5 w-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium">Best Prices</p>
              </button>
              <button
                onClick={() => setInput("Who are the top suppliers?")}
                className="p-4 rounded-lg glass border border-border/50 hover:border-primary/50 transition-colors text-left group"
              >
                <Users className="h-5 w-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium">Top Suppliers</p>
              </button>
              <button
                onClick={() => setInput("Help me find products")}
                className="p-4 rounded-lg glass border border-border/50 hover:border-primary/50 transition-colors text-left group"
              >
                <Sparkles className="h-5 w-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium">Get Help</p>
              </button>
            </div>
          </div>
        </PageTransition>
      </div>

      <Web3Footer />
    </div>
  );
};

export default AIAssistant;

// Helper function to get current season (should be imported from seasons.ts)
function getCurrentSeason() {
  const month = new Date().getMonth();
  const seasons = [
    { nameId: "Winter Harvest", description: "Peak season for dried herbs and root crops" },
    { nameId: "Spring Growth", description: "Fresh herbs and new growth" },
    { nameId: "Summer Peak", description: "Maximum availability of fresh products" },
    { nameId: "Autumn Transition", description: "Harvest season for most crops" },
  ];
  return seasons[Math.floor(month / 3)];
}
