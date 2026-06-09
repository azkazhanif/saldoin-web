import React from "react";

const FaqSection: React.FC = () => {
  return (
    <section id="faq" className="py-20 md:py-32 px-6 bg-slate-50/50 dark:bg-slate-900/10 border-t border-slate-200 dark:border-slate-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 reveal-element transition-all duration-700 transform opacity-0 translate-y-10">
          <h2 className="text-xs font-bold tracking-widest text-blue uppercase mb-3">FAQ</h2>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Pertanyaan yang Sering Diajukan
          </p>
        </div>

        {/* Accordion Questions */}
        <div className="flex flex-col gap-4">
          <div className="reveal-element transition-all duration-700 transform opacity-0 translate-y-10 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-850 rounded-2xl p-5 shadow-sm">
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-2">Apakah data keuangan saya aman di Saldoin?</h4>
            <p className="text-xs sm:text-sm text-slate-650 dark:text-slate-400 leading-relaxed">
              Ya, privasi dan keamanan data Anda adalah prioritas kami. Semua data dikirimkan melalui enkripsi bank-grade SSL dan disimpan dengan aman. Kami tidak akan pernah membagikan atau menjual data finansial Anda kepada pihak ketiga manapun.
            </p>
          </div>

          <div className="reveal-element transition-all duration-700 [animation-delay:0.1s] transform opacity-0 translate-y-10 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-850 rounded-2xl p-5 shadow-sm">
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-2">Apakah Saldoin berbayar?</h4>
            <p className="text-xs sm:text-sm text-slate-655 dark:text-slate-400 leading-relaxed">
              Saldoin menyediakan fitur pencatatan utama, budgeting, dan pembuatan hingga 3 dompet secara **100% Gratis**. Kami juga menawarkan akun Premium dengan dompet tak terbatas, laporan ekspor Excel, dan analisis kecerdasan buatan.
            </p>
          </div>

          <div className="reveal-element transition-all duration-700 [animation-delay:0.2s] transform opacity-0 translate-y-10 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-850 rounded-2xl p-5 shadow-sm">
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-2">Apakah Saldoin terhubung langsung dengan rekening bank saya?</h4>
            <p className="text-xs sm:text-sm text-slate-655 dark:text-slate-400 leading-relaxed">
              Demi alasan privasi dan kontrol penuh pengguna, saat ini pencatatan di Saldoin dilakukan secara manual atau semi-otomatis melalui upload mutasi. Kami tidak mengumpulkan kredensial bank internet Anda secara langsung.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
