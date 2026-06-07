import { useState, type ChangeEvent } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Label from "../../atoms/form/Label";

interface InputPasswordLabelProps {
  id: string;
  label: string;
  name: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const InputPasswordLabel = ({
  id,
  label,
  name,
  value,
  placeholder,
  onChange,
}: InputPasswordLabelProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-4">
      <Label htmlFor={id} label={label} />

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          name={name}
          className="w-full p-3 pr-10 border border-gray-200 focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/10 rounded-xl text-sm text-black bg-gray-50/50 focus:bg-white placeholder-gray-400 transition-all duration-200"
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>
    </div>
  );

};

export default InputPasswordLabel;
