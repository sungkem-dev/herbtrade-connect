

## Feature Summary Document — Herblocx

Membuat dokumen ringkasan fitur (Feature Summary) untuk Herblocx dalam dua format: file Markdown di `docs/` dan PDF yang bisa diunduh di `/mnt/documents/`.

### Tujuan
Dokumen ringkas dan terstruktur yang menjelaskan **semua fitur** yang ada di Herblocx, dikelompokkan per kategori dengan deskripsi singkat tiap fitur. Dokumen ini cocok untuk presentasi, onboarding tim baru, atau lampiran proposal.

### Isi Dokumen

**1. Cover & Overview**
- Nama: Herblocx — Blockchain Herbal Marketplace
- Tagline & deskripsi singkat
- Tech stack singkat (React 18, TypeScript, Vite, Tailwind, shadcn/ui)

**2. Authentication & User Roles**
- Register & Login (email/password via localStorage)
- Dual role: Buyer & Seller
- Logout & session management

**3. Marketplace (Public)**
- Landing page dengan hero, featured products, team carousel
- Shop page (browse produk dengan filter & search)
- Product detail page (spesifikasi, supplier info, reviews, seasonal badge)
- Supplier directory & supplier detail page
- Search autocomplete
- Seasonal banner (produk yang sedang musim)
- Community page

**4. Buyer Features**
- Buyer Dashboard (quick actions, blockchain stats)
- Cart & Checkout (simulated blockchain transaction)
- Order history & tracking
- Shipment map tracking (Leaflet)
- Buyer Requests (lihat permintaan)
- Product Request form (ajukan kebutuhan produk ke supplier)
- AI Assistant page (rekomendasi berbasis review, musim, harga)

**5. Seller Features**
- Seller Dashboard (revenue, orders summary)
- Product management (Add, Edit, Delete)
- Order management
- Analytics dengan grafik (Recharts)
- Withdraw funds (simulated)
- Supplier chat
- AI Assistant page (pricing strategy, stock optimization, market trends)

**6. AI Assistant System**
- Keyword-based pattern matching (TypeScript logic, bukan LLM asli)
- Buyer mode: rekomendasi produk, supplier ranking, perbandingan harga, review-based suggestions, seasonal recommendations
- Seller mode: pricing strategy, stock optimization, market trends, review insights
- Quick actions sidebar

**7. Seasonal System**
- Logika musim Indonesia (Musim Hujan & Kemarau)
- Data per produk: musim tanam & panen
- Helper: `getCurrentSeason()`, `getSeasonalProductIds()`, `getUpcomingHarvestProducts()`
- Banner & badge "In Season" di Shop page

**8. Blockchain Simulation**
- Wallet Connect Modal
- Live price ticker
- Transaction hashes (mock)
- Transaction history & detail page
- Blockchain stats widget
- Real-time transaction simulation

**9. UI/UX Features**
- Dark Web 3.0 theme (gradient, glow, glass morphism)
- Framer Motion animations & page transitions
- Initial loader
- Responsive design
- Particle background (Web3Background)

**10. Roadmap (Future Features)**
- Real LLM integration untuk AI Assistant (Lovable AI Gateway / Gemini)
- Supabase backend (real auth, database, RLS)
- Real payment gateway (Midtrans/Stripe)
- Real blockchain integration (Web3 wallet, smart contracts)
- Real-time notifications
- Multi-language (i18n)
- Mobile app
- Admin panel
- Email notifications

### File yang dibuat

| File | Aksi |
|------|------|
| `docs/FEATURE-SUMMARY.md` | Baru — versi Markdown untuk repo |
| `/mnt/documents/Herblocx_Feature_Summary.pdf` | Baru — versi PDF untuk diunduh user |
| `docs/README.md` | Ubah — tambah link ke FEATURE-SUMMARY.md |

### Proses Pembuatan PDF
1. Tulis konten lengkap di `docs/FEATURE-SUMMARY.md`
2. Generate PDF menggunakan Python (reportlab) dengan styling rapi: cover page, table of contents, section headers, bullet points
3. QA visual — convert PDF ke image, inspeksi setiap halaman untuk memastikan layout bersih, tidak ada teks terpotong
4. Tampilkan via `<lov-artifact>` agar user bisa langsung preview/download

