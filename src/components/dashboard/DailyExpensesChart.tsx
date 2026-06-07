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

const DailyExpensesChart: React.FC<DailyExpensesChartProps> = ({ data }) => {
  return (
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
