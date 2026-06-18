import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";

export interface WalletItem {
  id: string;
  name: string;
  type: string;
  provider: string;
  balance: number;
  initialBalance: number;
  color: string;
}

export const walletColorSwatches = [
  "#3B82F6", // Blue (BCA)
  "#4F46E5", // Indigo (Mandiri)
  "#06B6D4", // Cyan (GoPay)
  "#8B5CF6", // Purple (OVO)
  "#10B981", // Emerald (Cash)
  "#EF4444", // Red
  "#F59E0B", // Amber
  "#EC4899", // Pink
  "#1E293B", // Dark Slate
];

export const getProviderDefaultColor = (provider: string) => {
  switch (provider) {
    case "BCA":
      return "#3B82F6";
    case "Mandiri":
      return "#4F46E5";
    case "GoPay":
      return "#06B6D4";
    case "OVO":
      return "#8B5CF6";
    case "Cash":
      return "#10B981";
    default:
      return "#64748B";
  }
};

export const getWalletGradientStyle = (hexColor: string) => {
  const darkenHex = (hex: string, percent: number) => {
    let num = parseInt(hex.replace("#", ""), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) - amt,
      G = ((num >> 8) & 0x00ff) - amt,
      B = (num & 0x0000ff) - amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 0 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  };

  const startColor = hexColor || "#3B82F6";
  const endColor = darkenHex(startColor, 25);
  return {
    background: `linear-gradient(135deg, ${startColor} 0%, ${endColor} 100%)`,
  };
};

export const useWallet = () => {
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
    color: "#3B82F6",
  });

  // Edit Form states
  const [editWallet, setEditWallet] = useState({
    name: "",
    type: "Bank",
    provider: "BCA",
    balance: 0,
    color: "#3B82F6",
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
          color: w.color || getProviderDefaultColor(w.provider),
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
        is_active: true,
        color: newWallet.color,
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
        color: "#3B82F6",
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
          color: editWallet.color,
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

  return {
    wallets,
    loading,
    isModalOpen,
    setIsModalOpen,
    selectedWallet,
    setSelectedWallet,
    isDetailOpen,
    setIsDetailOpen,
    isConfirmingDelete,
    setIsConfirmingDelete,
    deleteLoading,
    isEditing,
    setIsEditing,
    newWallet,
    setNewWallet,
    editWallet,
    setEditWallet,
    handleSubmit,
    handleEditSubmit,
    handleDeleteWallet,
    loadData,
  };
};
