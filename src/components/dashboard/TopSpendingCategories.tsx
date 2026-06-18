import React from "react";
import { iconMap } from "../categories/iconHelper";
import { formatRupiah } from "../../lib/formatters";
import { resolveCategoryColor } from "../categories/colorHelper";

export interface SpendingCategoryItem {
  name: string;
  amount: number;
  percentage: number;
  color: string;
  icon: string;
}

interface TopSpendingCategoriesProps {
  categories: SpendingCategoryItem[];
}

export const TopSpendingCategories: React.FC<TopSpendingCategoriesProps> = ({ categories }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md h-[320px]">
      <div className="flex flex-col mb-4">
        <h3 className="text-black font-extrabold text-lg">Top Spending Categories</h3>
        <p className="text-gray-400 text-xs mt-0.5">Your highest expenses this month</p>
      </div>

      <div className="flex-grow flex flex-col justify-center gap-4">
        {categories.map((item, index) => {
          const IconComponent = iconMap[item.icon] || iconMap["Gift"];
          const resolvedColor = resolveCategoryColor(item.color);

          return (
            <div key={index} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: `${resolvedColor}15`,
                      color: resolvedColor,
                    }}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-black font-bold text-sm leading-tight">{item.name}</p>
                    <p className="text-gray-400 text-[10px] mt-0.5">{item.percentage}% of spending</p>
                  </div>
                </div>
                <span className="text-black font-extrabold text-sm">
                  {formatRupiah(item.amount)}
                </span>
              </div>
              {/* Progress Bar matching Category color */}
              <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden border border-gray-100/30">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${item.percentage}%`,
                    backgroundColor: resolvedColor 
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopSpendingCategories;
