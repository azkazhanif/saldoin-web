import React from "react";

const SocialButton = ({ icon, onClick }: { icon: React.ReactNode; onClick?: () => void }) => {
  return (
    <button 
      onClick={onClick}
      type="button"
      className="flex items-center justify-center py-2.5 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 active:scale-[0.98] transition-all cursor-pointer shadow-sm text-lg text-black"
    >
      {icon}
    </button>
  );
};

export default SocialButton;
