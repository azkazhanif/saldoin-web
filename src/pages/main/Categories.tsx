import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import { 
  IoFastFoodOutline, 
  IoCartOutline, 
  IoGameControllerOutline, 
  IoBulbOutline, 
  IoBriefcaseOutline,
  IoAddOutline,
  IoCloseOutline,
  IoCashOutline,
  IoCarOutline,
  IoHeartOutline,
  IoBookOutline,
  IoPeopleOutline,
  IoStorefrontOutline,
  IoTrendingUpOutline,
  IoRepeatOutline,
  IoReceiptOutline
} from "react-icons/io5";

const iconMap: Record<string, any> = {
  IoBriefcaseOutline: IoBriefcaseOutline,
  IoFastFoodOutline: IoFastFoodOutline,
  IoCartOutline: IoCartOutline,
  IoGameControllerOutline: IoGameControllerOutline,
  IoBulbOutline: IoBulbOutline,
  IoCashOutline: IoCashOutline,
  IoCarOutline: IoCarOutline,
  IoHeartOutline: IoHeartOutline,
  IoBookOutline: IoBookOutline,
  IoPeopleOutline: IoPeopleOutline,
  IoStorefrontOutline: IoStorefrontOutline,
  IoTrendingUpOutline: IoTrendingUpOutline,
  IoRepeatOutline: IoRepeatOutline,
  IoReceiptOutline: IoReceiptOutline
};

