import React from "react";
import { IoCloseOutline } from "react-icons/io5";
import { walletColorSwatches, getProviderDefaultColor } from "../../hooks/useWallet";

interface AddWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  newWallet: {
    name: string;
    type: string;
    provider: string;
    balance: number;
    color: string;
  };
  setNewWallet: React.Dispatch<
    React.SetStateAction<{
      name: string;
      type: string;
      provider: string;
      balance: number;
      color: string;
    }>
  >;
  onSubmit: (e: React.FormEvent) => void;
}

export const AddWalletModal: React.FC<AddWalletModalProps> = ({
  isOpen,
  onClose,
  newWallet,
  setNewWallet,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-md border border-gray-100 flex flex-col gap-4 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-black font-extrabold text-lg">Add New Wallet</h3>
            <p className="text-gray-400 text-xs mt-0.5">
              Enter details of your account or wallet
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-black cursor-pointer"
          >
            <IoCloseOutline className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {/* Wallet Name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500">
              Wallet Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Holiday Fund"
              value={newWallet.name}
              onChange={(e) =>
                setNewWallet({ ...newWallet, name: e.target.value })
              }
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white"
            />
          </div>

          {/* Wallet Type */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500">Wallet Type</label>
            <select
              value={newWallet.type}
              onChange={(e) => {
                const type = e.target.value;
                const provider =
                  type === "Cash" ? "Cash" : type === "Bank" ? "BCA" : "GoPay";
                setNewWallet({
                  ...newWallet,
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

          {/* Provider (Dynamic depending on Type) */}
          {newWallet.type !== "Cash" && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-500">Provider</label>
              <select
                value={newWallet.provider}
                onChange={(e) => {
                  const provider = e.target.value;
                  setNewWallet({
                    ...newWallet,
                    provider,
                    color: getProviderDefaultColor(provider),
                  });
                }}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white font-semibold"
              >
                {newWallet.type === "Bank" ? (
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
                  onClick={() => setNewWallet({ ...newWallet, color })}
                  className="w-7 h-7 rounded-full cursor-pointer transition-transform hover:scale-110 flex items-center justify-center relative shadow-sm border border-black/10"
                  style={{ backgroundColor: color }}
                >
                  {newWallet.color === color && (
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
              required
              placeholder="e.g. 500000"
              value={newWallet.balance === 0 ? "" : newWallet.balance}
              onChange={(e) =>
                setNewWallet({
                  ...newWallet,
                  balance: Number(e.target.value),
                })
              }
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white"
            />
          </div>

          {/* Form Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-black hover:bg-gray-50 text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue hover:bg-blue-600 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-blue/10"
            >
              Save Wallet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWalletModal;
