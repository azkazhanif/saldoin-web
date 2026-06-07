import MainLayout from "../../layouts/MainLayout";
import { 
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline
} from "react-icons/io5";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const Budget = () => {
  const totalLimit = 14000000;
  const totalSpent = 9800000;
  const percentage = Math.round((totalSpent / totalLimit) * 100);

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-black font-extrabold text-2xl">Budget Limits</h2>
          <p className="text-gray-400 text-sm mt-0.5">Define your monthly limits and tracking flags</p>
        </div>

        {/* Global Budget Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-md">
          <div className="flex-1">
            <h3 className="text-black font-extrabold text-lg">Overall Monthly Budget</h3>
            <p className="text-gray-400 text-xs mt-0.5">Calculated across all outcome categories</p>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Total Limit</p>
                <p className="text-black font-extrabold text-xl mt-0.5">{formatCurrency(totalLimit)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Total Spent</p>
                <p className="text-black font-extrabold text-xl mt-0.5 text-red-500">{formatCurrency(totalSpent)}</p>
              </div>
            </div>
          </div>

          {/* Progress Ring / Bar Visual */}
          <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-gray-50 pt-4 md:pt-0 md:pl-8 flex-shrink-0">
            <div className="w-28 h-28 rounded-full border-8 border-gray-100 flex items-center justify-center relative">
              {/* Inner details */}
              <div className="text-center">
                <span className="text-black font-extrabold text-xl leading-none">{percentage}%</span>
                <p className="text-gray-400 text-[9px] font-bold uppercase mt-1">Used</p>
              </div>
            </div>
            <span className="text-xs text-gray-500 font-semibold mt-4 text-center">
              Remaining: <b>{formatCurrency(totalLimit - totalSpent)}</b>
            </span>
          </div>
        </div>

        {/* Alerts & Warnings Panel */}
        <div>
          <h3 className="text-black font-extrabold text-lg mb-4">Budget Threshold Warnings</h3>
          <div className="flex flex-col gap-4">
            
            {/* Warning threshold item */}
            <div className="bg-amber-50/50 border border-amber-100/50 rounded-2xl p-4 flex items-start gap-3">
              <IoAlertCircleOutline className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-amber-800 font-extrabold text-sm leading-tight">Approach Limit: Utilities & Bills</h4>
                <p className="text-amber-700/80 text-xs mt-1">You spent 76% (Rp 3.050.000) of your Rp 4.000.000 budget in this category. 8 days remaining in monthly period.</p>
              </div>
            </div>

            {/* Safe threshold item */}
            <div className="bg-green-50/50 border border-green-100/50 rounded-2xl p-4 flex items-start gap-3">
              <IoCheckmarkCircleOutline className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-green-800 font-extrabold text-sm leading-tight">Under Control: Entertainment</h4>
                <p className="text-green-700/80 text-xs mt-1">You spent 55% (Rp 1.100.000) of your Rp 2.000.000 budget in this category. This is well within safe thresholds.</p>
              </div>
            </div>

            {/* Alert threshold item */}
            <div className="bg-red-50/50 border border-red-100/50 rounded-2xl p-4 flex items-start gap-3">
              <IoAlertCircleOutline className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-red-800 font-extrabold text-sm leading-tight">Approach Limit: Food & Beverage</h4>
                <p className="text-red-700/80 text-xs mt-1">You spent 69% (Rp 3.450.000) of your Rp 5.000.000 budget in this category. Monitor dining expenses over current weekend.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Budget;
