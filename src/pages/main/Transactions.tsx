import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import { 
  IoSearchOutline, 
  IoBriefcaseOutline, 
  IoFastFoodOutline, 
  IoCartOutline, 
  IoGameControllerOutline, 
  IoBulbOutline, 
  IoReceiptOutline,
  IoArrowDownOutline,
  IoArrowUpOutline,
  IoAddOutline,
  IoCloseOutline,
  IoCashOutline
} from "react-icons/io5";

// Map icon string names to actual react-icons
const iconMap: Record<string, any> = {
  IoBriefcaseOutline: IoBriefcaseOutline,
  IoFastFoodOutline: IoFastFoodOutline,
  IoCartOutline: IoCartOutline,
  IoGameControllerOutline: IoGameControllerOutline,
  IoBulbOutline: IoBulbOutline,
  IoReceiptOutline: IoReceiptOutline,
  IoCashOutline: IoCashOutline
};

const defaultTransactions = [
  { id: "1", title: "Salary Payment", category: "Salary & Income", date: "2026-06-07", amount: 15000000, type: "income", walletId: "1" },
  { id: "2", title: "Starbucks Coffee", category: "Food & Beverage", date: "2026-06-06", amount: 55000, type: "outcome", walletId: "2" },
  { id: "3", title: "Supermarket Groceries", category: "Shopping", date: "2026-06-05", amount: 450000, type: "outcome", walletId: "2" },
  { id: "4", title: "Steam Game Purchase", category: "Entertainment", date: "2026-06-04", amount: 250000, type: "outcome", walletId: "2" },
  { id: "5", title: "Electricity Bill", category: "Utilities & Bills", date: "2026-06-03", amount: 850000, type: "outcome", walletId: "3" },
  { id: "6", title: "Freelance Design Fee", category: "Salary & Income", date: "2026-06-02", amount: 3250000, type: "income", walletId: "1" }
];

const defaultWallets = [
  { id: "1", name: "BCA Gaji", type: "Bank", provider: "BCA", balance: 8450000, accountNumber: "•••• •••• •••• 4821" },
  { id: "2", name: "GoPay Utama", type: "E-Wallet", provider: "GoPay", balance: 1250000, accountNumber: "0812 •••• 9923" },
  { id: "3", name: "Dompet Tunai", type: "Cash", provider: "Cash", balance: 500000, accountNumber: "Cash Wallet" }
];

