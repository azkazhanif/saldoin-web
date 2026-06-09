import React, { useEffect } from "react";
import { Link } from "react-router";
import { IoArrowForward } from "react-icons/io5";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import DemoSection from "../components/landing/DemoSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import FaqSection from "../components/landing/FaqSection";
import FooterSection from "../components/landing/FooterSection";

const LandingPage: React.FC = () => {
  const { user } = useAuth();

  // Simple scroll reveal effect using Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-10");
          }
        });
      },
      { threshold: 0.1 }
    );

    // Give react components a moment to mount before observing
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll(".reveal-element");
      elements.forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timer);
      const elements = document.querySelectorAll(".reveal-element");
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-poppins selection:bg-blue selection:text-white transition-colors duration-300 overflow-x-hidden">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue/5 dark:bg-blue/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[800px] right-1/4 w-[600px] h-[600px] bg-green-500/5 dark:bg-green/5 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-[200px] left-1/3 w-[500px] h-[500px] bg-blue/5 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Modular Navbar */}
      <Navbar user={user} />

      {/* Hero Section */}
      <HeroSection user={user} />

      {/* Feature Cards Grid Section */}
      <FeaturesSection />

      {/* Interactive Mock Dashboard Section */}
      <DemoSection />

      {/* Social Proof / Testimonials Section */}
      <TestimonialsSection />

      {/* FAQ Accordion Section */}
      <FaqSection />

      {/* CTA Get Started Banner */}
      <section className="py-20 md:py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue/5 to-indigo-900/10 dark:from-blue/20 dark:to-indigo-900/30 -z-10" />
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue/90 to-indigo-900/90 border border-blue/30 dark:border-blue/40 rounded-3xl p-8 md:p-16 text-center shadow-2xl relative overflow-hidden reveal-element transition-all duration-700 transform opacity-0 translate-y-10">
          
          <div className="absolute -top-16 -left-16 w-32 h-32 bg-blue rounded-full blur-2xl opacity-40 pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-green-500 rounded-full blur-2xl opacity-30 pointer-events-none" />

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight animate-fade-in">
            Siap Kendalikan <br className="sm:hidden" /> Keuanganmu Sekarang?
          </h2>
          <p className="text-blue-100 text-sm sm:text-base md:text-lg mb-8 max-w-2xl mx-auto">
            Bergabunglah bersama puluhan ribu pengguna lain yang telah mewujudkan kebiasaan keuangan sehat mereka. Hanya butuh waktu 1 menit untuk mendaftar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user ? (
              <Link
                to="/dashboard"
                className="px-8 py-4 rounded-xl bg-white text-blue hover:bg-slate-50 font-extrabold text-sm sm:text-base shadow-lg transition-all hover:scale-105 w-full sm:w-auto text-center cursor-pointer flex items-center justify-center gap-2"
              >
                Buka Dashboard Saya <IoArrowForward />
              </Link>
            ) : (
              <>
                <Link
                  to="/auth/register"
                  className="px-8 py-4 rounded-xl bg-white text-blue hover:bg-slate-50 font-extrabold text-sm sm:text-base shadow-lg transition-all hover:scale-105 w-full sm:w-auto text-center cursor-pointer"
                >
                  Mulai Daftar Gratis
                </Link>
                <Link
                  to="/auth/login"
                  className="px-8 py-4 rounded-xl border border-white/30 text-white hover:bg-white/10 font-extrabold text-sm sm:text-base transition-all w-full sm:w-auto text-center"
                >
                  Sudah Punya Akun? Masuk
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <FooterSection />
    </div>
  );
};

export default LandingPage;
