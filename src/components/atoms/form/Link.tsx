import React from "react";

const Link = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <a href={href} className="text-sm text-blue">
      {children}
    </a>
  );
};

export default Link;
