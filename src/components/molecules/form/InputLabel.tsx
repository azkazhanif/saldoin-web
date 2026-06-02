import Label from "../../atoms/form/Label";
import Input from "../../atoms/form/Input";

interface InputLabelProps {
  id: string;
  label: string;
  type: string;
  name: string;
  autoComplete?: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputLabel = ({
  id,
  label,
  type,
  name,
  autoComplete,
  value,
  placeholder,
  onChange,
}: InputLabelProps) => {
  return (
    <div className="mb-2">
      <Label htmlFor={id} label={label} />
      <Input
        type={type}
        id={id}
        name={name}
        autoComplete={autoComplete}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
};

export default InputLabel;
