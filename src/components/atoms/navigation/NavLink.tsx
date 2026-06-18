import type { ComponentType } from "react";
import { Link, useLocation } from "react-router";

interface NavLinkProps {
  href: string;
  icon: ComponentType<{ className?: string }>;
  activeIcon?: ComponentType<{ className?: string }>;
  label: string;
}

const NavLink = ({ href, icon: Icon, activeIcon: ActiveIcon, label }: NavLinkProps) => {
  const location = useLocation();
  const isActive = href === "/" 
    ? location.pathname === "/" 
    : href !== "" && location.pathname.startsWith(href);

  const CurrentIcon = isActive && ActiveIcon ? ActiveIcon : Icon;

  return (
    <li className="flex-1 md:flex-initial">
      <Link
        to={href || "#"}
        className={`font-semibold text-xs md:text-sm flex flex-col md:flex-row items-center gap-1.5 md:gap-3 p-2.5 md:px-4 md:py-3 rounded-xl transition-all duration-300 ease-out justify-center md:justify-start active:scale-95 md:hover:scale-[1.02] ${
          isActive 
            ? "text-blue bg-blue/10 shadow-xs shadow-blue/5" 
            : "text-gray-500 hover:text-blue hover:bg-blue/5"
        }`}
      >
        <CurrentIcon className={`w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 ${isActive ? "scale-105" : ""}`} />
        <span className="text-[10px] md:text-sm tracking-wide">{label}</span>
      </Link>
    </li>
  );
};

export default NavLink;
