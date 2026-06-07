import { useState, useEffect, useRef } from "react";
import Input from "../../atoms/form/Input";
import { IoIosNotifications } from "react-icons/io";
import { useAuth } from "../../../contexts/AuthContext";


const Header = () => {
  const { profile, user } = useAuth();
  const [isMac, setIsMac] = useState(true);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const firstName = profile?.name 
    ? profile.name.split(" ")[0] 
    : (user?.email ? user.email.split("@")[0] : "User");

  useEffect(() => {
    // Detect OS for shortcut labels
    setIsMac(navigator.userAgent.toUpperCase().indexOf("MAC") >= 0);

    // Cmd+F or Ctrl+F listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full border-b border-gray-50 pb-4">
      <h1 className="text-xl md:text-2xl font-extrabold text-black">
        Hi, {firstName}! Welcome back🙌🏻
      </h1>
      
      <div className="flex items-center gap-3 w-full md:w-auto">
        {/* Search input with shortcut helper badge */}
        <div className="relative flex-1 md:w-64">
          <Input 
            ref={searchInputRef}
            type="text" 
            placeholder="Search..." 
            id="search" 
            name="search" 
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-0.5 text-[10px] font-bold text-gray-400 bg-gray-50 border border-gray-200/50 px-1.5 py-0.5 rounded-md select-none pointer-events-none">
            {isMac ? "⌘F" : "Ctrl+F"}
          </div>
        </div>

        {/* Notifications Button & Dropdown */}
        <div className="relative flex-shrink-0" ref={notificationRef}>
          <button 
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className={`relative p-2.5 rounded-xl border transition-all cursor-pointer ${
              isNotificationOpen 
                ? "bg-blue/5 border-blue/20 text-blue ring-2 ring-blue/10" 
                : "bg-white border-gray-200 text-black hover:bg-gray-50"
            }`}
          >
            <IoIosNotifications className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Popover notification modal (renders directly below) */}
          {isNotificationOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 p-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                <h4 className="text-black font-extrabold text-sm">Notifications</h4>
                <button className="text-blue hover:text-blue-600 text-[10px] font-bold cursor-pointer">
                  Mark all as read
                </button>
              </div>
              
              <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
                
                <div className="flex items-start gap-3 py-1 border-b border-gray-50 last:border-b-0">
                  <span className="w-2 h-2 rounded-full bg-blue mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-black font-bold">New Wallet Created</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Wallet "Dompet Tunai" was added successfully.</p>
                    <p className="text-[9px] text-gray-300 mt-1">2 mins ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 py-1 border-b border-gray-50 last:border-b-0">
                  <span className="w-2 h-2 rounded-full bg-blue mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-black font-bold">Limit Warning Alert</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Category "Utilities & Bills" has reached 76% of budget.</p>
                    <p className="text-[9px] text-gray-300 mt-1">1 hour ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 py-1 border-b border-gray-50 last:border-b-0">
                  <span className="w-2 h-2 rounded-full bg-gray-200 mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 font-bold">Salary Credited</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Monthly income of Rp 15.000.000 was received.</p>
                    <p className="text-[9px] text-gray-300 mt-1">Yesterday</p>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
