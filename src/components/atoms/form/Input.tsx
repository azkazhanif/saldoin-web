import React from "react";

interface InputProps {
  type: string;
  id: string;
  name: string;
  autoComplete?: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ref?: React.Ref<HTMLInputElement>;
}

const Input = ({
  type,
  id,
  name,
  autoComplete,
  value,
  placeholder,
  onChange,
  ref,
}: InputProps) => {
  return (
    <input
      ref={ref}
      type={type}
      id={id}
      name={name}
      className="w-full p-3 border border-gray-200 focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/10 rounded-xl text-sm text-black bg-gray-50/50 focus:bg-white placeholder-gray-400 transition-all duration-200"
      autoComplete={autoComplete}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
};

export default Input;

