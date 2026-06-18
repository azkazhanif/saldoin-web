import React from "react";
import { iconMap } from "../categories/iconHelper";
import { formatRupiah } from "../../lib/formatters";
import { IoCalendarOutline, IoCashOutline } from "react-icons/io5";

export interface UpcomingBillItem {
  id: string;
  title: string;
  category: string;
  date: string;
  amount: number;
  iconName: string;
  bgColorClass: string;
}

interface UpcomingBillsProps {
  data: UpcomingBillItem[];
}

export const UpcomingBills: React.FC<UpcomingBillsProps> = ({ data }) => {
  const getDaysUntilStr = (dateStr: string) => {
    // Today is 2026-06-18
    const today = new Date(2026, 5, 18);
    const parts = dateStr.split("-");
    if (parts.length < 3) return "Upcoming";
    const due = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    return `Due in ${diffDays} days`;
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md h-[320px]">
      <div className="flex flex-col mb-4">
        <h3 className="text-black font-extrabold text-lg flex items-center gap-2">
          <IoCalendarOutline className="w-5 h-5 text-blue" /> Upcoming Bills
        </h3>
        <p className="text-gray-400 text-xs mt-0.5">Scheduled payments & auto-debits</p>
      </div>

      <div className="flex-grow overflow-y-auto pr-1 flex flex-col gap-4">
        {data.length > 0 ? (
          data.map((bill) => {
            const IconComponent = iconMap[bill.iconName] || IoCashOutline;
            const daysStr = getDaysUntilStr(bill.date);

            return (
              <div 
                key={bill.id} 
                className="flex items-center justify-between py-1 border-b border-gray-50 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${bill.bgColorClass} flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-black font-bold text-sm leading-tight">{bill.title}</p>
                    <span className="inline-block text-[9px] font-extrabold text-blue bg-blue/5 border border-blue/10 px-1.5 py-0.5 rounded-md mt-1">
                      {daysStr}
                    </span>
                  </div>
                </div>
                <span className="font-extrabold text-sm text-black">
                  {formatRupiah(bill.amount)}
                </span>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-8 h-full">
            <p className="text-gray-400 text-center text-xs font-semibold">
              No upcoming bills scheduled.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingBills;
