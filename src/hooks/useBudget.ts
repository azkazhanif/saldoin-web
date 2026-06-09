import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import type { Budget } from "../types/budget";

export const useBudget = () => {
  const { user } = useAuth();
  const [activePeriod, setActivePeriod] = useState<"daily" | "monthly" | "yearly" >("monthly");
  
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return { day: now.getDate(), month: now.getMonth() + 1, year: now.getFullYear() };
  });

  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [unbudgetedCategories, setUnbudgetedCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { day, month, year } = currentDate;

      // 1. Determine active date range for outcome transactions
      let startDate = "";
      let endDate = "";

      if (activePeriod === "daily") {
        const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        startDate = dateStr;
        endDate = dateStr;
      } else if (activePeriod === "monthly") {
        startDate = `${year}-${String(month).padStart(2, "0")}-01`;
        const lastDay = new Date(year, month, 0).getDate();
        endDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
      } else if (activePeriod === "yearly") {
        startDate = `${year}-01-01`;
        endDate = `${year}-12-31`;
      }

      // 2. Fetch budgets for the current year (so we can filter in-memory dynamically)
      const { data: budgetsData, error: budgetError } = await supabase
        .from("budgets")
        .select(`
          *,
          category:categories(id, name, icon, color)
        `)
        .eq("user_id", user.id)
        .eq("year", year);

      if (budgetError) throw budgetError;

      // 3. Fetch transactions for active date range where type = 'outcome'
      const { data: spendingData, error: txError } = await supabase
        .from("transactions")
        .select("category_id, amount")
        .eq("user_id", user.id)
        .eq("type", "outcome") // Map to 'outcome' in database
        .gte("date", startDate)
        .lte("date", endDate);

      if (txError) throw txError;

      // 4. Fetch all expense categories ('outcome') to find unbudgeted ones
      const { data: categoriesData, error: catError } = await supabase
        .from("categories")
        .select("*")
        .or(`user_id.is.null,user_id.eq.${user.id}`)
        .eq("type", "outcome");

      if (catError) throw catError;

      // Aggregate spending by category
      const spendingMap = (spendingData || []).reduce((acc, tx) => {
        acc[tx.category_id] = (acc[tx.category_id] || 0) + Number(tx.amount);
        return acc;
      }, {} as Record<string, number>);

      // Filter budgets based on active period
      const filteredBudgetsData = (budgetsData || []).filter((b: any) => {
        if (activePeriod === "daily") {
          return b.period === "daily" && b.month === month;
        } else if (activePeriod === "monthly") {
          return b.period === "monthly" && b.month === month;
        } else {
          return b.period === "yearly";
        }
      });

      // Merge budgets with dynamic progress spent
      const mergedBudgets: Budget[] = filteredBudgetsData.map((b: any) => {
        const spent = spendingMap[b.category_id] || 0;
        const amount = Number(b.amount);
        const percentage = amount > 0 ? Math.round((spent / amount) * 100) : 0;
        return {
          id: b.id,
          user_id: b.user_id,
          category_id: b.category_id,
          amount,
          period: b.period,
          month: b.month,
          year: b.year,
          alert_at: b.alert_at || 80,
          is_recurring: b.is_recurring ?? true,
          created_at: b.created_at,
          updated_at: b.updated_at,
          category: {
            id: b.category?.id,
            name: b.category?.name || "Lain-lain",
            icon: b.category?.icon || "Gift",
            color: b.category?.color || "#6B7280",
          },
          spent,
          percentage,
        };
      });

      // Filter unbudgeted categories
      const budgetedCategoryIds = new Set(mergedBudgets.map((b) => b.category_id));
      const unbudgeted = (categoriesData || [])
        .filter((cat) => !budgetedCategoryIds.has(cat.id))
        .map((cat) => ({
          id: cat.id,
          name: cat.name,
          icon: cat.icon || "Gift",
          color: cat.color || "#6B7280",
        }));

      setBudgets(mergedBudgets);
      setUnbudgetedCategories(unbudgeted);
    } catch (err) {
      console.error("Error loading budgets info:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user, activePeriod, currentDate.day, currentDate.month, currentDate.year]);

  const handlePrevPeriod = () => {
    setCurrentDate((prev) => {
      if (activePeriod === "daily") {
        const d = new Date(prev.year, prev.month - 1, prev.day - 1);
        return { day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear() };
      } else if (activePeriod === "monthly") {
        let newMonth = prev.month - 1;
        let newYear = prev.year;
        if (newMonth === 0) {
          newMonth = 12;
          newYear -= 1;
        }
        return { ...prev, month: newMonth, year: newYear };
      } else {
        return { ...prev, year: prev.year - 1 };
      }
    });
  };

  const handleNextPeriod = () => {
    setCurrentDate((prev) => {
      const now = new Date();
      const currentLimit = { day: now.getDate(), month: now.getMonth() + 1, year: now.getFullYear() };

      if (activePeriod === "daily") {
        if (prev.year > currentLimit.year ||
            (prev.year === currentLimit.year && prev.month > currentLimit.month) ||
            (prev.year === currentLimit.year && prev.month === currentLimit.month && prev.day >= currentLimit.day)) {
          return prev;
        }
        const d = new Date(prev.year, prev.month - 1, prev.day + 1);
        return { day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear() };
      } else if (activePeriod === "monthly") {
        if (prev.year > currentLimit.year || (prev.year === currentLimit.year && prev.month >= currentLimit.month)) {
          return prev;
        }
        let newMonth = prev.month + 1;
        let newYear = prev.year;
        if (newMonth === 13) {
          newMonth = 1;
          newYear += 1;
        }
        return { ...prev, month: newMonth, year: newYear };
      } else {
        if (prev.year >= currentLimit.year) {
          return prev;
        }
        return { ...prev, year: prev.year + 1 };
      }
    });
  };

  const isNextDisabled = () => {
    const now = new Date();
    if (activePeriod === "daily") {
      return currentDate.year > now.getFullYear() ||
        (currentDate.year === now.getFullYear() && currentDate.month > now.getMonth() + 1) ||
        (currentDate.year === now.getFullYear() && currentDate.month === now.getMonth() + 1 && currentDate.day >= now.getDate());
    } else if (activePeriod === "monthly") {
      return currentDate.year > now.getFullYear() ||
        (currentDate.year === now.getFullYear() && currentDate.month >= now.getMonth() + 1);
    } else {
      return currentDate.year >= now.getFullYear();
    }
  };

  const createBudget = async (
    categoryId: string, 
    amount: number, 
    alertAt: number, 
    isRecurring: boolean, 
    period?: "daily" | "monthly" | "yearly"
  ) => {
    if (!user) return { error: new Error("User not authenticated") };
    try {
      const targetPeriod = period || activePeriod;
      // Yearly budgets are mapped to month = 1 to satisfy DB unique key (user_id, category_id, month, year)
      const targetMonth = targetPeriod === "yearly" ? 1 : currentDate.month;

      const payload: any = {
        user_id: user.id,
        category_id: categoryId,
        amount,
        period: targetPeriod,
        month: targetMonth,
        year: currentDate.year,
        alert_at: alertAt,
        is_recurring: isRecurring,
      };

      let { error } = await supabase.from("budgets").insert(payload);

      // 42703 = column does not exist
      if (error && error.code === "42703") {
        delete payload.alert_at;
        delete payload.is_recurring;
        const retryResult = await supabase.from("budgets").insert(payload);
        error = retryResult.error;
      }

      if (error) throw error;
      await loadData();
      return { error: null };
    } catch (err: any) {
      console.error(err);
      return { error: err };
    }
  };

  const updateBudget = async (budgetId: string, amount: number, alertAt: number, isRecurring: boolean) => {
    if (!user) return { error: new Error("User not authenticated") };
    try {
      const payload: any = {
        amount,
        alert_at: alertAt,
        is_recurring: isRecurring,
      };

      let { error } = await supabase
        .from("budgets")
        .update(payload)
        .eq("id", budgetId)
        .eq("user_id", user.id);

      // 42703 = column does not exist
      if (error && error.code === "42703") {
        delete payload.alert_at;
        delete payload.is_recurring;
        const retryResult = await supabase
          .from("budgets")
          .update(payload)
          .eq("id", budgetId)
          .eq("user_id", user.id);
        error = retryResult.error;
      }

      if (error) throw error;
      await loadData();
      return { error: null };
    } catch (err: any) {
      console.error(err);
      return { error: err };
    }
  };

  const deleteBudget = async (budgetId: string) => {
    if (!user) return { error: new Error("User not authenticated") };
    try {
      const { error } = await supabase
        .from("budgets")
        .delete()
        .eq("id", budgetId)
        .eq("user_id", user.id);

      if (error) throw error;
      await loadData();
      return { error: null };
    } catch (err: any) {
      console.error(err);
      return { error: err };
    }
  };

  return {
    currentDate,
    activePeriod,
    setActivePeriod,
    budgets,
    unbudgetedCategories,
    loading,
    prevPeriod: handlePrevPeriod,
    nextPeriod: handleNextPeriod,
    isNextDisabled: isNextDisabled(),
    createBudget,
    updateBudget,
    deleteBudget,
    refetch: loadData,
  };
};
