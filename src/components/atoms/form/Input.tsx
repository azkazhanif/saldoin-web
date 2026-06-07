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
      className="w-full p-2.5 border border-gray-200 focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue rounded-xl text-sm text-black bg-white placeholder-gray-400"
      autoComplete={autoComplete}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
};

export default Input;
