import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Order {
  id: string;
  product: string;
  customer: string;
  date: string;
  amount: string;
  payment: string;
  status: 'Delivered' | 'Canceled' | 'Process';
}

const ordersData: Order[] = [
  { id: '#20462', product: 'Jahe', customer: 'Matt Dickerson', date: '13/05/2022', amount: '$90', payment: 'Transfer Bank', status: 'Delivered' },
  { id: '#18933', product: 'Kunyit', customer: 'Wiktoria', date: '22/05/2022', amount: '$150', payment: 'Transfer Bank', status: 'Delivered' },
  { id: '#45169', product: 'Jahe', customer: 'Trixia Raya', date: '15/06/2022', amount: '$200', payment: 'E-Wallet', status: 'Process' },
  { id: '#34304', product: 'Kayu Manis', customer: 'Jamie Morrison', date: '08/05/2022', amount: '$80', payment: 'Transfer Bank', status: 'Delivered' },
  { id: '#17188', product: 'Lada Hitam', customer: 'Robert Levy', date: '30/04/2022', amount: '$120', payment: 'Transfer Bank', status: 'Canceled' },
  { id: '#73003', product: 'Pala', customer: 'Noel Baldwin', date: '15/04/2022', amount: '$95', payment: 'E-Wallet', status: 'Delivered' },
  { id: '#58825', product: 'Jahe', customer: 'Zaire Saris', date: '22/03/2022', amount: '$110', payment: 'Transfer Bank', status: 'Delivered' },
  { id: '#44122', product: 'Kunyit', customer: 'Michael Jenkins', date: '03/03/2022', amount: '$75', payment: 'Transfer Bank', status: 'Delivered' },
  { id: '#89094', product: 'Kayu Manis', customer: 'Tyler Moran', date: '01/02/2022', amount: '$140', payment: 'Transfer Bank', status: 'Delivered' },
  { id: '#76147', product: 'Lada Hitam', customer: 'Liam Melon', date: '19/01/2022', amount: '$160', payment: 'E-Wallet', status: 'Delivered' }
];

const SellerOrders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('10');

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return 'bg-success text-white';
      case 'Canceled':
        return 'bg-destructive text-white';
      case 'Process':
        return 'bg-warning text-white';
    }
  };

  const filteredOrders = ordersData.filter(order =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">Orders Tracking</h1>
        <p className="text-muted-foreground mb-8">View Your Orders Tracking!</p>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show</span>
                <Select value={entriesPerPage} onValueChange={setEntriesPerPage}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">entries</span>
              </div>

              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="md:w-[300px]"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Tracking ID</th>
                    <th className="text-left py-3 px-4 font-semibold">Product</th>
                    <th className="text-left py-3 px-4 font-semibold">Customer</th>
                    <th className="text-left py-3 px-4 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 font-semibold">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold">Payment</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{order.id}</td>
                      <td className="py-3 px-4">{order.product}</td>
                      <td className="py-3 px-4">{order.customer}</td>
                      <td className="py-3 px-4">{order.date}</td>
                      <td className="py-3 px-4 font-semibold">{order.amount}</td>
                      <td className="py-3 px-4">{order.payment}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-6">
              <p className="text-sm text-muted-foreground">
                Showing 1 to {filteredOrders.length} of {ordersData.length} entries
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default SellerOrders;
