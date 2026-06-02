import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "success" | "danger" | "warning";
  size?: "small" | "medium" | "large";
  width?: string;
  onClick?: () => void;
}

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "medium",
  width,
  onClick,
}: ButtonProps) => {
  const variantClasses = {
    primary: "bg-blue text-white",
    secondary: "bg-gray text-black",
    success: "bg-green text-white",
    danger: "bg-red text-white",
    warning: "bg-yellow text-black",
  };

  const sizeClasses = {
    small: "px-2 py-1 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      className={`block ${variantClasses[variant]} ${sizeClasses[size]} ${width ? `w-${width}` : ""} rounded-md`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
