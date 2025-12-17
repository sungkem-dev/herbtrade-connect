import { Web3Header } from "@/components/Web3Header";
import { Web3Footer } from "@/components/Web3Footer";
import { Web3Background } from "@/components/Web3Background";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, CheckCircle, Clock, MapPin, ArrowRightLeft } from "lucide-react";

const Tracking = () => {
  const trackingData = {
    orderId: "0x8f4e...3a2b",
    product: "Curcuma longa (turmeric)",
    price: "125.50 USDT",
    status: "Delivering",
    location: "At Sea",
    daysAhead: 4,
    estimation: "On Time",
    expectedDate: "Mon 16th",
    timeline: [
      { step: "Order Confirmed", date: "Jan 10, 2024", completed: true },
      { step: "Shipped", date: "Jan 12, 2024", completed: true },
      { step: "Out For Delivery", date: "Jan 15, 2024", completed: true },
      { step: "Delivered", date: "Jan 16, 2024", completed: false }
    ],
    detailedTracking: [
      { step: "Empty Pickup", place: "Jakarta Port", initialDate: "Jan 10", date: "Jan 10", delay: "0 days" },
      { step: "Door Pickup", place: "Supplier Warehouse", initialDate: "Jan 10", date: "Jan 10", delay: "0 days" },
      { step: "Gate In", place: "Jakarta Port", initialDate: "Jan 11", date: "Jan 11", delay: "0 days" },
      { step: "Vessel Loaded", place: "Jakarta Port", initialDate: "Jan 12", date: "Jan 12", delay: "0 days" },
      { step: "Vessel Departure", place: "Jakarta Port", initialDate: "Jan 12", date: "Jan 12", delay: "0 days" }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col gradient-bg relative overflow-hidden">
      <Web3Background />
      <Web3Header />

      <div className="flex-1 container mx-auto px-4 py-8 pt-24 relative z-10">
        <h1 className="text-4xl font-bold mb-8 text-gradient-hero animate-fade-in">Track Your Shipment</h1>

        {/* Order Summary */}
        <Card className="mb-8 glass-card border-border/50 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">{trackingData.product}</h2>
                <p className="text-muted-foreground font-mono">TX: {trackingData.orderId}</p>
                <p className="text-xl font-semibold text-primary mt-2">{trackingData.price}</p>
              </div>
              <div className="text-right">
                <Badge className="mb-2 status-pending">{trackingData.status}</Badge>
                <p className="text-sm text-muted-foreground">{trackingData.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Overview */}
        <Card className="mb-8 glass-card border-border/50 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Clock className="h-8 w-8 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Days Ahead</p>
                  <p className="text-2xl font-bold">{trackingData.daysAhead}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Final Estimation</p>
                  <p className="text-2xl font-bold">{trackingData.estimation}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
                <div className="p-3 bg-primary/20 rounded-lg">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expected by</p>
                  <p className="text-2xl font-bold">{trackingData.expectedDate}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="mb-8 glass-card border-border/50 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5 text-primary" />
              Shipment Timeline
            </h3>
            <div className="space-y-8">
              {trackingData.timeline.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 animate-fade-in" style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    item.completed ? 'bg-green-500/20 text-green-400 glow-primary' : 'bg-muted/50 text-muted-foreground'
                  }`}>
                    {item.completed ? <CheckCircle className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${item.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {item.step}
                    </p>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Tracking Table */}
        <Card className="glass-card border-border/50 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-6">Detailed Tracking History</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Tracking Step</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Event Place</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Initial Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Delay</th>
                  </tr>
                </thead>
                <tbody>
                  {trackingData.detailedTracking.map((item, index) => (
                    <tr key={index} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">{item.step}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{item.place}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{item.initialDate}</td>
                      <td className="py-3 px-4">{item.date}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="status-success">
                          {item.delay}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Web3Footer />
    </div>
  );
};

export default Tracking;