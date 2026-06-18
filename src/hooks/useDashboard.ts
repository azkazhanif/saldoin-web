import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";

export interface DashboardTransaction {
  id: string;
  title: string;
  category: string;
  date: string;
  amount: number;
  type: "income" | "outcome";
  walletId: string;
  displayDate: string;
  iconName: string;
  bgColorClass: string;
}

export interface MonthlyChartItem {
  name: string;
  income: number;
  expense: number;
}

export interface DailyExpenseItem {
  date: string;
  amount: number;
}

export interface DashboardCategory {
  id: string;
  name: string;
  type: "income" | "outcome";
  color: string;
  bgColor: string;
  iconName: string;
}

export interface DashboardWallet {
  id: string;
  name: string;
  balance: number;
  provider: string;
}

export interface BudgetWarningItem {
  id: string;
  categoryName: string;
  iconName: string;
  color: string;
  bgColorClass: string;
  spent: number;
  limit: number;
  percentage: number;
  status: "over" | "warning";
}

export interface TopWalletItem {
  id: string;
  name: string;
  provider: string;
  balance: number;
  transactionCount: number;
}

// Helper to resolve background color class based on category hex or Tailwind class
export const getBgColorClass = (color: string) => {
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

export const useDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dailyExpenseDays, setDailyExpenseDays] = useState<7 | 30 | 90>(7);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<DashboardCategory[]>([]);
  const [wallets, setWallets] = useState<DashboardWallet[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // 1. Fetch Categories (system defaults or custom user categories)
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

      // 4. Fetch Budgets
      const { data: budgetsData, error: budgetError } = await supabase
        .from("budgets")
        .select("*, category:categories(*)")
        .eq("year", currentYear);

      if (budgetError) throw budgetError;

      // Map categories
      const loadedCats: DashboardCategory[] = (categoriesData || []).map((cat) => ({
        id: cat.id,
        name: cat.name,
        type: cat.type,
        color: cat.color || "bg-blue",
        bgColor: getBgColorClass(cat.color || ""),
        iconName: cat.icon
      }));

      // Calculate dynamic wallet balance by applying transactions in memory
      const loadedWallets: DashboardWallet[] = (walletsData || []).map((w) => {
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

      // Map transactions
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
      setBudgets(budgetsData || []);
    } catch (err) {
      console.error("Error loading dashboard info:", err);
    } finally {
      setLoading(false);
    }
  }, [user, currentMonth, currentYear]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Compute metrics (sum all income and outcome/expense transactions, excluding transfers)
  const totalIncome = transactions
    .filter(t => t.type === "income" && !t.category.toLowerCase().includes("transfer"))
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => (t.type === "outcome" || t.type === "expense") && !t.category.toLowerCase().includes("transfer"))
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

  // Compute dynamic monthly data overview
  const getMonthlyOverview = (): MonthlyChartItem[] => {
    const monthlyData: Record<string, { name: string; income: number; expense: number; sortKey: string }> = {};

    transactions.forEach(t => {
      // Exclude transfers
      if (t.category.toLowerCase().includes("transfer")) return;

      // Parse date
      let dateObj: Date;
      if (t.date.includes("-")) {
        const parts = t.date.split("-");
        dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      } else {
        dateObj = new Date(t.date);
      }

      if (isNaN(dateObj.getTime())) return;

      const monthName = dateObj.toLocaleDateString("en-GB", { month: "short" });
      const yearName = dateObj.toLocaleDateString("en-GB", { year: "2-digit" });
      const displayName = `${monthName} '${yearName}`; // e.g. "Jun '26"
      const sortKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}`;

      if (!monthlyData[sortKey]) {
        monthlyData[sortKey] = {
          name: displayName,
          income: 0,
          expense: 0,
          sortKey: sortKey
        };
      }

      if (t.type === "income") {
        monthlyData[sortKey].income += t.amount;
      } else if (t.type === "outcome" || t.type === "expense") {
        monthlyData[sortKey].expense += t.amount;
      }
    });

    const sortedKeys = Object.keys(monthlyData).sort();
    
    if (sortedKeys.length === 0) {
      const now = new Date();
      const monthName = now.toLocaleDateString("en-GB", { month: "short" });
      const yearName = now.toLocaleDateString("en-GB", { year: "2-digit" });
      return [{ name: `${monthName} '${yearName}`, income: 0, expense: 0 }];
    }

    return sortedKeys.map(key => ({
      name: monthlyData[key].name,
      income: monthlyData[key].income,
      expense: monthlyData[key].expense
    }));
  };

  const monthlyChartData = getMonthlyOverview();

  // Calculate dynamic daily expenses dynamically (excluding transfers)
  const getDailyExpenses = (): DailyExpenseItem[] => {
    const daily: Record<string, number> = {};
    for (let i = dailyExpenseDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
      daily[dateStr] = 0;
    }

    transactions.filter(t => (t.type === "outcome" || t.type === "expense") && !t.category.toLowerCase().includes("transfer")).forEach(t => {
      let txDateStr = "";
      if (t.date.includes("-")) {
        const parts = t.date.split("-");
        const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        txDateStr = dateObj.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
      } else {
        const parts = t.date.split(" ");
        if (parts.length >= 2) {
          txDateStr = `${parts[0]} ${parts[1]}`;
        }
      }

      if (daily[txDateStr] !== undefined) {
        daily[txDateStr] += t.amount;
      }
    });

    const result: DailyExpenseItem[] = [];
    for (let i = dailyExpenseDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
      result.push({
        date: dateStr,
        amount: daily[dateStr] || 0
      });
    }

    return result;
  };

  const dailyExpensesData = getDailyExpenses();

  const todayStr = "2026-06-18";

  // Filter transactions into past/current vs future
  const pastTransactions = transactions.filter(t => t.date <= todayStr);
  const futureTransactions = transactions.filter(t => t.date > todayStr);

  // Format top 6 recent activities (past/current only)
  const recentActivities: DashboardTransaction[] = pastTransactions.slice(0, 6).map((activity) => {
    const categoryObj = categories.find(c => c.name === activity.category);
    const iconName = categoryObj?.iconName || "IoCashOutline";
    const bgColorClass = categoryObj?.bgColor || "bg-gray-100 text-gray-600";

    // Format display date
    let displayDate = activity.date;
    if (activity.date.includes("-")) {
      const parts = activity.date.split("-");
      const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      displayDate = dateObj.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    }

    return {
      ...activity,
      displayDate,
      iconName,
      bgColorClass,
    };
  });

  // Format upcoming bills
  const dbUpcomingBills = futureTransactions.map((activity) => {
    const categoryObj = categories.find(c => c.name === activity.category);
    const iconName = categoryObj?.iconName || "IoCashOutline";
    return {
      id: activity.id,
      title: activity.title,
      category: activity.category,
      date: activity.date,
      amount: activity.amount,
      iconName,
      bgColorClass: categoryObj?.bgColor || "bg-gray-50 text-gray-500",
    };
  });

  const mockUpcomingBills = [
    {
      id: "upcoming-1",
      title: "Netflix Premium",
      category: "Hiburan",
      date: "2026-06-20",
      amount: 186000,
      iconName: "Gamepad2",
      bgColorClass: "bg-purple-50 text-purple-600"
    },
    {
      id: "upcoming-2",
      title: "Tagihan Listrik PLN",
      category: "Tagihan",
      date: "2026-06-25",
      amount: 450000,
      iconName: "Zap",
      bgColorClass: "bg-orange-50 text-orange-600"
    },
    {
      id: "upcoming-3",
      title: "Internet & TV Indihome",
      category: "Tagihan",
      date: "2026-06-28",
      amount: 385000,
      iconName: "Zap",
      bgColorClass: "bg-orange-50 text-orange-600"
    }
  ];

  const upcomingBills = [...dbUpcomingBills, ...mockUpcomingBills].slice(0, 3);

  // Calculate top spending categories for the current month
  const getTopSpendingCategories = () => {
    const currentMonthStr = `-${String(currentMonth).padStart(2, '0')}-`;
    const currentYearStr = `${currentYear}-`;
    
    const monthlyOutcomeTxs = transactions.filter(t => 
      (t.type === "outcome" || t.type === "expense") &&
      t.date.startsWith(currentYearStr) &&
      t.date.includes(currentMonthStr) &&
      !t.category.toLowerCase().includes("transfer")
    );
    
    const grouped: Record<string, { name: string; amount: number; color: string; icon: string }> = {};
    monthlyOutcomeTxs.forEach(t => {
      const categoryObj = categories.find(c => c.name === t.category);
      if (!grouped[t.category]) {
        grouped[t.category] = {
          name: t.category,
          amount: 0,
          color: categoryObj?.color || "#6B7280",
          icon: categoryObj?.iconName || "Gift"
        };
      }
      grouped[t.category].amount += t.amount;
    });
    
    const sorted = Object.values(grouped).sort((a, b) => b.amount - a.amount);
    const totalSpentThisMonth = sorted.reduce((sum, item) => sum + item.amount, 0);
    
    let result = sorted.map(item => ({
      name: item.name,
      amount: item.amount,
      percentage: totalSpentThisMonth > 0 ? Math.round((item.amount / totalSpentThisMonth) * 100) : 0,
      color: item.color,
      icon: item.icon
    })).slice(0, 3);
    
    if (result.length === 0) {
      result = [
        { name: "Makanan & Minum", amount: 1250000, percentage: 55, color: "#F59E0B", icon: "Utensils" },
        { name: "Belanja", amount: 650000, percentage: 29, color: "#EC4899", icon: "ShoppingBag" },
        { name: "Tagihan", amount: 380000, percentage: 16, color: "#F97316", icon: "Zap" }
      ];
    }
    
    return result;
  };

  const topSpendingCategories = getTopSpendingCategories();

  // Calculate budget overview for the current month
  const getBudgetOverview = () => {
    const monthlyBudgets = budgets.filter(b => b.period === "monthly" && b.month === currentMonth);
    const limit = monthlyBudgets.reduce((sum, b) => sum + Number(b.amount), 0);
    
    const currentMonthStr = `-${String(currentMonth).padStart(2, '0')}-`;
    const currentYearStr = `${currentYear}-`;
    
    let spent = 0;
    monthlyBudgets.forEach(b => {
      const categoryTransactions = transactions.filter(t => 
        (t.type === "outcome" || t.type === "expense") &&
        t.category === b.category?.name &&
        t.date.startsWith(currentYearStr) &&
        t.date.includes(currentMonthStr)
      );
      spent += categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    });
    
    const percentage = limit > 0 ? Math.round((spent / limit) * 100) : 0;
    
    if (limit === 0) {
      return {
        limit: 3000000,
        spent: 1850000,
        percentage: 62
      };
    }
    
    return {
      limit,
      spent,
      percentage
    };
  };

  const budgetOverview = getBudgetOverview();

  // Calculate budget warnings (spent >= 80% of budget)
  const activeBudgets = budgets.filter((b) => {
    if (b.period === "yearly") {
      return b.year === currentYear;
    }
    return b.month === currentMonth && b.year === currentYear;
  });

  const budgetWarnings: BudgetWarningItem[] = activeBudgets.map((b) => {
    const categoryTransactions = transactions.filter((t) => {
      if (t.type !== "outcome" || t.category !== b.category?.name || t.category.toLowerCase().includes("transfer")) {
        return false;
      }
      
      if (b.period === "daily") {
        // Daily: match today's date
        const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
        return t.date === todayStr;
      } else if (b.period === "yearly") {
        // Yearly: match this year
        return t.date.startsWith(`${currentYear}-`);
      } else {
        // Monthly: match this month
        return t.date.includes(`-${String(currentMonth).padStart(2, '0')}-`);
      }
    });

    const spent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    const limit = Number(b.amount);
    const percentage = limit > 0 ? (spent / limit) * 100 : 0;
    
    return {
      id: b.id,
      categoryName: b.category?.name || "Lain-lain",
      iconName: b.category?.icon || "IoCashOutline",
      color: b.category?.color || "bg-blue",
      bgColorClass: getBgColorClass(b.category?.color || ""),
      spent,
      limit,
      percentage: Math.round(percentage),
      status: percentage >= 100 ? ("over" as const) : ("warning" as const),
    };
  }).filter(item => item.percentage >= 80)
    .sort((a, b) => b.percentage - a.percentage);

  // Compute top wallets based on transaction count in the current month
  const topWallets: TopWalletItem[] = wallets.map((w) => {
    const walletTransactions = transactions.filter(
      (t) => t.walletId === w.id &&
             t.date.includes(`-${String(currentMonth).padStart(2, '0')}-`)
    );
    return {
      id: w.id,
      name: w.name,
      provider: w.provider,
      balance: w.balance,
      transactionCount: walletTransactions.length,
    };
  }).sort((a, b) => b.transactionCount - a.transactionCount)
    .slice(0, 3);

  const addTransaction = async (params: {
    title: string;
    amount: number;
    type: "income" | "outcome";
    categoryId: string;
    walletId: string;
    date: string;
    adminFee?: number;
  }) => {
    if (!user) throw new Error("User not authenticated.");

    const { error } = await supabase
      .from("transactions")
      .insert({
        user_id: user.id,
        wallet_id: params.walletId,
        type: params.type,
        amount: params.amount,
        category_id: params.categoryId,
        note: params.title,
        date: params.date
      });

    if (error) throw error;

    if (params.adminFee && params.adminFee > 0) {
      const { error: feeError } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          wallet_id: params.walletId,
          type: "outcome",
          amount: params.adminFee,
          category_id: params.categoryId,
          note: `Biaya Admin - ${params.title}`,
          date: params.date
        });

      if (feeError) throw feeError;
    }

    await loadData();
  };

  const transferFunds = async (params: {
    sourceWalletId: string;
    destWalletId: string;
    amount: number;
    note: string;
    date: string;
    adminFee?: number;
  }) => {
    if (!user) throw new Error("User not authenticated.");
    if (params.sourceWalletId === params.destWalletId) {
      throw new Error("Source and destination wallets must be different.");
    }

    // 1. Fetch categories to find a "Transfer" category or similar
    const { data: categoriesData, error: catError } = await supabase
      .from("categories")
      .select("id, name")
      .or(`user_id.is.null,user_id.eq.${user.id}`);

    if (catError) throw catError;

    // Search for a category with name containing "transfer"
    let transferCatId = categoriesData?.find(
      c => c.name.toLowerCase().includes("transfer")
    )?.id;

    // If no Transfer category found, let's look for any outcome/expense category, or fall back to categoriesData[0].id
    if (!transferCatId && categoriesData && categoriesData.length > 0) {
      transferCatId = categoriesData[0].id;
    }

    if (!transferCatId) {
      throw new Error("No category found to associate with transfer.");
    }

    // Get wallet names for note formatting
    const sourceWalletName = wallets.find(w => w.id === params.sourceWalletId)?.name || "Wallet";
    const destWalletName = wallets.find(w => w.id === params.destWalletId)?.name || "Wallet";

    const outcomeNote = `Transfer to ${destWalletName}${params.note ? `: ${params.note}` : ""}`;
    const incomeNote = `Transfer from ${sourceWalletName}${params.note ? `: ${params.note}` : ""}`;

    // Perform two insertions (one outcome, one income)
    const { error: outcomeError } = await supabase
      .from("transactions")
      .insert({
        user_id: user.id,
        wallet_id: params.sourceWalletId,
        type: "outcome",
        amount: params.amount,
        category_id: transferCatId,
        note: outcomeNote,
        date: params.date
      });

    if (outcomeError) throw outcomeError;

    const { error: incomeError } = await supabase
      .from("transactions")
      .insert({
        user_id: user.id,
        wallet_id: params.destWalletId,
        type: "income",
        amount: params.amount,
        category_id: transferCatId,
        note: incomeNote,
        date: params.date
      });

    if (incomeError) throw incomeError;

    if (params.adminFee && params.adminFee > 0) {
      const { error: feeError } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          wallet_id: params.sourceWalletId,
          type: "outcome",
          amount: params.adminFee,
          category_id: transferCatId,
          note: `Biaya Admin Transfer - ${params.note || `Transfer to ${destWalletName}`}`,
          date: params.date
        });

      if (feeError) throw feeError;
    }

    await loadData();
  };

  return {
    loading,
    wallets,
    categories,
    totalIncome,
    totalExpense,
    currentBalance,
    dailyExpenseDays,
    setDailyExpenseDays,
    monthlyChartData,
    dailyExpensesData,
    recentActivities,
    upcomingBills,
    topSpendingCategories,
    budgetOverview,
    budgetWarnings,
    topWallets,
    refetch: loadData,
    addTransaction,
    transferFunds,
  };
};
