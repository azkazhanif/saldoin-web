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
  IoCashOutline
} from "react-icons/io5";

const iconMap: Record<string, any> = {
  IoBriefcaseOutline: IoBriefcaseOutline,
  IoFastFoodOutline: IoFastFoodOutline,
  IoCartOutline: IoCartOutline,
  IoGameControllerOutline: IoGameControllerOutline,
  IoBulbOutline: IoBulbOutline,
  IoCashOutline: IoCashOutline
};

const defaultCategories = [
  { id: "1", name: "Salary & Income", budget: 18250000, type: "income", color: "bg-green-600", bgColor: "bg-green-50 text-green-600", iconName: "IoBriefcaseOutline" },
  { id: "2", name: "Food & Beverage", budget: 5000000, type: "outcome", color: "bg-amber-500", bgColor: "bg-amber-50 text-amber-600", iconName: "IoFastFoodOutline" },
  { id: "3", name: "Utilities & Bills", budget: 4000000, type: "outcome", color: "bg-orange-500", bgColor: "bg-orange-50 text-orange-600", iconName: "IoBulbOutline" },
  { id: "4", name: "Shopping", budget: 3000000, type: "outcome", color: "bg-blue", bgColor: "bg-blue/10 text-blue", iconName: "IoCartOutline" },
  { id: "5", name: "Entertainment", budget: 2000000, type: "outcome", color: "bg-purple-500", bgColor: "bg-purple-50 text-purple-600", iconName: "IoGameControllerOutline" }
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
                  <option value="IoCartOutline">Shopping Cart</option>
                  <option value="IoFastFoodOutline">Food & Dining</option>
                  <option value="IoGameControllerOutline">Gaming / Entertain</option>
                  <option value="IoBulbOutline">Utility / Power</option>
                  <option value="IoBriefcaseOutline">Briefcase / Salary</option>
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
