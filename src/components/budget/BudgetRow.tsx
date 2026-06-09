import type { Budget } from "../../types/budget";
import { formatRupiah } from "../../lib/formatters";
import { iconMap } from "../categories/iconHelper";
import { resolveCategoryColor } from "../categories/colorHelper";

interface BudgetRowProps {
  budget: Budget;
  onClick: () => void;
}

export const BudgetRow = ({ budget, onClick }: BudgetRowProps) => {
  const spent = budget.spent || 0;
  const limit = budget.amount;
  const percentage = budget.percentage || 0;

  const IconComponent = iconMap[budget.category.icon] || iconMap["Gift"];
  const resolvedColor = resolveCategoryColor(budget.category.color);

  const isOver = percentage >= 100;
  const isWarning = percentage >= (budget.alert_at || 80) && percentage < 100;

  let progressBg = "";
  let textStatusColor = "";
  let borderClass = "border-gray-100 hover:border-gray-200";

  if (isOver) {
    progressBg = "bg-red-600";
    textStatusColor = "text-red-600";
    borderClass = "border-red-500 hover:border-red-600 bg-red-50/5";
  } else if (isWarning) {
    progressBg = "bg-amber-500";
    textStatusColor = "text-amber-600";
    borderClass = "border-gray-100 hover:border-amber-200";
  } else {
    textStatusColor = "text-black";
  }

  return (
    <div
      onClick={onClick}
      className={`bg-white border rounded-2xl p-4 flex flex-col gap-3 transition-all duration-300 shadow-xs cursor-pointer select-none ${borderClass}`}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: `${resolvedColor}15`,
              color: resolvedColor,
            }}
          >
            <IconComponent className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="text-black font-extrabold text-sm sm:text-base leading-tight truncate">
                {budget.category.name}
              </h4>
              {isOver && (
                <span className="text-[9px] bg-red-100 border border-red-200 text-red-600 font-bold px-1.5 py-0.5 rounded-md flex-shrink-0">
                  Over budget!
                </span>
              )}
              {isWarning && (
                <span className="text-[9px] bg-amber-100 border border-amber-200 text-amber-600 font-bold px-1.5 py-0.5 rounded-md flex-shrink-0">
                  Hampir habis
                </span>
              )}
            </div>
            <p className="text-gray-400 text-xs mt-0.5 font-medium">
              {formatRupiah(spent)} dari {formatRupiah(limit)}
            </p>
          </div>
        </div>

        <div className="text-right flex-shrink-0 max-w-[50%]">
          <p
            className={`font-extrabold text-sm sm:text-base leading-tight ${
              isOver ? "text-red-600" : "text-black"
            }`}
          >
            {isOver ? (
              <span className="text-xs font-bold block">
                {formatRupiah(spent)} MELEBIHI limit {formatRupiah(limit)}
              </span>
            ) : (
              formatRupiah(limit)
            )}
          </p>
          <span 
            className={`text-xs font-bold ${textStatusColor}`}
            style={{ color: (!isOver && !isWarning) ? resolvedColor : undefined }}
          >
            {percentage}%
          </span>
        </div>
      </div>

      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${progressBg}`}
          style={{ 
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: (!isOver && !isWarning) ? resolvedColor : undefined
          }}
        />
      </div>
    </div>
  );
};
export default BudgetRow;
