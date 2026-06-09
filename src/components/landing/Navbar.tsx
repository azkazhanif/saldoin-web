import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { IoWalletOutline, IoCloseOutline, IoMenuOutline, IoArrowForward } from "react-icons/io5";
import ThemeToggle from "../atoms/ThemeToggle";

interface NavbarProps {
  user: any;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-350 ${
        scrolled
          ? "py-3 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-900 shadow-md"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-blue flex items-center justify-center shadow-lg shadow-blue/20 group-hover:scale-105 transition-transform duration-300">
            <IoWalletOutline className="text-white text-xl" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
            Saldo<span className="text-blue">in</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8 font-semibold text-sm text-slate-600 dark:text-slate-400">
          <a href="#fitur" className="hover:text-blue dark:hover:text-white transition-colors">Fitur</a>
          <a href="#demo" className="hover:text-blue dark:hover:text-white transition-colors">Coba Demo</a>
          <a href="#testimoni" className="hover:text-blue dark:hover:text-white transition-colors">Testimoni</a>
          <a href="#faq" className="hover:text-blue dark:hover:text-white transition-colors">FAQ</a>
        </div>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />

          {user ? (
            <Link to="/dashboard" className="btn-primary">
              Ke Dashboard <IoArrowForward className="text-sm" />
            </Link>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-blue dark:hover:text-white transition-colors px-3 py-2"
              >
                Masuk
              </Link>
              <Link to="/auth/register" className="btn-primary">
                Mulai Gratis <IoArrowForward className="text-sm" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            className="p-2 text-slate-700 dark:text-slate-300 hover:text-blue dark:hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <IoCloseOutline size={28} /> : <IoMenuOutline size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-900 px-6 py-6 flex flex-col gap-5 shadow-xl animate-fade-in">
          <a
            href="#fitur"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-semibold text-slate-700 dark:text-slate-300 hover:text-blue dark:hover:text-white transition-colors"
          >
            Fitur
          </a>
          <a
            href="#demo"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-semibold text-slate-700 dark:text-slate-300 hover:text-blue dark:hover:text-white transition-colors"
          >
            Coba Demo
          </a>
          <a
            href="#testimoni"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-semibold text-slate-700 dark:text-slate-300 hover:text-blue dark:hover:text-white transition-colors"
          >
            Testimoni
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-semibold text-slate-700 dark:text-slate-300 hover:text-blue dark:hover:text-white transition-colors"
          >
            FAQ
          </a>
          <hr className="border-slate-200 dark:border-slate-900" />
          <div className="flex flex-col gap-3">
            {user ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary justify-center py-3"
              >
                Ke Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center font-bold text-slate-700 dark:text-slate-300 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-all"
                >
                  Masuk
                </Link>
                <Link
                  to="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary justify-center py-3"
                >
                  Mulai Gratis
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
