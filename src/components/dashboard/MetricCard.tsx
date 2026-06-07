import React from "react";
import { formatRupiah } from "../../lib/formatters";

interface MetricCardProps {
  title: string;
  amount: number;
  trendText: string;
  trendIcon: React.ReactNode;
  trendColorClass: string;
  cardIcon: React.ReactNode;
  iconBgClass: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  amount,
  trendText,
  trendIcon,
  trendColorClass,
  cardIcon,
  iconBgClass,
}) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center justify-between transition-all duration-300 hover:shadow-md hover:border-gray-200">
      <div className="flex flex-col">
        <span className="text-gray-400 text-sm font-semibold mb-1">{title}</span>
        <span className="text-black font-extrabold text-2xl leading-none">
          {formatRupiah(amount)}
        </span>
        <span className={`font-bold text-xs mt-2 flex items-center gap-1 ${trendColorClass}`}>
          {trendIcon} {trendText}
        </span>
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm flex-shrink-0 ${iconBgClass}`}>
        {cardIcon}
      </div>
    </div>
  );
};

export default MetricCard;
