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
  outcome: number;
}

export interface DailyExpenseItem {
  date: string;
  amount: number;
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

// Historical monthly overview base data (updated dynamically for June)
const baseMonthlyData = [
  { name: "Jul", income: 12000000, outcome: 8000000 },
  { name: "Aug", income: 13500000, outcome: 8500000 },
  { name: "Sep", income: 14000000, outcome: 9000000 },
  { name: "Oct", income: 15000000, outcome: 9500000 },
  { name: "Nov", income: 16500000, outcome: 11000000 },
  { name: "Dec", income: 18000000, outcome: 13000000 },
  { name: "Jan", income: 15500000, outcome: 10000000 },
  { name: "Feb", income: 16000000, outcome: 9500000 },
  { name: "Mar", income: 17200000, outcome: 10200000 },
  { name: "Apr", income: 18500000, outcome: 11000000 },
  { name: "May", income: 19000000, outcome: 10500000 },
  { name: "Jun", income: 0, outcome: 0 },
];

export const useDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

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

      // 2. Fetch Transactions
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
      setTransactions(loadedTxs);
    } catch (err) {
      console.error("Error loading dashboard info:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Compute metrics
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOutcome = transactions
    .filter(t => t.type === "outcome")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSaving = Math.max(0, totalIncome - totalOutcome);

  // Compute monthly data dynamically for June
  const junIncome = transactions
    .filter(t => t.type === "income" && (t.date.includes("-06-") || t.date.includes("Jun")))
    .reduce((sum, t) => sum + t.amount, 0);

  const junOutcome = transactions
    .filter(t => t.type === "outcome" && (t.date.includes("-06-") || t.date.includes("Jun")))
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyChartData: MonthlyChartItem[] = baseMonthlyData.map(m => {
    if (m.name === "Jun") {
      return { ...m, income: junIncome, outcome: junOutcome };
    }
    return m;
  });

  // Calculate 7 days of daily expenses dynamically
  const getDailyExpenses = (): DailyExpenseItem[] => {
    const daily: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
      daily[dateStr] = 0;
    }

    transactions.filter(t => t.type === "outcome").forEach(t => {
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

    return Object.keys(daily).map(key => ({
      date: key,
      amount: daily[key]
    }));
  };

  const dailyExpensesData = getDailyExpenses();

  // Format top 6 recent activities
  const recentActivities: DashboardTransaction[] = transactions.slice(0, 6).map((activity) => {
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

  return {
    loading,
    totalIncome,
    totalOutcome,
    totalSaving,
    monthlyChartData,
    dailyExpensesData,
    recentActivities,
    refetch: loadData,
  };
};
