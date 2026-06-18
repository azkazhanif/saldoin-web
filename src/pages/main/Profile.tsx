import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";
import MainLayout from "../../layouts/MainLayout";
import { 
  IoBriefcaseOutline, 
  IoFastFoodOutline, 
  IoCartOutline, 
  IoGameControllerOutline, 
  IoBulbOutline, 
  IoReceiptOutline,
  IoCashOutline,
  IoCarOutline,
  IoHeartOutline,
  IoBookOutline,
  IoPeopleOutline,
  IoStorefrontOutline,
  IoTrendingUpOutline,
  IoRepeatOutline,
  IoFlameOutline,
  IoWalletOutline,
  IoTrendingDownOutline,
  IoLogOutOutline,
  IoCalendarOutline
} from "react-icons/io5";

const iconMap: Record<string, any> = {
  IoBriefcaseOutline,
  IoFastFoodOutline,
  IoCartOutline,
  IoGameControllerOutline,
  IoBulbOutline,
  IoReceiptOutline,
  IoCashOutline,
  IoCarOutline,
  IoHeartOutline,
  IoBookOutline,
  IoPeopleOutline,
  IoStorefrontOutline,
  IoTrendingUpOutline,
  IoRepeatOutline
};

const getBgColorClass = (color: string) => {
  if (!color) return "bg-gray-50 text-gray-500";
  if (color === "bg-blue") return "bg-blue/10 text-blue";
  if (color.endsWith("-500")) {
    return `${color.replace("-500", "-50")} text-${color.replace("bg-", "").replace("-500", "-600")}`;
  }
  if (color.endsWith("-600") || color.endsWith("-700")) {
    const baseColor = color.split("-")[1];
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

export const Profile = () => {
  const { profile, user, signOut, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [wallets, setWallets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const displayName = profile?.name || user?.email?.split("@")[0] || "User Saldoin";
  const userInitial = displayName.charAt(0).toUpperCase();

  const loadProfileSummary = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Refresh user profile details to get latest streak data from database
      try {
        await refreshProfile();
      } catch (e) {
        console.warn("Could not refresh profile from database, using client computation fallback:", e);
      }

      // 1. Fetch Wallets
      const { data: walletsData } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", user.id);

      // 2. Fetch Transactions
      const { data: transactionsData } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      // 3. Fetch Categories
      const { data: categoriesData } = await supabase
        .from("categories")
        .select("*")
        .or(`user_id.is.null,user_id.eq.${user.id}`);

      // Map Categories
      const loadedCats = (categoriesData || []).map((cat) => ({
        id: cat.id,
        name: cat.name,
        type: cat.type,
        color: cat.color || "bg-blue",
        bgColor: getBgColorClass(cat.color || ""),
        iconName: cat.icon
      }));

      // Calculate dynamically wallet balance by applying transactions in memory
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
        };
      });

      // Map transactions for the UI
      const loadedTxs = (transactionsData || []).map((tx) => {
        const cat = categoriesData?.find(c => c.id === tx.category_id);
        return {
          id: tx.id,
          title: tx.note || "Transaction",
          category: cat ? cat.name : "Lain-lain",
          date: tx.date,
          amount: Number(tx.amount),
          type: tx.type === "income" ? "income" : "outcome",
        };
      });

      setCategories(loadedCats);
      setWallets(loadedWallets);
      setTransactions(loadedTxs);
    } catch (err) {
      console.error("Error loading profile summary data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileSummary();
  }, [user]);

  // Calculate Streak money journaling
  const calculateJournalingStreak = () => {
    if (transactions.length === 0) return 0;

    // Get unique transaction log dates sorted descending
    const dates = Array.from(
      new Set(transactions.map((tx) => tx.date))
    ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const mostRecentDate = new Date(dates[0]);
    mostRecentDate.setHours(0, 0, 0, 0);

    // If most recent entry is older than yesterday, streak is broken
    if (mostRecentDate.getTime() < yesterday.getTime()) {
      return 0;
    }

    let expectedDate = mostRecentDate;
    for (let i = 0; i < dates.length; i++) {
      const currentDate = new Date(dates[i]);
      currentDate.setHours(0, 0, 0, 0);

      if (currentDate.getTime() === expectedDate.getTime()) {
        streak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
        expectedDate.setHours(0, 0, 0, 0);
      } else if (currentDate.getTime() < expectedDate.getTime()) {
        break;
      }
    }
    return streak;
  };

  // Read streak from profile metadata (computed on DB via trigger), with client fallback
  const streak = profile?.journaling_streak !== undefined && profile?.journaling_streak !== null 
    ? profile.journaling_streak 
    : calculateJournalingStreak();

  const longestStreak = profile?.longest_streak !== undefined && profile?.longest_streak !== null
    ? profile.longest_streak
    : Math.max(streak, 0);

  // Financial Summary Computations
  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter(t => t.type === "outcome" || t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const handleLogout = async () => {
    if (confirm("Yakin ingin keluar dari akun Anda?")) {
      try {
        await signOut();
      } catch (err) {
        console.error("Gagal keluar:", err);
      }
    }
  };

  const recentActivities = transactions.slice(0, 5);

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        {/* Profile Header Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 transition-all hover:shadow-md">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-blue text-white flex items-center justify-center font-bold text-3xl shadow-md flex-shrink-0 ring-4 ring-blue/10">
              {userInitial}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-black font-extrabold text-2xl leading-tight">{displayName}</h2>
              <p className="text-gray-400 text-sm font-semibold mt-1">{user?.email}</p>
              
              <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-3 justify-center sm:justify-start font-medium">
                <IoCalendarOutline className="w-4 h-4 text-gray-400" />
                <span>Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString("id-ID", { month: "long", year: "numeric" }) : "Recently"}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer self-stretch sm:self-auto justify-center"
          >
            <IoLogOutOutline className="w-5 h-5" /> Sign Out
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-8 h-8 border-4 border-blue border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 text-xs font-semibold mt-3 animate-pulse">Memuat ringkasan profil...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* STREAK JOURNALING CARD */}
            <div className="md:col-span-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-orange-200/50 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-md transition-all">
              <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
                <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md animate-bounce">
                  <IoFlameOutline className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-black font-extrabold text-lg leading-tight">Streak Money Journaling</h3>
                  <p className="text-gray-500 text-xs font-semibold mt-1">
                    {streak > 0 
                      ? `Hebat! Kamu sudah mencatat keuangan selama ${streak} hari berturut-turut.` 
                      : "Belum ada streak. Catat transaksi kamu setiap hari untuk membangun kebiasaan keuangan yang sehat!"
                    }
                  </p>
                </div>
              </div>
              <div className="text-center sm:text-right shrink-0 flex gap-5 justify-center">
                <div className="text-center">
                  <span className="text-orange-600 font-extrabold text-4xl leading-none">{streak}</span>
                  <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mt-1.5">Hari Beruntun</p>
                </div>
                <div className="text-center border-l border-orange-200/40 pl-5">
                  <span className="text-amber-600 font-extrabold text-4xl leading-none">{longestStreak}</span>
                  <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mt-1.5">Rekor Terbaik</p>
                </div>
              </div>
            </div>

            {/* FINANCIAL SUMMARY METRICS */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
              <div className="flex flex-col">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Saldo</span>
                <span className="text-black font-extrabold text-xl leading-none">{formatCurrency(totalBalance)}</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue/10 text-blue flex items-center justify-center shadow-xs">
                <IoWalletOutline className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
              <div className="flex flex-col">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Pemasukan</span>
                <span className="text-green-600 font-extrabold text-xl leading-none">{formatCurrency(totalIncome)}</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shadow-xs">
                <IoTrendingUpOutline className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
              <div className="flex flex-col">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Pengeluaran</span>
                <span className="text-red-600 font-extrabold text-xl leading-none">{formatCurrency(totalExpense)}</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shadow-xs">
                <IoTrendingDownOutline className="w-6 h-6" />
              </div>
            </div>

            {/* RECENT ACTIVITY LIST (Spans 3 columns) */}
            <div className="md:col-span-3 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4 hover:shadow-md transition-all">
              <div>
                <h3 className="text-black font-extrabold text-lg">Aktivitas Terakhir</h3>
                <p className="text-gray-400 text-xs mt-0.5 font-medium">Transaksi terakhir yang Anda catat</p>
              </div>

              <div className="flex flex-col gap-3">
                {recentActivities.length > 0 ? (
                  recentActivities.map((tx) => {
                    const categoryObj = categories.find(c => c.name === tx.category);
                    const iconName = categoryObj?.iconName || "IoCashOutline";
                    const Icon = iconMap[iconName] || IoCashOutline;
                    const bgColorClass = categoryObj?.bgColor || "bg-gray-100 text-gray-600";

                    return (
                      <div key={tx.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50/50 transition-colors border border-gray-50">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl ${bgColorClass} flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-black font-bold text-sm leading-tight">{tx.title}</p>
                            <p className="text-gray-400 text-[10px] font-semibold mt-1 uppercase tracking-wider bg-gray-50 px-2 py-0.5 rounded border border-gray-100 inline-block">
                              {tx.category}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-extrabold text-sm ${
                            tx.type === "income" ? "text-green-600" : "text-black"
                          }`}>
                            {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                          </p>
                          <p className="text-gray-400 text-[10px] font-medium mt-1">
                            {tx.date}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-400 text-center text-xs font-semibold py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    Belum ada transaksi dicatat.
                  </p>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Profile;
