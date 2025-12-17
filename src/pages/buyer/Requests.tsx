import { Web3Header } from "@/components/Web3Header";
import { Web3Footer } from "@/components/Web3Footer";
import { Web3Background } from "@/components/Web3Background";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { Link } from "react-router-dom";

const mockRequests = [
  {
    id: 1,
    productName: "Jahe Merah Premium",
    quantity: "50 kg",
    status: "pending",
    requestDate: "2025-02-15",
  },
  {
    id: 2,
    productName: "Kunyit Organik",
    quantity: "30 kg",
    status: "approved",
    requestDate: "2025-03-14",
  },
  {
    id: 3,
    productName: "Temulawak Kering",
    quantity: "25 kg",
    status: "processing",
    requestDate: "2025-01-13",
  },
  {
    id: 4,
    productName: "Lengkuas Segar",
    quantity: "40 kg",
    status: "pending",
    requestDate: "2025-11-12",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "status-success";
    case "processing":
      return "status-pending";
    case "pending":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const BuyerRequests = () => {
  return (
    <div className="min-h-screen flex flex-col gradient-bg relative overflow-hidden">
      <Web3Background />
      <Web3Header />

      <main className="flex-1 container mx-auto px-4 py-8 pt-24 relative z-10">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2 text-gradient-hero">Buyer Requests</h1>
          <p className="text-muted-foreground text-lg">
            Manage your purchase requests for herbal products
          </p>
        </div>

        {mockRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockRequests.map((request, index) => (
              <Card
                key={request.id}
                className="glass-card border-border/50 card-hover animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-primary/20 rounded-lg glow-primary">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="outline" className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-lg mb-2">
                    {request.productName}
                  </h3>

                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <p>
                      <span className="font-medium text-foreground">Quantity:</span>{" "}
                      {request.quantity}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">Date:</span>{" "}
                      {new Date(request.requestDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <Button className="w-full btn-web3-outline">
                    View Detail
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="glass-card border-border/50">
            <CardContent className="py-12 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Requests Yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't made any purchase requests yet.
              </p>
              <Link to="/shop">
                <Button className="btn-web3">Browse Products</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>

      <Web3Footer />
    </div>
  );
};

export default BuyerRequests;