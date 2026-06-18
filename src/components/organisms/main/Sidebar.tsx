import { 
  IoHomeOutline, IoHome,
  IoWalletOutline, IoWallet,
  IoReceiptOutline, IoReceipt,
  IoGridOutline, IoGrid,
  IoPieChartOutline, IoPieChart 
} from "react-icons/io5";
import NavLink from "../../atoms/navigation/NavLink";
import { Link, useNavigate, useLocation } from "react-router";
import { useAuth } from "../../../contexts/AuthContext";

const Sidebar = () => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const displayName = profile?.name || user?.email?.split("@")[0] || "User";
  const userInitial = displayName.charAt(0).toUpperCase();
  const isProfileActive = location.pathname === "/profile";

  return (
    <aside className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-100 flex flex-row items-center justify-between px-4 z-50 md:bottom-auto md:left-auto md:right-auto md:h-screen md:sticky md:top-0 md:flex-col md:justify-between md:p-5 md:border-r md:border-t-0 md:bg-white">
      {/* Brand & Main Menu Container */}
      <div className="flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start w-full md:gap-8 flex-1 md:flex-initial">
        {/* Brand Logo - Desktop Only */}
        <Link
          to="/dashboard"
          className="hidden md:block text-blue font-extrabold text-2xl px-2 tracking-tight transition-transform hover:scale-102"
        >
          Saldoin
        </Link>

        {/* Navigation Menu */}
        <div className="w-full">
          <p className="hidden md:block text-gray-400 font-extrabold text-[10px] uppercase tracking-widest px-2 mb-3">
            Main Menu
          </p>
          <ul className="flex flex-row md:flex-col items-center md:items-stretch justify-around md:justify-start gap-1 md:gap-1.5 w-full">
            <NavLink href="/dashboard" icon={IoHomeOutline} activeIcon={IoHome} label="Dashboard" />
            <NavLink href="/wallet" icon={IoWalletOutline} activeIcon={IoWallet} label="Wallet" />
            <NavLink href="/transactions" icon={IoReceiptOutline} activeIcon={IoReceipt} label="Transactions" />
            <NavLink href="/categories" icon={IoGridOutline} activeIcon={IoGrid} label="Categories" />
            <NavLink href="/budget" icon={IoPieChartOutline} activeIcon={IoPieChart} label="Budget" />
          </ul>
        </div>
      </div>

      {/* Bottom Section: Clickable Profile Card */}
      <div className="shrink-0 ml-4 md:ml-0 md:w-full">
        <button
          onClick={() => navigate("/profile")}
          className={`rounded-full w-full md:rounded-2xl p-1 md:p-3 flex items-center justify-between gap-3 border transition-all duration-300 cursor-pointer active:scale-[0.98] hover:scale-[1.02] ${
            isProfileActive
              ? "bg-blue/10 border-blue/20 ring-4 ring-blue/5 md:bg-blue/5"
              : "bg-gray-50 hover:bg-gray-100/80 border-transparent shadow-xs hover:shadow-sm"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md shrink-0 transition-transform duration-300 ${
              isProfileActive ? "bg-blue text-white ring-4 ring-blue/15 scale-105" : "bg-blue text-white"
            }`}>
              {userInitial}
            </div>
            <div className="hidden md:block text-left">
              <p
                className="text-black font-extrabold text-sm leading-none truncate max-w-30"
                title={displayName}
              >
                {displayName}
              </p>
              <p className="text-gray-400 text-[10px] font-bold mt-1.5">Premium Account</p>
            </div>
          </div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
