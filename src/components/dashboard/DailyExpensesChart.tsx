import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatRupiah } from "../../lib/formatters";
import type { DailyExpenseItem } from "../../hooks/useDashboard";

interface DailyExpensesChartProps {
  data: DailyExpenseItem[];
  days: 7 | 30 | 90;
  setDays: (days: 7 | 30 | 90) => void;
}

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
              {formatRupiah(entry.value as number)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const convertToDDMM = (dateStr: string) => {
  const parts = dateStr.split(" ");
  if (parts.length < 2) return dateStr;
  const day = parts[0];
  const monthAbbr = parts[1].toLowerCase();
  
  const monthMap: Record<string, string> = {
    jan: "01",
    feb: "02",
    mar: "03",
    apr: "04",
    may: "05", mei: "05",
    jun: "06",
    jul: "07",
    aug: "08", agt: "08",
    sep: "09",
    oct: "10", okt: "10",
    nov: "11",
    dec: "12", des: "12"
  };
  
  const month = monthMap[monthAbbr] || "01";
  return `${day}/${month}`;
};

const DailyExpensesChart: React.FC<DailyExpensesChartProps> = ({ data, days, setDays }) => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const dateRangeStr = data.length > 0
    ? `${data[0].date} - ${data[data.length - 1].date}`
    : "";

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-black font-extrabold text-lg">Daily Expenses</h3>
          <p className="text-gray-400 text-xs mt-0.5">
            Daily cash flow details for the last {days} days ({dateRangeStr})
          </p>
        </div>
        
        {/* Day Range Filter Buttons */}
        <div className="flex bg-gray-50 border border-gray-200/50 p-1 rounded-xl self-start">
          <button
            onClick={() => setDays(7)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              days === 7 
                ? "bg-white text-black shadow-xs" 
                : "text-gray-400 hover:text-black"
            }`}
          >
            7D
          </button>
          <button
            onClick={() => setDays(30)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              days === 30 
                ? "bg-white text-black shadow-xs" 
                : "text-gray-400 hover:text-black"
            }`}
          >
            30D
          </button>
          <button
            onClick={() => setDays(90)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              days === 90 
                ? "bg-white text-black shadow-xs" 
                : "text-gray-400 hover:text-black"
            }`}
          >
            90D
          </button>
        </div>
      </div>
 
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
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
              interval={days === 90 ? 14 : days === 30 ? 4 : 0} // Prevent text overlapping on 30D / 90D view
              tickFormatter={(tick) => isMobile ? convertToDDMM(tick) : tick}
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
  );
};

export default DailyExpensesChart;
