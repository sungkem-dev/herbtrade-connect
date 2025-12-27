# Flowchart - Herblocx

Dokumentasi flowchart untuk semua fitur di platform Herblocx.

---

## 1. Authentication Flowcharts

### 1.1 Register Flow

```mermaid
flowchart TD
    A[Start] --> B[Akses Halaman Register]
    B --> C[Tampilkan Form Register]
    C --> D[User Input Data]
    D --> E{Validasi Input}
    
    E -->|Invalid| F[Tampilkan Error]
    F --> D
    
    E -->|Valid| G{Cek Email Exists?}
    
    G -->|Ya| H[Error: Email Sudah Terdaftar]
    H --> D
    
    G -->|Tidak| I{Password Match?}
    
    I -->|Tidak| J[Error: Password Tidak Cocok]
    J --> D
    
    I -->|Ya| K[Hash Password]
    K --> L[Simpan User ke localStorage]
    L --> M[Tampilkan Toast Sukses]
    M --> N[Redirect ke Login]
    N --> O[End]
    
    style A fill:#22c55e
    style O fill:#ef4444
    style F fill:#f59e0b
    style H fill:#f59e0b
    style J fill:#f59e0b
```

### 1.2 Login Flow

```mermaid
flowchart TD
    A[Start] --> B[Akses Halaman Login]
    B --> C[Tampilkan Form Login]
    C --> D[User Input Email & Password]
    D --> E{Validasi Input}
    
    E -->|Invalid| F[Tampilkan Error Field]
    F --> D
    
    E -->|Valid| G[Cari User di localStorage]
    G --> H{User Ditemukan?}
    
    H -->|Tidak| I[Error: Invalid Credentials]
    I --> D
    
    H -->|Ya| J{Password Benar?}
    
    J -->|Tidak| K[Error: Invalid Credentials]
    K --> D
    
    J -->|Ya| L[Simpan Session ke localStorage]
    L --> M{Cek Role User}
    
    M -->|Buyer| N[Redirect ke /buyer/dashboard]
    M -->|Seller| O[Redirect ke /seller/dashboard]
    
    N --> P[End]
    O --> P
    
    style A fill:#22c55e
    style P fill:#ef4444
    style I fill:#f59e0b
    style K fill:#f59e0b
```

### 1.3 Logout Flow

```mermaid
flowchart TD
    A[Start] --> B[User Klik Logout]
    B --> C[Hapus Session dari localStorage]
    C --> D[Clear Cart jika diperlukan]
    D --> E[Redirect ke Home /]
    E --> F[Tampilkan Toast Logout]
    F --> G[End]
    
    style A fill:#22c55e
    style G fill:#ef4444
```

---

## 2. Shopping Flowcharts

### 2.1 Browse Products Flow

```mermaid
flowchart TD
    A[Start] --> B[Akses Halaman /shop]
    B --> C[Load Products dari products.ts]
    C --> D[Tampilkan Grid Produk]
    D --> E{User Aksi?}
    
    E -->|Search| F[Input Search Query]
    F --> G[Filter Products by Name]
    G --> D
    
    E -->|Filter Category| H[Pilih Kategori]
    H --> I[Filter Products by Category]
    I --> D
    
    E -->|Klik Produk| J[Navigate ke /product/:id]
    J --> K[End - View Product Detail]
    
    E -->|Scroll| L[Load More Products]
    L --> D
    
    E -->|Exit| M[End]
    
    style A fill:#22c55e
    style K fill:#3b82f6
    style M fill:#ef4444
```

### 2.2 View Product Detail Flow

```mermaid
flowchart TD
    A[Start] --> B[Akses /product/:id]
    B --> C[Extract Product ID dari URL]
    C --> D[Cari Product di products.ts]
    D --> E{Product Ditemukan?}
    
    E -->|Tidak| F[Redirect ke 404 Page]
    F --> G[End]
    
    E -->|Ya| H[Render Product Detail]
    H --> I[Tampilkan: Image, Name, Price, Description]
    I --> J[Tampilkan: Supplier, Origin, Certifications]
    J --> K[Tampilkan Tombol Aksi]
    K --> L{User Aksi?}
    
    L -->|Add to Cart| M[Trigger Add to Cart Flow]
    L -->|Buy Now| N[Trigger Buy Now Flow]
    L -->|View Supplier| O[Navigate ke Supplier Page]
    L -->|Back| P[Navigate ke Shop]
    
    M --> Q[End]
    N --> Q
    O --> Q
    P --> Q
    
    style A fill:#22c55e
    style F fill:#f59e0b
    style G fill:#ef4444
    style Q fill:#ef4444
```

