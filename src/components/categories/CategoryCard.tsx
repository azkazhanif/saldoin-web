import { useState } from "react";
import type { Category } from "../../types/category";
import { iconMap } from "./iconHelper";

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
}

export const CategoryCard = ({ category, onClick }: CategoryCardProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const IconComponent = iconMap[category.icon] || iconMap["Gift"];

  const handleClick = () => {
    if (category.is_default) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    } else {
      onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 transition-all duration-300 shadow-xs cursor-pointer select-none group min-h-[120px] ${
        category.is_default
          ? "hover:border-gray-200"
          : "hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      {/* Tooltip for default categories */}
      {showTooltip && (
        <div className="absolute inset-x-2 -top-10 bg-slate-900 text-white text-[10px] md:text-xs font-semibold px-2 py-1.5 rounded-lg shadow-md z-20 text-center animate-in fade-in slide-in-from-bottom-2 duration-200">
          Category default tidak bisa diedit atau dihapus
          <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
        </div>
      )}

      {/* Default Badge at Top Right */}
      {category.is_default && (
        <span className="absolute top-2.5 right-2.5 text-[9px] bg-slate-100 border border-slate-200 text-slate-500 font-bold px-1.5 py-0.5 rounded-md">
          Default
        </span>
      )}

      {/* Icon Circle */}
      <div
        className="w-11 h-11 rounded-[10px] flex items-center justify-center flex-shrink-0"
        style={{
          backgroundColor: `${category.color}15`,
          color: category.color,
        }}
      >
        <IconComponent className="w-5 h-5" />
      </div>

      {/* Name */}
      <h3 className="text-black font-semibold text-[13px] leading-tight truncate max-w-full">
        {category.name}
      </h3>

      {/* Transactions Count */}
      <span className="text-gray-400 text-[11px] font-medium">
        {category.transaction_count || 0} transaksi
      </span>
    </div>
  );
};
