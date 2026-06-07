import MainLayout from "../../layouts/MainLayout";
import { 
  IoCardOutline, 
  IoTrendingUpOutline, 
  IoTrendingDownOutline, 
  IoAddOutline, 
  IoLockClosedOutline 
} from "react-icons/io5";

const Wallet = () => {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-black font-extrabold text-2xl">My Wallet</h2>
          <p className="text-gray-400 text-sm mt-0.5">Manage your cards and check balances</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Glassmorphism Credit Card */}
          <div className="lg:col-span-1 bg-gradient-to-br from-blue to-dark-blue text-white rounded-3xl p-6 shadow-xl relative overflow-hidden h-56 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue/20 rounded-full blur-xl" />
            
            <div className="flex justify-between items-start z-10">
              <div>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Active Balance</p>
                <p className="text-white font-extrabold text-2xl mt-1">Rp 8.450.000</p>
              </div>
              <IoCardOutline className="w-8 h-8 opacity-80" />
            </div>

            <div className="z-10">
              <p className="text-white/40 text-[10px] tracking-widest font-mono">CARD NUMBER</p>
              <p className="text-white font-bold text-lg font-mono tracking-wider mt-0.5">•••• •••• •••• 4821</p>
            </div>

            <div className="flex justify-between items-center z-10">
              <div>
                <p className="text-white/40 text-[9px] uppercase font-semibold">Card Holder</p>
                <p className="text-white font-bold text-xs mt-0.5">Azka Zufar Hanif</p>
              </div>
              <div className="text-right">
                <p className="text-white/40 text-[9px] uppercase font-semibold">Expires</p>
                <p className="text-white font-bold text-xs mt-0.5">12/28</p>
              </div>
            </div>
          </div>

          {/* Quick Details / Stats */}
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-black font-extrabold text-lg mb-4">Quick Financial Review</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50/50 rounded-2xl flex flex-col justify-between">
                  <span className="text-green-600 font-bold text-xs uppercase tracking-wider">Monthly Income</span>
                  <span className="text-black font-extrabold text-xl mt-2">Rp 18.250.000</span>
                  <span className="text-[10px] text-green-500 mt-1 flex items-center gap-1">
                    <IoTrendingUpOutline className="w-3.5 h-3.5" /> +12.5% increase
                  </span>
                </div>
                <div className="p-4 bg-red-50/50 rounded-2xl flex flex-col justify-between">
                  <span className="text-red-600 font-bold text-xs uppercase tracking-wider">Monthly Outcome</span>
                  <span className="text-black font-extrabold text-xl mt-2">Rp 9.800.000</span>
                  <span className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                    <IoTrendingDownOutline className="w-3.5 h-3.5" /> +8.2% increase
                  </span>
                </div>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex gap-4 mt-6">
              <button className="flex-1 py-3 px-4 bg-blue hover:bg-blue-600 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue/10">
                <IoAddOutline className="w-5 h-5" /> Top Up Wallet
              </button>
              <button className="flex-1 py-3 px-4 bg-gray-50 hover:bg-gray-100 text-black border border-gray-200/50 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
                <IoLockClosedOutline className="w-4 h-4" /> Freeze Card
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </MainLayout>
  );
};

export default Wallet;
