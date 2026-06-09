import { formatRupiah, formatRupiahCompact } from "../../lib/formatters";

interface BudgetSummaryCardProps {
  totalSpent: number;
  totalLimit: number;
  onSetFirstBudget?: () => void;
  period?: "daily" | "monthly" | "yearly";
}

export const BudgetSummaryCard = ({
  totalSpent,
  totalLimit,
  onSetFirstBudget,
  period = "monthly",
}: BudgetSummaryCardProps) => {
  const hasBudgets = totalLimit > 0;
  const remaining = totalLimit - totalSpent;
  const percentage = hasBudgets ? Math.round((totalSpent / totalLimit) * 100) : 0;

  const getStatusColor = (percent: number) => {
    if (percent >= 100) return "text-red-600 bg-red-50 border-red-100";
    if (percent >= 80) return "text-amber-600 bg-amber-50 border-amber-100";
    return "text-green-600 bg-green-50 border-green-100";
  };

  const getProgressBg = (percent: number) => {
    if (percent >= 100) return "bg-red-600";
    if (percent >= 80) return "bg-amber-500";
    return "bg-blue";
  };

  const getSpentTextColor = (percent: number) => {
    if (percent >= 100) return "text-red-600";
    if (percent >= 80) return "text-amber-600";
    return "text-green-600";
  };

  const getPeriodText = () => {
    if (period === "daily") return "hari ini";
    if (period === "yearly") return "tahun ini";
    return "bulan ini";
  };

  if (!hasBudgets) {
    return (
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs flex flex-col items-center justify-center text-center gap-3 min-h-[160px]">
        <p className="text-gray-400 text-sm font-semibold">
          Belum ada budget. Set limit untuk mulai memantau pengeluaran {getPeriodText()}.
        </p>
        {onSetFirstBudget && (
          <button
            onClick={onSetFirstBudget}
            className="btn-primary mt-1"
          >
            + Set budget pertama
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs flex flex-col gap-5 transition-all hover:shadow-sm">
      {/* Top row */}
      <div className="flex justify-between items-center">
        <h3 className="text-black font-extrabold text-base">Ringkasan {getPeriodText()}</h3>
        <span
          className={`text-xs font-extrabold border rounded-full px-3 py-1 ${getStatusColor(
            percentage
          )}`}
        >
          {percentage}% terpakai
        </span>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getProgressBg(
              percentage
            )}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-gray-500">
            {formatRupiah(totalSpent)} dari {formatRupiah(totalLimit)}
          </span>
          <span className={remaining >= 0 ? "text-blue" : "text-red-600"}>
            {remaining >= 0 ? `Sisa ${formatRupiah(remaining)}` : `Over ${formatRupiah(Math.abs(remaining))}`}
          </span>
        </div>
      </div>

      {/* Grid Stats */}
      <hr className="border-gray-100" />
      <div className="grid grid-cols-3 divide-x divide-gray-100 text-center">
        <div>
          <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Total Limit</p>
          <p className="text-black font-extrabold text-base mt-1">
            {formatRupiahCompact(totalLimit)}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Sudah Terpakai</p>
          <p className={`font-extrabold text-base mt-1 ${getSpentTextColor(percentage)}`}>
            {formatRupiahCompact(totalSpent)}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Sisa Budget</p>
          <p className={`font-extrabold text-base mt-1 ${remaining >= 0 ? "text-blue" : "text-red-600"}`}>
            {formatRupiahCompact(remaining)}
          </p>
        </div>
      </div>
    </div>
  );
};
export default BudgetSummaryCard;
