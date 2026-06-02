import Checkbox from "../../atoms/form/Checkbox";
import Label from "../../atoms/form/Label";

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
      <Label htmlFor={id} label={label} />
    </div>
  );
};

export default CheckboxLabel;
