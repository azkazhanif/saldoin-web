import React from "react";
import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";
import { useTheme } from "../../contexts/ThemeContext";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-all duration-300 active:scale-95 shadow-sm cursor-pointer"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
        {theme === "light" ? (
          <IoMoonOutline className="w-5 h-5 animate-slide-in text-indigo-600" />
        ) : (
          <IoSunnyOutline className="w-5 h-5 animate-slide-in text-amber-400" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
