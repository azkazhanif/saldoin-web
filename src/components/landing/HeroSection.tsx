import React from "react";
import { Link } from "react-router";
import { IoTrendingUpOutline, IoTrendingDownOutline, IoSparklesOutline, IoArrowForward } from "react-icons/io5";
import hero3d from "../../assets/hero-3d.png";

interface HeroSectionProps {
  user: any;
}

const HeroSection: React.FC<HeroSectionProps> = ({ user }) => {
  return (
    <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Hero Content */}
        <div className="lg:col-span-7 flex flex-col items-start text-left relative z-10">
          {/* Promo Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue/10 border border-blue/20 dark:border-blue/30 text-blue font-bold text-xs mb-6 shadow-sm shadow-blue/5 animate-pulse">
            <IoSparklesOutline className="text-sm" />
            <span>Pencatat Keuangan Paling Intuitif #1 di Indonesia</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900 dark:text-white mb-6">
            Catat Keuangan <br />
            <span className="bg-gradient-to-r from-blue via-indigo-650 to-green dark:via-indigo-400 bg-clip-text text-transparent">
              Lebih Mudah & Terarah
            </span>
          </h1>

          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
            Jangan biarkan uangmu menguap tanpa jejak. <span className="font-semibold text-slate-800 dark:text-slate-200">Saldoin</span> membantu mencatat setiap transaksi, mengatur anggaran bulanan, dan menganalisis pengeluaran agar impian finansialmu cepat terwujud.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {user ? (
              <Link
                to="/dashboard"
                className="btn-primary px-8 py-4 text-sm sm:text-base justify-center shadow-lg shadow-blue/20 hover:shadow-blue/30 scale-105"
              >
                Ke Dashboard Saya <IoArrowForward className="text-sm" />
              </Link>
            ) : (
              <Link
                to="/auth/register"
                className="btn-primary px-8 py-4 text-sm sm:text-base justify-center shadow-lg shadow-blue/20 hover:shadow-blue/30 scale-105"
              >
                Mulai Catat Sekarang
              </Link>
            )}
            <a
              href="#demo"
              className="px-8 py-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-850 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm"
            >
              Coba Demo Interaktif
            </a>
          </div>

          {/* Micro Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-slate-200 dark:border-slate-900 w-full max-w-lg">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">50k+</p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-500">Pengguna Aktif</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Rp 10T+</p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-500">Dana Terkelola</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">4.8★</p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-500">Rating Playstore</p>
            </div>
          </div>
        </div>

        {/* Hero Image (3D Asset) */}
        <div className="lg:col-span-5 relative flex justify-center items-center">
          <div className="absolute w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-blue/10 dark:bg-blue/15 rounded-full blur-[100px] animate-pulse -z-10" />
          <div className="relative w-full max-w-[420px] transition-transform duration-500 hover:scale-[1.03] cursor-pointer">
            {/* Premium 3D Generated Image */}
            <img
              src={hero3d}
              alt="Saldoin 3D Illustration"
              className="w-full h-auto drop-shadow-[0_15px_35px_rgba(0,101,225,0.15)] dark:drop-shadow-[0_20px_50px_rgba(0,101,225,0.3)] rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/50 dark:bg-slate-950/20 backdrop-blur-sm p-2"
            />
            {/* Floating micro indicators */}
            <div className="absolute -top-4 -right-4 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-850 backdrop-blur-md rounded-2xl p-3 shadow-xl flex items-center gap-3 animate-float [animation-delay:1.5s]">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 dark:bg-green/20 flex items-center justify-center">
                <IoTrendingUpOutline className="text-green text-lg" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">PEMASUKAN</p>
                <p className="text-xs font-bold text-slate-800 dark:text-white">+Rp 15.000.000</p>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-850 backdrop-blur-md rounded-2xl p-3 shadow-xl flex items-center gap-3 animate-float [animation-delay:3s]">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 dark:bg-rose-500/20 flex items-center justify-center">
                <IoTrendingDownOutline className="text-rose-500 text-lg" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">PENGELUARAN</p>
                <p className="text-xs font-bold text-slate-800 dark:text-white">-Rp 1.250.000</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
