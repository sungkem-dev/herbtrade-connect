import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, Clock, X, Loader2 } from "lucide-react";
import { fetchProducts, Product } from "@/lib/products";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SearchAutocompleteProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

// Mock products for fallback
const mockProducts: Product[] = [
  {
    id: "CL001",
    name: "Turmeric",
    scientific_name: "Curcuma longa",
    price: 12.50,
    image_url: "/turmeric.jpg",
    category: "East Java",
    location: "Malang, East Java",
    in_stock: true,
    on_sale: false,
    supplier_id: "SUP001",
    supplier_name: "Java Herbs Co.",
    supplier_location: "Malang, East Java",
    supplier_rating: 4.8,
    supplier_total_sales: 1250,
    supplier_verified: true,
    reviews: [],
    min_order_qty: 10,
    min_order_unit: "kg",
    created_at: new Date().toISOString(),
  },
  {
    id: "CV001",
    name: "Ceylon Cinnamon",
    scientific_name: "Cinnamomum verum",
    price: 18.75,
    image_url: "/cinnamon.jpg",
    category: "Middle Java",
    location: "Semarang, Middle Java",
    in_stock: true,
    on_sale: false,
    supplier_id: "SUP003",
    supplier_name: "Central Java Herbs",
    supplier_location: "Semarang, Middle Java",
    supplier_rating: 4.9,
    supplier_total_sales: 1100,
    supplier_verified: true,
    reviews: [],
    min_order_qty: 5,
    min_order_unit: "kg",
    created_at: new Date().toISOString(),
  },
  {
    id: "AP001",
    name: "Andrographis",
    scientific_name: "Andrographis paniculata",
    price: 8.75,
    image_url: "/andrographis.jpg",
    category: "West Java",
    location: "Bogor, West Java",
    in_stock: true,
    on_sale: true,
    supplier_id: "SUP002",
    supplier_name: "West Java Botanics",
    supplier_location: "Bogor, West Java",
    supplier_rating: 4.7,
    supplier_total_sales: 890,
    supplier_verified: true,
    reviews: [],
    min_order_qty: 5,
    min_order_unit: "kg",
    created_at: new Date().toISOString(),
  },
  {
    id: "PN001",
    name: "Black Pepper",
    scientific_name: "Piper nigrum",
    price: 15.50,
    image_url: "/pepper.jpg",
    category: "North Sumatra",
    location: "Medan, North Sumatra",
    in_stock: true,
    on_sale: false,
    supplier_id: "SUP001",
    supplier_name: "Java Herbs Co.",
    supplier_location: "Malang, East Java",
    supplier_rating: 4.8,
    supplier_total_sales: 1250,
    supplier_verified: true,
    reviews: [],
    min_order_qty: 10,
    min_order_unit: "kg",
    created_at: new Date().toISOString(),
  },
  {
    id: "MF001",
    name: "Nutmeg",
    scientific_name: "Myristica fragrans",
    price: 22.00,
    image_url: "/nutmeg.jpg",
    category: "South Kalimantan",
    location: "Banjarmasin, South Kalimantan",
    in_stock: true,
    on_sale: false,
    supplier_id: "SUP002",
    supplier_name: "West Java Botanics",
    supplier_location: "Bogor, West Java",
    supplier_rating: 4.7,
    supplier_total_sales: 890,
    supplier_verified: true,
    reviews: [],
    min_order_qty: 5,
    min_order_unit: "kg",
    created_at: new Date().toISOString(),
  },
];

export const SearchAutocomplete = ({ onSearch, placeholder = "Search products, suppliers..." }: SearchAutocompleteProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Popular searches mock data
  const popularSearches = ["Turmeric", "Cinnamon", "Andrographis", "Black Pepper", "Nutmeg"];

  // Load products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await fetchProducts();
        setAllProducts(products.length > 0 ? products : mockProducts);
      } catch (error) {
        console.error("Error loading products:", error);
        // Graceful fallback to mock products
        setAllProducts(mockProducts);
      }
    };
    loadProducts();
  }, []);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Filter products based on query
  useEffect(() => {
    if (query.length > 0) {
      const filtered = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.scientific_name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()) ||
          product.location.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [query, allProducts]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // Save to recent searches
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));

    setQuery(searchQuery);
    setIsOpen(false);
    onSearch?.(searchQuery);
  };

  const handleProductClick = (product: Product) => {
    handleSearch(product.name);
    navigate(`/product/${product.id}`);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
          className="pl-12 pr-4 h-12 bg-muted/30 border-border/50 rounded-xl focus:border-primary/50 focus:ring-primary/20"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/50 rounded-xl shadow-xl overflow-hidden z-50 glass-card max-h-96 overflow-y-auto"
        >
          {/* Search Results */}
          {suggestions.length > 0 && (
            <div className="p-2">
              <p className="text-xs text-muted-foreground px-3 py-2">Products</p>
              {suggestions.slice(0, 5).map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                  <img
                    src={product.image_url || "/placeholder.png"}
                    alt={product.name}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{product.scientific_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm text-primary">${product.price}</p>
                    <p className="text-xs text-muted-foreground">{product.location}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {query.length === 0 && recentSearches.length > 0 && (
            <div className="p-2 border-b border-border/30">
              <div className="flex items-center justify-between px-3 py-2">
                <p className="text-xs text-muted-foreground">Recent Searches</p>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-primary hover:underline"
                >
                  Clear
                </button>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="w-full flex items-center gap-3 p-2 px-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{search}</span>
                </button>
              ))}
            </div>
          )}

          {/* Popular Searches */}
          {query.length === 0 && (
            <div className="p-2">
              <p className="text-xs text-muted-foreground px-3 py-2">Trending</p>
              <div className="flex flex-wrap gap-2 px-3 pb-2">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border/30 hover:border-primary/30 text-sm transition-colors"
                  >
                    <TrendingUp className="h-3 w-3 text-green-400" />
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {query.length > 0 && suggestions.length === 0 && (
            <div className="p-6 text-center">
              <p className="text-muted-foreground">No products found for "{query}"</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="p-6 text-center">
              <Loader2 className="h-5 w-5 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground mt-2 text-sm">Loading products...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
