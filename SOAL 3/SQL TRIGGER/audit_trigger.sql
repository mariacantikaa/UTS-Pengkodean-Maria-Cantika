-- 1. Buat fungsi untuk mencegah modifikasi atau penghapusan data transaksi yang sudah POSTED
CREATE OR REPLACE FUNCTION prevent_posted_transaction_alteration()
RETURNS TRIGGER AS $$
BEGIN
    -- Cek apakah transaksi sudah berstatus 'POSTED'
    IF OLD.status = 'POSTED' THEN
        RAISE EXCEPTION 'Pelanggaran Keamanan: Transaksi kas keluar yang sudah diposting (POSTED) bersifat immutable dan tidak boleh di-update atau dihapus!';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Terapkan trigger BEFORE UPDATE OR DELETE pada tabel transaksi kas keluar
CREATE TRIGGER trg_enforce_vkk_immutability
BEFORE UPDATE OR DELETE ON voucher_kas_keluar
FOR EACH ROW
EXECUTE FUNCTION prevent_posted_transaction_alteration();