import React, { useState } from "react";
import {
  IoWalletOutline,
  IoTrendingUpOutline,
  IoTrendingDownOutline,
  IoListOutline,
  IoAddOutline,
  IoCloseOutline
} from "react-icons/io5";

interface MockTransaction {
  id: number;
  title: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  date: string;
}

const DemoSection: React.FC = () => {
  // Interactive Mock Dashboard states
  const [balance, setBalance] = useState(5750000);
  const [transactions, setTransactions] = useState<MockTransaction[]>([
    { id: 1, title: "Gaji Bulanan", category: "Pemasukan", amount: 8000000, type: "income", date: "Hari ini" },
    { id: 2, title: "Belanja Bulanan", category: "Belanja", amount: 1500000, type: "expense", date: "Kemarin" },
    { id: 3, title: "Kopi & Cemilan", category: "Makanan", amount: 250005, type: "expense", date: "2 hari lalu" },
    { id: 4, title: "Tagihan Listrik", category: "Tagihan", amount: 500000, type: "expense", date: "3 hari lalu" }
  ]);

  // Form states
  const [isAddingMock, setIsAddingMock] = useState(false);
  const [mockTitle, setMockTitle] = useState("");
  const [mockAmount, setMockAmount] = useState("");
  const [mockType, setMockType] = useState<"income" | "expense">("expense");
  const [mockCategory, setMockCategory] = useState("Lain-lain");

  // Handle adding mock transaction
  const handleAddMockTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mockTitle || !mockAmount) return;

    const amountNum = parseFloat(mockAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    const newTx: MockTransaction = {
      id: Date.now(),
      title: mockTitle,
      category: mockCategory,
      amount: amountNum,
      type: mockType,
      date: "Hari ini"
    };

    setTransactions([newTx, ...transactions]);
    if (mockType === "income") {
      setBalance(balance + amountNum);
    } else {
      setBalance(balance - amountNum);
    }

    // Reset fields
    setMockTitle("");
    setMockAmount("");
    setIsAddingMock(false);
  };

  // Helper for formatting currency
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(num);
  };

  // Simulated chart data
  const categoriesStats = [
    { name: "Gaji & Pemasukan", amount: transactions.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0), color: "bg-green-500" },
    { name: "Belanja", amount: transactions.filter(t => t.category === "Belanja").reduce((acc, t) => acc + t.amount, 0), color: "bg-blue/80" },
    { name: "Makanan", amount: transactions.filter(t => t.category === "Makanan").reduce((acc, t) => acc + t.amount, 0), color: "bg-amber-500" },
    { name: "Tagihan", amount: transactions.filter(t => t.category === "Tagihan").reduce((acc, t) => acc + t.amount, 0), color: "bg-rose-500" },
    { name: "Lain-lain", amount: transactions.filter(t => t.category === "Lain-lain" || (t.category !== "Belanja" && t.category !== "Makanan" && t.category !== "Tagihan" && t.type === "expense")).reduce((acc, t) => acc + t.amount, 0), color: "bg-purple-500" }
  ];

  return (
    <section id="demo" className="py-20 md:py-32 px-6 bg-slate-50 dark:bg-slate-900/20 border-y border-slate-200 dark:border-slate-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Interactive Info */}
        <div className="lg:col-span-5 text-left reveal-element transition-all duration-700 transform opacity-0 translate-y-10">
          <h2 className="text-xs font-bold tracking-widest text-blue uppercase mb-3">DEMO INTERAKTIF</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
            Rasakan Kemudahan Mencatat Secara Langsung!
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-6">
            Di sebelah kanan adalah simulasi live dashboard dari Saldoin. Silakan coba klik tombol **"Catat Pengeluaran Baru"** atau buat pencatatan transaksi kustom Anda sendiri untuk melihat bagaimana Saldoin menghitung saldo dan merangkum grafik secara instan.
          </p>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue/10 text-blue flex items-center justify-center font-bold text-xs mt-1">1</div>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                <span className="font-semibold text-slate-900 dark:text-white">Interaksi Instan:</span> Tambahkan data dan perhatikan perubahan saldo secara real-time.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue/10 text-blue flex items-center justify-center font-bold text-xs mt-1">2</div>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                <span className="font-semibold text-slate-900 dark:text-white">Visualisasi Dinamis:</span> Pengeluaran dikategorikan langsung secara berkala.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue/10 text-blue flex items-center justify-center font-bold text-xs mt-1">3</div>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                <span className="font-semibold text-slate-900 dark:text-white">Simulasi Nyata:</span> Persis seperti cara kerja aplikasi saldoin sesungguhnya.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={() => {
                setMockTitle("Beli Sepatu Baru");
                setMockAmount("750000");
                setMockType("expense");
                setMockCategory("Belanja");
                setIsAddingMock(true);
              }}
              className="btn-primary"
            >
              Coba Catat: Beli Sepatu (+Rp 750rb)
            </button>
          </div>
        </div>

        {/* Interactive Simulation Dashboard UI */}
        <div className="lg:col-span-7 reveal-element transition-all duration-700 [animation-delay:0.2s] transform opacity-0 translate-y-10">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-w-xl mx-auto">
            
            {/* Dashboard Header Bar */}
            <div className="bg-slate-100 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs text-slate-500 ml-2 font-semibold">Demo Dashboard Saldoin v1.0</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-blue/10 text-blue font-bold text-[10px] tracking-wider uppercase">
                Live Preview
              </div>
            </div>

            <div className="p-6 flex flex-col gap-6">
              {/* Total Balance Card */}
              <div className="bg-gradient-to-br from-blue to-indigo-850 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-blue/20">
                <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
                  <IoWalletOutline size={180} />
                </div>
                <p className="text-xs text-blue-100 font-bold tracking-widest uppercase mb-1">TOTAL SALDO AKTIF</p>
                <p className="text-3xl font-extrabold tracking-tight mb-4 transition-all duration-300">
                  {formatRupiah(balance)}
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-white/10 text-xs">
                  <div>
                    <p className="text-blue-200">Income Bulan Ini</p>
                    <p className="font-bold text-green-300 text-sm mt-0.5 animate-fade-in">
                      +{formatRupiah(transactions.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0))}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-200 text-right">Expense Bulan Ini</p>
                    <p className="font-bold text-rose-300 text-sm mt-0.5 text-right animate-fade-in">
                      -{formatRupiah(transactions.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0))}
                    </p>
                  </div>
                </div>
              </div>

              {/* Categories Live Animated Chart Preview */}
              <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-850 rounded-2xl p-5">
                <p className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest mb-4">Pengeluaran per Kategori</p>
                <div className="flex flex-col gap-3">
                  {categoriesStats.slice(1).map((cat, i) => {
                    const totalExpenses = Math.max(1, transactions.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0));
                    const percentageWidth = Math.min(100, Math.round((cat.amount / totalExpenses) * 100));
                    
                    return (
                      <div key={i} className="flex flex-col gap-1.5 animate-fade-in">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-700 dark:text-slate-300">{cat.name}</span>
                          <span className="text-slate-500 dark:text-slate-400">{formatRupiah(cat.amount)} ({percentageWidth}%)</span>
                        </div>
                        {/* Custom Animated Progress Bar */}
                        <div className="w-full bg-slate-200 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${cat.color} rounded-full transition-all duration-700`}
                            style={{
                              width: `${cat.amount > 0 && balance > 0 ? percentageWidth : 0}%`
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Transactions Log Header */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <IoListOutline /> Transaksi Terakhir
                </span>
                <button
                  onClick={() => setIsAddingMock(true)}
                  className="text-xs font-bold text-blue hover:text-blue-600 dark:hover:text-blue-450 transition-colors flex items-center gap-1 cursor-pointer bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm"
                >
                  <IoAddOutline /> Catat Manual
                </button>
              </div>

              {/* Add Mock Transaction Popover Form */}
              {isAddingMock && (
                <form
                  onSubmit={handleAddMockTransaction}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col gap-4 animate-fade-in shadow-inner"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold text-blue uppercase tracking-wider">Catat Keuangan Baru</span>
                    <button
                      type="button"
                      onClick={() => setIsAddingMock(false)}
                      className="text-slate-500 hover:text-slate-750 dark:text-slate-400 dark:hover:text-white"
                    >
                      <IoCloseOutline size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase block mb-1">Nama Transaksi</label>
                      <input
                        type="text"
                        required
                        value={mockTitle}
                        onChange={(e) => setMockTitle(e.target.value)}
                        placeholder="e.g. Beli Makan Siang"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-950 dark:text-white focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/10 transition-all font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase block mb-1">Jumlah (Rp)</label>
                      <input
                        type="number"
                        required
                        value={mockAmount}
                        onChange={(e) => setMockAmount(e.target.value)}
                        placeholder="e.g. 50000"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-950 dark:text-white focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/10 transition-all font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase block mb-1">Jenis</label>
                      <select
                        value={mockType}
                        onChange={(e) => setMockType(e.target.value as "income" | "expense")}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-950 dark:text-white focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/10 transition-all font-semibold"
                      >
                        <option value="expense">Pengeluaran (Out)</option>
                        <option value="income">Pemasukan (In)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase block mb-1">Kategori</label>
                      <select
                        value={mockCategory}
                        onChange={(e) => setMockCategory(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-950 dark:text-white focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/10 transition-all font-semibold"
                      >
                        <option value="Belanja">Belanja</option>
                        <option value="Makanan">Makanan/Minuman</option>
                        <option value="Tagihan">Tagihan</option>
                        <option value="Lain-lain">Lain-lain</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-blue hover:bg-blue/90 text-white font-bold text-xs py-2 rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    Simpan Transaksi
                  </button>
                </form>
              )}

              {/* Transactions list */}
              <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-xl p-3 flex justify-between items-center hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-colors animate-fade-in"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          tx.type === "income"
                            ? "bg-green-500/10 text-green-600 dark:text-green-500"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-500"
                        }`}
                      >
                        {tx.type === "income" ? <IoTrendingUpOutline /> : <IoTrendingDownOutline />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{tx.title}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-500">{tx.category} • {tx.date}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-extrabold ${tx.type === "income" ? "text-green-600 dark:text-green-400" : "text-rose-600 dark:text-rose-400"}`}>
                      {tx.type === "income" ? "+" : "-"}
                      {formatRupiah(tx.amount)}
                    </span>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default DemoSection;