### 2.3 Add to Cart Flow

```mermaid
flowchart TD
    A[Start] --> B{User Logged In?}
    
    B -->|Tidak| C[Redirect ke Login]
    C --> D[End - Login Required]
    
    B -->|Ya| E[User Klik Add to Cart]
    E --> F[Ambil Product ID & Quantity]
    F --> G{Product Ada di Cart?}
    
    G -->|Ya| H[Update Quantity]
    G -->|Tidak| I[Tambah Item Baru ke Cart]
    
    H --> J[Update CartContext]
    I --> J
    
    J --> K[Simpan Cart ke localStorage]
    K --> L[Update Badge Cart di Header]
    L --> M[Tampilkan Toast 'Added to Cart']
    M --> N[End]
    
    style A fill:#22c55e
    style D fill:#f59e0b
    style N fill:#ef4444
```

### 2.4 Buy Now Flow

```mermaid
flowchart TD
    A[Start] --> B{User Logged In?}
    
    B -->|Tidak| C[Redirect ke Login]
    C --> D[End - Login Required]
    
    B -->|Ya| E[User Klik Buy Now]
    E --> F{Wallet Connected?}
    
    F -->|Tidak| G[Tampilkan WalletConnectModal]
    G --> H{User Connect Wallet?}
    H -->|Tidak| I[Close Modal]
    I --> J[End - Cancelled]
    H -->|Ya| K[Wallet Connected]
    
    F -->|Ya| K
    K --> L[Tampilkan OrderPlacement Modal]
    L --> M[User Input Shipping Address]
    M --> N[User Confirm Order]
    N --> O[Simulasi Blockchain Transaction]
    O --> P{Transaction Success?}
    
    P -->|Tidak| Q[Tampilkan Error]
    Q --> R[End - Transaction Failed]
    
    P -->|Ya| S[Generate TX Hash]
    S --> T[Buat Order Object]
    T --> U[Simpan ke OrderContext]
    U --> V[Tampilkan Konfirmasi + TX Hash]
    V --> W[Redirect ke Order History]
    W --> X[End - Success]
    
    style A fill:#22c55e
    style D fill:#f59e0b
    style J fill:#f59e0b
    style R fill:#ef4444
    style X fill:#22c55e
```

---

## 3. Buyer Dashboard Flowcharts

### 3.1 View Order History Flow

```mermaid
flowchart TD
    A[Start] --> B[Akses /buyer/orders]
    B --> C{User Logged In?}
    
    C -->|Tidak| D[Redirect ke Login]
    D --> E[End]
    
    C -->|Ya| F[Ambil Orders dari OrderContext]
    F --> G{Ada Orders?}
    
    G -->|Tidak| H[Tampilkan Empty State]
    H --> I[Tampilkan CTA 'Start Shopping']
    I --> J[End]
    
    G -->|Ya| K[Render Tabel Orders]
    K --> L[Tampilkan: ID, Date, Items, Total, Status, TX Hash]
    L --> M{User Aksi?}
    
    M -->|Klik Order| N[Tampilkan Order Detail]
    M -->|Track| O[Navigate ke Tracking]
    M -->|Exit| P[End]
    
    N --> M
    O --> P
    
    style A fill:#22c55e
    style E fill:#ef4444
    style J fill:#ef4444
    style P fill:#ef4444
```

### 3.2 Track Shipment Flow

```mermaid
flowchart TD
    A[Start] --> B[Akses /tracking]
    B --> C[Tampilkan Search Form]
    C --> D[User Input Order ID / TX Hash]
    D --> E[Klik Search]
    E --> F[Cari Order di OrderContext]
    F --> G{Order Ditemukan?}
    
    G -->|Tidak| H[Tampilkan Error 'Order Not Found']
    H --> D
    
    G -->|Ya| I[Ambil Tracking Data]
    I --> J[Render Timeline Status]
    J --> K[Tampilkan: Current Status, Location, ETA]
    K --> L[Tampilkan Blockchain Verification]
    L --> M{User Aksi?}
    
    M -->|Refresh| N[Reload Tracking Data]
    N --> I
    
    M -->|Back| O[End]
    
    style A fill:#22c55e
    style H fill:#f59e0b
    style O fill:#ef4444
```

