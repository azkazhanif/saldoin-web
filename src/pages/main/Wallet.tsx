import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import { IoAddOutline, IoCloseOutline } from "react-icons/io5";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";

// Indonesian Rupiah currency formatting utility
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

interface WalletItem {
  id: string;
  name: string;
  type: string;
  provider: string;
  balance: number;
  initialBalance: number;
}

const Wallet = () => {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<WalletItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal display toggles
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<WalletItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Add Form states
  const [newWallet, setNewWallet] = useState({
    name: "",
    type: "Bank",
    provider: "BCA",
    balance: 0,
  });

  // Edit Form states
  const [editWallet, setEditWallet] = useState({
    name: "",
    type: "Bank",
    provider: "BCA",
    balance: 0,
  });

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // 1. Fetch Wallets
      const { data: walletsData, error: walletError } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", user.id);

      if (walletError) throw walletError;

      // 2. Fetch Transactions (needed to compute live balance)
      const { data: transactionsData, error: txError } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id);

      if (txError) throw txError;

      const loadedWallets = (walletsData || []).map((w) => {
        // Calculate balance dynamically
        const walletTransactions = (transactionsData || []).filter(
          (t) => t.wallet_id === w.id,
        );
        const incomeSum = walletTransactions
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + Number(t.amount), 0);
        const outcomeSum = walletTransactions
          .filter((t) => t.type === "outcome" || t.type === "expense")
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const currentBalance =
          Number(w.initial_balance) + incomeSum - outcomeSum;

        return {
          id: w.id,
          name: w.name,
          type:
            w.type === "bank"
              ? "Bank"
              : w.type === "ewallet"
                ? "E-Wallet"
                : "Cash",
          provider: w.provider,
          balance: currentBalance,
          initialBalance: Number(w.initial_balance),
        };
      });

      setWallets(loadedWallets);
    } catch (err) {
      console.error("Error fetching wallets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm font-semibold mt-4 animate-pulse">
            Loading wallets...
          </p>
        </div>
      </MainLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Use provider name as default name if name is empty
    const finalName = newWallet.name.trim() || newWallet.provider;

    const dbType =
      newWallet.type === "Bank"
        ? "bank"
        : newWallet.type === "E-Wallet"
          ? "ewallet"
          : "cash";

    try {
      const { error } = await supabase.from("wallets").insert({
        user_id: user.id,
        name: finalName,
        type: dbType,
        provider: newWallet.provider,
        initial_balance: newWallet.balance,
        account_number: "", // No longer input by user, saved as empty string
        is_active: true,
      });

      if (error) {
        alert(error.message);
        return;
      }

      await loadData();
      setIsModalOpen(false);
      setNewWallet({
        name: "",
        type: "Bank",
        provider: "BCA",
        balance: 0,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to save wallet.");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWallet || !user) return;

    // Use provider name as default name if name is empty
    const finalName = editWallet.name.trim() || editWallet.provider;

    const dbType =
      editWallet.type === "Bank"
        ? "bank"
        : editWallet.type === "E-Wallet"
          ? "ewallet"
          : "cash";

    try {
      const { error } = await supabase
        .from("wallets")
        .update({
          name: finalName,
          type: dbType,
          provider: editWallet.provider,
          initial_balance: editWallet.balance,
        })
        .eq("id", selectedWallet.id);

      if (error) {
        alert(error.message);
        return;
      }

      await loadData();
      setIsEditing(false);
      setIsDetailOpen(false);
      setSelectedWallet(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update wallet.");
    }
  };

  const handleDeleteWallet = async () => {
    if (!selectedWallet || !user) return;
    setDeleteLoading(true);
    try {
      // 1. Delete transactions associated with the wallet to avoid foreign key violations
      const { error: txError } = await supabase
        .from("transactions")
        .delete()
        .eq("wallet_id", selectedWallet.id);

      if (txError) throw txError;

      // 2. Delete the wallet entry
      const { error: walletError } = await supabase
        .from("wallets")
        .delete()
        .eq("id", selectedWallet.id);

      if (walletError) throw walletError;

      // 3. Reload data, close modal, reset state
      await loadData();
      setIsDetailOpen(false);
      setIsConfirmingDelete(false);
      setSelectedWallet(null);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete wallet.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-black font-extrabold text-2xl">My Wallet</h2>
          <p className="text-gray-400 text-sm mt-0.5">
            Manage your cards and check balances
          </p>
        </div>

        {/* Responsive Grid list of wallets (cols-2 on mobile, cols-3 on desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {wallets.map((wallet) => {
            // Select gradient template based on provider
            let gradientClass =
              "bg-gradient-to-br from-gray-700 to-gray-900 text-white";
            if (wallet.provider === "BCA") {
              gradientClass =
                "bg-gradient-to-br from-blue-800 to-slate-900 text-white";
            } else if (wallet.provider === "Mandiri") {
              gradientClass =
                "bg-gradient-to-br from-indigo-950 to-blue-900 text-white";
            } else if (wallet.provider === "GoPay") {
              gradientClass =
                "bg-gradient-to-br from-cyan-600 to-blue-800 text-white";
            } else if (wallet.provider === "OVO") {
              gradientClass =
                "bg-gradient-to-br from-purple-800 to-slate-900 text-white";
            } else if (wallet.provider === "Cash") {
              gradientClass =
                "bg-gradient-to-br from-emerald-600 to-teal-800 text-white";
            }

            return (
              <div
                key={wallet.id}
                onClick={() => {
                  setSelectedWallet(wallet);
                  setIsConfirmingDelete(false);
                  setIsEditing(false);
                  setIsDetailOpen(true);
                }}
                className={`${gradientClass} rounded-3xl p-5 shadow-sm relative overflow-hidden h-44 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer`}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl animate-pulse" />

                {/* Top Row: Provider and Type badge */}
                <div className="flex justify-between items-center z-10">
                  <span className="text-white font-extrabold text-sm tracking-wide">
                    {wallet.provider}
                  </span>
                  <span className="text-[9px] bg-white/10 border border-white/20 rounded-full px-2 py-0.5 font-bold uppercase flex-shrink-0">
                    {wallet.type}
                  </span>
                </div>

                {/* Middle Row: Current Balance */}
                <div className="z-10 py-1">
                  <p className="text-white font-extrabold text-xl md:text-2xl leading-none">
                    {formatCurrency(wallet.balance)}
                  </p>
                </div>

                {/* Bottom Row: Wallet Name & Status */}
                <div className="flex justify-between items-end z-10">
                  <span className="text-white/70 font-semibold text-xs leading-none max-w-[70%] truncate">
                    {wallet.name}
                  </span>
                  <span className="text-white/40 text-[8px] uppercase font-bold tracking-widest leading-none">
                    Active
                  </span>
                </div>
              </div>
            );
          })}

          {/* "+ Add New Wallet" interactive trigger card */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="border-2 border-dashed border-gray-200 hover:border-blue hover:bg-blue/5 rounded-3xl p-6 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer h-44 text-gray-400 hover:text-blue"
          >
            <IoAddOutline className="w-8 h-8" />
            <span className="font-extrabold text-sm">Add New Wallet</span>
          </button>
        </div>
      </div>

      {/* Add Wallet Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-md border border-gray-100 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-black font-extrabold text-lg">
                  Add New Wallet
                </h3>
                <p className="text-gray-400 text-xs mt-0.5">
                  Enter details of your account or wallet
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-black cursor-pointer"
              >
                <IoCloseOutline className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Wallet Name */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-500">
                  Wallet Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. BCA Tabungan, Dompet Saku"
                  value={newWallet.name}
                  onChange={(e) =>
                    setNewWallet({ ...newWallet, name: e.target.value })
                  }
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white"
                />
              </div>

              {/* Wallet Type */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-500">
                  Wallet Type
                </label>
                <select
                  value={newWallet.type}
                  onChange={(e) => {
                    const type = e.target.value;
                    const provider =
                      type === "Cash"
                        ? "Cash"
                        : type === "Bank"
                          ? "BCA"
                          : "GoPay";
                    setNewWallet({
                      ...newWallet,
                      type,
                      provider,
                    });
                  }}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white"
                >
                  <option value="Bank">Bank Account</option>
                  <option value="E-Wallet">E-Wallet</option>
                  <option value="Cash">Cash / Dompet</option>
                </select>
              </div>

              {/* Provider (Dynamic depending on Type) */}
              {newWallet.type !== "Cash" && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-500">
                    Provider
                  </label>
                  <select
                    value={newWallet.provider}
                    onChange={(e) =>
                      setNewWallet({ ...newWallet, provider: e.target.value })
                    }
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white"
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
                  onClick={() => setIsModalOpen(false)}
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
      )}

      {/* Wallet Detail Modal Overlay */}
      {isDetailOpen && selectedWallet && (
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

                <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
                  {/* Wallet Name */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-500">
                      Wallet Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BCA Utama"
                      value={editWallet.name}
                      onChange={(e) =>
                        setEditWallet({ ...editWallet, name: e.target.value })
                      }
                      className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white"
                    />
                  </div>

                  {/* Wallet Type */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-500">
                      Wallet Type
                    </label>
                    <select
                      value={editWallet.type}
                      onChange={(e) => {
                        const type = e.target.value;
                        const provider =
                          type === "Cash"
                            ? "Cash"
                            : type === "Bank"
                              ? "BCA"
                              : "GoPay";
                        setEditWallet({
                          ...editWallet,
                          type,
                          provider,
                        });
                      }}
                      className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white"
                    >
                      <option value="Bank">Bank Account</option>
                      <option value="E-Wallet">E-Wallet</option>
                      <option value="Cash">Cash / Dompet</option>
                    </select>
                  </div>

                  {/* Provider */}
                  {editWallet.type !== "Cash" && (
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-gray-500">
                        Provider
                      </label>
                      <select
                        value={editWallet.provider}
                        onChange={(e) =>
                          setEditWallet({ ...editWallet, provider: e.target.value })
                        }
                        className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white"
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

                  {/* Initial Balance */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-500">
                      Initial Balance
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 500000"
                      value={editWallet.balance}
                      onChange={(e) =>
                        setEditWallet({
                          ...editWallet,
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
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-2.5 rounded-xl border border-gray-200 text-black hover:bg-gray-50 text-xs font-bold transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-blue hover:bg-blue-600 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-blue/10"
                    >
                      Save Changes
                    </button>
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
                    onClick={() => setIsDetailOpen(false)}
                    className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-black cursor-pointer"
                  >
                    <IoCloseOutline className="w-5 h-5" />
                  </button>
                </div>

                {/* Card Visual Recap */}
                <div 
                  className={`rounded-3xl p-5 shadow-md relative overflow-hidden h-44 flex flex-col justify-between ${
                    selectedWallet.provider === "BCA" ? "bg-gradient-to-br from-blue-800 to-slate-900 text-white" :
                    selectedWallet.provider === "Mandiri" ? "bg-gradient-to-br from-indigo-950 to-blue-900 text-white" :
                    selectedWallet.provider === "GoPay" ? "bg-gradient-to-br from-cyan-600 to-blue-800 text-white" :
                    selectedWallet.provider === "OVO" ? "bg-gradient-to-br from-purple-800 to-slate-900 text-white" :
                    selectedWallet.provider === "Cash" ? "bg-gradient-to-br from-emerald-600 to-teal-800 text-white" :
                    "bg-gradient-to-br from-gray-700 to-gray-900 text-white"
                  }`}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl" />
                  <div className="flex justify-between items-center z-10">
                    <span className="text-white font-extrabold text-sm tracking-wide">{selectedWallet.provider}</span>
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
                    <span className="text-white/70 font-semibold text-xs leading-none max-w-[70%] truncate">{selectedWallet.name}</span>
                    <span className="text-white/40 text-[8px] uppercase font-bold tracking-widest leading-none">Active</span>
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
                    <span className="text-black font-extrabold">{formatCurrency(selectedWallet.initialBalance)}</span>
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
                      });
                      setIsEditing(true);
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-blue text-blue hover:bg-blue/5 text-xs font-bold transition-all cursor-pointer flex items-center justify-center"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDetailOpen(false)}
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
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-black font-extrabold text-lg">Delete Wallet?</h3>
                  <p className="text-gray-500 text-xs leading-relaxed max-w-xs">
                    Are you sure you want to delete <strong className="text-black">{selectedWallet.name}</strong>? This will permanently delete all associated transaction records. This action cannot be undone.
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
                    onClick={handleDeleteWallet}
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
      )}
    </MainLayout>
  );
};

export default Wallet;
