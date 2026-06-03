const Input = ({
  type,
  id,
  name,
  autoComplete,
  value,
  placeholder,
  onChange,
}: {
  type: string;
  id: string;
  name: string;
  autoComplete?: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <input
      type={type}
      id={id}
      name={name}
      className="w-full p-2 border border-gray-300 rounded-md text-sm text-black"
      autoComplete={autoComplete}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
};

export default Input;
