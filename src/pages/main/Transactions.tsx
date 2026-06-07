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
  IoCashOutline,
  IoCarOutline,
  IoHeartOutline,
  IoBookOutline,
  IoPeopleOutline,
  IoStorefrontOutline,
  IoTrendingUpOutline,
  IoRepeatOutline
} from "react-icons/io5";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";

// Map icon string names to actual react-icons
const iconMap: Record<string, any> = {
  IoBriefcaseOutline: IoBriefcaseOutline,
  IoFastFoodOutline: IoFastFoodOutline,
  IoCartOutline: IoCartOutline,
  IoGameControllerOutline: IoGameControllerOutline,
  IoBulbOutline: IoBulbOutline,
  IoReceiptOutline: IoReceiptOutline,
  IoCashOutline: IoCashOutline,
  IoCarOutline: IoCarOutline,
  IoHeartOutline: IoHeartOutline,
  IoBookOutline: IoBookOutline,
  IoPeopleOutline: IoPeopleOutline,
  IoStorefrontOutline: IoStorefrontOutline,
  IoTrendingUpOutline: IoTrendingUpOutline,
  IoRepeatOutline: IoRepeatOutline
};

const getBgColorClass = (color: string) => {
  if (!color) return "bg-gray-50 text-gray-500";
  if (color === "bg-blue") return "bg-blue/10 text-blue";
  if (color.endsWith("-500")) {
    return `${color.replace("-500", "-50")} text-${color.replace("bg-", "").replace("-500", "-600")}`;
  }
  if (color.endsWith("-600") || color.endsWith("-700")) {
    const baseColor = color.split("-")[1]; // e.g. green or emerald
    return `bg-${baseColor}-50 text-${baseColor}-600`;
  }
  return `${color}/10 text-${color.replace("bg-", "")}`;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // 1. Fetch Categories (system defaults or user custom categories)
      const { data: categoriesData, error: catError } = await supabase
        .from("categories")
        .select("*")
        .or(`user_id.is.null,user_id.eq.${user.id}`);

      if (catError) throw catError;

      // 2. Fetch Wallets
      const { data: walletsData, error: walletError } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", user.id);

      if (walletError) throw walletError;

      // 3. Fetch Transactions
      const { data: transactionsData, error: txError } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (txError) throw txError;

      // Map categories
      const loadedCats = (categoriesData || []).map((cat) => ({
        id: cat.id,
        name: cat.name,
        type: cat.type,
        color: cat.color || "bg-blue",
        bgColor: getBgColorClass(cat.color || ""),
        iconName: cat.icon
      }));

      // Calculate dynamic wallet balance by applying transactions in memory
      const loadedWallets = (walletsData || []).map((w) => {
        const walletTransactions = (transactionsData || []).filter(t => t.wallet_id === w.id);
        const incomeSum = walletTransactions
          .filter(t => t.type === "income")
          .reduce((sum, t) => sum + Number(t.amount), 0);
        const outcomeSum = walletTransactions
          .filter(t => t.type === "outcome" || t.type === "expense")
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const currentBalance = Number(w.initial_balance) + incomeSum - outcomeSum;

        return {
          id: w.id,
          name: w.name,
          balance: currentBalance,
          provider: w.provider
        };
      });

      // Map transactions to UI-compatible format (using category name instead of UUID)
      const loadedTxs = (transactionsData || []).map((tx) => {
        const cat = categoriesData?.find(c => c.id === tx.category_id);
        return {
          id: tx.id,
          title: tx.note || "Transaction",
          category: cat ? cat.name : "Lain-lain",
          date: tx.date,
          amount: Number(tx.amount),
          type: tx.type,
          walletId: tx.wallet_id
        };
      });

      setCategories(loadedCats);
      setWallets(loadedWallets);
      setTransactions(loadedTxs);
    } catch (err) {
      console.error("Error loading transactions data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount / user change
  useEffect(() => {
    loadData();
  }, [user]);

  // Sync category state selection when categories/wallets change or load
  useEffect(() => {
    if (categories.length > 0 && wallets.length > 0) {
      setNewTx(prev => ({
        ...prev,
        category: categories.find(c => c.type === prev.type)?.name || categories[0]?.name || "",
        walletId: wallets[0]?.id || ""
      }));
    }
  }, [categories, wallets]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm font-semibold mt-4 animate-pulse">Loading transactions...</p>
        </div>
      </MainLayout>
    );
  }

  const handleTxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // 1. Find category object by name to get its UUID
    const matchedCat = categories.find(c => c.name === newTx.category);
    if (!matchedCat) {
      alert("Invalid category selected.");
      return;
    }

    // 2. Find wallet object
    const targetWallet = wallets.find(w => w.id === newTx.walletId);
    if (!targetWallet) {
      alert("Invalid wallet selected.");
      return;
    }

    // Check balance if expense
    if (newTx.type === "outcome" && targetWallet.balance < newTx.amount) {
      alert(`Insufficient funds in wallet "${targetWallet.name}"! Available balance: ${formatCurrency(targetWallet.balance)}`);
      return;
    }

    try {
      // Insert transaction into database
      const { error } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          wallet_id: newTx.walletId,
          type: newTx.type,
          amount: newTx.amount,
          category_id: matchedCat.id,
          note: newTx.title,
          date: newTx.date
        });

      if (error) {
        alert(error.message);
        return;
      }

      await loadData();
      setIsTxModalOpen(false);
      setNewTx({
        title: "",
        amount: 0,
        type: "outcome",
        category: categories[0]?.name || "",
        walletId: wallets[0]?.id || "",
        date: new Date().toISOString().split("T")[0]
      });
    } catch (err) {
      console.error(err);
      alert("Failed to save transaction.");
    }
  };

  const handleCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    let color = "bg-blue";
    if (newCat.type === "income") {
      color = "bg-green-600";
    }

    try {
      // 1. Save Category
      const { data: catData, error: catError } = await supabase
        .from("categories")
        .insert({
          user_id: user.id,
          name: newCat.name,
          icon: newCat.iconName,
          color: color,
          type: newCat.type,
          is_default: false
        })
        .select()
        .single();

      if (catError) {
        alert(catError.message);
        return;
      }

      // 2. Save Budget if set
      if (newCat.budget > 0 && catData) {
        const now = new Date();
        const { error: budgetError } = await supabase
          .from("budgets")
          .insert({
            user_id: user.id,
            category_id: catData.id,
            amount: newCat.budget,
            period: "monthly",
            month: now.getMonth() + 1,
            year: now.getFullYear()
          });

        if (budgetError) {
          console.error("Error saving budget:", budgetError.message);
        }
      }

      await loadData();
      setIsCatModalOpen(false);
      setNewCat({
        name: "",
        budget: 0,
        type: "outcome",
        iconName: "IoCartOutline"
      });
    } catch (err: any) {
      console.error(err);
      alert("Failed to save category.");
    }
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
                  <option value="IoBriefcaseOutline">Salary / Income</option>
                  <option value="IoReceiptOutline">Freelance / Receipt</option>
                  <option value="IoStorefrontOutline">Business / Store</option>
                  <option value="IoRepeatOutline">Transfer / Repeat</option>
                  <option value="IoCashOutline">Cash / Other</option>
                  <option value="IoFastFoodOutline">Food & Drink</option>
                  <option value="IoCarOutline">Transport / Car</option>
                  <option value="IoGameControllerOutline">Entertainment / Gaming</option>
                  <option value="IoHeartOutline">Health / Medical</option>
                  <option value="IoCartOutline">Shopping / Retail</option>
                  <option value="IoBulbOutline">Bills / Utilities</option>
                  <option value="IoBookOutline">Education / Book</option>
                  <option value="IoPeopleOutline">Social / People</option>
                  <option value="IoTrendingUpOutline">Investment</option>
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
