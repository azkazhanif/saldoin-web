import { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { 
  IoSearchOutline, 
  IoBriefcaseOutline, 
  IoFastFoodOutline, 
  IoCartOutline, 
  IoGameControllerOutline, 
  IoBulbOutline, 
  IoReceiptOutline,
  IoArrowDownOutline,
  IoArrowUpOutline
} from "react-icons/io5";

const mockTransactions = [
  { id: "1", title: "Salary Payment", category: "Salary", date: "07 Jun 2026", amount: 15000000, type: "income", icon: IoBriefcaseOutline, bgColor: "bg-green-50 text-green-600" },
  { id: "2", title: "Starbucks Coffee", category: "Food & Beverage", date: "06 Jun 2026", amount: -55000, type: "outcome", icon: IoFastFoodOutline, bgColor: "bg-amber-50 text-amber-600" },
  { id: "3", title: "Supermarket Groceries", category: "Shopping", date: "05 Jun 2026", amount: -450000, type: "outcome", icon: IoCartOutline, bgColor: "bg-blue-50 text-blue-600" },
  { id: "4", title: "Steam Game Purchase", category: "Entertainment", date: "04 Jun 2026", amount: -250000, type: "outcome", icon: IoGameControllerOutline, bgColor: "bg-purple-50 text-purple-600" },
  { id: "5", title: "Electricity Bill", category: "Utilities", date: "03 Jun 2026", amount: -850000, type: "outcome", icon: IoBulbOutline, bgColor: "bg-orange-50 text-orange-600" },
  { id: "6", title: "Freelance Design Fee", category: "Salary", date: "02 Jun 2026", amount: 3250000, type: "income", icon: IoReceiptOutline, bgColor: "bg-green-50 text-green-600" },
  { id: "7", title: "House Rent", category: "Utilities", date: "01 Jun 2026", amount: -2200000, type: "outcome", icon: IoBulbOutline, bgColor: "bg-orange-50 text-orange-600" },
  { id: "8", title: "Ramen Dinner", category: "Food & Beverage", date: "30 May 2026", amount: -120000, type: "outcome", icon: IoFastFoodOutline, bgColor: "bg-amber-50 text-amber-600" },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const Transactions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "outcome">("all");

  const filteredTransactions = mockTransactions.filter((tx) => {
    const matchesSearch = tx.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tx.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || tx.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-black font-extrabold text-2xl">Transactions</h2>
          <p className="text-gray-400 text-sm mt-0.5">Track your history and log movements</p>
        </div>

        {/* Toolbar: Search and Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue text-sm text-black bg-white"
            />
          </div>

          {/* Filter Type Switches */}
          <div className="flex bg-gray-50 border border-gray-200/50 p-1 rounded-xl">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterType === "all" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-black"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("income")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterType === "income" ? "bg-white text-green-600 shadow-sm" : "text-gray-400 hover:text-green-600"
              }`}
            >
              Income
            </button>
            <button
              onClick={() => setFilterType("outcome")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterType === "outcome" ? "bg-white text-red-600 shadow-sm" : "text-gray-400 hover:text-red-600"
              }`}
            >
              Expense
            </button>
          </div>
        </div>

        {/* Transaction History Table */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase">
                <th className="pb-3 font-semibold">Transaction</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => {
                  const Icon = tx.icon;
                  return (
                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${tx.bgColor} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-black font-bold text-sm">{tx.title}</span>
                      </td>
                      <td className="py-4">
                        <span className="text-gray-500 font-semibold text-xs py-1 px-3 bg-gray-50 rounded-full border border-gray-100">
                          {tx.category}
                        </span>
                      </td>
                      <td className="py-4 text-gray-400 font-medium text-xs">
                        {tx.date}
                      </td>
                      <td className={`py-4 text-right font-extrabold text-sm ${
                        tx.type === "income" ? "text-green-600" : "text-black"
                      }`}>
                        <span className="inline-flex items-center gap-1">
                          {tx.type === "income" ? (
                            <IoArrowUpOutline className="w-3.5 h-3.5" />
                          ) : (
                            <IoArrowDownOutline className="w-3.5 h-3.5" />
                          )}
                          {formatCurrency(tx.amount)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400 font-medium text-sm">
                    No transactions matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default Transactions;
