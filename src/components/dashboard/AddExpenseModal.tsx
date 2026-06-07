import React, { useState, useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";
import type { DashboardCategory, DashboardWallet } from "../../hooks/useDashboard";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: DashboardCategory[];
  wallets: DashboardWallet[];
  onSubmit: (data: {
    title: string;
    amount: number;
    categoryId: string;
    walletId: string;
    date: string;
    adminFee?: number;
  }) => Promise<void>;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  categories,
  wallets,
  onSubmit,
}) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [categoryId, setCategoryId] = useState("");
  const [walletId, setWalletId] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [hasAdminFee, setHasAdminFee] = useState(false);
  const [adminFee, setAdminFee] = useState<number | "">(2500);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const outcomeCategories = categories.filter((c) => c.type === "outcome");

  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setAmount("");
      setDate(new Date().toISOString().split("T")[0]);
      setHasAdminFee(false);
      setAdminFee(2500);
      setError("");
      
      if (outcomeCategories.length > 0) {
        setCategoryId(outcomeCategories[0].id);
      }
      if (wallets.length > 0) {
        setWalletId(wallets[0].id);
      }
    }
  }, [isOpen, categories, wallets]);

  if (!isOpen) return null;

  const selectedWallet = wallets.find((w) => w.id === walletId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please fill in the title.");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (!categoryId) {
      setError("Please select a category.");
      return;
    }
    if (!walletId) {
      setError("Please select a wallet.");
      return;
    }
    if (hasAdminFee && (adminFee === "" || Number(adminFee) < 0)) {
      setError("Please enter a valid admin fee amount.");
      return;
    }

    const feeAmount = hasAdminFee && adminFee !== "" ? Number(adminFee) : 0;
    const totalAmountRequired = Number(amount) + feeAmount;

    // Balance check
    if (selectedWallet && selectedWallet.balance < totalAmountRequired) {
      setError(
        `Insufficient funds in wallet "${selectedWallet.name}"! Available balance: Rp ${selectedWallet.balance.toLocaleString("id-ID")}. Total required (with fee): Rp ${totalAmountRequired.toLocaleString("id-ID")}`
      );
      return;
    }

    setLoading(true);
    setError("");
    try {
      await onSubmit({
        title,
        amount: Number(amount),
        categoryId,
        walletId,
        date,
        adminFee: hasAdminFee && adminFee !== "" ? Number(adminFee) : undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to add expense transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-md border border-gray-100 flex flex-col gap-4 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-black font-extrabold text-lg">Add Expense</h3>
            <p className="text-gray-400 text-xs mt-0.5">Log an outgoing transaction</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-black cursor-pointer"
          >
            <IoCloseOutline className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500">Transaction Note</label>
            <input
              type="text"
              required
              placeholder="e.g. Starbucks, Makan Siang"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white"
            />
          </div>

          {/* Amount */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-500">Amount (IDR)</label>
              {selectedWallet && (
                <span className="text-[10px] text-gray-400 font-semibold">
                  Limit: Rp {selectedWallet.balance.toLocaleString("id-ID")}
                </span>
              )}
            </div>
            <input
              type="number"
              required
              placeholder="e.g. 50000"
              value={amount}
              onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white"
            />
          </div>

          {/* Category selection */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500">Expense Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white"
            >
              {outcomeCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Wallet selection */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500">Source Wallet</label>
            <select
              value={walletId}
              onChange={(e) => setWalletId(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white"
            >
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} (Balance: Rp {w.balance.toLocaleString("id-ID")})
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500">Transaction Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white"
            />
          </div>

          {/* Admin Fee Checkbox */}
          <div className="flex flex-col gap-2 mt-1">
            <div className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                id="expenseAdminFeeCheckbox"
                checked={hasAdminFee}
                onChange={(e) => setHasAdminFee(e.target.checked)}
                className="w-4 h-4 rounded text-blue border-gray-300 focus:ring-blue cursor-pointer"
              />
              <label htmlFor="expenseAdminFeeCheckbox" className="text-xs font-bold text-gray-500 cursor-pointer select-none">
                Add Admin Fee (Didebit terpisah)
              </label>
            </div>

            {hasAdminFee && (
              <div className="flex flex-col gap-1 pl-6 animate-in slide-in-from-top-1 duration-200">
                <label className="text-xs font-bold text-gray-400">Admin Fee Amount (IDR)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 2500"
                  value={adminFee}
                  onChange={(e) => setAdminFee(e.target.value === "" ? "" : Number(e.target.value))}
                  className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm text-black focus:outline-none focus:border-blue bg-white"
                />
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-black hover:bg-gray-50 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-blue hover:bg-blue-600 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-blue/10 disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {loading ? "Saving..." : "Save Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
