import Checkbox from "../../atoms/form/Checkbox";

interface CheckboxLabelProps {
  id: string;
  name: string;
  label: string;
  value?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxLabel = ({
  id,
  name,
  label,
  value,
  onChange,
}: CheckboxLabelProps) => {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} name={name} value={value} onChange={onChange} />
      <label 
        htmlFor={id} 
        className="text-sm font-medium text-black select-none cursor-pointer"
      >
        {label}
      </label>
    </div>
  );
};

export default CheckboxLabel;

