const Label = ({
  htmlFor,
  label,
  className,
}: {
  htmlFor: string;
  label: string;
  className?: string;
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider ${className}`}
    >
      {label}
    </label>
  );
};

export default Label;

