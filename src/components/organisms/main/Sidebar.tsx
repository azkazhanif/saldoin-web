import { useState, useEffect, useRef } from "react";
import { BiMoneyWithdraw } from "react-icons/bi";
import { BsWallet } from "react-icons/bs";
import { GoHome } from "react-icons/go";
import {
  IoListOutline,
  IoSettingsOutline,
  IoLogOutOutline,
  IoChevronUpOutline,
  IoChevronDownOutline,
} from "react-icons/io5";
import NavLink from "../../atoms/navigation/NavLink";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../../contexts/AuthContext";

const Sidebar = () => {
  const { profile, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayName = profile?.name || user?.email?.split("@")[0] || "User";
  const userInitial = displayName.charAt(0).toUpperCase();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSettingsClick = () => {
    navigate("/settings/categories");
    setIsMenuOpen(false);
  };

  const handleLogoutClick = async () => {
    setIsMenuOpen(false);
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <aside className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-100 flex flex-row items-center justify-between px-4 z-50 md:relative md:bottom-auto md:left-auto md:right-auto md:h-screen md:sticky md:top-0 md:flex-col md:justify-between md:p-4 md:border-r md:border-t-0">
      {/* Brand & Main Menu Container */}
      <div className="flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start w-full md:gap-6 flex-1 md:flex-initial">
        {/* Brand Logo - Desktop Only */}
        <Link
          to="/dashboard"
          className="hidden md:block text-blue font-bold text-2xl px-2"
        >
          Saldoin
        </Link>

        {/* Navigation Menu */}
        <div className="w-full">
          <p className="hidden md:block text-gray-400 font-bold text-xs uppercase tracking-wider px-2 mb-2">
            Main Menu
          </p>
          <ul className="flex flex-row md:flex-col items-center md:items-stretch justify-around md:justify-start gap-1 w-full">
            <NavLink href="/dashboard" icon={GoHome} label="Dashboard" />
            <NavLink href="/wallet" icon={BsWallet} label="Wallet" />
            <NavLink
              href="/transactions"
              icon={IoListOutline}
              label="Transactions"
            />
            <NavLink
              href="/categories"
              icon={IoSettingsOutline}
              label="Categories"
            />
            <NavLink href="/budget" icon={BiMoneyWithdraw} label="Budget" />
          </ul>
        </div>
      </div>

      {/* Bottom Section: Profile Card & Dropdown */}
      <div
        className="relative shrink-0 ml-4 md:ml-0 md:w-full"
        ref={dropdownRef}
      >
        {/* Dropdown Popup */}
        {isMenuOpen && (
          <div className="absolute bottom-full right-0 md:left-0 md:right-0 mb-2 w-48 md:w-auto bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50 flex flex-col gap-1 transition-all duration-200">
            <button
              onClick={handleSettingsClick}
              className="w-full text-left px-4 py-2 text-sm text-black font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <IoSettingsOutline className="w-5 h-5 text-gray-500" />
              Settings
            </button>
            <button
              onClick={handleLogoutClick}
              className="w-full text-left px-4 py-2 text-sm text-red-600 font-medium flex items-center gap-2 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <IoLogOutOutline className="w-5 h-5 text-red-500" />
              Log out
            </button>
          </div>
        )}

        {/* Clickable Profile Card */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`rounded-full md:rounded-xl p-1 md:p-3 flex items-center justify-between gap-2 border transition-all duration-200 cursor-pointer ${
            isMenuOpen
              ? "bg-blue/5 border-blue/20 ring-2 ring-blue/10 md:ring-2 md:ring-blue/10"
              : "bg-gray-50 hover:bg-gray-100 border-transparent"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
              {userInitial}
            </div>
            <div className="hidden md:block text-left">
              <p
                className="text-black font-bold text-sm leading-none truncate max-w-[120px]"
                title={displayName}
              >
                {displayName}
              </p>
              <p className="text-gray-400 text-xs mt-1">Premium Account</p>
            </div>
          </div>
          {isMenuOpen ? (
            <IoChevronUpOutline className="hidden md:block w-4 h-4 text-gray-500 flex-shrink-0" />
          ) : (
            <IoChevronDownOutline className="hidden md:block w-4 h-4 text-gray-500 flex-shrink-0" />
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
