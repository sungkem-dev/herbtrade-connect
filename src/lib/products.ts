import { supabase } from "@/integrations/supabase/client";
import { Tables, Enums } from "@/integrations/supabase/types";

export type ProductReview = Tables<"product_reviews"> & {
  reviewer_name: string;
};

export type Product = Tables<"products"> & {
  supplier_name: string;
  supplier_location: string;
  supplier_rating: number;
  supplier_total_sales: number;
  supplier_verified: boolean;
  reviews: ProductReview[];
};

export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      suppliers:profiles!products_supplier_id_fkey(
        name,
        country,
        kyc_status
      ),
      reviews:product_reviews(
        *,
        reviewer:profiles!product_reviews_user_id_fkey(
          name
        )
      )
    `);

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data.map((product: any) => ({
    ...product,
    supplier_name: product.suppliers?.name || "Unknown Supplier",
    supplier_location: product.suppliers?.country || "Unknown",
    supplier_rating: 4.5, // Mock rating for now, as it's not in schema
    supplier_total_sales: 0, // Mock for now
    supplier_verified: product.suppliers?.kyc_status === "verified",
    reviews: product.reviews.map((review: any) => ({
      ...review,
      reviewer_name: review.reviewer?.name || "Anonymous",
    })),
  }));
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      suppliers:profiles!products_supplier_id_fkey(
        name,
        country,
        kyc_status
      ),
      reviews:product_reviews(
        *,
        reviewer:profiles!product_reviews_user_id_fkey(
          name
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }

  return {
    ...data,
    supplier_name: data.suppliers?.name || "Unknown Supplier",
    supplier_location: data.suppliers?.country || "Unknown",
    supplier_rating: 4.5, // Mock rating for now
    supplier_total_sales: 0, // Mock for now
    supplier_verified: data.suppliers?.kyc_status === "verified",
    reviews: data.reviews.map((review: any) => ({
      ...review,
      reviewer_name: review.reviewer?.name || "Anonymous",
    })),
  };
};

export const addProductReview = async (productId: string, userId: string, rating: number, comment: string) => {
  const { data, error } = await supabase
    .from("product_reviews")
    .insert({
      product_id: productId,
      user_id: userId,
      rating,
      comment,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const categories = [
  'East Java',
  'West Java',
  'Middle Java',
  'North Sumatra',
  'South Kalimantan'
];

// Legacy mock data kept for AI assistants & components that haven't been
// migrated to the async Supabase fetchers yet. Shape matches the pre-migration
// nested structure (supplier.*, minOrder, specifications.*).
export interface LegacyProduct {
  id: string;
  name: string;
  scientificName: string;
  price: number;
  image: string;
  category: string;
  location: string;
  inStock: boolean;
  onSale: boolean;
  description: string;
  minOrder: { quantity: number; unit: string };
  specifications: {
    essentialOil?: string;
    curcumin?: string;
    packing: string;
    effectiveIngredients: string;
    certificate: string;
    model: string;
    casNo: string;
  };
  cultivationArea: string;
  supplier: {
    id: string;
    name: string;
    location: string;
    rating: number;
    totalSales: number;
    stock: number;
    verified: boolean;
  };
  reviews: { user: string; rating: number; comment: string; date: string }[];
}

export const products: LegacyProduct[] = [
  { id: 'CL001', name: 'Turmeric', scientificName: 'Curcuma longa', price: 9.99, image: '/turmeric.jpg', category: 'East Java', location: 'Malang, East Java', inStock: true, onSale: true, description: 'Premium turmeric simplisia from East Java.', minOrder: { quantity: 100, unit: 'Kilogram' }, specifications: { essentialOil: '1.85% v/b', curcumin: '3.82%', packing: '25kg/fiber drum', effectiveIngredients: 'Curcumin', certificate: 'ISO9001, GMP', model: 'HK120095', casNo: '458-37-7' }, cultivationArea: 'East Java - Malang', supplier: { id: 'SUP001', name: 'Java Herbs Co.', location: 'Malang, East Java', rating: 4.8, totalSales: 1250, stock: 5000, verified: true }, reviews: [] },
  { id: 'AP001', name: 'Andrographis', scientificName: 'Andrographis paniculata', price: 12.50, image: '/andrographis.jpg', category: 'West Java', location: 'Bogor, West Java', inStock: true, onSale: false, description: 'High-quality Andrographis paniculata.', minOrder: { quantity: 50, unit: 'Kilogram' }, specifications: { packing: '20kg/carton', effectiveIngredients: 'Andrographolide', certificate: 'ISO9001, GMP, BPOM', model: 'HK120096', casNo: '5508-58-7' }, cultivationArea: 'West Java - Bogor', supplier: { id: 'SUP002', name: 'West Java Botanics', location: 'Bogor, West Java', rating: 4.7, totalSales: 890, stock: 3200, verified: true }, reviews: [] },
  { id: 'CV001', name: 'Ceylon Cinnamon', scientificName: 'Cinnamomum verum', price: 15.99, image: '/cinnamon.jpg', category: 'Middle Java', location: 'Semarang, Middle Java', inStock: true, onSale: true, description: 'Premium Ceylon cinnamon bark.', minOrder: { quantity: 200, unit: 'Kilogram' }, specifications: { packing: '15kg/box', effectiveIngredients: 'Cinnamaldehyde', certificate: 'ISO9001, Organic, Halal', model: 'HK120097', casNo: '8015-91-6' }, cultivationArea: 'Middle Java - Semarang', supplier: { id: 'SUP003', name: 'Central Java Herbs', location: 'Semarang, Middle Java', rating: 4.9, totalSales: 1100, stock: 4500, verified: true }, reviews: [] },
  { id: 'PN001', name: 'Black Pepper', scientificName: 'Piper nigrum', price: 18.75, image: '/blackpaper.jpg', category: 'North Sumatra', location: 'Medan, North Sumatra', inStock: true, onSale: false, description: 'Premium black pepper.', minOrder: { quantity: 500, unit: 'Kilogram' }, specifications: { packing: '25kg/bag', effectiveIngredients: 'Piperine', certificate: 'ISO9001, GMP, Phytosanitary', model: 'HK120098', casNo: '84929-31-7' }, cultivationArea: 'North Sumatra - Medan', supplier: { id: 'SUP004', name: 'Sumatra Spices', location: 'Medan, North Sumatra', rating: 4.6, totalSales: 780, stock: 2800, verified: true }, reviews: [] },
  { id: 'MF001', name: 'Nutmeg', scientificName: 'Myristica fragrans', price: 22.50, image: '/Nutmeg.jpg', category: 'South Kalimantan', location: 'Banjarmasin, South Kalimantan', inStock: true, onSale: true, description: 'High-quality nutmeg.', minOrder: { quantity: 100, unit: 'Box' }, specifications: { packing: '20kg/carton', effectiveIngredients: 'Myristicin', certificate: 'ISO9001, GMP, Halal', model: 'HK120099', casNo: '8008-45-5' }, cultivationArea: 'South Kalimantan - Banjarmasin', supplier: { id: 'SUP005', name: 'Kalimantan Natural', location: 'Banjarmasin, South Kalimantan', rating: 4.5, totalSales: 650, stock: 2100, verified: false }, reviews: [] },
];

