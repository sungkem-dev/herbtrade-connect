## Integrasi Supabase ke Herblocx

### Cara Connect ke Supabase

Lovable mendukung **2 cara** koneksi Supabase:

**Opsi A — Lovable Cloud (Direkomendasikan)**
- Otomatis spin up Supabase backend tanpa perlu akun eksternal
- Auto-inject env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `LOVABLE_API_KEY`)
- Edge functions, storage, auth, dan database langsung tersedia
- Aktifkan via tombol "Enable Lovable Cloud" di workspace

**Opsi B — Connect Supabase Project Anda Sendiri**
- Karena Anda bilang "sudah ada Supabase", saya asumsikan Anda mau pakai project Supabase Anda sendiri
- Anda perlu klik tombol **Supabase** (ikon hijau) di pojok kanan atas Lovable editor → "Connect Supabase" → pilih organization & project Anda
- Setelah connect, Lovable otomatis dapat akses untuk menjalankan migration, manage auth, edge functions, dll
- Saya **tidak bisa** menghubungkan secara otomatis dari sisi saya — koneksi OAuth harus Anda klik manual sekali

### Langkah Setelah Connect

Setelah koneksi Supabase aktif, saya akan menjalankan migration berikut untuk membuat schema database lengkap Herblocx (mengganti localStorage dengan persistensi nyata).

### Database Schema (Migration)

#### 1. Auth & Roles
```text
profiles                user_roles
├─ id (uuid, FK auth)   ├─ user_id (FK auth.users)
├─ name                 ├─ role (enum: buyer|seller|admin)
├─ email                └─ unique(user_id, role)
├─ company
├─ country
├─ avatar_url
└─ kyc_status (enum)
```

#### 2. KYC Profiles
```text
buyer_kyc                       seller_kyc
├─ user_id (FK)                 ├─ user_id (FK)
├─ legal_name, nib, npwp        ├─ legal_name, nib, npwp
├─ simplisia_needed[]           ├─ land_name, land_location
├─ purchase_volume_kg           ├─ land_area_hectares
├─ preferred_origin             ├─ geotag_lat, geotag_lng
└─ import_destination           ├─ simplisia_offered[]
                                ├─ cultivation_method
                                └─ monthly_capacity_kg
```

#### 3. Marketplace
```text
products                        product_reviews
├─ id, name, scientific_name    ├─ product_id (FK)
├─ price, image_url             ├─ user_id (FK)
├─ category, location           ├─ rating (1-5)
├─ in_stock, on_sale            ├─ comment
├─ description                  └─ created_at
├─ min_order_qty, min_order_unit
├─ specifications (jsonb)
├─ cultivation_area
├─ supplier_id (FK profiles)
└─ created_at

suppliers (view of profiles where role=seller)
```

#### 4. Orders & Cart
```text
cart_items                      orders
├─ id, user_id (FK)             ├─ id, tx_hash, block_number
├─ product_id (FK)              ├─ buyer_id, seller_id (FK)
├─ quantity, status             ├─ product_id (FK)
└─ created_at                   ├─ quantity, price_per_unit, total
                                ├─ payment_method
                                ├─ status (processing|shipped|delivered|success)
                                ├─ from_addr, to_addr (mock chain)
                                ├─ gas_used, gas_price
                                └─ created_at
```

#### 5. Buyer Requests (RFQ)
```text
buyer_requests                  request_matches
├─ id, buyer_id (FK)            ├─ request_id (FK)
├─ product_name, category       ├─ supplier_id (FK)
├─ quantity, unit               ├─ price
├─ budget_min, budget_max       └─ created_at
├─ description
├─ status (open|matched|closed)
└─ created_at
```

#### 6. Compliance / Traceability
```text
seller_admin_profiles           product_batches
├─ id, user_id (FK)             ├─ id, batch_code, product_name
├─ seller_type, nik, npwp       ├─ simplisia_type, farmer_id
├─ export_license, hs_code      ├─ harvest_date, processing_facility
├─ destination_markets[]        ├─ export_destination, quantity_kg
├─ farmer_identity (jsonb)      ├─ packaging
└─ bank info                    ├─ shipping_timeline (jsonb)
                                ├─ quality_tests (jsonb)
                                ├─ eudr_data (jsonb)
                                ├─ fda_data (jsonb)
                                ├─ jas_data (jsonb)
                                ├─ qr_target_url, scan_count
                                └─ tx_hash

verification_history
├─ id, batch_id (FK)
├─ verifier_role (buyer|public|seller)
├─ compliance_summary
└─ verified_at
```

#### 7. Community
```text
posts                           comments              post_likes
├─ id, author_id (FK)           ├─ id, post_id (FK)   ├─ post_id, user_id
├─ content                      ├─ author_id (FK)     └─ unique(post_id, user_id)
├─ media_type, media_url        ├─ content
├─ likes_count                  └─ created_at
└─ created_at
```

### RLS Policies (Penting)
- **profiles**: user bisa SELECT semua, UPDATE hanya milik sendiri
- **user_roles**: SELECT via `has_role()` security definer (hindari recursion)
- **kyc tables**: user hanya akses miliknya sendiri
- **products**: SELECT public, INSERT/UPDATE/DELETE hanya seller pemilik
- **orders**: buyer & seller terkait bisa SELECT; INSERT untuk buyer authenticated
- **buyer_requests**: SELECT public (untuk seller browse), INSERT/UPDATE buyer pemilik
- **posts/comments**: SELECT public, INSERT authenticated, DELETE pemilik

### Helper Function
```sql
CREATE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER ...
```

### Code Changes Setelah Migration
- `src/lib/auth.ts` → ganti localStorage dengan `supabase.auth`
- `src/contexts/CartContext.tsx` → query `cart_items` table
- `src/contexts/OrderContext.tsx` → query `orders` table
- `src/contexts/BuyerRequestContext.tsx` → query `buyer_requests`
- `src/contexts/ComplianceContext.tsx` → query `product_batches`
- `src/contexts/CommunityContext.tsx` → query `posts` & `comments`
- `src/lib/products.ts` → seed initial products ke DB, fetch dari `products` table
- Tambah `src/integrations/supabase/client.ts` (auto-generated by Lovable Cloud)
- Update halaman `Login.tsx` & `Register.tsx` dengan Supabase Auth (email/password)

### Yang Perlu Anda Lakukan Sekarang

**Pilih salah satu:**

1. **Pakai Lovable Cloud** (paling mudah, saya bisa langsung jalan): saya aktifkan Lovable Cloud dan langsung buat semua schema + migrate code.

2. **Pakai Supabase Anda sendiri**: klik tombol **Supabase** di pojok kanan atas Lovable editor → connect project Anda → kabari saya kalau sudah, lalu saya jalankan migration & migrasi code.

Mana yang Anda pilih?
