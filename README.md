# 🧾 Enterprise Financial & Inventory System (EFIS)
> **Modul Voucher Kas Keluar (VKK) & Manajemen Inventaris Anti-Concurrency**

[![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2014+-336791?logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Repositori ini berisi solusi terintegrasi untuk pencatatan akuntansi keuangan modern dan pengelolaan inventaris tingkat lanjut. Sistem ini dirancang untuk mencegah human error pada pencatatan keuangan serta menjamin integritas data transaksi pada lingkungan backend berkecepatan/konkurensi tinggi.

---

## 📸 Antarmuka Pengguna (UI Preview)

| Form Voucher Kas Keluar (Balanced) | Form Voucher Kas Keluar (Discrepancy) |
| :---: | :---: |
| *(Tambahkan screenshot saat debit & kredit seimbang)* | *(Tambahkan screenshot saat ada selisih nominal)* |

---

## ✨ Fitur Unggulan

### 🎨 Frontend: Voucher Kas Keluar (`VoucherForm.js`)
* **Dynamic Journal Entries:** Kemampuan menambah/menghapus baris akun jurnal secara fleksibel[cite: 1].
* **Real-time Balance Validation:** Deteksi otomatis keseimbangan (*balance*) antara Total Debit dan Total Kredit sesuai prinsip *Double-Entry Bookkeeping*[cite: 1].
* **Interactive Lock Submission:** Tombol simpan otomatis dinonaktifkan (*disabled*) jika data belum seimbang atau selisih[cite: 1].
* **Soft Pink Aesthetic UI:** Desain antarmuka bersih, responsif, dan ramah pengguna berbasis Tailwind CSS[cite: 1].
* **Format IDR Otomatis:** Input angka langsung diformat ke dalam mata uang Rupiah (`Rp`)[cite: 1].

### 🗄️ Backend: Database & Keamanan (`PostgreSQL`)
* **Chart of Accounts & Journal Structure (`Sistem Akuntansi.sql`):** Struktur tabel terisolasi antara header transaksi dan rincian jurnal debit/kredit[cite: 2].
* **Pessimistic Locking (`inventory_all_system.sql`):** Penguncian baris berbasis `FOR UPDATE` untuk mencegah *race condition* saat terjadi transaksi stok simultan[cite: 3].
* **Anti-Negative Inventory Trigger (`inventory_all_system.sql`):** Penghentian transaksi otomatis (*Raise Exception*) jika stok barang tidak mencukupi saat transaksi penjualan (`SALE`)[cite: 3].
* **Data Immutability Audit (`audit_trigger.sql`):** Keamanan ekstra menggunakan trigger `BEFORE UPDATE OR DELETE` yang melarang pengubahan atau penghapusan transaksi yang berstatus `POSTED`[cite: 6].

---

## 📂 Struktur Berkas

```text
.
├── VoucherForm.js                # Komponen Utama React untuk Form Voucher Kas Keluar
├── Sistem Akuntansi.sql          # DDL Skema Tabel Utama Akuntansi (CoA & Jurnal)
├── inventory_all_system.sql      # DDL Tabel Inventaris & Fungsi Trigger Mutasi Stok
├── inventory_pessimistic_lock.sql# Script Pengujian Locking Transaksi
├── inventory_test_queries.sql    # Kumpulan Test Case (Purchase, Sale, Anti-Negative)
├── audit_trigger.sql             # Trigger Immutability Transaksi Status POSTED
└── README.md                     # Dokumentasi Proyek
