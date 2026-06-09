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
    activePeriod,
    setActivePeriod,
    budgets,
    unbudgetedCategories,
    loading,
    prevPeriod,
    nextPeriod,
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
    period?: "daily" | "monthly" | "yearly";
  }) => {
    let res;
    if (selectedBudget) {
      // Edit mode
      res = await updateBudget(selectedBudget.id, formData.amount, formData.alertAt, formData.isRecurring);
    } else if (selectedCategory) {
      // Add mode
      res = await createBudget(selectedCategory.id, formData.amount, formData.alertAt, formData.isRecurring, formData.period);
    }
    
    if (res && res.error) {
      alert(`Gagal menyimpan budget: ${res.error.message || res.error}`);
    } else {
      handleModalClose();
    }
  };

  const handleDeleteBudget = async () => {
    if (selectedBudget) {
      const res = await deleteBudget(selectedBudget.id);
      if (res && res.error) {
        alert(`Gagal menghapus budget: ${res.error.message || res.error}`);
      } else {
        handleModalClose();
      }
    }
  };

  // Date/Period Label formatting
  const getPeriodLabel = () => {
    const { day, month, year } = currentDate;
    if (activePeriod === "daily") {
      const d = new Date(year, month - 1, day);
      return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(d);
    } else if (activePeriod === "monthly") {
      const d = new Date(year, month - 1);
      return new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(d);
    } else {
      return String(year);
    }
  };

  const periodLabel = getPeriodLabel();

  // Sub-heading helper
  const getSubheading = () => {
    if (activePeriod === "daily") return "Pantau batas pengeluaran harian kamu";
    if (activePeriod === "yearly") return "Pantau batas pengeluaran tahunan kamu";
    return "Pantau batas pengeluaran bulanan kamu";
  };

  // Empty state title helper
  const getEmptyTitle = () => {
    if (activePeriod === "daily") return `Belum ada budget harian untuk ${periodLabel}`;
    if (activePeriod === "yearly") return `Belum ada budget tahunan untuk ${periodLabel}`;
    return `Belum ada budget bulanan untuk ${periodLabel}`;
  };

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
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-black font-extrabold text-2xl">Budget</h2>
            <p className="text-gray-400 text-sm mt-0.5">{getSubheading()}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 self-start lg:self-auto w-full lg:w-auto">
            {/* Period Switcher Tabs */}
            <div className="flex bg-gray-50 border border-gray-200/50 p-1 rounded-xl justify-between sm:justify-start">
              <button
                onClick={() => setActivePeriod("daily")}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                  activePeriod === "daily"
                    ? "bg-white text-black shadow-xs"
                    : "text-gray-400 hover:text-black"
                }`}
              >
                Harian
              </button>
              <button
                onClick={() => setActivePeriod("monthly")}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                  activePeriod === "monthly"
                    ? "bg-white text-black shadow-xs"
                    : "text-gray-400 hover:text-black"
                }`}
              >
                Bulanan
              </button>
              <button
                onClick={() => setActivePeriod("yearly")}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                  activePeriod === "yearly"
                    ? "bg-white text-black shadow-xs"
                    : "text-gray-400 hover:text-black"
                }`}
              >
                Tahunan
              </button>
            </div>

            {/* Date Switcher Navigation */}
            <div className="flex items-center gap-3 bg-white border border-gray-100 px-3 py-1.5 rounded-xl shadow-xs w-full sm:w-auto justify-between sm:justify-start">
              <button
                onClick={prevPeriod}
                className="p-1 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-black transition-colors cursor-pointer"
              >
                <IoChevronBackOutline className="w-5 h-5" />
              </button>
              <span className="text-sm font-extrabold text-black min-w-[120px] text-center select-none">
                {periodLabel}
              </span>
              <button
                onClick={nextPeriod}
                disabled={isNextDisabled}
                className={`p-1 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-black transition-colors cursor-pointer ${
                  isNextDisabled ? "opacity-35 cursor-not-allowed hover:bg-transparent" : ""
                }`}
              >
                <IoChevronForwardOutline className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-8 h-8 border-4 border-blue border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 text-xs font-semibold mt-3 animate-pulse">Memuat budget...</p>
          </div>
        ) : budgets.length === 0 ? (
          /* Empty State: No Budget limit set at all */
          <div className="flex flex-col items-center justify-center text-center p-8 bg-white border border-gray-100 rounded-3xl gap-4 min-h-[300px] shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-blue/10 text-blue flex items-center justify-center shadow-xs">
              <IoWalletOutline className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-black font-extrabold text-lg">{getEmptyTitle()}</h3>
              <p className="text-gray-400 text-xs font-semibold mt-1 max-w-sm leading-relaxed">
                Set limit pengeluaran per category untuk mulai memantau. Kamu akan mendapat peringatan sebelum
                budget habis.
              </p>
            </div>
            {unbudgetedCategories.length > 0 && (
              <button
                onClick={() => handleOpenSet(unbudgetedCategories[0])}
                className="btn-primary px-5"
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
              period={activePeriod}
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
                className="text-xs font-bold text-blue hover:underline cursor-pointer"
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
        monthYearLabel={periodLabel}
        activePeriod={activePeriod}
      />
    </MainLayout>
  );
};

export default BudgetPage;
