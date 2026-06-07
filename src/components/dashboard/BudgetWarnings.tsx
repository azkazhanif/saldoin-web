import React from "react";
import { IoWarningOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import { formatRupiah } from "../../lib/formatters";
import type { BudgetWarningItem } from "../../hooks/useDashboard";
import { 
  IoTrendingUpOutline, 
  IoFastFoodOutline,
  IoCartOutline,
  IoGameControllerOutline,
  IoReceiptOutline,
  IoBriefcaseOutline,
  IoBulbOutline,
  IoRepeatOutline,
  IoCashOutline,
  IoCarOutline,
  IoHeartOutline,
  IoBookOutline,
  IoPeopleOutline,
  IoStorefrontOutline
} from "react-icons/io5";

const iconMap: Record<string, any> = {
  IoBriefcaseOutline: IoBriefcaseOutline,
  IoFastFoodOutline: IoFastFoodOutline,
  IoCartOutline: IoCartOutline,
  IoGameControllerOutline: IoGameControllerOutline,
  IoBulbOutline: IoBulbOutline,
  IoReceiptOutline: IoReceiptOutline,
  IoCashOutline: IoCashOutline,
  IoCarOutline: IoCarOutline,
  IoHeartOutline: IoHeartOutline,
  IoBookOutline: IoBookOutline,
  IoPeopleOutline: IoPeopleOutline,
  IoStorefrontOutline: IoStorefrontOutline,
  IoTrendingUpOutline: IoTrendingUpOutline,
  IoRepeatOutline: IoRepeatOutline
};

interface BudgetWarningsProps {
  warnings: BudgetWarningItem[];
}

const BudgetWarnings: React.FC<BudgetWarningsProps> = ({ warnings }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md h-[320px]">
      <div className="flex flex-col mb-4">
        <h3 className="text-black font-extrabold text-lg flex items-center gap-2">
          <IoWarningOutline className="w-5 h-5 text-amber-500" /> Budget Warnings
        </h3>
        <p className="text-gray-400 text-xs mt-0.5">Categories exceeding 80% of monthly budget</p>
      </div>

      <div className="flex-grow overflow-y-auto pr-1 flex flex-col gap-4">
        {warnings.length > 0 ? (
          warnings.map((w) => {
            const Icon = iconMap[w.iconName] || IoCashOutline;
            const progressColor = w.status === "over" ? "bg-red-500" : "bg-amber-500";
            const textColor = w.status === "over" ? "text-red-700" : "text-amber-700";
            const badgeBg = w.status === "over" ? "bg-red-50" : "bg-amber-50";

            return (
              <div key={w.id} className="flex flex-col gap-2 py-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${w.bgColorClass} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-black font-bold text-sm leading-tight">{w.categoryName}</p>
                      <p className="text-gray-400 text-[10px] mt-0.5">
                        {formatRupiah(w.spent)} / {formatRupiah(w.limit)}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${badgeBg} ${textColor}`}>
                    {w.status === "over" ? "Over Budget" : `${w.percentage}% Used`}
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${progressColor} transition-all duration-500`}
                    style={{ width: `${w.percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-8 h-full">
            <IoCheckmarkCircleOutline className="w-8 h-8 text-green-500" />
            <p className="text-gray-500 text-center text-xs font-semibold">
              All budgets are on track. Good job!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetWarnings;
