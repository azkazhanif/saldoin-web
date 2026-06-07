import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import MainLayout from "../../layouts/MainLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { 
  IoTrendingUpOutline, 
  IoTrendingDownOutline, 
  IoWalletOutline,
  IoFastFoodOutline,
  IoCartOutline,
  IoGameControllerOutline,
  IoReceiptOutline,
  IoBriefcaseOutline,
  IoBulbOutline,
  IoRepeatOutline,
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

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Custom Chart Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-lg z-50">
        <p className="text-gray-400 text-xs font-semibold mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm mt-1">
            <span 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-500 font-medium capitalize">{entry.name}:</span>
            <span className="text-black font-extrabold">
              {formatCurrency(entry.value as number)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const localTxs = localStorage.getItem("saldooin_transactions");
    const localWallets = localStorage.getItem("saldooin_wallets");
    const localCats = localStorage.getItem("saldooin_categories");

    const loadedTxs = localTxs ? JSON.parse(localTxs) : defaultTransactions;
    const loadedCats = localCats ? JSON.parse(localCats) : defaultCategories;

    setTransactions(loadedTxs);
    setCategories(loadedCats);

    if (!localTxs) localStorage.setItem("saldooin_transactions", JSON.stringify(defaultTransactions));
    if (!localWallets) localStorage.setItem("saldooin_wallets", JSON.stringify(defaultWallets));
    if (!localCats) localStorage.setItem("saldooin_categories", JSON.stringify(defaultCategories));
  }, []);

  // Compute live summaries
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

  const monthlyChartData = baseMonthlyData.map(m => {
    if (m.name === "Jun") {
      return { ...m, income: junIncome, outcome: junOutcome };
    }
    return m;
  });

  // Calculate 7 days of daily expenses dynamically
  const getDailyExpenses = () => {
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

  // Show only top 6 recent activities
  const recentActivities = transactions.slice(0, 6);

  return (
    <MainLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric Card: Income */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center justify-between transition-all duration-300 hover:shadow-md hover:border-gray-200">
          <div className="flex flex-col">
            <span className="text-gray-400 text-sm font-semibold mb-1">Total Income</span>
            <span className="text-black font-extrabold text-2xl leading-none">{formatCurrency(totalIncome)}</span>
            <span className="text-green-500 font-bold text-xs mt-2 flex items-center gap-1">
              <IoTrendingUpOutline className="w-4 h-4" /> +12.5% vs last month
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center font-bold text-xl shadow-sm flex-shrink-0">
            <IoTrendingUpOutline className="w-6 h-6" />
          </div>
        </div>

        {/* Metric Card: Outcome */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center justify-between transition-all duration-300 hover:shadow-md hover:border-gray-200">
          <div className="flex flex-col">
            <span className="text-gray-400 text-sm font-semibold mb-1">Total Outcome</span>
            <span className="text-black font-extrabold text-2xl leading-none">{formatCurrency(totalOutcome)}</span>
            <span className="text-red-500 font-bold text-xs mt-2 flex items-center gap-1">
              <IoTrendingDownOutline className="w-4 h-4" /> +8.2% vs last month
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-xl shadow-sm flex-shrink-0">
            <IoTrendingDownOutline className="w-6 h-6" />
          </div>
        </div>

        {/* Metric Card: Saving */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center justify-between transition-all duration-300 hover:shadow-md hover:border-gray-200">
          <div className="flex flex-col">
            <span className="text-gray-400 text-sm font-semibold mb-1">Total Saving</span>
            <span className="text-black font-extrabold text-2xl leading-none">{formatCurrency(totalSaving)}</span>
            <span className="text-blue font-bold text-xs mt-2 flex items-center gap-1">
              <IoWalletOutline className="w-4 h-4" /> 46.3% saving rate
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue/10 text-blue flex items-center justify-center font-bold text-xl shadow-sm flex-shrink-0">
            <IoWalletOutline className="w-6 h-6" />
          </div>
        </div>

        {/* Monthly Comparison Chart (spans 2 columns) */}
        <div className="md:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-black font-extrabold text-lg">Income & Outcome Overview</h3>
              <p className="text-gray-400 text-xs mt-0.5">Monthly breakdown for the last 12 months</p>
            </div>
            {/* Custom Legend */}
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-blue" />
                <span className="text-gray-600">Income</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-red-400" />
                <span className="text-gray-600">Outcome</span>
              </div>
            </div>
          </div>
          
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyChartData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  tickLine={false} 
                  axisLine={false} 
                  stroke="#9ca3af" 
                  fontSize={11} 
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  stroke="#9ca3af" 
                  fontSize={11}
                  tickFormatter={(val) => `Rp ${(val / 1000000).toFixed(0)}M`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
                <Bar 
                  dataKey="income" 
                  name="Income" 
                  fill="#0065e1" 
                  radius={[4, 4, 0, 0]} 
                  maxBarSize={16}
                />
                <Bar 
                  dataKey="outcome" 
                  name="Outcome" 
                  fill="#f87171" 
                  radius={[4, 4, 0, 0]} 
                  maxBarSize={16}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions Card (spans 1 column) */}
        <div className="md:col-span-1 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md">
          <div className="flex flex-col mb-4">
            <h3 className="text-black font-extrabold text-lg">Quick Actions</h3>
            <p className="text-gray-400 text-xs mt-0.5">Manage your transactions instantly</p>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-3 w-full">
            {/* Add Income */}
            <button 
              onClick={() => navigate("/transactions")}
              className="w-full py-2.5 px-3 rounded-xl bg-green-50 hover:bg-green-100/80 text-green-600 border border-green-100/30 flex items-center justify-between transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-green-600 text-white flex items-center justify-center flex-shrink-0">
                  <IoTrendingUpOutline className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-extrabold text-xs leading-tight text-green-700">Add Income</p>
                  <p className="text-[10px] text-green-600/70 mt-0.5">Receive funds to wallet</p>
                </div>
              </div>
              <span className="text-green-600 group-hover:translate-x-1 transition-transform text-sm font-extrabold">&rarr;</span>
            </button>

            {/* Add Expense */}
            <button 
              onClick={() => navigate("/transactions")}
              className="w-full py-2.5 px-3 rounded-xl bg-red-50 hover:bg-red-100/80 text-red-600 border border-red-100/30 flex items-center justify-between transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center flex-shrink-0">
                  <IoTrendingDownOutline className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-extrabold text-xs leading-tight text-red-700">Add Expense</p>
                  <p className="text-[10px] text-red-600/70 mt-0.5">Log an outgoing payment</p>
                </div>
              </div>
              <span className="text-red-600 group-hover:translate-x-1 transition-transform text-sm font-extrabold">&rarr;</span>
            </button>

            {/* Transfer Funds */}
            <button 
              onClick={() => navigate("/transactions")}
              className="w-full py-2.5 px-3 rounded-xl bg-blue/5 hover:bg-blue/10/80 text-blue border border-blue/10 flex items-center justify-between transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue text-white flex items-center justify-center flex-shrink-0">
                  <IoRepeatOutline className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-extrabold text-xs leading-tight text-blue-700">Transfer Funds</p>
                  <p className="text-[10px] text-blue/60 mt-0.5">Move money to other users</p>
                </div>
              </div>
              <span className="text-blue group-hover:translate-x-1 transition-transform text-sm font-extrabold">&rarr;</span>
            </button>
          </div>
        </div>

        {/* Daily Expenses Chart Card (spans 2 columns) */}
        <div className="md:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-black font-extrabold text-lg">Daily Expenses</h3>
              <p className="text-gray-400 text-xs mt-0.5">Daily cash flow details for the last 7 days</p>
            </div>
            <span className="bg-blue/5 text-blue text-xs font-semibold py-1 px-3 rounded-full">
              June 1 - June 7
            </span>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={dailyExpensesData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0065e1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0065e1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="date" 
                  tickLine={false} 
                  axisLine={false} 
                  stroke="#9ca3af" 
                  fontSize={11} 
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  stroke="#9ca3af" 
                  fontSize={11}
                  tickFormatter={(val) => `Rp ${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  name="Expense" 
                  stroke="#0065e1" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorExpense)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Card (spans 1 column) */}
        <div className="md:col-span-1 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md">
          <div className="flex flex-col mb-4">
            <h3 className="text-black font-extrabold text-lg">Recent Activities</h3>
            <p className="text-gray-400 text-xs mt-0.5">Transactions from your account</p>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[220px] pr-1 flex flex-col gap-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => {
                const categoryObj = categories.find(c => c.name === activity.category);
                const iconName = categoryObj?.iconName || "IoCashOutline";
                const Icon = iconMap[iconName] || IoCashOutline;
                const bgColorClass = categoryObj?.bgColor || "bg-gray-100 text-gray-600";

                // Format display date
                let displayDate = activity.date;
                if (activity.date.includes("-")) {
                  const parts = activity.date.split("-");
                  const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
                  displayDate = dateObj.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
                }

                return (
                  <div key={activity.id} className="flex items-center justify-between py-1 border-b border-gray-50 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${bgColorClass} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-black font-bold text-sm leading-tight">{activity.title}</p>
                        <p className="text-gray-400 text-[10px] mt-1">{displayDate}</p>
                      </div>
                    </div>
                    <span className={`font-extrabold text-sm ${
                      activity.type === "income" ? "text-green-600" : "text-black"
                    }`}>
                      {activity.type === "income" ? "+" : ""}{formatCurrency(activity.amount)}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400 text-center text-xs font-semibold py-8">No transactions logged yet.</p>
            )}
          </div>
        </div>
        
      </div>
    </MainLayout>
  );
};

export default Dashboard;
