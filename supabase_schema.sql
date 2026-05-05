-- Create ENUMs
CREATE TYPE app_role AS ENUM (
  'buyer',
  'seller',
  'admin'
);

CREATE TYPE kyc_status AS ENUM (
  'not_started',
  'draft',
  'pending',
  'verified',
  'rejected'
);

CREATE TYPE order_status AS ENUM (
  'processing',
  'shipped',
  'delivered',
  'success'
);

CREATE TYPE request_status AS ENUM (
  'open',
  'matched',
  'closed'
);

CREATE TYPE verifier_role AS ENUM (
  'buyer',
  'public',
  'seller'
);

-- 1. Auth & Roles
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name text,
  email text UNIQUE,
  company text,
  country text,
  avatar_url text,
  kyc_status kyc_status DEFAULT 'not_started'::kyc_status,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.user_roles (
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  PRIMARY KEY (user_id, role)
);

-- 2. KYC Profiles
CREATE TABLE public.buyer_kyc (
  user_id uuid REFERENCES public.profiles ON DELETE CASCADE PRIMARY KEY,
  legal_name text,
  nib text,
  npwp text,
  simplisia_needed text[],
  purchase_volume_kg numeric,
  preferred_origin text,
  import_destination text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.seller_kyc (
  user_id uuid REFERENCES public.profiles ON DELETE CASCADE PRIMARY KEY,
  legal_name text,
  nib text,
  npwp text,
  land_name text,
  land_location text,
  land_area_hectares numeric,
  geotag_lat numeric,
  geotag_lng numeric,
  simplisia_offered text[],
  cultivation_method text,
  monthly_capacity_kg numeric,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 3. Marketplace
CREATE TABLE public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  scientific_name text,
  price numeric NOT NULL,
  image_url text,
  category text,
  location text,
  in_stock boolean DEFAULT TRUE,
  on_sale boolean DEFAULT FALSE,
  description text,
  min_order_qty numeric,
  min_order_unit text,
  specifications jsonb,
  cultivation_area text,
  supplier_id uuid REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.product_reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES public.products ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE VIEW public.suppliers AS
SELECT
  p.id,
  p.name,
  p.email,
  p.company,
  p.country,
  p.avatar_url,
  p.kyc_status,
  p.created_at
FROM public.profiles p
JOIN public.user_roles ur ON p.id = ur.user_id
WHERE ur.role = 'seller'::app_role;

-- 4. Orders & Cart
CREATE TABLE public.cart_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products ON DELETE CASCADE NOT NULL,
  quantity numeric NOT NULL,
  status text DEFAULT 'pending' NOT NULL, -- This will be updated to an ENUM later if needed
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tx_hash text UNIQUE,
  block_number bigint,
  buyer_id uuid REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
  seller_id uuid REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products ON DELETE CASCADE NOT NULL,
  quantity numeric NOT NULL,
  price_per_unit numeric NOT NULL,
  total numeric NOT NULL,
  payment_method text,
  status order_status DEFAULT 'processing'::order_status NOT NULL,
  from_addr text,
  to_addr text,
  gas_used numeric,
  gas_price numeric,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 5. Buyer Requests (RFQ)
CREATE TABLE public.buyer_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id uuid REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
  product_name text NOT NULL,
  category text,
  quantity numeric,
  unit text,
  budget_min numeric,
  budget_max numeric,
  description text,
  status request_status DEFAULT 'open'::request_status NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.request_matches (
  request_id uuid REFERENCES public.buyer_requests ON DELETE CASCADE NOT NULL,
  supplier_id uuid REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
  price numeric,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  PRIMARY KEY (request_id, supplier_id)
);

-- 6. Compliance / Traceability
CREATE TABLE public.seller_admin_profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles ON DELETE CASCADE NOT NULL UNIQUE,
  seller_type text,
  nik text,
  npwp text,
  export_license text,
  hs_code text,
  destination_markets text[],
  farmer_identity jsonb,
  bank_info jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.product_batches (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_code text UNIQUE NOT NULL,
  product_name text NOT NULL,
  simplisia_type text,
  farmer_id text,
  harvest_date date,
  processing_facility text,
  export_destination text,
  quantity_kg numeric,
  packaging text,
  shipping_timeline jsonb,
  quality_tests jsonb,
  eudr_data jsonb,
  fda_data jsonb,
  jas_data jsonb,
  qr_target_url text,
  scan_count integer DEFAULT 0,
  tx_hash text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.verification_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id uuid REFERENCES public.product_batches ON DELETE CASCADE NOT NULL,
  verifier_role verifier_role NOT NULL,
  compliance_summary text,
  verified_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 7. Community
CREATE TABLE public.posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id uuid REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  media_type text,
  media_url text,
  likes_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid REFERENCES public.posts ON DELETE CASCADE NOT NULL,
  author_id uuid REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.post_likes (
  post_id uuid REFERENCES public.posts ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (post_id, user_id),
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable Row Level Security (RLS) for tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_kyc ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_kyc ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

-- Set up policies for public.profiles
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (TRUE);
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Set up policies for public.user_roles
CREATE POLICY "User roles are viewable by authenticated users." ON public.user_roles FOR SELECT USING (auth.role() = 'authenticated');

-- Set up policies for KYC tables
CREATE POLICY "Buyers can view and update their own KYC." ON public.buyer_kyc FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Sellers can view and update their own KYC." ON public.seller_kyc FOR ALL USING (auth.uid() = user_id);

-- Set up policies for public.products
CREATE POLICY "Products are viewable by everyone." ON public.products FOR SELECT USING (TRUE);
CREATE POLICY "Suppliers can insert their own products." ON public.products FOR INSERT WITH CHECK (auth.uid() = supplier_id);
CREATE POLICY "Suppliers can update their own products." ON public.products FOR UPDATE USING (auth.uid() = supplier_id);
CREATE POLICY "Suppliers can delete their own products." ON public.products FOR DELETE USING (auth.uid() = supplier_id);

-- Set up policies for public.product_reviews
CREATE POLICY "Product reviews are viewable by everyone." ON public.product_reviews FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can insert product reviews." ON public.product_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Set up policies for public.cart_items
CREATE POLICY "Users can manage their own cart items." ON public.cart_items FOR ALL USING (auth.uid() = user_id);

-- Set up policies for public.orders
CREATE POLICY "Buyers and sellers can view their own orders." ON public.orders FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Authenticated buyers can insert orders." ON public.orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Set up policies for public.buyer_requests
CREATE POLICY "Buyer requests are viewable by everyone." ON public.buyer_requests FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated buyers can insert their own requests." ON public.buyer_requests FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Buyers can update their own requests." ON public.buyer_requests FOR UPDATE USING (auth.uid() = buyer_id);

-- Set up policies for public.request_matches
CREATE POLICY "Request matches are viewable by everyone." ON public.request_matches FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated sellers can insert request matches." ON public.request_matches FOR INSERT WITH CHECK (auth.uid() = supplier_id);

-- Set up policies for public.seller_admin_profiles
CREATE POLICY "Sellers can view and update their own admin profile." ON public.seller_admin_profiles FOR ALL USING (auth.uid() = user_id);

-- Set up policies for public.product_batches
CREATE POLICY "Product batches are viewable by everyone." ON public.product_batches FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated sellers can insert their own product batches." ON public.product_batches FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.seller_admin_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Sellers can update their own product batches." ON public.product_batches FOR UPDATE USING (EXISTS (SELECT 1 FROM public.seller_admin_profiles WHERE user_id = auth.uid()));

-- Set up policies for public.verification_history
CREATE POLICY "Verification history is viewable by everyone." ON public.verification_history FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can insert verification history." ON public.verification_history FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Set up policies for public.posts
CREATE POLICY "Posts are viewable by everyone." ON public.posts FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can insert posts." ON public.posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Post owners can delete their posts." ON public.posts FOR DELETE USING (auth.uid() = author_id);

-- Set up policies for public.comments
CREATE POLICY "Comments are viewable by everyone." ON public.comments FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can insert comments." ON public.comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Comment owners can delete their comments." ON public.comments FOR DELETE USING (auth.uid() = author_id);

-- Set up policies for public.post_likes
CREATE POLICY "Post likes are viewable by everyone." ON public.post_likes FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can manage their own post likes." ON public.post_likes FOR ALL USING (auth.uid() = user_id);

-- Create helper function for RLS
CREATE FUNCTION public.has_role(_user_id uuid, _role app_role) RETURNS boolean LANGUAGE plpgsql STABLE SECURITY DEFINER AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
END;
$$;

-- Update user_roles RLS to use has_role function
DROP POLICY IF EXISTS "User roles are viewable by authenticated users." ON public.user_roles;
CREATE POLICY "Enable read access for authenticated users" ON public.user_roles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow individual insert access" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow individual delete access" ON public.user_roles FOR DELETE USING (auth.uid() = user_id);

-- Additional RLS for profiles table to allow users to insert their own profile
CREATE POLICY "Allow individual insert access for profiles" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
