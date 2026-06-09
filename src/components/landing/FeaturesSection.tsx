import React from "react";
import { IoWalletOutline, IoTrendingUpOutline, IoPieChartOutline } from "react-icons/io5";

const FeaturesSection: React.FC = () => {
  return (
    <section id="fitur" className="py-20 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24 reveal-element transition-all duration-700 transform opacity-0 translate-y-10">
          <h2 className="text-xs font-bold tracking-widest text-blue uppercase mb-3">FITUR UNGGULAN</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
            Semua Fitur yang Anda Butuhkan untuk Merdeka Finansial
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Kami menyederhanakan pengelolaan uang Anda dengan fitur modern yang dirancang untuk kebutuhan finansial harian Anda.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="reveal-element transition-all duration-700 transform opacity-0 translate-y-10 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-850 hover:border-blue/30 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue/5 dark:hover:shadow-blue/5 group hover:-translate-y-2 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-blue/10 border border-blue/20 text-blue flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <IoWalletOutline size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Multi-Dompet (Wallets)</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Pisahkan dana operasional, tabungan darurat, dan budget hura-hura dalam dompet terpisah untuk menghindari salah pencatatan.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="reveal-element transition-all duration-700 [animation-delay:0.1s] transform opacity-0 translate-y-10 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-850 hover:border-green/30 rounded-2xl p-6 hover:shadow-xl hover:shadow-green/5 dark:hover:shadow-green/5 group hover:-translate-y-2 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-green/10 border border-green/20 text-green flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <IoTrendingUpOutline size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Catat Cepat 3 Detik</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Antarmuka modern mempermudah Anda memasukkan transaksi baru dalam hitungan detik. Cepat, simpel, bebas repot.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="reveal-element transition-all duration-700 [animation-delay:0.2s] transform opacity-0 translate-y-10 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-850 hover:border-amber-500/30 rounded-2xl p-6 hover:shadow-xl hover:shadow-amber-500/5 dark:hover:shadow-amber-500/5 group hover:-translate-y-2 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <IoPieChartOutline size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Budgeting Pintar</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Tetapkan limit belanja untuk setiap kategori. Sistem akan memberi peringatan ketika pengeluaran mendekati limit agar Anda tidak boncos.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="reveal-element transition-all duration-700 [animation-delay:0.3s] transform opacity-0 translate-y-10 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-850 hover:border-purple-500/30 rounded-2xl p-6 hover:shadow-xl hover:shadow-purple-500/5 dark:hover:shadow-purple-500/5 group hover:-translate-y-2 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <IoTrendingUpOutline size={24} className="rotate-90" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Laporan & Analisis</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Lihat ke mana saja uang Anda pergi dengan visualisasi chart yang cantik, mendalam, dan ringkasan bulanan otomatis.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
