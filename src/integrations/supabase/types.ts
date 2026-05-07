export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      buyer_kyc: {
        Row: {
          created_at: string
          import_destination: string | null
          legal_name: string | null
          nib: string | null
          npwp: string | null
          preferred_origin: string | null
          purchase_volume_kg: number | null
          simplisia_needed: string[] | null
          user_id: string
        }
        Insert: {
          created_at?: string
          import_destination?: string | null
          legal_name?: string | null
          nib?: string | null
          npwp?: string | null
          preferred_origin?: string | null
          purchase_volume_kg?: number | null
          simplisia_needed?: string[] | null
          user_id: string
        }
        Update: {
          created_at?: string
          import_destination?: string | null
          legal_name?: string | null
          nib?: string | null
          npwp?: string | null
          preferred_origin?: string | null
          purchase_volume_kg?: number | null
          simplisia_needed?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "buyer_kyc_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "buyer_kyc_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      buyer_requests: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          buyer_id: string
          category: string | null
          created_at: string
          description: string | null
          id: string
          product_name: string
          quantity: number | null
          status: Database["public"]["Enums"]["request_status"]
          unit: string | null
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          buyer_id: string
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          product_name: string
          quantity?: number | null
          status?: Database["public"]["Enums"]["request_status"]
          unit?: string | null
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          buyer_id?: string
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          product_name?: string
          quantity?: number | null
          status?: Database["public"]["Enums"]["request_status"]
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buyer_requests_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "buyer_requests_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity: number
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          post_id: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          post_id: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          block_number: number | null
          buyer_id: string
          created_at: string
          from_addr: string | null
          gas_price: number | null
          gas_used: number | null
          id: string
          payment_method: string | null
          price_per_unit: number
          product_id: string
          quantity: number
          seller_id: string
          status: Database["public"]["Enums"]["order_status"]
          to_addr: string | null
          total: number
          tx_hash: string | null
        }
        Insert: {
          block_number?: number | null
          buyer_id: string
          created_at?: string
          from_addr?: string | null
          gas_price?: number | null
          gas_used?: number | null
          id?: string
          payment_method?: string | null
          price_per_unit: number
          product_id: string
          quantity: number
          seller_id: string
          status?: Database["public"]["Enums"]["order_status"]
          to_addr?: string | null
          total: number
          tx_hash?: string | null
        }
        Update: {
          block_number?: number | null
          buyer_id?: string
          created_at?: string
          from_addr?: string | null
          gas_price?: number | null
          gas_used?: number | null
          id?: string
          payment_method?: string | null
          price_per_unit?: number
          product_id?: string
          quantity?: number
          seller_id?: string
          status?: Database["public"]["Enums"]["order_status"]
          to_addr?: string | null
          total?: number
          tx_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          likes_count: number | null
          media_type: string | null
          media_url: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          likes_count?: number | null
          media_type?: string | null
          media_url?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          likes_count?: number | null
          media_type?: string | null
          media_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      product_batches: {
        Row: {
          batch_code: string
          created_at: string
          eudr_data: Json | null
          export_destination: string | null
          farmer_id: string | null
          fda_data: Json | null
          harvest_date: string | null
          id: string
          jas_data: Json | null
          packaging: string | null
          processing_facility: string | null
          product_name: string
          qr_target_url: string | null
          quality_tests: Json | null
          quantity_kg: number | null
          scan_count: number | null
          shipping_timeline: Json | null
          simplisia_type: string | null
          tx_hash: string | null
        }
        Insert: {
          batch_code: string
          created_at?: string
          eudr_data?: Json | null
          export_destination?: string | null
          farmer_id?: string | null
          fda_data?: Json | null
          harvest_date?: string | null
          id?: string
          jas_data?: Json | null
          packaging?: string | null
          processing_facility?: string | null
          product_name: string
          qr_target_url?: string | null
          quality_tests?: Json | null
          quantity_kg?: number | null
          scan_count?: number | null
          shipping_timeline?: Json | null
          simplisia_type?: string | null
          tx_hash?: string | null
        }
        Update: {
          batch_code?: string
          created_at?: string
          eudr_data?: Json | null
          export_destination?: string | null
          farmer_id?: string | null
          fda_data?: Json | null
          harvest_date?: string | null
          id?: string
          jas_data?: Json | null
          packaging?: string | null
          processing_facility?: string | null
          product_name?: string
          qr_target_url?: string | null
          quality_tests?: Json | null
          quantity_kg?: number | null
          scan_count?: number | null
          shipping_timeline?: Json | null
          simplisia_type?: string | null
          tx_hash?: string | null
        }
        Relationships: []
      }
      product_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          product_id: string
          rating: number
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id: string
          rating: number
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          created_at: string
          cultivation_area: string | null
          description: string | null
          id: string
          image_url: string | null
          in_stock: boolean | null
          location: string | null
          min_order_qty: number | null
          min_order_unit: string | null
          name: string
          on_sale: boolean | null
          price: number
          scientific_name: string | null
          specifications: Json | null
          supplier_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          cultivation_area?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          location?: string | null
          min_order_qty?: number | null
          min_order_unit?: string | null
          name: string
          on_sale?: boolean | null
          price: number
          scientific_name?: string | null
          specifications?: Json | null
          supplier_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          cultivation_area?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          location?: string | null
          min_order_qty?: number | null
          min_order_unit?: string | null
          name?: string
          on_sale?: boolean | null
          price?: number
          scientific_name?: string | null
          specifications?: Json | null
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          country: string | null
          created_at: string
          email: string | null
          id: string
          kyc_status: Database["public"]["Enums"]["kyc_status"] | null
          name: string | null
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id: string
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          name?: string | null
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          name?: string | null
        }
        Relationships: []
      }
      request_matches: {
        Row: {
          created_at: string
          price: number | null
          request_id: string
          supplier_id: string
        }
        Insert: {
          created_at?: string
          price?: number | null
          request_id: string
          supplier_id: string
        }
        Update: {
          created_at?: string
          price?: number | null
          request_id?: string
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "request_matches_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "buyer_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_matches_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_matches_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_admin_profiles: {
        Row: {
          bank_info: Json | null
          created_at: string
          destination_markets: string[] | null
          export_license: string | null
          farmer_identity: Json | null
          hs_code: string | null
          id: string
          nik: string | null
          npwp: string | null
          seller_type: string | null
          user_id: string
        }
        Insert: {
          bank_info?: Json | null
          created_at?: string
          destination_markets?: string[] | null
          export_license?: string | null
          farmer_identity?: Json | null
          hs_code?: string | null
          id?: string
          nik?: string | null
          npwp?: string | null
          seller_type?: string | null
          user_id: string
        }
        Update: {
          bank_info?: Json | null
          created_at?: string
          destination_markets?: string[] | null
          export_license?: string | null
          farmer_identity?: Json | null
          hs_code?: string | null
          id?: string
          nik?: string | null
          npwp?: string | null
          seller_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seller_admin_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seller_admin_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_kyc: {
        Row: {
          created_at: string
          cultivation_method: string | null
          geotag_lat: number | null
          geotag_lng: number | null
          land_area_hectares: number | null
          land_location: string | null
          land_name: string | null
          legal_name: string | null
          monthly_capacity_kg: number | null
          nib: string | null
          npwp: string | null
          simplisia_offered: string[] | null
          user_id: string
        }
        Insert: {
          created_at?: string
          cultivation_method?: string | null
          geotag_lat?: number | null
          geotag_lng?: number | null
          land_area_hectares?: number | null
          land_location?: string | null
          land_name?: string | null
          legal_name?: string | null
          monthly_capacity_kg?: number | null
          nib?: string | null
          npwp?: string | null
          simplisia_offered?: string[] | null
          user_id: string
        }
        Update: {
          created_at?: string
          cultivation_method?: string | null
          geotag_lat?: number | null
          geotag_lng?: number | null
          land_area_hectares?: number | null
          land_location?: string | null
          land_name?: string | null
          legal_name?: string | null
          monthly_capacity_kg?: number | null
          nib?: string | null
          npwp?: string | null
          simplisia_offered?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seller_kyc_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seller_kyc_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      verification_history: {
        Row: {
          batch_id: string
          compliance_summary: string | null
          id: string
          verified_at: string
          verifier_role: Database["public"]["Enums"]["verifier_role"]
        }
        Insert: {
          batch_id: string
          compliance_summary?: string | null
          id?: string
          verified_at?: string
          verifier_role: Database["public"]["Enums"]["verifier_role"]
        }
        Update: {
          batch_id?: string
          compliance_summary?: string | null
          id?: string
          verified_at?: string
          verifier_role?: Database["public"]["Enums"]["verifier_role"]
        }
        Relationships: [
          {
            foreignKeyName: "verification_history_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "product_batches"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      suppliers: {
        Row: {
          avatar_url: string | null
          company: string | null
          country: string | null
          created_at: string | null
          email: string | null
          id: string | null
          kyc_status: Database["public"]["Enums"]["kyc_status"] | null
          name: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      assign_role_to_self: {
        Args: { _role: Database["public"]["Enums"]["app_role"] }
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "buyer" | "seller" | "admin"
      kyc_status: "not_started" | "draft" | "pending" | "verified" | "rejected"
      order_status: "processing" | "shipped" | "delivered" | "success"
      request_status: "open" | "matched" | "closed"
      verifier_role: "buyer" | "public" | "seller"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["buyer", "seller", "admin"],
      kyc_status: ["not_started", "draft", "pending", "verified", "rejected"],
      order_status: ["processing", "shipped", "delivered", "success"],
      request_status: ["open", "matched", "closed"],
      verifier_role: ["buyer", "public", "seller"],
    },
  },
} as const
