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
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal Open states
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<any | null>(null);

  // Form states
  const [newTx, setNewTx] = useState({
    title: "",
    amount: 0,
    type: "outcome",
    category: "",
    walletId: "",
    date: new Date().toISOString().split("T")[0]
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
          type: tx.type === "income" ? "income" : "outcome",
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
    if (categories.length > 0 && wallets.length > 0 && !selectedTx) {
      setNewTx(prev => ({
        ...prev,
        category: categories.find(c => c.type === prev.type)?.name || categories[0]?.name || "",
        walletId: wallets[0]?.id || ""
      }));
    }
  }, [categories, wallets, selectedTx]);

  // Populate form state when modal opens in edit or add mode
  useEffect(() => {
    if (isTxModalOpen) {
      if (selectedTx) {
        setNewTx({
          title: selectedTx.title,
          amount: selectedTx.amount,
          type: selectedTx.type === "income" ? "income" : "outcome",
          category: selectedTx.category,
          walletId: selectedTx.walletId,
          date: selectedTx.date
        });
      } else {
        setNewTx({
          title: "",
          amount: 0,
          type: "outcome",
          category: categories.find(c => c.type === "outcome")?.name || categories[0]?.name || "",
          walletId: wallets[0]?.id || "",
          date: new Date().toISOString().split("T")[0]
        });
      }
    }
  }, [isTxModalOpen, selectedTx, categories, wallets]);

  // Reset pagination to page 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType, selectedCategoryFilter]);

  const handleOpenAddTx = () => {
    setSelectedTx(null);
    setIsTxModalOpen(true);
  };

  const handleOpenEditTx = (tx: any) => {
    setSelectedTx(tx);
    setIsTxModalOpen(true);
  };

  const handleCloseTxModal = () => {
    setIsTxModalOpen(false);
    setSelectedTx(null);
  };

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

    // Check balance if outcome
    if (newTx.type === "outcome") {
      const currentBalanceWithoutThisTx = selectedTx && selectedTx.walletId === newTx.walletId
        ? targetWallet.balance + (selectedTx.type === "outcome" ? selectedTx.amount : -selectedTx.amount)
        : targetWallet.balance;

      if (currentBalanceWithoutThisTx < newTx.amount) {
        alert(`Insufficient funds in wallet "${targetWallet.name}"! Available balance: ${formatCurrency(targetWallet.balance)}`);
        return;
      }
    }

    try {
      if (selectedTx) {
        // Update Mode
        const { error } = await supabase
          .from("transactions")
          .update({
            wallet_id: newTx.walletId,
            type: newTx.type,
            amount: newTx.amount,
            category_id: matchedCat.id,
            note: newTx.title,
            date: newTx.date
          })
          .eq("id", selectedTx.id)
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        // Insert Mode
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

        if (error) throw error;
      }

      await loadData();
      handleCloseTxModal();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to save transaction.");
    }
  };

  const handleDeleteTx = async () => {
    if (!selectedTx || !user) return;
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    try {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", selectedTx.id)
        .eq("user_id", user.id);

      if (error) throw error;
      await loadData();
      handleCloseTxModal();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete transaction.");
    }
  };

  // Filter list
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tx.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || tx.type === filterType;
    const matchesCategory = selectedCategoryFilter === "all" || tx.category === selectedCategoryFilter;
    return matchesSearch && matchesFilter && matchesCategory;
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const paginatedTransactions = filteredTransactions.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-black font-extrabold text-2xl">Transactions</h2>
            <p className="text-gray-400 text-sm mt-0.5">Track your history and log movements</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleOpenAddTx}
              className="py-2.5 px-4 bg-blue hover:bg-blue-600 text-white rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue/10"
            >
              <IoAddOutline className="w-4 h-4" /> Add Transaction
            </button>
          </div>
        </div>

        {/* Toolbar: Search, Category Filter, and Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue text-sm text-black bg-white"
              />
            </div>
            
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue text-sm text-black bg-white font-semibold min-w-[160px] cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
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
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase">
                  <th className="pb-3 font-semibold">Transaction</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 text-right font-semibold">Amount</th>
                  <th className="pb-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedTransactions.length > 0 ? (
                  paginatedTransactions.map((tx) => {
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
                        <td className="py-4 text-right">
                          <button
                            onClick={() => handleOpenEditTx(tx)}
                            className="text-blue hover:text-blue-600 text-xs font-extrabold cursor-pointer transition-colors"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400 font-medium text-sm">
                      No transactions matching criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 bg-gray-50/20 text-xs mt-4">
              <span className="text-gray-400 font-bold">
                Showing {Math.min((safeCurrentPage - 1) * itemsPerPage + 1, filteredTransactions.length)} to{" "}
                {Math.min(safeCurrentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} entries
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={safeCurrentPage === 1}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-black font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center border ${
                      safeCurrentPage === page
                        ? "bg-blue border-blue text-white"
                        : "border-gray-200 hover:bg-gray-50 text-black"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={safeCurrentPage === totalPages}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-black font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ADD/EDIT TRANSACTION MODAL OVERLAY */}
      {isTxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-md border border-gray-100 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-black font-extrabold text-lg">
                  {selectedTx ? "Edit Transaction" : "Add Transaction"}
                </h3>
                <p className="text-gray-400 text-xs mt-0.5">
                  {selectedTx ? "Update details of this movement" : "Register a cash movement"}
                </p>
              </div>
              <button 
                onClick={handleCloseTxModal}
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
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white font-semibold"
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
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white font-semibold"
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
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white font-semibold"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex justify-between items-center gap-3 mt-4 border-t border-gray-100 pt-4">
                {selectedTx && (
                  <button
                    type="button"
                    onClick={handleDeleteTx}
                    className="py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-xs transition-all cursor-pointer"
                  >
                    Delete
                  </button>
                )}

                <div className="flex gap-2 flex-1 justify-end">
                  <button
                    type="button"
                    onClick={handleCloseTxModal}
                    className="py-2.5 px-4 hover:bg-gray-100 text-gray-600 rounded-xl font-bold text-xs transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-blue hover:bg-blue-600 text-white rounded-xl font-bold text-xs transition-all cursor-pointer shadow-md shadow-blue/10"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Transactions;
