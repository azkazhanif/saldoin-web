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
    />
  );
};

export default Checkbox;
