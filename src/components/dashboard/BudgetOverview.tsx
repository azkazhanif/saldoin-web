import React from "react";
import { formatRupiah } from "../../lib/formatters";
import { IoCheckmarkCircleOutline, IoAlertCircleOutline } from "react-icons/io5";

export interface BudgetOverviewData {
  limit: number;
  spent: number;
  percentage: number;
}

interface BudgetOverviewProps {
  data: BudgetOverviewData;
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({ data }) => {
  const remaining = data.limit - data.spent;
  const isOver = data.percentage >= 100;
  const isWarning = data.percentage >= 80 && data.percentage < 100;

  let statusColor = "text-[#1A6B3C]";
  let progressBg = "bg-[#1A6B3C]";
  let cardBorder = "border-gray-100";

  if (isOver) {
    statusColor = "text-red-600";
    progressBg = "bg-red-600";
    cardBorder = "border-red-100";
  } else if (isWarning) {
    statusColor = "text-amber-500";
    progressBg = "bg-amber-500";
    cardBorder = "border-amber-100";
  }

  return (
    <div className={`bg-white border rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md ${cardBorder}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-black font-extrabold text-lg">Budget Overview</h3>
          <p className="text-gray-400 text-xs mt-0.5">Total monthly budget usage status</p>
        </div>
        {isOver ? (
          <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2.5 py-1 rounded-full text-[10px] font-bold border border-red-100">
            <IoAlertCircleOutline className="w-3.5 h-3.5" />
            <span>Over Budget</span>
          </div>
        ) : isWarning ? (
          <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full text-[10px] font-bold border border-amber-100">
            <IoAlertCircleOutline className="w-3.5 h-3.5" />
            <span>Warning</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2.5 py-1 rounded-full text-[10px] font-bold border border-green-100">
            <IoCheckmarkCircleOutline className="w-3.5 h-3.5" />
            <span>On Track</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {/* Big percentage highlight */}
        <div className="flex items-baseline gap-2">
          <span className={`text-4xl font-extrabold tracking-tight ${statusColor}`}>
            {data.percentage}%
          </span>
          <span className="text-gray-400 text-xs font-semibold">of limit used</span>
        </div>

        {/* Thick progress bar */}
        <div className="w-full bg-gray-100 h-3.5 rounded-full overflow-hidden border border-gray-200/50">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${progressBg}`}
            style={{ width: `${Math.min(data.percentage, 100)}%` }}
          />
        </div>

        {/* Stats details */}
        <div className="grid grid-cols-3 gap-2 mt-2 pt-4 border-t border-gray-50 text-center">
          <div>
            <p className="text-gray-400 text-[9px] uppercase font-bold tracking-wider">Budget limit</p>
            <p className="text-black font-extrabold text-xs mt-1">{formatRupiah(data.limit)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-[9px] uppercase font-bold tracking-wider">Total Spent</p>
            <p className="text-black font-extrabold text-xs mt-1">{formatRupiah(data.spent)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-[9px] uppercase font-bold tracking-wider">
              {remaining >= 0 ? "Remaining" : "Over Limit"}
            </p>
            <p className={`font-extrabold text-xs mt-1 ${remaining >= 0 ? "text-[#1A6B3C]" : "text-red-600"}`}>
              {formatRupiah(Math.abs(remaining))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetOverview;
