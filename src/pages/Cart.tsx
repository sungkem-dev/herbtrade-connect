import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Wallet, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const Cart = () => {
  const [selectedPayment, setSelectedPayment] = useState<string>('');

  // Mock order data
  const orders = [
    {
      id: 1,
      product: 'Curcuma longa (Turmeric)',
      scientificName: 'Curcuma longa simplisia',
      price: 9.99,
      quantity: 2,
      image: '/turmeric.jpg'
    },
    {
      id: 2,
      product: 'Andrographis',
      scientificName: 'Andrographis paniculata',
      price: 12.50,
      quantity: 1,
      image: '/andrographis.jpg'
    },
    {
      id: 3,
      product: 'Ceylon Cinnamon',
      scientificName: 'Cinnamomum verum',
      price: 15.99,
      quantity: 3,
      image: '/cinnamon.jpg'
    }
  ];

  const totalAmount = orders.reduce((sum, order) => sum + (order.price * order.quantity), 0);

  const handlePayment = () => {
    if (!selectedPayment) {
      toast.error("Please select a payment method");
      return;
    }
    toast.success(`Payment initiated via ${selectedPayment}!`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-3 mb-2">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold animate-fade-in">Daftar Pesanan</h1>
            </div>
            <p className="text-muted-foreground">Review your orders and proceed to payment</p>
          </div>
        </section>

        {/* Orders List */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Order Items */}
              <div className="lg:col-span-2 space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="animate-fade-in hover-scale">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <img 
                          src={order.image} 
                          alt={order.product}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{order.product}</h3>
                          <p className="text-sm text-muted-foreground italic mb-3">{order.scientificName}</p>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm text-muted-foreground">Quantity: {order.quantity}</span>
                              <p className="text-2xl font-bold text-primary mt-1">${(order.price * order.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary & Payment */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4 animate-scale-in">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                    <CardDescription>Total amount for {orders.length} items</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>$5.00</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-primary">${(totalAmount + 5).toFixed(2)}</span>
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full" size="lg">
                          Lanjutkan Pembayaran
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Choose Payment Method</DialogTitle>
                          <DialogDescription>
                            Select your preferred payment method to complete the transaction
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-4">
                          {/* Total Amount Display */}
                          <div className="bg-muted/50 rounded-lg p-4 text-center">
                            <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                            <p className="text-3xl font-bold text-primary">${(totalAmount + 5).toFixed(2)}</p>
                          </div>

                          {/* Crypto Wallets */}
                          <div className="space-y-3">
                            <p className="font-semibold text-sm">Crypto Wallet</p>
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                onClick={() => setSelectedPayment('MetaMask')}
                                className={`p-4 border-2 rounded-lg hover:bg-muted transition-colors ${
                                  selectedPayment === 'MetaMask' ? 'border-primary bg-primary/10' : 'border-border'
                                }`}
                              >
                                <Wallet className="h-8 w-8 mx-auto mb-2 text-primary" />
                                <p className="font-semibold text-sm">MetaMask</p>
                              </button>
                              <button
                                onClick={() => setSelectedPayment('TrustWallet')}
                                className={`p-4 border-2 rounded-lg hover:bg-muted transition-colors ${
                                  selectedPayment === 'TrustWallet' ? 'border-primary bg-primary/10' : 'border-border'
                                }`}
                              >
                                <Wallet className="h-8 w-8 mx-auto mb-2 text-primary" />
                                <p className="font-semibold text-sm">TrustWallet</p>
                              </button>
                            </div>
                          </div>

                          <Separator />

                          {/* Bank Transfer */}
                          <div className="space-y-3">
                            <p className="font-semibold text-sm">Bank Transfer</p>
                            <button
                              onClick={() => setSelectedPayment('Bank Transfer')}
                              className={`w-full p-4 border-2 rounded-lg hover:bg-muted transition-colors ${
                                selectedPayment === 'Bank Transfer' ? 'border-primary bg-primary/10' : 'border-border'
                              }`}
                            >
                              <CreditCard className="h-8 w-8 mx-auto mb-2 text-primary" />
                              <p className="font-semibold">Bank Transfer</p>
                              <p className="text-xs text-muted-foreground mt-1">Via bank account</p>
                            </button>
                          </div>

                          <Button 
                            onClick={handlePayment} 
                            className="w-full" 
                            size="lg"
                            disabled={!selectedPayment}
                          >
                            Bayar Sekarang
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
