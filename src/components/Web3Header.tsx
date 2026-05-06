import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut, User } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Web3Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use the useAuth hook for real-time auth state updates
  const { user, loading } = useAuth();
  
  // Determine dashboard path based on user role
  const dashboardPath = user?.roles && user.roles.length > 0 
    ? user.roles.includes("seller") 
      ? "/seller/dashboard" 
      : user.roles.includes("buyer")
      ? "/buyer/dashboard"
      : "/kyc"
    : "/kyc";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: sectionId } });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsOpen(false);
  };

  const navLinks = [
    { href: "/shop", label: "Marketplace", isScroll: false },
    { href: "/community", label: "Community", isScroll: false },
    { id: "about", label: "About", isScroll: true },
    { id: "contact", label: "Contact", isScroll: true },
  ];

  // Determine user display name and role label
  const getUserDisplayName = () => {
    if (loading) return "Loading...";
    if (!user) return "Login";
    return user.name || user.email?.split("@")[0] || "Profile";
  };

  const getRoleLabel = () => {
    if (!user?.roles || user.roles.length === 0) return "General";
    if (user.roles.includes("seller")) return "Seller";
    if (user.roles.includes("buyer")) return "Buyer";
    return "General";
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/50"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img src="/icon.png" alt="HerBlocX" className="h-8 w-6" />
              <span className="text-xl font-bold text-gradient-hero">HerBlocX</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) =>
                link.isScroll ? (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id!)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href!}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle />
              {loading ? (
                <Button variant="outline" disabled className="btn-web3-outline gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  Loading...
                </Button>
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="btn-web3-outline gap-2">
                      <User className="h-4 w-4" />
                      {user.name || user.email?.split("@")[0] || "Profile"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass">
                    <div className="px-2 py-1.5 text-xs text-muted-foreground">
                      Role: {getRoleLabel()}
                    </div>
                    <DropdownMenuItem asChild>
                      <Link to={dashboardPath}>
                        {user.roles && user.roles.length > 0 ? "Dashboard" : "Start KYC"}
                      </Link>
                    </DropdownMenuItem>
                    {user.roles?.includes("seller") && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/seller/compliance-onboarding">Compliance Onboarding</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/seller/qr-compliance">QR Compliance</Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    {user.roles?.includes("buyer") && (
                      <DropdownMenuItem asChild>
                        <Link to="/buyer/compliance-history">Verification History</Link>
                      </DropdownMenuItem>
                    )}
                    {(!user.roles || user.roles.length === 0) && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/kyc?role=seller">Upgrade as Seller</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/kyc?role=buyer">Upgrade as Buyer</Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login">
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                    Login
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="glass w-[300px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) =>
                    link.isScroll ? (
                      <button
                        key={link.id}
                        onClick={() => scrollToSection(link.id!)}
                        className="text-lg hover:text-primary transition-colors text-left"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link
                        key={link.href}
                        to={link.href!}
                        onClick={() => setIsOpen(false)}
                        className="text-lg hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    )
                  )}
                  <div className="border-t border-border pt-4 mt-4 space-y-4">
                    <ThemeToggle showLabel className="w-full" />
                    {loading ? (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                        Loading...
                      </div>
                    ) : user ? (
                      <>
                        <div className="text-xs text-muted-foreground">
                          Role: {getRoleLabel()}
                        </div>
                        <Link
                          to={dashboardPath}
                          onClick={() => setIsOpen(false)}
                          className="block text-lg hover:text-primary transition-colors"
                        >
                          {user.roles && user.roles.length > 0 ? "Dashboard" : "Start KYC"}
                        </Link>
                        {user.roles?.includes("seller") && (
                          <>
                            <Link
                              to="/seller/compliance-onboarding"
                              onClick={() => setIsOpen(false)}
                              className="block text-lg hover:text-primary transition-colors"
                            >
                              Compliance Onboarding
                            </Link>
                            <Link
                              to="/seller/qr-compliance"
                              onClick={() => setIsOpen(false)}
                              className="block text-lg hover:text-primary transition-colors"
                            >
                              QR Compliance
                            </Link>
                          </>
                        )}
                        {user.roles?.includes("buyer") && (
                          <Link
                            to="/buyer/compliance-history"
                            onClick={() => setIsOpen(false)}
                            className="block text-lg hover:text-primary transition-colors"
                          >
                            Verification History
                          </Link>
                        )}
                        {(!user.roles || user.roles.length === 0) && (
                          <>
                            <Link
                              to="/kyc?role=seller"
                              onClick={() => setIsOpen(false)}
                              className="block text-lg hover:text-primary transition-colors"
                            >
                              Upgrade as Seller
                            </Link>
                            <Link
                              to="/kyc?role=buyer"
                              onClick={() => setIsOpen(false)}
                              className="block text-lg hover:text-primary transition-colors"
                            >
                              Upgrade as Buyer
                            </Link>
                          </>
                        )}
                        <Button onClick={handleLogout} variant="destructive" className="w-full">
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </>
                    ) : (
                      <Link to="/login" onClick={() => setIsOpen(false)} className="block">
                        <Button variant="outline" className="w-full">
                          Login
                        </Button>
                      </Link>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
};
