import React, { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { 
  IoAddOutline, 
  IoCloseOutline
} from "react-icons/io5";

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
  accountNumber: string;
}

const Wallet = () => {
  // Dynamic list state for wallets
  const [wallets, setWallets] = useState<WalletItem[]>([
    { id: "1", name: "BCA Gaji", type: "Bank", provider: "BCA", balance: 8450000, accountNumber: "•••• •••• •••• 4821" },
    { id: "2", name: "GoPay Utama", type: "E-Wallet", provider: "GoPay", balance: 1250000, accountNumber: "0812 •••• 9923" },
    { id: "3", name: "Dompet Tunai", type: "Cash", provider: "Cash", balance: 500000, accountNumber: "Cash Wallet" }
  ]);

  // Modal display toggles
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [newWallet, setNewWallet] = useState({
    name: "",
    type: "Bank",
    provider: "BCA",
    balance: 0,
    accountNumber: ""
  });

  // Load from localStorage on mount
  React.useEffect(() => {
    const localWallets = localStorage.getItem("saldooin_wallets");
    if (localWallets) {
      setWallets(JSON.parse(localWallets));
    } else {
      localStorage.setItem("saldooin_wallets", JSON.stringify(wallets));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare wallet account format
    let formattedAccount = newWallet.accountNumber;
    if (newWallet.type === "Bank" && newWallet.accountNumber) {
      formattedAccount = `•••• •••• •••• ${newWallet.accountNumber.slice(-4)}`;
    } else if (newWallet.type === "E-Wallet" && newWallet.accountNumber) {
      formattedAccount = `${newWallet.accountNumber.slice(0, 4)} •••• ${newWallet.accountNumber.slice(-4)}`;
    } else if (newWallet.type === "Cash") {
      formattedAccount = "Cash Wallet";
    }

    const createdWallet: WalletItem = {
      id: Date.now().toString(),
      name: newWallet.name,
      type: newWallet.type,
      provider: newWallet.provider,
      balance: newWallet.balance,
      accountNumber: formattedAccount
    };

    const updatedWallets = [...wallets, createdWallet];
    setWallets(updatedWallets);
    localStorage.setItem("saldooin_wallets", JSON.stringify(updatedWallets));
    setIsModalOpen(false);
    setNewWallet({
      name: "",
      type: "Bank",
      provider: "BCA",
      balance: 0,
      accountNumber: ""
    });
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-black font-extrabold text-2xl">My Wallet</h2>
          <p className="text-gray-400 text-sm mt-0.5">Manage your cards and check balances</p>
        </div>

        {/* Responsive Grid list of wallets (cols-2 on mobile, cols-3 on desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {wallets.map((wallet) => {
            // Select gradient template based on provider
            let gradientClass = "bg-gradient-to-br from-gray-700 to-gray-900 text-white";
            if (wallet.provider === "BCA") {
              gradientClass = "bg-gradient-to-br from-blue-800 to-slate-900 text-white";
            } else if (wallet.provider === "Mandiri") {
              gradientClass = "bg-gradient-to-br from-indigo-950 to-blue-900 text-white";
            } else if (wallet.provider === "GoPay") {
              gradientClass = "bg-gradient-to-br from-cyan-600 to-blue-800 text-white";
            } else if (wallet.provider === "OVO") {
              gradientClass = "bg-gradient-to-br from-purple-800 to-slate-900 text-white";
            } else if (wallet.provider === "Cash") {
              gradientClass = "bg-gradient-to-br from-emerald-600 to-teal-800 text-white";
            }

            return (
              <div 
                key={wallet.id} 
                className={`${gradientClass} rounded-3xl p-5 shadow-sm relative overflow-hidden h-44 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-0.5`}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl animate-pulse" />
                
                <div className="flex justify-between items-start z-10">
                  <div>
                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider">{wallet.name}</p>
                    <p className="text-white font-extrabold text-lg md:text-xl mt-0.5 leading-tight">{formatCurrency(wallet.balance)}</p>
                  </div>
                  <span className="text-[9px] bg-white/10 border border-white/20 rounded-full px-2 py-0.5 font-bold uppercase flex-shrink-0">
                    {wallet.type}
                  </span>
                </div>

                <div className="z-10">
                  <p className="text-white/40 text-[8px] tracking-widest font-mono uppercase font-bold">Account Number</p>
                  <p className="text-white font-bold text-xs md:text-sm font-mono tracking-wider mt-0.5">{wallet.accountNumber}</p>
                </div>

                <div className="flex justify-between items-center z-10">
                  <span className="text-white/80 font-extrabold text-xs">{wallet.provider}</span>
                  <span className="text-white/40 text-[8px] uppercase font-bold tracking-widest">Active</span>
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
                <h3 className="text-black font-extrabold text-lg">Add New Wallet</h3>
                <p className="text-gray-400 text-xs mt-0.5">Enter details of your account or wallet</p>
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
                <label className="text-xs font-bold text-gray-500">Wallet Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BCA Tabungan, Dompet Saku"
                  value={newWallet.name}
                  onChange={(e) => setNewWallet({ ...newWallet, name: e.target.value })}
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
                    const provider = type === "Cash" ? "Cash" : (type === "Bank" ? "BCA" : "GoPay");
                    const accountNumber = type === "Cash" ? "Cash Wallet" : "";
                    setNewWallet({ ...newWallet, type, provider, accountNumber });
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
                  <label className="text-xs font-bold text-gray-500">Provider</label>
                  <select
                    value={newWallet.provider}
                    onChange={(e) => setNewWallet({ ...newWallet, provider: e.target.value })}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white"
                  >
                    {newWallet.type === "Bank" ? (
                      <>
                        <option value="BCA">BCA</option>
                        <option value="Mandiri">Mandiri</option>
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

              {/* Account Number (Dynamic description) */}
              {newWallet.type !== "Cash" && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-500">
                    {newWallet.type === "Bank" ? "Account Number" : "Phone Number"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={newWallet.type === "Bank" ? "e.g. 1234567890" : "e.g. 0812345678"}
                    value={newWallet.accountNumber}
                    onChange={(e) => setNewWallet({ ...newWallet, accountNumber: e.target.value })}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white"
                  />
                </div>
              )}

              {/* Initial Balance */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-500">Initial Balance</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 500000"
                  value={newWallet.balance === 0 ? "" : newWallet.balance}
                  onChange={(e) => setNewWallet({ ...newWallet, balance: Number(e.target.value) })}
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
    </MainLayout>
  );
};

export default Wallet;
