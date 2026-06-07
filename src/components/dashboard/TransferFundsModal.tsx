import React, { useState, useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";
import type { DashboardWallet } from "../../hooks/useDashboard";

interface TransferFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallets: DashboardWallet[];
  onSubmit: (data: {
    sourceWalletId: string;
    destWalletId: string;
    amount: number;
    note: string;
    date: string;
    adminFee?: number;
  }) => Promise<void>;
}

const TransferFundsModal: React.FC<TransferFundsModalProps> = ({
  isOpen,
  onClose,
  wallets,
  onSubmit,
}) => {
  const [sourceWalletId, setSourceWalletId] = useState("");
  const [destWalletId, setDestWalletId] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [hasAdminFee, setHasAdminFee] = useState(false);
  const [adminFee, setAdminFee] = useState<number | "">(6500);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setNote("");
      setDate(new Date().toISOString().split("T")[0]);
      setHasAdminFee(false);
      setAdminFee(6500);
      setError("");
      
      if (wallets.length > 0) {
        setSourceWalletId(wallets[0].id);
        if (wallets.length > 1) {
          setDestWalletId(wallets[1].id);
        } else {
          setDestWalletId(wallets[0].id);
        }
      }
    }
  }, [isOpen, wallets]);

  if (!isOpen) return null;

  const selectedSourceWallet = wallets.find((w) => w.id === sourceWalletId);
  const selectedDestWallet = wallets.find((w) => w.id === destWalletId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceWalletId) {
      setError("Please select a source wallet.");
      return;
    }
    if (!destWalletId) {
      setError("Please select a destination wallet.");
      return;
    }
    if (sourceWalletId === destWalletId) {
      setError("Source and destination wallets must be different.");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (hasAdminFee && (adminFee === "" || Number(adminFee) < 0)) {
      setError("Please enter a valid admin fee amount.");
      return;
    }

    const feeAmount = hasAdminFee && adminFee !== "" ? Number(adminFee) : 0;
    const totalAmountRequired = Number(amount) + feeAmount;

    // Balance check
    if (selectedSourceWallet && selectedSourceWallet.balance < totalAmountRequired) {
      setError(
        `Insufficient funds in wallet "${selectedSourceWallet.name}"! Available balance: Rp ${selectedSourceWallet.balance.toLocaleString("id-ID")}. Total required (with fee): Rp ${totalAmountRequired.toLocaleString("id-ID")}`
      );
      return;
    }

    setLoading(true);
    setError("");
    try {
      await onSubmit({
        sourceWalletId,
        destWalletId,
        amount: Number(amount),
        note,
        date,
        adminFee: hasAdminFee && adminFee !== "" ? Number(adminFee) : undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to execute transfer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-md border border-gray-100 flex flex-col gap-4 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-black font-extrabold text-lg">Transfer Funds</h3>
            <p className="text-gray-400 text-xs mt-0.5">Move money between accounts</p>
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
          {/* Source Wallet selection */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-500">From (Source Wallet)</label>
              {selectedSourceWallet && (
                <span className="text-[10px] text-gray-400 font-semibold">
                  Balance: Rp {selectedSourceWallet.balance.toLocaleString("id-ID")}
                </span>
              )}
            </div>
            <select
              value={sourceWalletId}
              onChange={(e) => setSourceWalletId(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white"
            >
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} (Rp {w.balance.toLocaleString("id-ID")})
                </option>
              ))}
            </select>
          </div>

          {/* Destination Wallet selection */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-500">To (Destination Wallet)</label>
              {selectedDestWallet && (
                <span className="text-[10px] text-gray-400 font-semibold">
                  Balance: Rp {selectedDestWallet.balance.toLocaleString("id-ID")}
                </span>
              )}
            </div>
            <select
              value={destWalletId}
              onChange={(e) => setDestWalletId(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white"
            >
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} (Rp {w.balance.toLocaleString("id-ID")})
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500">Amount (IDR)</label>
            <input
              type="number"
              required
              placeholder="e.g. 100000"
              value={amount}
              onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white"
            />
          </div>

          {/* Transfer Note */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500">Note / Description (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Bayar Utang, Transfer Bulanan"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white"
            />
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500">Transfer Date</label>
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
                id="transferAdminFeeCheckbox"
                checked={hasAdminFee}
                onChange={(e) => setHasAdminFee(e.target.checked)}
                className="w-4 h-4 rounded text-blue border-gray-300 focus:ring-blue cursor-pointer"
              />
              <label htmlFor="transferAdminFeeCheckbox" className="text-xs font-bold text-gray-500 cursor-pointer select-none">
                Add Admin Fee (Didebit terpisah dari sumber)
              </label>
            </div>

            {hasAdminFee && (
              <div className="flex flex-col gap-1 pl-6 animate-in slide-in-from-top-1 duration-200">
                <label className="text-xs font-bold text-gray-400">Admin Fee Amount (IDR)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 6500"
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
              {loading ? "Sending..." : "Execute Transfer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferFundsModal;
