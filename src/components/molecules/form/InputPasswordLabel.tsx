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
    <div className="mb-2">
      <Label htmlFor={id} label={label} className="mb-1" />

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          name={name}
          className="w-full p-2 pr-10 border border-gray-300 rounded-md text-sm text-black"
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>
    </div>
  );
};

export default InputPasswordLabel;
