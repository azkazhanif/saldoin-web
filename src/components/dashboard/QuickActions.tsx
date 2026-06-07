import React from "react";
import { useNavigate } from "react-router";
import { 
  IoTrendingUpOutline, 
  IoTrendingDownOutline, 
  IoRepeatOutline 
} from "react-icons/io5";

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="md:col-span-1 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md">
      <div className="flex flex-col mb-4">
        <h3 className="text-black font-extrabold text-lg">Quick Actions</h3>
        <p className="text-gray-400 text-xs mt-0.5">Manage your transactions instantly</p>
      </div>

      <div className="flex-1 flex items-center justify-center w-full">
        <div className="grid grid-cols-3 gap-3 w-full">
          {/* Add Income */}
          <button 
            onClick={() => navigate("/transactions")}
            className="aspect-square rounded-2xl bg-gradient-to-tr from-green-50 to-emerald-50/30 hover:from-green-100/80 hover:to-emerald-100/50 hover:shadow-lg hover:shadow-green-100/40 border border-green-100/50 flex flex-col items-center justify-center gap-2 transition-all duration-300 cursor-pointer group p-2 hover:scale-[1.03] active:scale-95"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-green-200/50 group-hover:scale-110 transition-transform duration-300">
              <IoTrendingUpOutline className="w-5 h-5" />
            </div>
            <div className="text-center">
              <p className="font-extrabold text-[11px] leading-tight text-green-700">Add Income</p>
            </div>
          </button>

          {/* Add Expense */}
          <button 
            onClick={() => navigate("/transactions")}
            className="aspect-square rounded-2xl bg-gradient-to-tr from-red-50 to-rose-50/30 hover:from-red-100/80 hover:to-rose-100/50 hover:shadow-lg hover:shadow-red-100/40 border border-red-100/50 flex flex-col items-center justify-center gap-2 transition-all duration-300 cursor-pointer group p-2 hover:scale-[1.03] active:scale-95"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-red-200/50 group-hover:scale-110 transition-transform duration-300">
              <IoTrendingDownOutline className="w-5 h-5" />
            </div>
            <div className="text-center">
              <p className="font-extrabold text-[11px] leading-tight text-red-700">Add Expense</p>
            </div>
          </button>

          {/* Transfer Funds */}
          <button 
            onClick={() => navigate("/transactions")}
            className="aspect-square rounded-2xl bg-gradient-to-tr from-blue/5 to-indigo-50/10 hover:from-blue/10 hover:to-indigo-100/30 hover:shadow-lg hover:shadow-blue-100/40 border border-blue/20 flex flex-col items-center justify-center gap-2 transition-all duration-300 cursor-pointer group p-2 hover:scale-[1.03] active:scale-95"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue to-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-200/50 group-hover:scale-110 transition-transform duration-300">
              <IoRepeatOutline className="w-5 h-5" />
            </div>
            <div className="text-center">
              <p className="font-extrabold text-[11px] leading-tight text-blue-700">Transfer Funds</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
