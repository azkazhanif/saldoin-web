import React from "react";
import { IoStar } from "react-icons/io5";

const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimoni" className="py-20 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24 reveal-element transition-all duration-700 transform opacity-0 translate-y-10">
          <h2 className="text-xs font-bold tracking-widest text-blue uppercase mb-3">TESTIMONI PENGGUNA</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
            Dipercaya oleh Ribuan Orang yang Ingin Finansialnya Sehat
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Apa kata mereka yang sudah mengubah kebiasaan finansial mereka menggunakan Saldoin?
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="reveal-element transition-all duration-700 transform opacity-0 translate-y-10 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-850 rounded-2xl p-6 relative flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              {/* Stars */}
              <div className="flex gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => <IoStar key={i} />)}
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm italic leading-relaxed mb-6">
                "Semenjak pakai Saldoin, saya jadi tahu uang bulanan saya habis di mana saja. Ternyata paling banyak bocor di kopi dan jajan sore. Fitur budget-nya membantu menekan nafsu belanja impulsif!"
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-900">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-855 text-blue dark:text-blue flex items-center justify-center font-extrabold text-sm">
                RI
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Rinaldi Irawan</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-500">Software Engineer</p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="reveal-element transition-all duration-700 [animation-delay:0.1s] transform opacity-0 translate-y-10 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-850 rounded-2xl p-6 relative flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <div className="flex gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => <IoStar key={i} />)}
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm italic leading-relaxed mb-6">
                "Udah coba berbagai macam aplikasi catatan keuangan, cuma Saldoin yang paling nyaman dan ga ribet. Desain UI-nya bersih banget, modern, dan paling penting: sinkronisasi datanya super cepat!"
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-900">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-855 text-blue dark:text-blue flex items-center justify-center font-extrabold text-sm">
                AP
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Amelia Putri</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-500">Karyawan Swasta</p>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="reveal-element transition-all duration-700 [animation-delay:0.2s] transform opacity-0 translate-y-10 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-850 rounded-2xl p-6 relative flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <div className="flex gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => <IoStar key={i} />)}
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm italic leading-relaxed mb-6">
                "Fitur multi-wallet bener-bener ngebantu saya yang punya banyak rekening bank dan e-wallet. Nyatetin cashflow bisnis sampingan dan kebutuhan pribadi jadi terpisah rapi. Recommended!"
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-900">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-855 text-blue dark:text-blue flex items-center justify-center font-extrabold text-sm">
                DN
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Dwi Nando</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-500">Entrepreneur</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
