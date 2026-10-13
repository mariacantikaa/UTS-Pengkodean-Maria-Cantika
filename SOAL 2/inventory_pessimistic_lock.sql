-- Masukkan data awal barang (Stok awal 5)
INSERT INTO inventory_items (item_id, item_name, stock_qty, unit_cost) 
VALUES ('BRG-01', 'Kertas A4', 5, 50000.00);

-- Uji Penjualan melebihi stok (Mau jual 20 padahal sisa 5 - Akan memicu Error / Exception)
INSERT INTO inventory_transactions (item_id, trx_type, qty) 
VALUES ('BRG-01', 'SALE', 20);