### 3.3 View Requests Flow

```mermaid
flowchart TD
    A[Start] --> B[Akses /buyer/requests]
    B --> C{User Logged In?}
    
    C -->|Tidak| D[Redirect ke Login]
    D --> E[End]
    
    C -->|Ya| F[Load Requests Data]
    F --> G{Ada Requests?}
    
    G -->|Tidak| H[Tampilkan Empty State]
    H --> I[End]
    
    G -->|Ya| J[Render Tabel Requests]
    J --> K[Tampilkan: ID, Product, Quantity, Status, Date]
    K --> L{User Aksi?}
    
    L -->|View Detail| M[Tampilkan Request Detail]
    L -->|Cancel| N{Confirm Cancel?}
    N -->|Ya| O[Update Status ke Cancelled]
    N -->|Tidak| L
    L -->|Exit| P[End]
    
    M --> L
    O --> J
    
    style A fill:#22c55e
    style E fill:#ef4444
    style I fill:#ef4444
    style P fill:#ef4444
```

---

## 4. Seller Dashboard Flowcharts

### 4.1 Add Product Flow

```mermaid
flowchart TD
    A[Start] --> B[Akses /seller/add-product]
    B --> C{User Logged In as Seller?}
    
    C -->|Tidak| D[Redirect ke Login]
    D --> E[End]
    
    C -->|Ya| F[Tampilkan Form Add Product]
    F --> G[User Input Product Data]
    G --> H[User Klik Submit]
    H --> I{Validasi Input}
    
    I -->|Invalid| J[Tampilkan Error Messages]
    J --> G
    
    I -->|Valid| K{Price Valid?}
    
    K -->|Tidak| L[Error: Invalid Price]
    L --> G
    
    K -->|Ya| M[Generate Product ID]
    M --> N[Buat Product Object]
    N --> O[Simpan ke Storage]
    O --> P[Tampilkan Toast Sukses]
    P --> Q[Redirect ke /seller/products]
    Q --> R[End]
    
    style A fill:#22c55e
    style E fill:#ef4444
    style J fill:#f59e0b
    style L fill:#f59e0b
    style R fill:#ef4444
```

### 4.2 View My Products Flow

```mermaid
flowchart TD
    A[Start] --> B[Akses /seller/products]
    B --> C{User Logged In as Seller?}
    
    C -->|Tidak| D[Redirect ke Login]
    D --> E[End]
    
    C -->|Ya| F[Load Seller Products]
    F --> G{Ada Products?}
    
    G -->|Tidak| H[Tampilkan Empty State]
    H --> I[Tampilkan 'Add First Product' CTA]
    I --> J{User Klik Add?}
    J -->|Ya| K[Navigate ke Add Product]
    J -->|Tidak| L[End]
    
    G -->|Ya| M[Render Product Grid]
    M --> N[Tampilkan: Image, Name, Price, Status]
    N --> O{User Aksi?}
    
    O -->|Add New| K
    O -->|Edit| P[Open Edit Form]
    O -->|Delete| Q{Confirm Delete?}
    Q -->|Ya| R[Hapus Product]
    Q -->|Tidak| O
    O -->|Exit| L
    
    P --> O
    R --> F
    K --> L
    
    style A fill:#22c55e
    style E fill:#ef4444
    style L fill:#ef4444
```

### 4.3 View Seller Orders Flow

```mermaid
flowchart TD
    A[Start] --> B[Akses /seller/orders]
    B --> C{User Logged In as Seller?}
    
    C -->|Tidak| D[Redirect ke Login]
    D --> E[End]
    
    C -->|Ya| F[Load Seller Orders]
    F --> G{Ada Orders?}
    
    G -->|Tidak| H[Tampilkan Empty State]
    H --> I[End]
    
    G -->|Ya| J[Render Tabel Orders]
    J --> K[Tampilkan: ID, Buyer, Product, Qty, Total, Status]
    K --> L{User Aksi?}
    
    L -->|Update Status| M[Pilih Status Baru]
    M --> N{Status Valid?}
    N -->|Processing| O[Update ke Processing]
    N -->|Shipped| P[Update ke Shipped]
    N -->|Delivered| Q[Update ke Delivered]
    
    O --> R[Simpan Status]
    P --> R
    Q --> R
    R --> S[Tampilkan Toast]
    S --> J
    
    L -->|View Detail| T[Tampilkan Order Detail]
    T --> L
    
    L -->|Exit| U[End]
    
    style A fill:#22c55e
    style E fill:#ef4444
    style I fill:#ef4444
    style U fill:#ef4444
```

