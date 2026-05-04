# Herblocx — Feature Summary

**Blockchain Herbal Marketplace untuk Indonesia**

Platform marketplace yang menghubungkan pembeli dengan supplier produk herbal lokal Indonesia dengan transparansi blockchain (simulasi), AI assistant, dan sistem musiman.

---

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite 5
- **Styling**: Tailwind CSS, shadcn/ui, design tokens HSL
- **Animasi**: Framer Motion
- **Visualisasi**: Recharts (analytics), Leaflet (peta tracking)
- **State**: React Context API + localStorage (client-side persistence)
- **Routing**: React Router v6

---

## 1. Authentication & User Roles

- **Register & Login** dengan email/password (disimpan di localStorage)
- **Dual Role**: pemilihan role Buyer atau Seller saat register
- **Session Management**: persist login antar reload browser
- **Logout**: clear session dan redirect ke landing page

## 2. Marketplace (Public Pages)

- **Landing Page**: hero section, featured products, team carousel, testimonial
- **Shop Page**: browse semua produk dengan filter kategori, search, dan sort
- **Product Detail**: spesifikasi lengkap, sertifikat (ISO/GMP/Halal), supplier info, reviews, badge musim
- **Supplier Directory**: daftar semua supplier dengan rating dan lokasi
- **Supplier Detail Page**: profil supplier, produk yang dijual, history penjualan
- **Search Autocomplete**: pencarian instan dengan suggestion
- **Seasonal Banner**: highlight produk yang sedang musim panen
- **Community Page**: forum diskusi & posting community
- **About & Contact**: info perusahaan dan formulir kontak

## 3. Buyer Features

- **Buyer Dashboard**: quick actions, ringkasan order, blockchain stats
- **Cart & Checkout**: keranjang belanja dengan simulasi transaksi blockchain (transaction hash)
- **Order History**: daftar lengkap pesanan dengan status
- **Shipment Tracking**: tracking pesanan dengan peta interaktif (Leaflet)
- **Buyer Requests Page**: lihat semua permintaan yang sudah diajukan
- **Product Request Form**: ajukan kebutuhan produk spesifik (nama, jumlah, budget, deskripsi) ke supplier
- **AI Assistant Page**: chat AI untuk rekomendasi produk, perbandingan harga, dan saran berbasis musim/review

## 4. Seller Features

- **Seller Dashboard**: ringkasan revenue, jumlah order, dan stats
- **Product Management**: CRUD produk (Add, Edit, Delete, list)
- **Add Product Page**: form lengkap dengan upload image, spesifikasi, sertifikat
- **Order Management**: kelola pesanan masuk, update status pengiriman
- **Analytics**: grafik revenue dan penjualan per periode (Recharts)
- **Withdraw**: simulasi penarikan dana ke wallet
- **Supplier Chat**: komunikasi langsung dengan buyer
- **AI Assistant Page**: insight pricing, optimasi stok, dan tren pasar

## 5. AI Assistant System

Saat ini menggunakan **keyword pattern matching (TypeScript logic)**, bukan LLM asli.

**Buyer Mode**:
- Rekomendasi produk berdasarkan rating supplier
- Supplier ranking
- Perbandingan harga semua produk
- Saran berdasarkan review/testimoni
- Rekomendasi produk yang sedang musim

**Seller Mode**:
- Strategi pricing (di atas/bawah rata-rata pasar)
- Optimasi stok berdasarkan velocity penjualan
- Analisis tren pasar (high demand, on sale)
- Insight dari review produk

**Quick Actions Sidebar**: shortcut prompt umum untuk akses cepat.

## 6. Seasonal System

- **Logika Musim Indonesia**: Musim Hujan (Okt–Mar) & Musim Kemarau (Apr–Sep)
- **Data Per Produk**: bulan tanam dan bulan panen
- **Helper Functions**:
  - `getCurrentSeason()` — deteksi musim aktif
  - `getSeasonalProductIds()` — produk yang sedang musim
  - `getUpcomingHarvestProducts()` — produk yang akan segera panen
  - `getProductSeasonInfo()` — info musim per produk
- **UI Integration**: banner "Currently In Season" di Shop page, badge "In Season" di product card

## 7. Blockchain Simulation

Semua fitur blockchain saat ini disimulasikan (mock), belum terhubung ke chain asli.

- **Wallet Connect Modal**: simulasi connect wallet (MetaMask UI)
- **Live Price Ticker**: harga crypto real-time (mock)
- **Transaction Hash**: setiap order menghasilkan tx hash format `0x...`
- **Transaction History Page**: daftar semua transaksi user
- **Transaction Detail**: detail per transaksi dengan block number, gas fee
- **Blockchain Stats Widget**: total transactions, active wallets, network status
- **Real-time Transaction Feed**: simulasi transaksi yang masuk live

## 8. UI/UX Features

- **Dark Web 3.0 Theme**: gradient, glow effects, glass morphism
- **Particle Background**: animated background di semua halaman
- **Framer Motion Animations**: page transitions, hover effects, stagger animations
- **Initial Loader**: loading screen pertama kali load aplikasi
- **Responsive Design**: optimal di mobile, tablet, desktop
- **Toast Notifications**: feedback action via shadcn Sonner
- **Skeleton Loaders**: loading state yang smooth

---

## 9. Roadmap — Fitur untuk Ditambahkan

| Prioritas | Fitur | Deskripsi |
|-----------|-------|-----------|
| Tinggi | **Real LLM Integration** | Ganti AI Assistant dengan Lovable AI Gateway (Gemini/GPT) untuk percakapan natural |
| Tinggi | **Lovable Cloud Backend** | Real authentication, PostgreSQL database dengan RLS, replace localStorage |
| Tinggi | **Real Payment Gateway** | Integrasi Midtrans/Stripe untuk pembayaran sungguhan |
| Sedang | **Real Blockchain** | Web3 wallet connect (MetaMask/WalletConnect), smart contract untuk escrow |
| Sedang | **Real-time Notifications** | Push notification order, chat, dan harga (Supabase Realtime) |
| Sedang | **Email Notifications** | Konfirmasi order, status pengiriman, password reset |
| Sedang | **Multi-language (i18n)** | Bahasa Indonesia & English |
| Rendah | **Admin Panel** | Dashboard untuk moderasi user, produk, dispute |
| Rendah | **Mobile App** | React Native atau PWA |
| Rendah | **Export Reports** | Download laporan penjualan/pembelian dalam CSV/PDF |
| Rendah | **Rating System Real** | User dapat memberikan rating & review setelah pembelian |

---

## Ringkasan

Herblocx saat ini sudah menjadi **prototype fungsional lengkap (MVP)** dengan semua fitur utama marketplace, AI assistant, dan visualisasi blockchain. Untuk siap produksi, prioritas berikutnya adalah migrasi ke **Lovable Cloud** untuk backend asli dan integrasi **LLM real** untuk AI Assistant.

*Dokumen ini di-generate sebagai bagian dari MVP documentation Herblocx.*
