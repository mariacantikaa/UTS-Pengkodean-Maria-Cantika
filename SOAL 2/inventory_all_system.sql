-- 1. Membuat Tabel Inventory Items (Master Barang)
CREATE TABLE IF NOT EXISTS inventory_items (
    item_id VARCHAR(10) PRIMARY KEY,
    item_name VARCHAR(100),
    stock_qty INT NOT NULL DEFAULT 0,
    unit_cost NUMERIC(15, 2) NOT NULL
);

-- 2. Membuat Tabel Inventory Transactions (Riwayat Transaksi)
CREATE TABLE IF NOT EXISTS inventory_transactions (
    trx_id SERIAL PRIMARY KEY,
    item_id VARCHAR(10) REFERENCES inventory_items(item_id),
    trx_type VARCHAR(10) CHECK (trx_type IN ('PURCHASE', 'SALE', 'ADJUSTMENT')),
    qty INT NOT NULL,
    trx_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Membuat Trigger Function untuk Mutasi Stok, Anti-Negative Inventory, & Concurrency (FOR UPDATE)
CREATE OR REPLACE FUNCTION trg_update_stock_and_journal()
RETURNS TRIGGER AS $$
DECLARE
    v_current_stock INT;
    v_new_stock INT;
BEGIN
    -- Mengunci baris item tertentu untuk mencegah race condition (Pessimistic Locking)
    SELECT stock_qty INTO v_current_stock
    FROM inventory_items
    WHERE item_id = NEW.item_id
    FOR UPDATE;

    -- Hitung perubahan stok berdasarkan jenis transaksi
    IF NEW.trx_type = 'PURCHASE' THEN
        v_new_stock := v_current_stock + NEW.qty;
    ELSIF NEW.trx_type = 'SALE' THEN
        v_new_stock := v_current_stock - NEW.qty;
        
        -- Validasi anti-negative inventory: gagalkan transaksi jika stok kurang dari 0
        IF v_new_stock < 0 THEN
            RAISE EXCEPTION 'Transaksi ditolak: Stok tidak mencukupi untuk Item ID %. Stok saat ini: %, Jumlah Penjualan: %', 
                NEW.item_id, v_current_stock, NEW.qty;
        END IF;
    ELSIF NEW.trx_type = 'ADJUSTMENT' THEN
        v_new_stock := v_current_stock + NEW.qty;
        IF v_new_stock < 0 THEN
            RAISE EXCEPTION 'Transaksi ditolak: Penyesuaian stok mengakibatkan stok negatif pada Item ID %', NEW.item_id;
        END IF;
    END IF;

    -- Perbarui nilai stock_qty pada tabel inventory_items
    UPDATE inventory_items
    SET stock_qty = v_new_stock
    WHERE item_id = NEW.item_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Membuat Trigger yang terikat pada tabel inventory_transactions
DROP TRIGGER IF EXISTS trg_inventory_mutation ON inventory_transactions;
CREATE TRIGGER trg_inventory_mutation
    AFTER INSERT ON inventory_transactions
    FOR EACH ROW
    EXECUTE FUNCTION trg_update_stock_and_journal();