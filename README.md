📊 Sistem Akuntansi & Manajemen Inventaris (Cash Outflow Voucher & Inventory Engine)Sistem informasi berbasis web dan basis data yang dirancang untuk mengelola transaksi keuangan, pencatatan jurnal akuntansi berpasangan (double-entry bookkeeping), serta manajemen mutasi stok barang dengan kontrol integritas data secara real-time.📸 Ringkasan Fitur UtamaSistem ini terdiri dari dua modul utama:Frontend Voucher Kas Keluar (VKK): Antarmuka interaktif berbasis React & Tailwind CSS untuk entri data transaksi pengeluaran kas.Backend Database Core (PostgreSQL): Arsitektur basis data relasional dengan penguncian pesimistik (pessimistic locking), validasi anti-stok negatif, dan prinsip immutability untuk audit keuangan.🚀 Fitur Unggulan💳 1. Modul Keuangan & Voucher Kas KeluarValidasi Keseimbangan Jurnal (Live Balance Checker): Sistem secara otomatis menghitung total Debit dan Kredit. Transaksi hanya dapat disimpan jika jurnal berada dalam kondisi seimbang ($Debit = Kredit$).Entri Baris Dinamis: Fleksibilitas penambahan/penghapusan baris entri jurnal dengan proteksi minimal 2 baris (sesuai kaidah double-entry accounting).Auto-Formatting Currency: Penyesuaian mata uang ke format Rupiah (IDR).Antarmuka Responsive & Intuitif: Menggunakan Lucid Icons dan Tailwind CSS.📦 2. Engine Inventaris & Stok PostgreSQLPessimistic Locking (FOR UPDATE): Mencegah kondisi race condition atau concurrency bug saat banyak pengguna melakukan transaksi secara bersamaan.Anti-Negative Inventory Validation: Menggagalkan transaksi penjualan (SALE) atau penyesuaian (ADJUSTMENT) secara otomatis jika kuantitas stok kurang dari 0.Trigger Mutasi Stok Otomatis: Memperbarui kuantitas barang secara otomatis setiap kali ada entri pada tabel riwayat transaksi (inventory_transactions).🛡️ 3. Audit & Immutability KeuanganStrict Data Protection: Mencegah pengubahan (UPDATE) atau penghapusan (DELETE) data transaksi yang berstatus POSTED melalui mekanisme PostgreSQL Trigger.📁 Struktur Berkas Repositori.
├── VoucherForm.js                # Komponen React UI untuk Form Voucher Kas Keluar
├── Sistem Akuntansi.sql          # Skema dasar Chart of Accounts (COA) & Jurnal Umum
├── inventory_all_system.sql      # Skema dasar Inventaris & Function/Trigger Mutasi Stok
├── inventory_pessimistic_lock.sql # Skrip pengujian kasus batas/error stok
├── inventory_test_queries.sql    # Skrip pengujian alur transaksi pembelian & penjualan
└── audit_trigger.sql             # Skrip trigger pencegahan manipulasi data berstatus POSTED
🛠️ Teknologi yang DigunakanFrontend: React.js, Tailwind CSS, Lucide React (Icons).Backend / Database: PostgreSQL (PL/pgSQL Functions, Triggers, Constraints).🗄️ Arsitektur Basis Data (Database Schema)1. Chart of Accounts & Jurnal-- Chart of Accounts
chart_of_accounts (account_id, account_code, account_name, normal_balance)

-- Header Jurnal
journal_headers (id, reference_no, transaction_date, description, status_posting)

-- Detail Baris Jurnal
journal_lines (id, header_id, account_id, debit, credit)
2. Inventaris-- Master Barang
inventory_items (item_id, item_name, stock_qty, unit_cost)

-- Riwayat Transaksi
inventory_transactions (trx_id, item_id, trx_type, qty, trx_date)
💻 Cara Menjalankan1. Menjalankan Frontend (React)Pastikan Anda telah menginstal Node.js.Pasang dependensi yang dibutuhkan:npm install react lucide-react
Impor komponen VoucherForm.js ke dalam proyek React Anda.2. Memasang Basis Data (PostgreSQL)Jalankan skrip SQL secara berurutan pada instance PostgreSQL Anda:Inisialisasi Sistem Akuntansi:psql -d database_name -f "Sistem Akuntansi.sql"
Inisialisasi System Engine Inventaris:psql -d database_name -f "inventory_all_system.sql"
Penerapan Fitur Immutability Audit:psql -d database_name -f "audit_trigger.sql"
🧪 Pengujian Sistem DatabaseGunakan berkas inventory_test_queries.sql untuk menguji alur sistem:-- 1. Input Barang Awal (Stok = 5)
INSERT INTO inventory_items (item_id, item_name, stock_qty, unit_cost) 
VALUES ('BRG-01', 'Kertas A4', 5, 50000.00);

-- 2. Transaksi Pembelian (+10) -> Stok menjadi 15
INSERT INTO inventory_transactions (item_id, trx_type, qty) 
VALUES ('BRG-01', 'PURCHASE', 10);

-- 3. Transaksi Penjualan Normal (-3) -> Stok menjadi 12
INSERT INTO inventory_transactions (item_id, trx_type, qty) 
VALUES ('BRG-01', 'SALE', 3);

-- 4. Pengujian Anti-Negative Inventory (Jual 20 padahal stok 12) -> ERROR
INSERT INTO inventory_transactions (item_id, trx_type, qty) 
VALUES ('BRG-01', 'SALE', 20);
Hasil Expected: Query ke-4 akan memicu exception dan transaksi dibatalkan (rollback):ERROR: Transaksi ditolak: Stok tidak mencukupi untuk Item ID BRG-01. Stok saat ini: 12, Jumlah Penjualan: 20📝 LisensiProyek ini dibuat untuk keperluan demonstrasi dan implementasi sistem akuntansi terintegrasi.
