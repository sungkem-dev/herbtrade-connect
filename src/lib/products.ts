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
