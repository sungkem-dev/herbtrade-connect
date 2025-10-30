import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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
      return "bg-green-500/10 text-green-600 hover:bg-green-500/20";
    case "processing":
      return "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20";
    case "pending":
      return "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const BuyerRequests = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Buyer Requests</h1>
          <p className="text-muted-foreground text-lg">
            Manage your purchase requests for herbal products
          </p>
        </div>

        {mockRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockRequests.map((request, index) => (
              <Card
                key={request.id}
                className="hover:shadow-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <Badge className={getStatusColor(request.status)}>
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

                  <Button className="w-full" variant="outline">
                    View Detail
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Requests Yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't made any purchase requests yet.
              </p>
              <Link to="/shop">
                <Button>Browse Products</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BuyerRequests;
