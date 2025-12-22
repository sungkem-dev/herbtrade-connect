import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Supplier from "./pages/Supplier";

import Tracking from "./pages/Tracking";
import BuyerDashboard from "./pages/buyer/Dashboard";
import BuyerRequests from "./pages/buyer/Requests";
import BuyerOrders from "./pages/buyer/Orders";
import SellerDashboard from "./pages/seller/Dashboard";
import SellerProducts from "./pages/seller/Products";
import AddProduct from "./pages/seller/AddProduct";
import SellerOrders from "./pages/seller/Orders";
import SellerAnalytics from "./pages/seller/Analytics";
import SellerWithdraw from "./pages/seller/Withdraw";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/supplier/:id" element={<Supplier />} />
            <Route path="/cart" element={<BuyerRequests />} />
            <Route path="/tracking/:orderId" element={<Tracking />} />
            <Route path="/tracking" element={<Tracking />} />
            <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
            <Route path="/buyer/requests" element={<BuyerRequests />} />
            <Route path="/buyer/orders" element={<BuyerOrders />} />
            <Route path="/seller/dashboard" element={<SellerDashboard />} />
            <Route path="/seller/products" element={<SellerProducts />} />
            <Route path="/seller/add-product" element={<AddProduct />} />
            <Route path="/seller/orders" element={<SellerOrders />} />
            <Route path="/seller/analytics" element={<SellerAnalytics />} />
            <Route path="/seller/withdraw" element={<SellerWithdraw />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
