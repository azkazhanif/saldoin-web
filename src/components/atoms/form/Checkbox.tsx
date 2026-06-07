interface CheckboxProps {
  id: string;
  name: string;
  value?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox = ({ id, name, value, onChange }: CheckboxProps) => {
  return (
    <input
      type="checkbox"
      id={id}
      name={name}
      checked={value}
      onChange={onChange}
      className="w-4.5 h-4.5 rounded border border-gray-200 text-blue focus:ring-blue/10 accent-blue cursor-pointer transition-all duration-200"
    />
  );
};

export default Checkbox;

