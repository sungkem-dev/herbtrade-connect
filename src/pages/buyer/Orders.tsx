import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package } from "lucide-react";

const mockOrders = [
  {
    id: "ORD-001",
    productName: "Jahe Merah Premium",
    date: "2025-01-10",
    price: "$ 9.99",
    status: "delivered",
  },
  {
    id: "ORD-002",
    productName: "Kunyit Organik",
    date: "2025-01-08",
    price: "$ 40",
    status: "shipped",
  },
  {
    id: "ORD-003",
    productName: "Temulawak Kering",
    date: "2025-01-05",
    price: "$ 62,5",
    status: "processing",
  },
  {
    id: "ORD-004",
    productName: "Lengkuas Segar",
    date: "2025-01-03",
    price: "$ 5",
    status: "delivered",
  },
  {
    id: "ORD-005",
    productName: "Kencur Premium",
    date: "2024-12-28",
    price: "$ 3.5",
    status: "delivered",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-500/10 text-green-600 hover:bg-green-500/20";
    case "shipped":
      return "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20";
    case "processing":
      return "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const BuyerOrders = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Order History</h1>
          <p className="text-muted-foreground text-lg">
            Track and review your past orders
          </p>
        </div>

        {mockOrders.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <Card className="hidden md:block animate-fade-in">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockOrders.map((order) => (
                      <TableRow
                        key={order.id}
                        className="hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.productName}</TableCell>
                        <TableCell>
                          {new Date(order.date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="font-semibold">{order.price}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {mockOrders.map((order, index) => (
                <Card
                  key={order.id}
                  className="hover:shadow-lg transition-all duration-300 animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Order ID
                        </p>
                        <p className="font-semibold">{order.id}</p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Product</p>
                        <p className="font-medium">{order.productName}</p>
                      </div>

                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Date</p>
                          <p className="text-sm">
                            {new Date(order.date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Price</p>
                          <p className="font-semibold text-primary">
                            {order.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
              <p className="text-muted-foreground">
                Your order history will appear here once you make a purchase.
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BuyerOrders;
