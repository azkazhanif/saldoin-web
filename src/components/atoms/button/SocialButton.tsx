import React from "react";

const SocialButton = ({ icon }: { icon: React.ReactNode }) => {
  return (
    <button className="text-center p-2 rounded-md  border border-gray-300">
      {icon}
    </button>
  );
};

export default SocialButton;
