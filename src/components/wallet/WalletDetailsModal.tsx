import React from "react";
import { IoCloseOutline } from "react-icons/io5";
import type { WalletItem } from "../../hooks/useWallet";
import {
  walletColorSwatches,
  getProviderDefaultColor,
  getWalletGradientStyle,
} from "../../hooks/useWallet";

// Indonesian Rupiah currency formatting utility
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

interface WalletDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedWallet: WalletItem;

  // Editing states and handlers
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  editWallet: {
    name: string;
    type: string;
    provider: string;
    balance: number;
    color: string;
  };
  setEditWallet: React.Dispatch<
    React.SetStateAction<{
      name: string;
      type: string;
      provider: string;
      balance: number;
      color: string;
    }>
  >;
  onEditSubmit: (e: React.FormEvent) => void;

  // Deletion states and handlers
  isConfirmingDelete: boolean;
  setIsConfirmingDelete: (val: boolean) => void;
  deleteLoading: boolean;
  onDeleteConfirm: () => void;
}

export const WalletDetailsModal: React.FC<WalletDetailsModalProps> = ({
  isOpen,
  onClose,
  selectedWallet,
  isEditing,
  setIsEditing,
  editWallet,
  setEditWallet,
  onEditSubmit,
  isConfirmingDelete,
  setIsConfirmingDelete,
  deleteLoading,
  onDeleteConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-md border border-gray-100 flex flex-col gap-5 animate-in zoom-in-95 duration-200">
        {isEditing ? (
          <>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-black font-extrabold text-lg">Edit Wallet</h3>
                <p className="text-gray-400 text-xs mt-0.5">Modify wallet details</p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-black cursor-pointer"
              >
                <IoCloseOutline className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={onEditSubmit} className="flex flex-col gap-4">
              {/* Wallet Name */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-500">
                  Wallet Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Holiday Fund"
                  value={editWallet.name}
                  onChange={(e) =>
                    setEditWallet({ ...editWallet, name: e.target.value })
                  }
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white"
                />
              </div>

              {/* Wallet Type */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-500">Wallet Type</label>
                <select
                  value={editWallet.type}
                  onChange={(e) => {
                    const type = e.target.value;
                    const provider =
                      type === "Cash" ? "Cash" : type === "Bank" ? "BCA" : "GoPay";
                    setEditWallet({
                      ...editWallet,
                      type,
                      provider,
                      color: getProviderDefaultColor(provider),
                    });
                  }}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white font-semibold"
                >
                  <option value="Bank" className="font-semibold">
                    Bank Account
                  </option>
                  <option value="E-Wallet" className="font-semibold">
                    E-Wallet
                  </option>
                  <option value="Cash" className="font-semibold">
                    Cash / Dompet
                  </option>
                </select>
              </div>

              {/* Provider */}
              {editWallet.type !== "Cash" && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-500">Provider</label>
                  <select
                    value={editWallet.provider}
                    onChange={(e) => {
                      const provider = e.target.value;
                      setEditWallet({
                        ...editWallet,
                        provider,
                        color: getProviderDefaultColor(provider),
                      });
                    }}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white font-semibold"
                  >
                    {editWallet.type === "Bank" ? (
                      <>
                        <option value="BCA">BCA</option>
                        <option value="Mandiri">Mandiri</option>
                        <option value="BNI">BNI</option>
                        <option value="Jago">Jago</option>
                      </>
                    ) : (
                      <>
                        <option value="GoPay">GoPay</option>
                        <option value="OVO">OVO</option>
                      </>
                    )}
                  </select>
                </div>
              )}

              {/* Wallet Color */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500">Wallet Color</label>
                <div className="flex flex-wrap gap-2.5 py-1">
                  {walletColorSwatches.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setEditWallet({ ...editWallet, color })}
                      className="w-7 h-7 rounded-full cursor-pointer transition-transform hover:scale-110 flex items-center justify-center relative shadow-sm border border-black/10"
                      style={{ backgroundColor: color }}
                    >
                      {editWallet.color === color && (
                        <div className="absolute inset-0 rounded-full border-2 border-white ring-2 ring-slate-800" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Initial Balance */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-500">
                  Initial Balance
                </label>
                <input
                  type="number"
                  disabled
                  value={editWallet.balance}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-400 bg-gray-50 cursor-not-allowed focus:outline-none"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex justify-between items-center mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setIsConfirmingDelete(true);
                  }}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Delete Wallet
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="py-2.5 px-4 rounded-xl border border-gray-200 text-black hover:bg-gray-50 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-4 rounded-xl bg-blue hover:bg-blue-600 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-blue/10"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </>
        ) : !isConfirmingDelete ? (
          <>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-black font-extrabold text-lg">Wallet Details</h3>
                <p className="text-gray-400 text-xs mt-0.5">Information about your wallet</p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-black cursor-pointer"
              >
                <IoCloseOutline className="w-5 h-5" />
              </button>
            </div>

            {/* Card Visual Recap */}
            <div
              style={getWalletGradientStyle(selectedWallet.color)}
              className="rounded-3xl p-5 shadow-md relative overflow-hidden h-44 flex flex-col justify-between text-white"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl" />
              <div className="flex justify-between items-center z-10">
                <span className="text-white font-extrabold text-sm tracking-wide">
                  {selectedWallet.provider}
                </span>
                <span className="text-[9px] bg-white/10 border border-white/20 rounded-full px-2 py-0.5 font-bold uppercase">
                  {selectedWallet.type}
                </span>
              </div>
              <div className="z-10 py-1">
                <p className="text-white font-extrabold text-xl md:text-2xl leading-none">
                  {formatCurrency(selectedWallet.balance)}
                </p>
              </div>
              <div className="flex justify-between items-end z-10">
                <span className="text-white/70 font-semibold text-xs leading-none max-w-[70%] truncate">
                  {selectedWallet.name}
                </span>
                <span className="text-white/40 text-[8px] uppercase font-bold tracking-widest leading-none">
                  Active
                </span>
              </div>
            </div>

            {/* Metadata List */}
            <div className="flex flex-col gap-3 border-y border-gray-50 py-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400 font-bold text-xs">Wallet Name</span>
                <span className="text-black font-extrabold">{selectedWallet.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-bold text-xs">Provider</span>
                <span className="text-black font-extrabold">{selectedWallet.provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-bold text-xs">Wallet Type</span>
                <span className="text-black font-extrabold">{selectedWallet.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-bold text-xs">Initial Balance</span>
                <span className="text-black font-extrabold">
                  {formatCurrency(selectedWallet.initialBalance)}
                </span>
              </div>
            </div>

            {/* Form Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
                className="flex-1 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-all cursor-pointer flex items-center justify-center"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditWallet({
                    name: selectedWallet.name,
                    type: selectedWallet.type,
                    provider: selectedWallet.provider,
                    balance: selectedWallet.initialBalance,
                    color: selectedWallet.color,
                  });
                  setIsEditing(true);
                }}
                className="flex-1 py-2.5 rounded-xl border border-blue text-blue hover:bg-blue/5 text-xs font-bold transition-all cursor-pointer flex items-center justify-center"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-blue hover:bg-blue-600 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-blue/10 flex items-center justify-center"
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center text-center gap-3 py-4">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-2 animate-bounce">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-black font-extrabold text-lg">Delete Wallet?</h3>
              <p className="text-gray-500 text-xs leading-relaxed max-w-xs">
                Are you sure you want to delete{" "}
                <strong className="text-black">{selectedWallet.name}</strong>? This will
                permanently delete all associated transaction records. This action cannot
                be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(false)}
                disabled={deleteLoading}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-black hover:bg-gray-50 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                No, Cancel
              </button>
              <button
                type="button"
                onClick={onDeleteConfirm}
                disabled={deleteLoading}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-red-200/50 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {deleteLoading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WalletDetailsModal;
