import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatRupiah } from "../../lib/formatters";
import type { MonthlyChartItem } from "../../hooks/useDashboard";

interface OverviewChartProps {
  data: MonthlyChartItem[];
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

const OverviewChart: React.FC<OverviewChartProps> = ({ data }) => {
  const isSingleMonth = data.length === 1;
  const barSize = isSingleMonth ? 32 : 16;
  const barGap = isSingleMonth ? 4 : 2;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-black font-extrabold text-lg">Income vs Expense</h3>
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
            <span className="text-gray-600">Expense</span>
          </div>
        </div>
      </div>
      
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barGap={barGap}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
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
              barSize={barSize}
            />
            <Bar 
              dataKey="expense" 
              name="Expense" 
              fill="#f87171" 
              radius={[4, 4, 0, 0]} 
              barSize={barSize}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OverviewChart;