const defaultCategories = [
  { id: "1", name: "Gaji", budget: 18250000, type: "income", color: "bg-green-600", bgColor: "bg-green-50 text-green-600", iconName: "IoBriefcaseOutline" },
  { id: "2", name: "Freelance", budget: 3250000, type: "income", color: "bg-emerald-600", bgColor: "bg-emerald-50 text-emerald-600", iconName: "IoReceiptOutline" },
  { id: "3", name: "Bisnis", budget: 0, type: "income", color: "bg-green-700", bgColor: "bg-green-50 text-green-700", iconName: "IoStorefrontOutline" },
  { id: "4", name: "Transfer Masuk", budget: 0, type: "income", color: "bg-sky-600", bgColor: "bg-sky-50 text-sky-600", iconName: "IoRepeatOutline" },
  { id: "5", name: "Lain-lain (Income)", budget: 0, type: "income", color: "bg-gray-500", bgColor: "bg-gray-50 text-gray-500", iconName: "IoCashOutline" },
  { id: "6", name: "Makan & Minum", budget: 5000000, type: "outcome", color: "bg-amber-500", bgColor: "bg-amber-50 text-amber-600", iconName: "IoFastFoodOutline" },
  { id: "7", name: "Transport", budget: 1500000, type: "outcome", color: "bg-blue", bgColor: "bg-blue/10 text-blue", iconName: "IoCarOutline" },
  { id: "8", name: "Hiburan", budget: 2000000, type: "outcome", color: "bg-purple-500", bgColor: "bg-purple-50 text-purple-600", iconName: "IoGameControllerOutline" },
  { id: "9", name: "Kesehatan", budget: 1000000, type: "outcome", color: "bg-red-500", bgColor: "bg-red-50 text-red-600", iconName: "IoHeartOutline" },
  { id: "10", name: "Belanja", budget: 3000000, type: "outcome", color: "bg-blue-600", bgColor: "bg-blue/10 text-blue-600", iconName: "IoCartOutline" },
  { id: "11", name: "Tagihan", budget: 4000000, type: "outcome", color: "bg-orange-500", bgColor: "bg-orange-50 text-orange-600", iconName: "IoBulbOutline" },
  { id: "12", name: "Pendidikan", budget: 0, type: "outcome", color: "bg-teal-600", bgColor: "bg-teal-50 text-teal-600", iconName: "IoBookOutline" },
  { id: "13", name: "Sosial", budget: 0, type: "outcome", color: "bg-rose-500", bgColor: "bg-rose-50 text-rose-600", iconName: "IoPeopleOutline" },
  { id: "14", name: "Investasi", budget: 0, type: "outcome", color: "bg-indigo-600", bgColor: "bg-indigo-50 text-indigo-600", iconName: "IoTrendingUpOutline" },
  { id: "15", name: "Lain-lain", budget: 0, type: "outcome", color: "bg-gray-500", bgColor: "bg-gray-50 text-gray-500", iconName: "IoCashOutline" },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const Categories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [newCat, setNewCat] = useState({
    name: "",
    budget: 0,
    type: "outcome",
    iconName: "IoCartOutline"
  });

  // Load from localStorage on mount
  useEffect(() => {
    const localCats = localStorage.getItem("saldooin_categories");
    const localTxs = localStorage.getItem("saldooin_transactions");

    const loadedCats = localCats ? JSON.parse(localCats) : defaultCategories;
    const loadedTxs = localTxs ? JSON.parse(localTxs) : [];

    setCategories(loadedCats);
    setTransactions(loadedTxs);

    if (!localCats) localStorage.setItem("saldooin_categories", JSON.stringify(defaultCategories));
  }, []);

  const handleCatSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let color = "bg-blue";
    let bgColor = "bg-blue/10 text-blue";
    if (newCat.type === "income") {
      color = "bg-green-600";
      bgColor = "bg-green-50 text-green-600";
    }

    const createdCat = {
      id: Date.now().toString(),
      name: newCat.name,
      budget: newCat.budget,
      type: newCat.type,
      color: color,
      bgColor: bgColor,
      iconName: newCat.iconName
    };

    const updatedCats = [...categories, createdCat];
    setCategories(updatedCats);
    localStorage.setItem("saldooin_categories", JSON.stringify(updatedCats));

    setIsModalOpen(false);
    setNewCat({
      name: "",
      budget: 0,
      type: "outcome",
      iconName: "IoCartOutline"
    });
  };

  // Filter outcome categories for budget display
  const expenseCategories = categories.filter(c => c.type === "outcome");

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-black font-extrabold text-2xl">Categories</h2>
            <p className="text-gray-400 text-sm mt-0.5">Manage transaction categories and limits</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="py-2.5 px-4 bg-blue hover:bg-blue-600 text-white rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue/10"
          >
            <IoAddOutline className="w-4.5 h-4.5" /> Add Category
          </button>
        </div>

        {/* Categories Bento Box List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {expenseCategories.map((category) => {
            // Compute spent and percentage dynamically from transaction log
            const spent = transactions
              .filter(t => t.category === category.name && t.type === "outcome")
              .reduce((sum, t) => sum + t.amount, 0);

            const percentage = category.budget > 0 ? Math.round((spent / category.budget) * 100) : 0;
            const Icon = iconMap[category.iconName] || IoCashOutline;

            return (
              <div 
                key={category.id} 
                className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-gray-200 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl ${category.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-black font-extrabold text-base leading-tight">{category.name}</h3>
                      <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold mt-1">Expense Budget</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold border rounded-full px-3 py-1 ${
                    percentage >= 100 
                      ? "text-red-600 bg-red-50 border-red-100" 
                      : (percentage >= 70 ? "text-amber-600 bg-amber-50 border-amber-100" : "text-black bg-gray-50 border-gray-100")
                  }`}>
                    {percentage}% used
                  </span>
                </div>

                {/* Progress Indicators */}
                <div className="mt-6">
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        percentage >= 100 ? "bg-red-500" : (percentage >= 70 ? "bg-amber-500" : category.color)
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold mt-3">
                    <span className="text-gray-400">Spent: <b className="text-gray-700">{formatCurrency(spent)}</b></span>
                    <span className="text-gray-400">Budget: <b className="text-gray-700">{formatCurrency(category.budget)}</b></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ADD CATEGORY MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-md border border-gray-100 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-black font-extrabold text-lg">Add Category</h3>
                <p className="text-gray-400 text-xs mt-0.5">Create custom budget category</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-black cursor-pointer"
              >
                <IoCloseOutline className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCatSubmit} className="flex flex-col gap-4">
              
              {/* Category Name */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-500">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Healthcare, Transport"
                  value={newCat.name}
                  onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white"
                />
              </div>

              {/* Budget Limit & Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-500">Monthly Budget (IDR)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 1500000"
                    value={newCat.budget === 0 ? "" : newCat.budget}
                    onChange={(e) => setNewCat({ ...newCat, budget: Number(e.target.value) })}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-500">Type</label>
                  <select
                    value={newCat.type}
                    onChange={(e) => setNewCat({ ...newCat, type: e.target.value })}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white"
                  >
                    <option value="outcome">Outcome (Budget)</option>
                    <option value="income">Income (Earnings)</option>
                  </select>
                </div>
              </div>

              {/* Icon Choice */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-500">Select Icon</label>
                <select
                  value={newCat.iconName}
                  onChange={(e) => setNewCat({ ...newCat, iconName: e.target.value })}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-blue bg-white"
                >
                  <option value="IoBriefcaseOutline">Salary / Income</option>
                  <option value="IoReceiptOutline">Freelance / Receipt</option>
                  <option value="IoStorefrontOutline">Business / Store</option>
                  <option value="IoRepeatOutline">Transfer / Repeat</option>
                  <option value="IoCashOutline">Cash / Other</option>
                  <option value="IoFastFoodOutline">Food & Drink</option>
                  <option value="IoCarOutline">Transport / Car</option>
                  <option value="IoGameControllerOutline">Entertainment / Gaming</option>
                  <option value="IoHeartOutline">Health / Medical</option>
                  <option value="IoCartOutline">Shopping / Retail</option>
                  <option value="IoBulbOutline">Bills / Utilities</option>
                  <option value="IoBookOutline">Education / Book</option>
                  <option value="IoPeopleOutline">Social / People</option>
                  <option value="IoTrendingUpOutline">Investment</option>
                </select>
              </div>

              {/* Form Buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-black hover:bg-gray-50 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue hover:bg-blue-600 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-blue/10"
                >
                  Save Category
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Categories;
