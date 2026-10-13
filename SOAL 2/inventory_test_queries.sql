-- Uji A: Masukkan data awal barang (Stok awal 5)
INSERT INTO inventory_items (item_id, item_name, stock_qty, unit_cost) 
VALUES ('BRG-01', 'Kertas A4', 5, 50000.00);

-- Uji B: Transaksi Pembelian (Stok bertambah 10 jadi 15)
INSERT INTO inventory_transactions (item_id, trx_type, qty) 
VALUES ('BRG-01', 'PURCHASE', 10);

-- Uji C: Transaksi Penjualan Normal (Stok dikurangi 3 jadi 12 - BERHASIL)
INSERT INTO inventory_transactions (item_id, trx_type, qty) 
VALUES ('BRG-01', 'SALE', 3);

-- Uji D: Uji Anti-Negative Inventory (Mau jual 20 padahal sisa 12 - AKAN ERROR/GAGAL)
INSERT INTO inventory_transactions (item_id, trx_type, qty) 
VALUES ('BRG-01', 'SALE', 20);