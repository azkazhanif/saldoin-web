import { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import { 
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline
} from "react-icons/io5";

const defaultCategories = [
  { id: "1", name: "Gaji", budget: 18250000, type: "income", color: "bg-green-600", bgColor: "bg-green-50 text-green-600", iconName: "IoBriefcaseOutline" },
  { id: "2", name: "Freelance", budget: 3250000, type: "income", color: "bg-emerald-600", bgColor: "bg-emerald-50 text-emerald-600", iconName: "IoReceiptOutline" },
  { id: "3", name: "Bisnis", budget: 0, type: "income", color: "bg-green-700", bgColor: "bg-green-50 text-green-700", iconName: "IoStorefrontOutline" },
  { id: "4", name: "Transfer Masuk", budget: 0, type: "income", color: "bg-sky-600", bgColor: "bg-sky-50 text-sky-600", iconName: "IoRepeatOutline" },
  { id: "5", name: "Lain-lain (Income)", budget: 0, type: "income", color: "bg-gray-500", bgColor: "bg-gray-50 text-gray-500", iconName: "IoCashOutline" },
  { id: "6", name: "Makan & Minum", budget: 5000000, type: "outcome", color: "bg-amber-500", bgColor: "bg-amber-50 text-amber-600", iconName: "IoFastFoodOutline" },
  { id: "7", name: "Transport", budget: 1500000, type: "outcome", color: "bg-blue", bgColor: "bg-blue/10 text-blue", iconName: "IoCarOutline" },
  { id: "8", name: "Hiburan", budget: 2000000, type: "outcome", color: "bg-purple-500", bgColor: "bg-purple-50 text-purple-600", iconName: "IoGameControllerOutline" },
  { id: "9", name: "Kesehatan", budget: 1000000, type: "outcome", color: "bg-red-500", bgColor: "bg-red-50 text-red-600", iconName: "IoHeartOutline" },
  { id: "10", name: "Belanja", budget: 3000000, type: "outcome", color: "bg-blue-600", bgColor: "bg-blue/10 text-blue-600", iconName: "IoCartOutline" },
  { id: "11", name: "Tagihan", budget: 4000000, type: "outcome", color: "bg-orange-500", bgColor: "bg-orange-50 text-orange-600", iconName: "IoBulbOutline" },
  { id: "12", name: "Pendidikan", budget: 0, type: "outcome", color: "bg-teal-600", bgColor: "bg-teal-50 text-teal-600", iconName: "IoBookOutline" },
  { id: "13", name: "Sosial", budget: 0, type: "outcome", color: "bg-rose-500", bgColor: "bg-rose-50 text-rose-600", iconName: "IoPeopleOutline" },
  { id: "14", name: "Investasi", budget: 0, type: "outcome", color: "bg-indigo-600", bgColor: "bg-indigo-50 text-indigo-600", iconName: "IoTrendingUpOutline" },
  { id: "15", name: "Lain-lain", budget: 0, type: "outcome", color: "bg-gray-500", bgColor: "bg-gray-50 text-gray-500", iconName: "IoCashOutline" },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const Budget = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const localCats = localStorage.getItem("saldooin_categories");
    const localTxs = localStorage.getItem("saldooin_transactions");

    const loadedCats = localCats ? JSON.parse(localCats) : defaultCategories;
    const loadedTxs = localTxs ? JSON.parse(localTxs) : [];

    setCategories(loadedCats);
    setTransactions(loadedTxs);

    if (!localCats) localStorage.setItem("saldooin_categories", JSON.stringify(defaultCategories));
  }, []);

  // Filter outcome categories
  const expenseCategories = categories.filter(c => c.type === "outcome");

  // Sum total limit
  const totalLimit = expenseCategories.reduce((sum, c) => sum + c.budget, 0);

  // Sum total spent (only expenses)
  const totalSpent = transactions
    .filter(t => t.type === "outcome")
    .reduce((sum, t) => sum + t.amount, 0);

  const percentage = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;

  // Generate warning items dynamically
  const alerts = expenseCategories.map(category => {
    const spent = transactions
      .filter(t => t.category === category.name && t.type === "outcome")
      .reduce((sum, t) => sum + t.amount, 0);

    const ratio = category.budget > 0 ? spent / category.budget : 0;
    const percentageUsed = Math.round(ratio * 100);

    return {
      categoryName: category.name,
      spent,
      budget: category.budget,
      percentage: percentageUsed,
      ratio
    };
  });

  const warnings = alerts.filter(a => a.ratio >= 0.7);
  const safeAlerts = alerts.filter(a => a.ratio < 0.7);

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
                <p className={`font-extrabold text-xl mt-0.5 ${percentage >= 100 ? "text-red-500" : (percentage >= 70 ? "text-amber-500" : "text-black")}`}>
                  {formatCurrency(totalSpent)}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Ring Visual */}
          <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-gray-50 pt-4 md:pt-0 md:pl-8 flex-shrink-0">
            <div className={`w-28 h-28 rounded-full border-8 flex items-center justify-center relative ${
              percentage >= 100 ? "border-red-500" : (percentage >= 70 ? "border-amber-400" : "border-blue")
            }`}>
              <div className="text-center animate-pulse">
                <span className="text-black font-extrabold text-xl leading-none">{percentage}%</span>
                <p className="text-gray-400 text-[9px] font-bold uppercase mt-1">Used</p>
              </div>
            </div>
            <span className="text-xs text-gray-500 font-semibold mt-4 text-center">
              Remaining: <b>{formatCurrency(Math.max(0, totalLimit - totalSpent))}</b>
            </span>
          </div>
        </div>

        {/* Alerts & Warnings Panel */}
        <div>
          <h3 className="text-black font-extrabold text-lg mb-4">Budget Threshold Warnings</h3>
          <div className="flex flex-col gap-4">
            
            {/* Real Warnings list */}
            {warnings.length > 0 ? (
              warnings.map((warn, index) => {
                const isExceeded = warn.percentage >= 100;
                const containerClass = isExceeded 
                  ? "bg-red-50/50 border border-red-100/50 text-red-800" 
                  : "bg-amber-50/50 border border-amber-100/50 text-amber-800";
                
                const titleText = isExceeded 
                  ? `Limit Exceeded: ${warn.categoryName}` 
                  : `Approaching Limit: ${warn.categoryName}`;
                
                const subText = isExceeded
                  ? `Alert! You spent ${warn.percentage}% (${formatCurrency(warn.spent)}) of your ${formatCurrency(warn.budget)} budget. Stop making purchases in this category immediately.`
                  : `Caution. You spent ${warn.percentage}% (${formatCurrency(warn.spent)}) of your ${formatCurrency(warn.budget)} budget. Monitor your transactions to avoid overrunning.`;

                return (
                  <div key={index} className={`rounded-2xl p-4 flex items-start gap-3 ${containerClass}`}>
                    <IoAlertCircleOutline className={`w-6 h-6 flex-shrink-0 mt-0.5 ${isExceeded ? "text-red-500" : "text-amber-500"}`} />
                    <div>
                      <h4 className="font-extrabold text-sm leading-tight">{titleText}</h4>
                      <p className="text-xs mt-1 opacity-90">{subText}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              /* If no warnings, show congratulations message */
              <div className="bg-green-50/50 border border-green-100/50 rounded-2xl p-4 flex items-start gap-3 text-green-800">
                <IoCheckmarkCircleOutline className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-sm leading-tight">All Budgets Safe</h4>
                  <p className="text-xs mt-1 text-green-700/90">Good job! All category expenses are below the 70% threshold warning line. Keep tracking your wallet.</p>
                </div>
              </div>
            )}

            {/* List safe categories for info */}
            {safeAlerts.length > 0 && (
              <div className="mt-2">
                <h4 className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Safe Zones</h4>
                <div className="flex flex-wrap gap-2">
                  {safeAlerts.map((safe, idx) => (
                    <span key={idx} className="bg-gray-50 border border-gray-100 text-gray-500 text-xs font-semibold px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      {safe.categoryName} ({safe.percentage}%)
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Budget;
