import React from "react";
import { IoWalletOutline } from "react-icons/io5";
import { formatRupiah } from "../../lib/formatters";
import type { TopWalletItem } from "../../hooks/useDashboard";

interface TopWalletsProps {
  wallets: TopWalletItem[];
}

const TopWallets: React.FC<TopWalletsProps> = ({ wallets }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md h-[320px]">
      <div className="flex flex-col mb-4">
        <h3 className="text-black font-extrabold text-lg flex items-center gap-2">
          <IoWalletOutline className="w-5 h-5 text-blue" /> Top Wallets
        </h3>
        <p className="text-gray-400 text-xs mt-0.5">Most active accounts this month</p>
      </div>

      <div className="flex-grow overflow-y-auto pr-1 flex flex-col gap-4">
        {wallets.length > 0 ? (
          wallets.map((w, idx) => {
            let badgeBg = "bg-gray-50 text-gray-600";
            if (idx === 0) badgeBg = "bg-blue/10 text-blue font-extrabold";
            else if (idx === 1) badgeBg = "bg-green-50 text-green-600 font-extrabold";

            return (
              <div 
                key={w.id} 
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center font-extrabold text-xs`}>
                    #{idx + 1}
                  </div>
                  <div>
                    <p className="text-black font-bold text-sm leading-tight">{w.name}</p>
                    <p className="text-gray-400 text-[10px] mt-0.5">{w.provider}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-black font-extrabold text-xs">{formatRupiah(w.balance)}</p>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full inline-block mt-1 ${badgeBg}`}>
                    {w.transactionCount} transactions
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-400 text-center text-xs font-semibold py-8">
            No active wallets found.
          </p>
        )}
      </div>
    </div>
  );
};

export default TopWallets;
