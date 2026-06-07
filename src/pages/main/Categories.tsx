import MainLayout from "../../layouts/MainLayout";
import { 
  IoFastFoodOutline, 
  IoCartOutline, 
  IoGameControllerOutline, 
  IoBulbOutline, 
  IoBriefcaseOutline,
  IoAddOutline
} from "react-icons/io5";

const categoriesData = [
  { id: "1", name: "Salary & Income", spent: 0, budget: 18250000, percentage: 0, type: "income", icon: IoBriefcaseOutline, color: "bg-green-600", bgColor: "bg-green-50 text-green-600" },
  { id: "2", name: "Food & Beverage", spent: 3450000, budget: 5000000, percentage: 69, type: "outcome", icon: IoFastFoodOutline, color: "bg-amber-500", bgColor: "bg-amber-50 text-amber-600" },
  { id: "3", name: "Utilities & Bills", spent: 3050000, budget: 4000000, percentage: 76, type: "outcome", icon: IoBulbOutline, color: "bg-orange-500", bgColor: "bg-orange-50 text-orange-600" },
  { id: "4", name: "Shopping", spent: 2200000, budget: 3000000, percentage: 73, type: "outcome", icon: IoCartOutline, color: "bg-blue", bgColor: "bg-blue/10 text-blue" },
  { id: "5", name: "Entertainment", spent: 1100000, budget: 2000000, percentage: 55, type: "outcome", icon: IoGameControllerOutline, color: "bg-purple-500", bgColor: "bg-purple-50 text-purple-600" },
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
  const expenseCategories = categoriesData.filter(c => c.type === "outcome");

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-black font-extrabold text-2xl">Categories</h2>
            <p className="text-gray-400 text-sm mt-0.5">Manage transaction categories and limits</p>
          </div>
          <button className="py-2.5 px-4 bg-blue hover:bg-blue-600 text-white rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue/10">
            <IoAddOutline className="w-4.5 h-4.5" /> Add Category
          </button>
        </div>

        {/* Categories Bento Box List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {expenseCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div 
                key={category.id} 
                className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-gray-200 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl ${category.bgColor} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-black font-extrabold text-base leading-tight">{category.name}</h3>
                      <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold mt-1">Expense Budget</p>
                    </div>
                  </div>
                  <span className="text-black font-bold text-xs bg-gray-50 border border-gray-100 rounded-full px-3 py-1">
                    {category.percentage}% used
                  </span>
                </div>

                {/* Progress Indicators */}
                <div className="mt-6">
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${category.color}`}
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold mt-3">
                    <span className="text-gray-400">Spent: <b className="text-gray-700">{formatCurrency(category.spent)}</b></span>
                    <span className="text-gray-400">Budget: <b className="text-gray-700">{formatCurrency(category.budget)}</b></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
};

export default Categories;
