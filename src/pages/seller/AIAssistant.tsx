import { useState, useRef, useEffect, useCallback } from "react";
import { Web3Header } from "@/components/Web3Header";
import { Web3Footer } from "@/components/Web3Footer";
import { Web3Background } from "@/components/Web3Background";
import { PageTransition } from "@/components/PageTransition";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, Sparkles, TrendingUp, DollarSign, Package, BarChart3, ArrowLeft, Star, Calendar } from "lucide-react";
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

const quickActions = [
  { label: "Pricing Strategy", icon: DollarSign, query: "Pricing strategy" },
  { label: "Stock Optimization", icon: Package, query: "Stock optimization" },
  { label: "Market Trends", icon: TrendingUp, query: "Market trends" },
  { label: "Review Insights", icon: Star, query: "Review analysis" },
  { label: "Seasonal Strategy", icon: Calendar, query: "Musim saat ini" },
  { label: "Demand Analysis", icon: BarChart3, query: "Demand analysis and market overview" },
];

const SellerAIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "👋 Welcome to the AI Business Assistant! I can help you optimize pricing, manage stock, analyze reviews, and plan around seasonal trends. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const generateSellerResponse = (input: string): string => {
    const lower = input.toLowerCase();
    const avgPrice = products.length > 0 ? products.reduce((s, p) => s + p.price, 0) / products.length : 0;

    const matchedProduct = products.find(
      (p) => lower.includes(p.name.toLowerCase()) || lower.includes(p.scientific_name.toLowerCase())
    );

    if (matchedProduct) {
      const margin = matchedProduct.price * 0.15;
      const avgRating = matchedProduct.reviews.length > 0
        ? (matchedProduct.reviews.reduce((s, r) => s + r.rating, 0) / matchedProduct.reviews.length).toFixed(1)
        : "No ratings";
      const seasonInfo = getProductSeasonInfo(matchedProduct.id);
      const seasonText = seasonInfo
        ? `\n- **Harvest Season:** ${seasonInfo.harvestMonths.map(m => getMonthName(m)).join(', ')}\n- **Tip:** ${seasonInfo.harvestMonths.includes(getCurrentMonth()) ? 'Peak harvest season — high supply, tight competition' : 'Off-season — limited supply, can markup 10-15%'}`
        : '';
      return `📊 **Market Insight: ${matchedProduct.name}**\n\n` +
        `- **Current Price:** $${matchedProduct.price}/kg\n` +
        `- **Market Average:** $${avgPrice.toFixed(2)}/kg\n` +
        `- **Suggested Range:** $${(matchedProduct.price - margin).toFixed(2)} - $${(matchedProduct.price + margin).toFixed(2)}/kg\n` +
        `- **Review Score:** ⭐ ${avgRating} (${matchedProduct.reviews.length} reviews)\n` +
        `- **Demand Level:** ${matchedProduct.supplier_total_sales > 1000 ? "🔥 High" : matchedProduct.supplier_total_sales > 700 ? "📈 Medium" : "📉 Low"}\n` +
        `- **Total Market Sales:** ${matchedProduct.supplier_total_sales.toLocaleString()} units${seasonText}\n\n` +
        `💡 ${matchedProduct.price > avgPrice ? "Price above market avg. Consider competitive pricing." : "Price below avg. Room to increase margins."}`;
    }

    // Review/feedback handler
    if (lower.includes("review") || lower.includes("feedback") || lower.includes("testimoni") || lower.includes("ulasan")) {
      if (products.length === 0) return "No products available for review analysis.";
      return `⭐ **Review Analysis & Insights:**\n\n` +
        products.map(p => {
          const avg = p.reviews.length > 0 ? (p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length).toFixed(1) : "No reviews";
          const lowReviews = p.reviews.filter(r => r.rating < 4);
          const positiveRate = p.reviews.length > 0 ? ((p.reviews.filter(r => r.rating >= 4).length / p.reviews.length) * 100).toFixed(0) : "0";
          return `**${p.name}** — ⭐ ${avg} avg | ${positiveRate}% positive\n` +
            (lowReviews.length > 0
              ? `  ⚠️ Area improvement: "${lowReviews[0].comment}"\n`
              : `  ✅ All reviews positive!\n`) +
            `  📊 ${p.reviews.length} total reviews`;
        }).join("\n\n") +
        `\n\n💡 **Tips:** Quick response to negative feedback can improve rating up to 20%.`;
    }

    // Season handler
    if (lower.includes("musim") || lower.includes("season") || lower.includes("seasonal") || lower.includes("panen")) {
      const currentSeason = getCurrentSeason();
      const inSeasonIds = getSeasonalProductIds();
      const inSeasonProducts = products.filter(p => inSeasonIds.includes(p.id));
      const upcoming = getUpcomingHarvestProducts();

      return `🌿 **Seasonal Market Strategy**\n\n` +
        `📅 **${currentSeason.nameId}**\n\n` +
        `**Products in Peak Harvest:**\n` +
        (inSeasonProducts.length > 0
          ? inSeasonProducts.map(p => {
              const si = getProductSeasonInfo(p.id);
              return `- **${p.name}** — High supply, competitive pricing\n  💡 Tip: Sell fast at market price, focus on volume`;
            }).join("\n")
          : "No products in peak season currently.") +
        `\n\n**Off-Season Products (Markup Opportunity):**\n` +
        products.filter(p => !inSeasonIds.includes(p.id)).map(p =>
          `- **${p.name}** — Limited supply, can markup 10-20%`
        ).join("\n") +
        (upcoming.length > 0
          ? `\n\n**Coming Soon:**\n` + upcoming.map(u => {
              const prod = products.find(p => p.id === u.productId);
              return prod ? `- **${prod.name}** — harvest starts ${u.nextMonth}, stock up now!` : '';
            }).filter(Boolean).join("\n")
          : '') +
        `\n\n💡 Buy stock during harvest (low prices), sell during off-season (premium prices)!`;
    }

    if (lower.includes("pricing") || lower.includes("harga") || lower.includes("strategy")) {
      if (products.length === 0) return "No products available for pricing analysis.";
      return `💰 **Pricing Strategy Recommendations:**\n\n` +
        products.map(p => {
          const position = p.price > avgPrice ? "Above avg" : "Below avg";
          const avgRating = p.reviews.length > 0 ? (p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length).toFixed(1) : "No rating";
          return `- **${p.name}:** $${p.price}/kg (${position}) — ⭐ ${avgRating}\n  Suggested: $${(p.price * 0.95).toFixed(2)} - $${(p.price * 1.10).toFixed(2)}/kg`;
        }).join("\n\n") +
        `\n\n📊 **Market Average:** $${avgPrice.toFixed(2)}/kg\n` +
        `💡 Products with ⭐ 4.5+ reviews can be priced 10-15% above market.`;
    }

    if (lower.includes("stock") || lower.includes("stok") || lower.includes("optimization")) {
      if (products.length === 0) return "No products available for stock analysis.";
      const sorted = [...products].sort((a, b) => b.supplier_total_sales - a.supplier_total_sales);
      return `📦 **Stock Optimization Tips:**\n\n` +
        sorted.map((p, i) =>
          `${i + 1}. **${p.name}** — Sales velocity: ${p.supplier_total_sales.toLocaleString()} units\n   ${p.supplier_total_sales > 900 ? "🔥 High demand — increase stock" : "📈 Moderate — maintain current levels"}`
        ).join("\n\n") +
        `\n\n💡 Maintain stock at 2-3x your monthly sales volume for optimal inventory.`;
    }

    if (lower.includes("trend") || lower.includes("tren") || lower.includes("demand") || lower.includes("market")) {
      if (products.length === 0) return "No products available for trend analysis.";
      const highDemand = products.filter(p => p.supplier_total_sales > 900);
      const onSale = products.filter(p => p.on_sale);
      return `📈 **Market Trends Analysis:**\n\n` +
        `**High Demand Products:**\n` +
        (highDemand.length > 0
          ? highDemand.map(p => `- ${p.name}: ${p.supplier_total_sales.toLocaleString()} sales (⭐ ${p.supplier_rating})`).join("\n")
          : "No high-demand products currently.") +
        `\n\n**Currently on Sale:** ${onSale.length} products\n` +
        (onSale.length > 0
          ? onSale.map(p => `- ${p.name} at $${p.price}/kg`).join("\n")
          : "No products on sale.") +
        `\n\n**Category Demand:**\n` +
        [...new Set(products.map(p => p.category))].map(cat => {
          const catProducts = products.filter(p => p.category === cat);
          const totalSales = catProducts.reduce((s, p) => s + p.supplier_total_sales, 0);
          return `- ${cat}: ${totalSales.toLocaleString()} total sales`;
        }).join("\n") +
        `\n\n💡 Focus on high-demand categories and products with strong sales velocity.`;
    }

    return `👋 Hi! I'm your AI business assistant. I can help you with:\n\n` +
      `- **Pricing strategy** — type "pricing"\n` +
      `- **Stock optimization** — type "stock"\n` +
      `- **Market trends** — type "trend"\n` +
      `- **Review insights** — type "review"\n` +
      `- **Seasonal strategy** — type "musim"\n` +
      `- **Product insights** — type a product name (e.g., "Turmeric")\n\n` +
      `Try one of the quick actions on the left! 👈`;
  };

  const handleSend = useCallback((text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: msg,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateSellerResponse(msg);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  }, [input, products]);

  const renderText = (text: string) => {
    return text.split("\n").map((line, i) => {
      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return (
        <span key={i}>
          <span dangerouslySetInnerHTML={{ __html: formatted }} />
          {i < text.split("\n").length - 1 && <br />}
        </span>
      );
    });
  };

  const avgPrice = products.length > 0 ? (products.reduce((s, p) => s + p.price, 0) / products.length).toFixed(2) : "0";
  const totalProducts = products.length;
  const totalSales = products.reduce((s, p) => s + p.supplier_total_sales, 0);
  const highDemandCount = products.filter(p => p.supplier_total_sales > 900).length;
  const currentSeason = getCurrentSeason();

  return (
    <div className="min-h-screen gradient-bg relative">
      <Web3Background />
      <Web3Header />
      <PageTransition>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/seller/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-secondary/20 rounded-xl glow-secondary">
                <Bot className="h-7 w-7 text-secondary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">AI Business Assistant</h1>
                <p className="text-sm text-muted-foreground">Smart insights for pricing, stock & market trends</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" style={{ minHeight: "65vh" }}>
            <div className="lg:col-span-1 space-y-4">
              <Card className="glass-card border-border/50">
                <CardContent className="pt-5 space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</h3>
                  {quickActions.map((action) => (
                    <Button key={action.label} variant="ghost" className="w-full justify-start text-left h-auto py-2 px-3 hover:bg-primary/10" onClick={() => handleSend(action.query)}>
                      <action.icon className="h-4 w-4 mr-2 flex-shrink-0 text-primary" />
                      <span className="text-xs">{action.label}</span>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card className="glass-card border-border/50">
                <CardContent className="pt-5 space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Market Overview</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Products:</span>
                      <span className="font-semibold">{totalProducts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg Price:</span>
                      <span className="font-semibold">${avgPrice}/kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Sales:</span>
                      <span className="font-semibold">{totalSales.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">High Demand:</span>
                      <span className="font-semibold text-green-500">{highDemandCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current Season:</span>
                      <span className="font-semibold text-primary">{currentSeason.nameId}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Card className="glass-card border-border/50 h-full flex flex-col">
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((msg) => (
                    <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-md px-4 py-3 rounded-lg ${msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                        <p className="text-sm">{renderText(msg.text)}</p>
                        <p className="text-xs mt-1 opacity-70">{msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
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
                </div>

                <div className="border-t border-border/50 p-4">
                  <div className="flex gap-2">
                    <Input placeholder="Ask me anything..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleSend()} disabled={isTyping} className="bg-muted/30 border-border/50" />
                    <Button onClick={() => handleSend()} disabled={isTyping || !input.trim()} className="btn-web3">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </PageTransition>
      <Web3Footer />
    </div>
  );
};

export default SellerAIAssistant;

// Helper function to get current season
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
