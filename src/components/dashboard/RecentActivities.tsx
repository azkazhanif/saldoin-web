import React from "react";
import { 
  IoTrendingUpOutline, 
  IoFastFoodOutline,
  IoCartOutline,
  IoGameControllerOutline,
  IoReceiptOutline,
  IoBriefcaseOutline,
  IoBulbOutline,
  IoRepeatOutline,
  IoCashOutline,
  IoCarOutline,
  IoHeartOutline,
  IoBookOutline,
  IoPeopleOutline,
  IoStorefrontOutline
} from "react-icons/io5";
import { formatRupiah } from "../../lib/formatters";
import type { DashboardTransaction } from "../../hooks/useDashboard";

const iconMap: Record<string, any> = {
  IoBriefcaseOutline: IoBriefcaseOutline,
  IoFastFoodOutline: IoFastFoodOutline,
  IoCartOutline: IoCartOutline,
  IoGameControllerOutline: IoGameControllerOutline,
  IoBulbOutline: IoBulbOutline,
  IoReceiptOutline: IoReceiptOutline,
  IoCashOutline: IoCashOutline,
  IoCarOutline: IoCarOutline,
  IoHeartOutline: IoHeartOutline,
  IoBookOutline: IoBookOutline,
  IoPeopleOutline: IoPeopleOutline,
  IoStorefrontOutline: IoStorefrontOutline,
  IoTrendingUpOutline: IoTrendingUpOutline,
  IoRepeatOutline: IoRepeatOutline
};

interface RecentActivitiesProps {
  data: DashboardTransaction[];
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ data }) => {
  return (
    <div className="md:col-span-1 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md">
      <div className="flex flex-col mb-4">
        <h3 className="text-black font-extrabold text-lg">Recent Activities</h3>
        <p className="text-gray-400 text-xs mt-0.5">Transactions from your account</p>
      </div>

      <div className="flex-grow overflow-y-auto h-64 pr-1 flex flex-col gap-4">
        {data.length > 0 ? (
          data.map((activity) => {
            const IconComponent = iconMap[activity.iconName] || IoCashOutline;

            return (
              <div 
                key={activity.id} 
                className="flex items-center justify-between py-1 border-b border-gray-50 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${activity.bgColorClass} flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-black font-bold text-sm leading-tight">{activity.title}</p>
                    <p className="text-gray-400 text-[10px] mt-1">{activity.displayDate}</p>
                  </div>
                </div>
                <span className={`font-extrabold text-sm ${
                  activity.type === "income" ? "text-green-600" : "text-black"
                }`}>
                  {activity.type === "income" ? "+" : ""}{formatRupiah(activity.amount)}
                </span>
              </div>
            );
          })
        ) : (
          <p className="text-gray-400 text-center text-xs font-semibold py-8">
            No transactions logged yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default RecentActivities;
