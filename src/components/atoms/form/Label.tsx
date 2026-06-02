const Label = ({ htmlFor, label }: { htmlFor: string; label: string }) => {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-black mb-1"
    >
      {label}
    </label>
  );
};

export default Label;
