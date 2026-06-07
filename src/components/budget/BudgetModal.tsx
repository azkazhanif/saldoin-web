import { useState, useEffect } from "react";
import { iconMap } from "../categories/iconHelper";
import { IoCloseOutline } from "react-icons/io5";
import type { Budget } from "../../types/budget";

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { amount: number; alertAt: number; isRecurring: boolean }) => void;
  onDelete?: () => void;
  budget?: Budget | null;
  category: { id: string; name: string; icon: string; color: string } | null;
  monthYearLabel: string;
}

export const BudgetModal = ({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  budget,
  category,
  monthYearLabel,
}: BudgetModalProps) => {
  const [amountInput, setAmountInput] = useState("");
  const [alertAt, setAlertAt] = useState(80);
  const [isRecurring, setIsRecurring] = useState(true);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isEditMode = !!budget;
  const targetCategory = budget ? budget.category : category;

  useEffect(() => {
    if (isOpen) {
      if (budget) {
        setAmountInput(new Intl.NumberFormat("id-ID").format(budget.amount));
        setAlertAt(budget.alert_at || 80);
        setIsRecurring(budget.is_recurring ?? true);
      } else {
        setAmountInput("");
        setAlertAt(80);
        setIsRecurring(true);
      }
      setIsConfirmDeleteOpen(false);
      setErrorMsg("");
    }
  }, [isOpen, budget]);

  if (!isOpen || !targetCategory) return null;

  const IconComponent = iconMap[targetCategory.icon] || iconMap["Gift"];

  const formatNumberString = (val: string) => {
    const clean = val.replace(/\D/g, "");
    if (!clean) return "";
    return new Intl.NumberFormat("id-ID").format(Number(clean));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountInput(formatNumberString(e.target.value));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const parsedAmount = Number(amountInput.replace(/\D/g, ""));
    if (!parsedAmount || parsedAmount < 1000) {
      setErrorMsg("Limit budget minimal adalah Rp 1.000.");
      return;
    }

    onSubmit({
      amount: parsedAmount,
      alertAt,
      isRecurring,
    });
  };

  if (isConfirmDeleteOpen && onDelete) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
        <div className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-md border border-gray-100 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
          <div>
            <h3 className="text-black font-extrabold text-lg">Hapus Limit</h3>
            <p className="text-gray-400 text-xs mt-0.5">Konfirmasi penghapusan budget</p>
          </div>

          <div className="text-sm font-semibold text-black/80 leading-relaxed py-2">
            Hapus limit budget untuk <strong className="text-black">"{targetCategory.name}"</strong>?{" "}
            Transaksi yang sudah ada tidak terpengaruh.
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => setIsConfirmDeleteOpen(false)}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-black hover:bg-gray-50 text-xs font-bold transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-red-600/10"
            >
              Hapus limit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-md border border-gray-100 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: `${targetCategory.color}15`,
                color: targetCategory.color,
              }}
            >
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-black font-extrabold text-base leading-tight">
                {isEditMode
                  ? `Edit Limit: ${targetCategory.name}`
                  : `Set Limit: ${targetCategory.name}`}
              </h3>
              <p className="text-gray-400 text-xs mt-0.5 font-medium">
                Budget ini berlaku untuk {monthYearLabel}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-black cursor-pointer"
          >
            <IoCloseOutline className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          {errorMsg && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold px-3 py-2 rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* Limit Amount */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500">Limit per bulan</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-sm font-bold text-gray-400 select-none">Rp</span>
              <input
                type="text"
                required
                placeholder="1.500.000"
                value={amountInput}
                onChange={handleAmountChange}
                className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1A6B3C] bg-white font-extrabold text-sm text-black"
              />
            </div>
          </div>

          {/* Threshold Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-bold text-gray-500">
              <label>Tampilkan peringatan saat mencapai</label>
              <span className="text-black">{alertAt}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              step="5"
              value={alertAt}
              onChange={(e) => setAlertAt(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#1A6B3C]"
            />
            <p className="text-[10px] text-gray-400 font-medium">
              Peringatan muncul saat pengeluaran mencapai {alertAt}% dari limit
            </p>
          </div>

          {/* Recurring Option */}
          <div className="flex items-start gap-3 py-1">
            <input
              id="recurring-checkbox"
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-gray-300 text-[#1A6B3C] focus:ring-[#1A6B3C] accent-[#1A6B3C]"
            />
            <label htmlFor="recurring-checkbox" className="flex flex-col cursor-pointer select-none">
              <span className="text-xs font-bold text-black">Ulangi limit ini setiap bulan</span>
              <span className="text-[10px] text-gray-400 font-medium mt-0.5">
                Kamu tetap bisa mengubah limit di bulan berikutnya
              </span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-between items-center gap-3 mt-4">
            {isEditMode && onDelete && (
              <button
                type="button"
                onClick={() => setIsConfirmDeleteOpen(true)}
                className="py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-xs"
              >
                Hapus limit
              </button>
            )}

            <div className="flex gap-2 flex-1 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 hover:bg-gray-100 text-gray-600 rounded-xl font-bold text-xs transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="py-2.5 px-6 bg-[#1A6B3C] hover:bg-[#1A6B3C]/95 text-white rounded-xl font-bold text-xs transition-all cursor-pointer shadow-md shadow-[#1A6B3C]/10"
              >
                Simpan limit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default BudgetModal;