### 4.4 View Analytics Flow

```mermaid
flowchart TD
    A[Start] --> B[Akses /seller/analytics]
    B --> C{User Logged In as Seller?}
    
    C -->|Tidak| D[Redirect ke Login]
    D --> E[End]
    
    C -->|Ya| F[Load Analytics Data]
    F --> G[Calculate Statistics]
    G --> H[Render Stat Cards]
    H --> I[Tampilkan: Revenue, Orders, Products Sold, Growth]
    I --> J[Load Revenue Chart Data]
    J --> K[Render Line Chart]
    K --> L{User Aksi?}
    
    L -->|Hover Chart| M[Tampilkan Tooltip Data]
    M --> L
    
    L -->|Change Date Range| N[Update Date Filter]
    N --> F
    
    L -->|Exit| O[End]
    
    style A fill:#22c55e
    style E fill:#ef4444
    style O fill:#ef4444
```

### 4.5 Withdraw Funds Flow

```mermaid
flowchart TD
    A[Start] --> B[Akses /seller/withdraw]
    B --> C{User Logged In as Seller?}
    
    C -->|Tidak| D[Redirect ke Login]
    D --> E[End]
    
    C -->|Ya| F[Load Balance Data]
    F --> G[Tampilkan Available Balance]
    G --> H[Tampilkan Withdraw Form]
    H --> I[User Input Amount & Wallet]
    I --> J[User Klik Withdraw]
    J --> K{Validasi Input}
    
    K -->|Invalid| L[Tampilkan Error]
    L --> I
    
    K -->|Valid| M{Amount <= Balance?}
    
    M -->|Tidak| N[Error: Insufficient Balance]
    N --> I
    
    M -->|Ya| O{Wallet Valid?}
    
    O -->|Tidak| P[Error: Invalid Wallet]
    P --> I
    
    O -->|Ya| Q[Simulasi Blockchain Transaction]
    Q --> R{Transaction Success?}
    
    R -->|Tidak| S[Error: Transaction Failed]
    S --> T[Tampilkan Retry Option]
    T --> I
    
    R -->|Ya| U[Generate TX Hash]
    U --> V[Update Balance]
    V --> W[Simpan Withdraw Record]
    W --> X[Tampilkan Konfirmasi + TX Hash]
    X --> Y[End - Success]
    
    style A fill:#22c55e
    style E fill:#ef4444
    style L fill:#f59e0b
    style N fill:#f59e0b
    style P fill:#f59e0b
    style S fill:#f59e0b
    style Y fill:#22c55e
```

---

## 5. Supplier Flowcharts

### 5.1 View Suppliers Flow

```mermaid
flowchart TD
    A[Start] --> B[Akses /suppliers]
    B --> C[Load Suppliers Data]
    C --> D[Render Supplier List]
    D --> E[Tampilkan: Avatar, Name, Rating, Location]
    E --> F{User Aksi?}
    
    F -->|Search| G[Input Search Query]
    G --> H[Filter Suppliers]
    H --> D
    
    F -->|Klik Supplier| I[Navigate ke /supplier/:id]
    I --> J[End - View Supplier Detail]
    
    F -->|Exit| K[End]
    
    style A fill:#22c55e
    style J fill:#3b82f6
    style K fill:#ef4444
```

### 5.2 View Supplier Detail Flow

```mermaid
flowchart TD
    A[Start] --> B[Akses /supplier/:id]
    B --> C[Extract Supplier ID]
    C --> D[Load Supplier Data]
    D --> E{Supplier Ditemukan?}
    
    E -->|Tidak| F[Redirect ke 404]
    F --> G[End]
    
    E -->|Ya| H[Render Supplier Profile]
    H --> I[Tampilkan: Avatar, Name, Bio, Rating]
    I --> J[Load Trend Graph Data]
    J --> K[Render SupplierTrendGraph]
    K --> L[Load Supplier Products]
    L --> M[Render Product Grid]
    M --> N{User Aksi?}
    
    N -->|Chat| O[Open SupplierChat]
    N -->|View Product| P[Navigate ke Product Detail]
    N -->|Back| Q[Navigate ke Suppliers List]
    
    O --> N
    P --> R[End]
    Q --> R
    
    style A fill:#22c55e
    style F fill:#f59e0b
    style G fill:#ef4444
    style R fill:#ef4444
```

