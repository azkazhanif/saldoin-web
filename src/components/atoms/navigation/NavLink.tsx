import type { ComponentType } from "react";
import { Link, useLocation } from "react-router";

interface NavLinkProps {
  href: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
}

const NavLink = ({ href, icon: Icon, label }: NavLinkProps) => {
  const location = useLocation();
  const isActive = href === "/" 
    ? location.pathname === "/" 
    : href !== "" && location.pathname.startsWith(href);

  return (
    <li className="flex-1 md:flex-initial">
      <Link
        to={href || "#"}
        className={`text-black font-medium text-xs md:text-sm flex flex-col md:flex-row items-center gap-1 md:gap-2 p-2 rounded-md transition-all justify-center md:justify-start ${
          isActive 
            ? "text-blue bg-blue/10" 
            : "hover:text-blue hover:bg-blue/10"
        }`}
      >
        <Icon className="w-5 h-5 md:w-6 md:h-6" />
        <span className="text-[10px] md:text-sm">{label}</span>
      </Link>
    </li>
  );
};

export default NavLink;
