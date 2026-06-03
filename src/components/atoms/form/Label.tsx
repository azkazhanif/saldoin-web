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
      className={`block text-sm font-medium text-black ${className}`}
    >
      {label}
    </label>
  );
};

export default Label;
