import { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { useBudget } from "../../hooks/useBudget";
import { BudgetSummaryCard } from "../../components/budget/BudgetSummaryCard";
import { BudgetRow } from "../../components/budget/BudgetRow";
import { NoBudgetRow } from "../../components/budget/NoBudgetRow";
import { BudgetModal } from "../../components/budget/BudgetModal";
import type { Budget } from "../../types/budget";
import { IoChevronBackOutline, IoChevronForwardOutline, IoWalletOutline } from "react-icons/io5";

export const BudgetPage = () => {
  const {
    currentDate,
    budgets,
    unbudgetedCategories,
    loading,
    prevMonth,
    nextMonth,
    isNextDisabled,
    createBudget,
    updateBudget,
    deleteBudget,
  } = useBudget();

  // Collapsible section state for unbudgeted categories
  const [isUnbudgetedCollapsed, setIsUnbudgetedCollapsed] = useState(() => {
    return localStorage.getItem("saldooin_budget_unbudgeted_collapsed") === "true";
  });

  // Modal / Selection states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);

  const toggleUnbudgeted = () => {
    setIsUnbudgetedCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("saldooin_budget_unbudgeted_collapsed", String(next));
      return next;
    });
  };

  const handleOpenEdit = (b: Budget) => {
    setSelectedBudget(b);
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenSet = (cat: any) => {
    setSelectedBudget(null);
    setSelectedCategory(cat);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedBudget(null);
    setSelectedCategory(null);
  };

  const handleModalSubmit = async (formData: {
    amount: number;
    alertAt: number;
    isRecurring: boolean;
  }) => {
    if (selectedBudget) {
      // Edit mode
      await updateBudget(selectedBudget.id, formData.amount, formData.alertAt, formData.isRecurring);
    } else if (selectedCategory) {
      // Add mode
      await createBudget(selectedCategory.id, formData.amount, formData.alertAt, formData.isRecurring);
    }
    handleModalClose();
  };

  const handleDeleteBudget = async () => {
    if (selectedBudget) {
      await deleteBudget(selectedBudget.id);
    }
    handleModalClose();
  };

  // Month-Year Label (e.g. "Juni 2026")
  const getMonthLabel = () => {
    const d = new Date(currentDate.year, currentDate.month - 1);
    return new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(d);
  };

  const monthYearLabel = getMonthLabel();

  // Aggregates
  const totalLimit = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + (b.spent || 0), 0);

  // Sorting: over -> warning -> safe -> empty
  const sortedBudgets = [...budgets].sort((a, b) => {
    const aPct = a.percentage || 0;
    const bPct = b.percentage || 0;

    const aOver = aPct >= 100 ? 1 : 0;
    const bOver = bPct >= 100 ? 1 : 0;
    if (aOver !== bOver) return bOver - aOver;

    const aWarn = aPct >= (a.alert_at || 80) ? 1 : 0;
    const bWarn = bPct >= (b.alert_at || 80) ? 1 : 0;
    if (aWarn !== bWarn) return bWarn - aWarn;

    const aSafe = aPct > 0 ? 1 : 0;
    const bSafe = bPct > 0 ? 1 : 0;
    if (aSafe !== bSafe) return bSafe - aSafe;

    return 0;
  });

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-black font-extrabold text-2xl">Budget</h2>
            <p className="text-gray-400 text-sm mt-0.5">Pantau batas pengeluaran bulan ini</p>
          </div>

          {/* Month Switcher Navigation */}
          <div className="flex items-center gap-3 bg-white border border-gray-100 px-3 py-1.5 rounded-xl shadow-xs self-start sm:self-auto">
            <button
              onClick={prevMonth}
              className="p-1 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-black transition-colors cursor-pointer"
            >
              <IoChevronBackOutline className="w-5 h-5" />
            </button>
            <span className="text-sm font-extrabold text-black min-w-[100px] text-center select-none">
              {monthYearLabel}
            </span>
            <button
              onClick={nextMonth}
              disabled={isNextDisabled}
              className={`p-1 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-black transition-colors cursor-pointer ${
                isNextDisabled ? "opacity-35 cursor-not-allowed hover:bg-transparent" : ""
              }`}
            >
              <IoChevronForwardOutline className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-8 h-8 border-4 border-[#1A6B3C] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 text-xs font-semibold mt-3 animate-pulse">Memuat budget...</p>
          </div>
        ) : budgets.length === 0 ? (
          /* Empty State: No Budget limit set at all */
          <div className="flex flex-col items-center justify-center text-center p-8 bg-white border border-gray-100 rounded-3xl gap-4 min-h-[300px] shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-green-50 text-[#1A6B3C] flex items-center justify-center shadow-xs">
              <IoWalletOutline className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-black font-extrabold text-lg">Belum ada budget untuk {monthYearLabel}</h3>
              <p className="text-gray-400 text-xs font-semibold mt-1 max-w-sm leading-relaxed">
                Set limit pengeluaran per category untuk mulai memantau. Kamu akan mendapat peringatan sebelum
                budget habis.
              </p>
            </div>
            {unbudgetedCategories.length > 0 && (
              <button
                onClick={() => handleOpenSet(unbudgetedCategories[0])}
                className="py-2.5 px-5 bg-[#1A6B3C] hover:bg-[#1A6B3C]/95 text-white rounded-xl font-bold text-xs transition-all cursor-pointer shadow-md shadow-[#1A6B3C]/10"
              >
                + Set budget pertama
              </button>
            )}
          </div>
        ) : (
          /* Main Dashboard Content when budgets are present */
          <div className="flex flex-col gap-6">
            {/* Overall Summary Card */}
            <BudgetSummaryCard
              totalSpent={totalSpent}
              totalLimit={totalLimit}
              onSetFirstBudget={
                unbudgetedCategories.length > 0 ? () => handleOpenSet(unbudgetedCategories[0]) : undefined
              }
            />

            {/* Section: Monitored Budgets */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <h3 className="text-gray-400 font-extrabold text-xs uppercase tracking-wider shrink-0">
                  Sudah ada limit
                </h3>
                <hr className="flex-1 border-gray-100" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedBudgets.map((b) => (
                  <BudgetRow key={b.id} budget={b} onClick={() => handleOpenEdit(b)} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section: Unmonitored Categories */}
        {!loading && unbudgetedCategories.length > 0 && (
          <div className="space-y-4 mt-2">
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={toggleUnbudgeted}
                className="flex items-center gap-1.5 text-gray-400 font-extrabold text-xs uppercase tracking-wider hover:text-black cursor-pointer select-none"
              >
                <span>Belum ada limit — tap untuk set</span>
                <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md font-bold">
                  {unbudgetedCategories.length}
                </span>
              </button>
              <hr className="flex-1 border-gray-100" />
              <button
                onClick={toggleUnbudgeted}
                className="text-xs font-bold text-[#1A6B3C] hover:underline cursor-pointer"
              >
                {isUnbudgetedCollapsed ? "Tampilkan" : "Sembunyikan"}
              </button>
            </div>

            {!isUnbudgetedCollapsed && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                {unbudgetedCategories.map((cat) => (
                  <NoBudgetRow key={cat.id} category={cat} onClick={() => handleOpenSet(cat)} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Set/Edit Budget Modal */}
      <BudgetModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        onDelete={handleDeleteBudget}
        budget={selectedBudget}
        category={selectedCategory}
        monthYearLabel={monthYearLabel}
      />
    </MainLayout>
  );
};

export default BudgetPage;
