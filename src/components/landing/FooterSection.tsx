import React from "react";
import { IoWalletOutline } from "react-icons/io5";

const FooterSection: React.FC = () => {
  return (
    <footer className="bg-slate-100 dark:bg-slate-955 border-t border-slate-200 dark:border-slate-900 py-16 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Logo & Desc */}
        <div className="md:col-span-5 flex flex-col items-start">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-blue flex items-center justify-center">
              <IoWalletOutline className="text-white text-lg" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              Saldo<span className="text-blue">in</span>
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-500 text-xs sm:text-sm leading-relaxed mb-6 max-w-sm">
            Saldoin berkomitmen membantu masyarakat Indonesia mencapai kebebasan finansial melalui edukasi keuangan dan aplikasi pencatat keuangan yang modern, mudah, dan menyenangkan.
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-600">
            © {new Date().getFullYear()} Saldoin Inc. Hak Cipta Dilindungi Undang-Undang.
          </p>
        </div>

        {/* Links 1 */}
        <div className="md:col-span-2 flex flex-col gap-3.5">
          <p className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-widest">Produk</p>
          <a href="#fitur" className="text-xs sm:text-sm text-slate-600 dark:text-slate-500 hover:text-blue dark:hover:text-white transition-colors">Fitur Aplikasi</a>
          <a href="#demo" className="text-xs sm:text-sm text-slate-600 dark:text-slate-500 hover:text-blue dark:hover:text-white transition-colors">Demo Dashboard</a>
          <span className="text-xs sm:text-sm text-slate-400 dark:text-slate-600 flex items-center gap-1.5 cursor-not-allowed opacity-50">
            Premium <span className="px-1.5 py-0.5 rounded-full bg-blue/15 text-blue text-[8px] font-bold uppercase">Soon</span>
          </span>
        </div>

        {/* Links 2 */}
        <div className="md:col-span-2 flex flex-col gap-3.5">
          <p className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-widest">Perusahaan</p>
          <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-500 hover:text-blue dark:hover:text-white transition-colors cursor-not-allowed opacity-50">Tentang Kami</span>
          <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-500 hover:text-blue dark:hover:text-white transition-colors cursor-not-allowed opacity-50">Karir</span>
          <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-500 hover:text-blue dark:hover:text-white transition-colors cursor-not-allowed opacity-50">Hubungi Kami</span>
        </div>

        {/* Links 3 (Legal) */}
        <div className="md:col-span-3 flex flex-col gap-3.5">
          <p className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-widest">Kebijakan</p>
          <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-500 hover:text-blue dark:hover:text-white transition-colors cursor-not-allowed opacity-50">Ketentuan Layanan</span>
          <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-500 hover:text-blue dark:hover:text-white transition-colors cursor-not-allowed opacity-50">Kebijakan Privasi</span>
          <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-500 hover:text-blue dark:hover:text-white transition-colors cursor-not-allowed opacity-50">Keamanan Data</span>
        </div>

      </div>
    </footer>
  );
};

export default FooterSection;