---

## 6. Wallet Flowchart

### 6.1 Connect Wallet Flow

```mermaid
flowchart TD
    A[Start] --> B[User Klik Connect Wallet]
    B --> C[Tampilkan WalletConnectModal]
    C --> D[Tampilkan Wallet Options]
    D --> E{User Pilih Wallet?}
    
    E -->|MetaMask| F[Request MetaMask Connection]
    E -->|WalletConnect| G[Show QR Code]
    E -->|Coinbase| H[Request Coinbase Connection]
    E -->|Cancel| I[Close Modal]
    I --> J[End - Cancelled]
    
    F --> K{Connection Approved?}
    G --> K
    H --> K
    
    K -->|Tidak| L[Tampilkan Error]
    L --> D
    
    K -->|Ya| M[Get Wallet Address]
    M --> N[Simpan ke State/Context]
    N --> O[Update UI - Show Address]
    O --> P[Close Modal]
    P --> Q[End - Connected]
    
    style A fill:#22c55e
    style J fill:#f59e0b
    style L fill:#f59e0b
    style Q fill:#22c55e
```

---

## 7. Main Purchase Flow (End-to-End)

```mermaid
flowchart TD
    A[🌐 Guest Mengunjungi Herblocx] --> B[Browse Products]
    B --> C{Tertarik dengan Produk?}
    
    C -->|Tidak| D[Lanjut Browse]
    D --> B
    
    C -->|Ya| E[View Product Detail]
    E --> F{Ingin Beli?}
    
    F -->|Tidak| B
    
    F -->|Ya| G{Sudah Login?}
    
    G -->|Tidak| H[Register / Login]
    H --> I{Registrasi?}
    I -->|Ya| J[Isi Form Register]
    J --> K[Login]
    I -->|Tidak| K
    K --> L[Redirect Kembali ke Produk]
    L --> E
    
    G -->|Ya| M{Add to Cart / Buy Now?}
    
    M -->|Add to Cart| N[Tambah ke Keranjang]
    N --> O{Lanjut Belanja?}
    O -->|Ya| B
    O -->|Tidak| P[Buka Keranjang]
    P --> Q[Review Items]
    Q --> R[Checkout]
    
    M -->|Buy Now| R
    
    R --> S{Wallet Connected?}
    S -->|Tidak| T[Connect Wallet]
    T --> S
    
    S -->|Ya| U[Isi Shipping Address]
    U --> V[Confirm Order]
    V --> W[Process Blockchain Transaction]
    W --> X{Transaction Success?}
    
    X -->|Tidak| Y[Show Error - Retry]
    Y --> V
    
    X -->|Ya| Z[Order Created]
    Z --> AA[Tampilkan Konfirmasi]
    AA --> AB[Receive TX Hash]
    AB --> AC[Track Order]
    AC --> AD{Order Delivered?}
    
    AD -->|Belum| AE[Check Status]
    AE --> AC
    
    AD -->|Ya| AF[Order Complete]
    AF --> AG[🎉 End - Purchase Complete]
    
    style A fill:#22c55e
    style AG fill:#22c55e
    style Y fill:#f59e0b
```

---

## Legenda Warna

| Warna | Makna |
|-------|-------|
| 🟢 Hijau (#22c55e) | Start / Success End |
| 🔴 Merah (#ef4444) | End / Terminal State |
| 🟡 Kuning (#f59e0b) | Error / Warning State |
| 🔵 Biru (#3b82f6) | Navigation to Another Flow |

---

## Ringkasan Flowchart

| Kategori | Jumlah Flowchart | Fitur Tercakup |
|----------|------------------|----------------|
| Authentication | 3 | Register, Login, Logout |
| Shopping | 4 | Browse, View Detail, Add to Cart, Buy Now |
| Buyer Dashboard | 3 | Order History, Track Shipment, View Requests |
| Seller Dashboard | 5 | Add Product, View Products, View Orders, Analytics, Withdraw |
| Supplier | 2 | View Suppliers, View Supplier Detail |
| Wallet | 1 | Connect Wallet |
| Main Flow | 1 | Complete Purchase Flow |
| **Total** | **19** | - |
