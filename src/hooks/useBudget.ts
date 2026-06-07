import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import type { Budget } from "../types/budget";

export const useBudget = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return { month: now.getMonth() + 1, year: now.getFullYear() };
  });

  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [unbudgetedCategories, setUnbudgetedCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { month, year } = currentDate;

      // 1. Fetch budgets for the month & year (with category details joined)
      const { data: budgetsData, error: budgetError } = await supabase
        .from("budgets")
        .select(`
          *,
          category:categories(id, name, icon, color)
        `)
        .eq("user_id", user.id)
        .eq("month", month)
        .eq("year", year);

      if (budgetError) throw budgetError;

      // 2. Fetch transactions for active month (where type = 'outcome')
      const startOfMonth = `${year}-${String(month).padStart(2, "0")}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const endOfMonth = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

      const { data: spendingData, error: txError } = await supabase
        .from("transactions")
        .select("category_id, amount")
        .eq("user_id", user.id)
        .eq("type", "outcome") // Map to 'outcome' in database
        .gte("date", startOfMonth)
        .lte("date", endOfMonth);

      if (txError) throw txError;

      // 3. Fetch all expense categories ('outcome') to find unbudgeted ones
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

      // Merge budgets with dynamic progress spent
      const mergedBudgets: Budget[] = (budgetsData || []).map((b: any) => {
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
  }, [user, currentDate.month, currentDate.year]);

  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      let newMonth = prev.month - 1;
      let newYear = prev.year;
      if (newMonth === 0) {
        newMonth = 12;
        newYear -= 1;
      }
      return { month: newMonth, year: newYear };
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const now = new Date();
      const currentLimit = { month: now.getMonth() + 1, year: now.getFullYear() };

      if (prev.year > currentLimit.year || (prev.year === currentLimit.year && prev.month >= currentLimit.month)) {
        return prev; // Disable navigating to the future
      }

      let newMonth = prev.month + 1;
      let newYear = prev.year;
      if (newMonth === 13) {
        newMonth = 1;
        newYear += 1;
      }
      return { month: newMonth, year: newYear };
    });
  };

  const isNextDisabled = () => {
    const now = new Date();
    return currentDate.year > now.getFullYear() || 
      (currentDate.year === now.getFullYear() && currentDate.month >= now.getMonth() + 1);
  };

  const createBudget = async (categoryId: string, amount: number, alertAt: number, isRecurring: boolean) => {
    if (!user) return { error: new Error("User not authenticated") };
    try {
      const { error } = await supabase.from("budgets").insert({
        user_id: user.id,
        category_id: categoryId,
        amount,
        period: "monthly",
        month: currentDate.month,
        year: currentDate.year,
        alert_at: alertAt,
        is_recurring: isRecurring,
      });

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
      const { error } = await supabase
        .from("budgets")
        .update({
          amount,
          alert_at: alertAt,
          is_recurring: isRecurring,
          updated_at: new Date().toISOString(),
        })
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
    budgets,
    unbudgetedCategories,
    loading,
    prevMonth: handlePrevMonth,
    nextMonth: handleNextMonth,
    isNextDisabled: isNextDisabled(),
    createBudget,
    updateBudget,
    deleteBudget,
    refetch: loadData,
  };
};
