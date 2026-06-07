import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "success" | "danger" | "warning";
  size?: "small" | "medium" | "large";
  width?: "full" | "auto" | string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "medium",
  width,
  onClick,
  disabled = false,
}: ButtonProps) => {
  const variantClasses = {
    primary: "bg-blue text-white hover:bg-blue/90 focus:ring-2 focus:ring-blue/20",
    secondary: "bg-gray/10 text-black hover:bg-gray/25 focus:ring-2 focus:ring-gray/10",
    success: "bg-green text-white hover:bg-green/90 focus:ring-2 focus:ring-green/20",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-600/20",
    warning: "bg-yellow-500 text-black hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-500/20",
  };

  const sizeClasses = {
    small: "px-3 py-1.5 text-xs font-semibold",
    medium: "px-5 py-3 text-sm font-bold",
    large: "px-7 py-3.5 text-base font-bold",
  };

  const widthClass = width === "full" ? "w-full" : "";

  return (
    <button
      type={type}
      disabled={disabled}
      className={`flex items-center justify-center text-center transition-all duration-200 cursor-pointer rounded-xl active:scale-[0.98] outline-none ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;

