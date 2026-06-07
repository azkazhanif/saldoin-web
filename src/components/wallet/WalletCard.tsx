import React from "react";
import type { WalletItem } from "../../hooks/useWallet";
import { getWalletGradientStyle } from "../../hooks/useWallet";

// Indonesian Rupiah currency formatting utility
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

interface WalletCardProps {
  wallet: WalletItem;
  onClick: () => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({ wallet, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={getWalletGradientStyle(wallet.color)}
      className="rounded-3xl p-5 shadow-sm relative overflow-hidden h-44 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer text-white"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl animate-pulse" />

      {/* Top Row: Provider and Type badge */}
      <div className="flex justify-between items-center z-10">
        <span className="text-white font-extrabold text-sm tracking-wide">
          {wallet.provider}
        </span>
        <span className="text-[9px] bg-white/10 border border-white/20 rounded-full px-2 py-0.5 font-bold uppercase flex-shrink-0">
          {wallet.type}
        </span>
      </div>

      {/* Middle Row: Current Balance */}
      <div className="z-10 py-1">
        <p className="text-white font-extrabold text-xl md:text-2xl leading-none">
          {formatCurrency(wallet.balance)}
        </p>
      </div>

      {/* Bottom Row: Wallet Name & Status */}
      <div className="flex justify-between items-end z-10">
        <span className="text-white/70 font-semibold text-xs leading-none max-w-[70%] truncate">
          {wallet.name}
        </span>
        <span className="text-white/40 text-[8px] uppercase font-bold tracking-widest leading-none">
          Active
        </span>
      </div>
    </div>
  );
};

export default WalletCard;