const defaultCategories = [
  { id: "1", name: "Salary & Income", budget: 18250000, type: "income", color: "bg-green-600", bgColor: "bg-green-50 text-green-600", iconName: "IoBriefcaseOutline" },
  { id: "2", name: "Food & Beverage", budget: 5000000, type: "outcome", color: "bg-amber-500", bgColor: "bg-amber-50 text-amber-600", iconName: "IoFastFoodOutline" },
  { id: "3", name: "Utilities & Bills", budget: 4000000, type: "outcome", color: "bg-orange-500", bgColor: "bg-orange-50 text-orange-600", iconName: "IoBulbOutline" },
  { id: "4", name: "Shopping", budget: 3000000, type: "outcome", color: "bg-blue", bgColor: "bg-blue/10 text-blue", iconName: "IoCartOutline" },
  { id: "5", name: "Entertainment", budget: 2000000, type: "outcome", color: "bg-purple-500", bgColor: "bg-purple-50 text-purple-600", iconName: "IoGameControllerOutline" }
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const Transactions = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "outcome">("all");

  // Modal Open states
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);

  // Form states
  const [newTx, setNewTx] = useState({
    title: "",
    amount: 0,
    type: "outcome",
    category: "",
    walletId: "",
    date: new Date().toISOString().split("T")[0]
  });

  const [newCat, setNewCat] = useState({
    name: "",
    budget: 0,
    type: "outcome",
    iconName: "IoCartOutline"
  });

  // Load from localStorage on mount
  useEffect(() => {
    const localTxs = localStorage.getItem("saldooin_transactions");
    const localWallets = localStorage.getItem("saldooin_wallets");
    const localCats = localStorage.getItem("saldooin_categories");

    const loadedTxs = localTxs ? JSON.parse(localTxs) : defaultTransactions;
    const loadedWallets = localWallets ? JSON.parse(localWallets) : defaultWallets;
    const loadedCats = localCats ? JSON.parse(localCats) : defaultCategories;

    setTransactions(loadedTxs);
    setWallets(loadedWallets);
    setCategories(loadedCats);

    // Seed back if not existing
    if (!localTxs) localStorage.setItem("saldooin_transactions", JSON.stringify(defaultTransactions));
    if (!localWallets) localStorage.setItem("saldooin_wallets", JSON.stringify(defaultWallets));
    if (!localCats) localStorage.setItem("saldooin_categories", JSON.stringify(defaultCategories));
  }, []);

  // Sync category state selection when categories load
  useEffect(() => {
    if (categories.length > 0) {
      setNewTx(prev => ({
        ...prev,
        category: categories[0]?.name || "",
        walletId: wallets[0]?.id || ""
      }));
    }
  }, [categories, wallets]);

  const handleTxSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check balance
    const targetWallet = wallets.find(w => w.id === newTx.walletId);
    if (!targetWallet) return;

    if (newTx.type === "outcome" && targetWallet.balance < newTx.amount) {
      alert(`Insufficient funds in wallet "${targetWallet.name}"! Available balance: ${formatCurrency(targetWallet.balance)}`);
      return;
    }

    // Update Wallet balance
    const updatedWallets = wallets.map(w => {
      if (w.id === newTx.walletId) {
        return {
          ...w,
          balance: newTx.type === "income" ? w.balance + newTx.amount : w.balance - newTx.amount
        };
      }
      return w;
    });

    // Save transaction
    const createdTx = {
      id: Date.now().toString(),
      title: newTx.title,
      amount: newTx.amount,
      type: newTx.type,
      category: newTx.category,
      walletId: newTx.walletId,
      date: newTx.date
    };

    const updatedTxs = [createdTx, ...transactions];

    setWallets(updatedWallets);
    setTransactions(updatedTxs);
    localStorage.setItem("saldooin_wallets", JSON.stringify(updatedWallets));
    localStorage.setItem("saldooin_transactions", JSON.stringify(updatedTxs));

    // Reset Form
    setIsTxModalOpen(false);
    setNewTx({
      title: "",
      amount: 0,
      type: "outcome",
      category: categories[0]?.name || "",
      walletId: wallets[0]?.id || "",
      date: new Date().toISOString().split("T")[0]
    });
  };

  const handleCatSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Set styling colors depending on category type
    let color = "bg-blue";
    let bgColor = "bg-blue/10 text-blue";
    if (newCat.type === "income") {
      color = "bg-green-600";
      bgColor = "bg-green-50 text-green-600";
    }

    const createdCat = {
      id: Date.now().toString(),
      name: newCat.name,
      budget: newCat.budget,
      type: newCat.type,
      color: color,
      bgColor: bgColor,
      iconName: newCat.iconName
    };

    const updatedCats = [...categories, createdCat];

    setCategories(updatedCats);
    localStorage.setItem("saldooin_categories", JSON.stringify(updatedCats));

    setIsCatModalOpen(false);
    setNewCat({
      name: "",
      budget: 0,
      type: "outcome",
      iconName: "IoCartOutline"
    });
  };

  // Filter list
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tx.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || tx.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-black font-extrabold text-2xl">Transactions</h2>
            <p className="text-gray-400 text-sm mt-0.5">Track your history and log movements</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsCatModalOpen(true)}
              className="py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-black border border-gray-200/50 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <IoAddOutline className="w-4 h-4" /> Add Category
            </button>
            <button 
              onClick={() => setIsTxModalOpen(true)}
              className="py-2.5 px-4 bg-blue hover:bg-blue-600 text-white rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue/10"
            >
              <IoAddOutline className="w-4 h-4" /> Add Transaction
            </button>
          </div>
        </div>

        {/* Toolbar: Search and Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue text-sm text-black bg-white"
            />
          </div>

          <div className="flex bg-gray-50 border border-gray-200/50 p-1 rounded-xl">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterType === "all" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-black"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("income")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterType === "income" ? "bg-white text-green-600 shadow-sm" : "text-gray-400 hover:text-green-600"
              }`}
            >
              Income
            </button>
            <button
              onClick={() => setFilterType("outcome")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterType === "outcome" ? "bg-white text-red-600 shadow-sm" : "text-gray-400 hover:text-red-600"
              }`}
            >
              Expense
            </button>
          </div>
        </div>

        {/* Transaction History Table */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase">
                <th className="pb-3 font-semibold">Transaction</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => {
                  // Find category object to fetch icon
                  const categoryObj = categories.find(c => c.name === tx.category);
                  const iconName = categoryObj?.iconName || "IoCashOutline";
                  const Icon = iconMap[iconName] || IoCashOutline;
                  const bgColorClass = categoryObj?.bgColor || "bg-gray-100 text-gray-600";

                  return (
                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${bgColorClass} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-black font-bold text-sm">{tx.title}</span>
                      </td>
                      <td className="py-4">
                        <span className="text-gray-500 font-semibold text-xs py-1 px-3 bg-gray-50 rounded-full border border-gray-100">
                          {tx.category}
                        </span>
                      </td>
                      <td className="py-4 text-gray-400 font-medium text-xs">
                        {tx.date}
                      </td>
                      <td className={`py-4 text-right font-extrabold text-sm ${
                        tx.type === "income" ? "text-green-600" : "text-black"
                      }`}>
                        <span className="inline-flex items-center gap-1">
                          {tx.type === "income" ? (
                            <IoArrowUpOutline className="w-3.5 h-3.5" />
                          ) : (
                            <IoArrowDownOutline className="w-3.5 h-3.5" />
                          )}
                          {formatCurrency(tx.amount)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400 font-medium text-sm">
                    No transactions matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD TRANSACTION MODAL OVERLAY */}
      {isTxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-md border border-gray-100 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-black font-extrabold text-lg">Add Transaction</h3>
                <p className="text-gray-400 text-xs mt-0.5">Register a cash movement</p>
              </div>
              <button 
                onClick={() => setIsTxModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-black cursor-pointer"
              >
                <IoCloseOutline className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTxSubmit} className="flex flex-col gap-4">
              {/* Title */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-500">Transaction Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Starbucks, Gaji Kantor"
                  value={newTx.title}
                  onChange={(e) => setNewTx({ ...newTx, title: e.target.value })}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white"
                />
              </div>

              {/* Amount & Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-500">Amount (IDR)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 50000"
                    value={newTx.amount === 0 ? "" : newTx.amount}
                    onChange={(e) => setNewTx({ ...newTx, amount: Number(e.target.value) })}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-500">Type</label>
                  <select
                    value={newTx.type}
                    onChange={(e) => {
                      const type = e.target.value;
                      const matchedCat = categories.find(c => c.type === type);
                      setNewTx({ ...newTx, type, category: matchedCat?.name || categories[0]?.name || "" });
                    }}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white"
                  >
                    <option value="outcome">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              </div>

              {/* Category (Filtered by type) */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-500">Category Relationship</label>
                <select
                  value={newTx.category}
                  onChange={(e) => setNewTx({ ...newTx, category: e.target.value })}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white"
                >
                  {categories
                    .filter(c => c.type === newTx.type)
                    .map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))
                  }
                </select>
              </div>

              {/* Wallet Card Selection */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-500">Account Wallet</label>
                <select
                  value={newTx.walletId}
                  onChange={(e) => setNewTx({ ...newTx, walletId: e.target.value })}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white"
                >
                  {wallets.map(w => (
                    <option key={w.id} value={w.id}>{w.name} ({formatCurrency(w.balance)})</option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-500">Transaction Date</label>
                <input
                  type="date"
                  required
                  value={newTx.date}
                  onChange={(e) => setNewTx({ ...newTx, date: e.target.value })}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setIsTxModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-black hover:bg-gray-50 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue hover:bg-blue-600 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-blue/10"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD CATEGORY MODAL OVERLAY */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-md border border-gray-100 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-black font-extrabold text-lg">Add Category</h3>
                <p className="text-gray-400 text-xs mt-0.5">Create custom budget category</p>
              </div>
              <button 
                onClick={() => setIsCatModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-black cursor-pointer"
              >
                <IoCloseOutline className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCatSubmit} className="flex flex-col gap-4">
              {/* Category Name */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-500">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Healthcare, Transport"
                  value={newCat.name}
                  onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white"
                />
              </div>

              {/* Budget Limit & Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-500">Monthly Budget (IDR)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 1500000"
                    value={newCat.budget === 0 ? "" : newCat.budget}
                    onChange={(e) => setNewCat({ ...newCat, budget: Number(e.target.value) })}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-500">Type</label>
                  <select
                    value={newCat.type}
                    onChange={(e) => setNewCat({ ...newCat, type: e.target.value })}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white"
                  >
                    <option value="outcome">Outcome (Budget)</option>
                    <option value="income">Income (Earnings)</option>
                  </select>
                </div>
              </div>

              {/* Icon Choice */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-500">Select Icon</label>
                <select
                  value={newCat.iconName}
                  onChange={(e) => setNewCat({ ...newCat, iconName: e.target.value })}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white"
                >
                  <option value="IoCartOutline">Shopping Cart</option>
                  <option value="IoFastFoodOutline">Food & Dining</option>
                  <option value="IoGameControllerOutline">Gaming / Entertain</option>
                  <option value="IoBulbOutline">Utility / Power</option>
                  <option value="IoBriefcaseOutline">Briefcase / Salary</option>
                  <option value="IoReceiptOutline">Receipt / Bill</option>
                </select>
              </div>

              {/* Form Buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-black hover:bg-gray-50 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue hover:bg-blue-600 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-blue/10"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Transactions;
