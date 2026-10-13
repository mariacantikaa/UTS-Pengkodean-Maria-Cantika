import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Calendar, 
  User, 
  FileSpreadsheet, 
  Save, 
  RefreshCw,
  Coins,
  ArrowRight
} from 'lucide-react';

const ACCOUNTS_LIST = [
  { code: '1110', name: 'Kas Kecil / Petty Cash' },
  { code: '1120', name: 'Bank BCA - Operational' },
  { code: '2110', name: 'Hutang Usaha / Accounts Payable' },
  { code: '5110', name: 'Biaya Gaji & Tunjangan' },
  { code: '5120', name: 'Biaya Sewa Kantor' },
  { code: '5130', name: 'Biaya Utilitas (Listrik, Air, Internet)' },
  { code: '5140', name: 'Biaya Perlengkapan Kantor' },
  { code: '5150', name: 'Biaya Konsumsi & Rapat' },
  { code: '5210', name: 'Biaya Pemeliharaan & Perbaikan' },
  { code: '6110', name: 'Beban Lain-lain' }
];

export default function App() {
  const [voucherNo, setVoucherNo] = useState('VKK-2026-0042');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [payee, setPayee] = useState('');
  const [memo, setMemo] = useState('');
  
  const [entries, setEntries] = useState([
    { id: 1, account: '5140', debit: 750000, credit: 0, description: 'Pembelian ATK bulanan' },
    { id: 2, account: '1110', debit: 0, credit: 750000, description: 'Pengeluaran kas kecil' }
  ]);

  const [notification, setNotification] = useState(null);

  const totalDebit = entries.reduce((sum, item) => sum + (Number(item.debit) || 0), 0);
  const totalCredit = entries.reduce((sum, item) => sum + (Number(item.credit) || 0), 0);
  const isBalanced = totalDebit > 0 && totalDebit === totalCredit;
  const difference = Math.abs(totalDebit - totalCredit);

  const handleAddRow = () => {
    setEntries([
      ...entries,
      { id: Date.now(), account: ACCOUNTS_LIST[0].code, debit: 0, credit: 0, description: '' }
    ]);
  };

  const handleRemoveRow = (id) => {
    if (entries.length <= 2) {
      setNotification({ type: 'error', message: 'Minimum 2 baris entri jurnal diperlukan dalam akuntansi berpasangan.' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    setEntries(entries.filter(item => item.id !== id));
  };

  const handleEntryChange = (id, field, value) => {
    setEntries(entries.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        // If user inputs debit, auto-clear credit or vice versa for convenience, 
        // though standard accountant entries allow free input.
        if (field === 'debit' && Number(value) > 0) {
          updated.credit = 0;
        } else if (field === 'credit' && Number(value) > 0) {
          updated.debit = 0;
        }
        return updated;
      }
      return item;
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isBalanced) return;

    setNotification({
      type: 'success',
      message: `Voucher Kas Keluar ${voucherNo} berhasil disimpan dan disubmit ke sistem!`
    });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="min-h-screen bg-rose-50/50 text-slate-800 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Title */}
        <header className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-100 text-rose-700 rounded-xl">
              <Receipt className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Voucher Kas Keluar (VKK)</h1>
              <p className="text-sm text-slate-500">Sistem Pencatatan Pengeluaran Kas & Jurnal Akuntansi Berpasangan</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-rose-50/80 px-4 py-2 rounded-xl border border-rose-200/60 text-xs font-semibold text-rose-800">
            <Coins className="w-4 h-4 text-rose-600" />
            <span>Modul Keuangan & Akuntansi</span>
          </div>
        </header>

        {/* Notification Toast */}
        {notification && (
          <div className={`p-4 rounded-xl border flex items-center gap-3 transition-all animate-fade-in ${
            notification.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Header Transaksi */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100 space-y-5">
            <h2 className="text-lg font-semibold text-slate-900 border-b border-rose-50 pb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-rose-500" />
              <span>Informasi Umum Transaksi</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Nomor Voucher */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Nomor Voucher
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <FileSpreadsheet className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={voucherNo}
                    onChange={(e) => setVoucherNo(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-rose-200/80 rounded-xl text-sm font-medium focus:ring-2 focus:ring-rose-400 focus:border-rose-400 focus:bg-white transition-all outline-none"
                    placeholder="Contoh: VKK-2026-0001"
                    required
                  />
                </div>
              </div>

              {/* Tanggal Transaksi */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Tanggal Transaksi
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-rose-200/80 rounded-xl text-sm font-medium focus:ring-2 focus:ring-rose-400 focus:border-rose-400 focus:bg-white transition-all outline-none"
                    required
                  />
                </div>
              </div>

              {/* Dibayarkan Kepada */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Dibayarkan Kepada (Payee)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={payee}
                    onChange={(e) => setPayee(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-rose-200/80 rounded-xl text-sm font-medium focus:ring-2 focus:ring-rose-400 focus:border-rose-400 focus:bg-white transition-all outline-none"
                    placeholder="Nama Vendor / Karyawan / Penerima"
                    required
                  />
                </div>
              </div>

              {/* Keterangan / Memo */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Keterangan / Memo Umum
                </label>
                <input
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-rose-200/80 rounded-xl text-sm font-medium focus:ring-2 focus:ring-rose-400 focus:border-rose-400 focus:bg-white transition-all outline-none"
                  placeholder="Contoh: Pembayaran biaya operasional kantor bulan ini"
                  required
                />
              </div>
            </div>
          </section>

          {/* Section 2: Tabel Entri Jurnal Dinamis */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-rose-50 pb-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Entri Jurnal Akuntansi</h2>
                <p className="text-xs text-slate-500">Tentukan akun debit dan kredit secara berimbang</p>
              </div>
              <button
                type="button"
                onClick={handleAddRow}
                className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm shadow-rose-200 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Baris Jurnal</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500 bg-rose-50/30">
                    <th className="py-3 px-3 rounded-l-xl w-4/12">Akun Perkiraan</th>
                    <th className="py-3 px-3 w-3/12">Keterangan Baris</th>
                    <th className="py-3 px-3 w-2/12 text-right">Debit (Rp)</th>
                    <th className="py-3 px-3 w-2/12 text-right">Kredit (Rp)</th>
                    <th className="py-3 px-3 rounded-r-xl w-1/12 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {entries.map((item, index) => (
                    <tr key={item.id} className="hover:bg-rose-50/20 transition-colors">
                      <td className="py-3 px-3">
                        <select
                          value={item.account}
                          onChange={(e) => handleEntryChange(item.id, 'account', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-rose-400 focus:outline-none"
                        >
                          {ACCOUNTS_LIST.map((acc) => (
                            <option key={acc.code} value={acc.code}>
                              {acc.code} - {acc.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleEntryChange(item.id, 'description', e.target.value)}
                          placeholder="Catatan baris..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          min="0"
                          step="100"
                          value={item.debit === 0 ? '' : item.debit}
                          onChange={(e) => handleEntryChange(item.id, 'debit', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-right font-mono focus:ring-2 focus:ring-rose-400 focus:outline-none"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          min="0"
                          step="100"
                          value={item.credit === 0 ? '' : item.credit}
                          onChange={(e) => handleEntryChange(item.id, 'credit', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-right font-mono focus:ring-2 focus:ring-rose-400 focus:outline-none"
                        />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(item.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Baris"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Section 3 & 4: Live Balanced Indicator & Totals */}
            <div className="pt-4 border-t border-rose-50 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
              
              {/* Indicator Status Card */}
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                isBalanced 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                  : 'bg-rose-100/70 border-rose-200 text-rose-900'
              }`}>
                {isBalanced ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-rose-600 flex-shrink-0" />
                )}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider">
                    {isBalanced ? 'Status: Seimbang (Balanced)' : 'Status: Belum Seimbang (Discrepancy)'}
                  </div>
                  <div className="text-xs opacity-90">
                    {isBalanced 
                      ? 'Total Debit sama dengan Total Kredit. Jurnal valid.' 
                      : totalDebit === 0 && totalCredit === 0
                        ? 'Nilai transaksi masih kosong ($0).'
                        : `Selisih nominal sebesar ${formatIDR(difference)}.`
                    }
                  </div>
                </div>
              </div>

              {/* Totals Summary */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-6 text-right">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Debit</span>
                  <span className="text-base font-bold font-mono text-slate-800">{formatIDR(totalDebit)}</span>
                </div>
                <div className="hidden sm:block text-slate-300 font-bold">|</div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Kredit</span>
                  <span className="text-base font-bold font-mono text-slate-800">{formatIDR(totalCredit)}</span>
                </div>
              </div>

            </div>
          </section>

          {/* Section 5: Action Submission Footer */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={!isBalanced}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm ${
                isBalanced
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200 active:scale-95 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-70'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>Simpan & Submit Voucher</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}