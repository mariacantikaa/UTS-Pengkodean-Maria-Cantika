-- 1. Tabel Daftar Akun (Chart of Accounts)
CREATE TABLE IF NOT EXISTS chart_of_accounts (
    account_id SERIAL PRIMARY KEY,
    account_code VARCHAR(20) UNIQUE NOT NULL,
    account_name VARCHAR(100) NOT NULL,
    normal_balance VARCHAR(10)
);

-- 2. Tabel Header Jurnal (Transaksi Utama)
CREATE TABLE IF NOT EXISTS journal_headers (
    id SERIAL PRIMARY KEY,
    reference_no VARCHAR(50) UNIQUE NOT NULL,
    transaction_date DATE NOT NULL,
    description TEXT,
    status_posting VARCHAR(20) DEFAULT 'DRAFT'
);

-- 3. Tabel Baris Jurnal (Rincian Debit & Kredit)
CREATE TABLE IF NOT EXISTS journal_lines (
    id SERIAL PRIMARY KEY,
    header_id INT REFERENCES journal_headers(id) ON DELETE CASCADE,
    account_id INT REFERENCES chart_of_accounts(account_id),
    debit NUMERIC(15,2) DEFAULT 0.00,
    credit NUMERIC(15,2) DEFAULT 0.00
);