import { iconMap } from "../categories/iconHelper";
import { IoAddOutline } from "react-icons/io5";
import { resolveCategoryColor } from "../categories/colorHelper";

interface NoBudgetRowProps {
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  onClick: () => void;
}

export const NoBudgetRow = ({ category, onClick }: NoBudgetRowProps) => {
  const IconComponent = iconMap[category.icon] || iconMap["Gift"];
  const resolvedColor = resolveCategoryColor(category.color);

  return (
    <div
      onClick={onClick}
      className="bg-white border-2 border-dashed border-gray-200 hover:border-blue hover:bg-blue/5 rounded-2xl p-4 flex items-center justify-between gap-4 transition-all duration-300 cursor-pointer select-none"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: `${resolvedColor}15`,
            color: resolvedColor,
          }}
        >
          <IconComponent className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-black font-semibold text-sm sm:text-base leading-tight">
            {category.name}
          </h4>
          <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mt-0.5 block">
            tidak dipantau
          </span>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="py-1.5 px-3 bg-gray-50 hover:bg-blue hover:text-white border border-gray-200/50 rounded-xl font-bold text-xs transition-all flex items-center gap-1 cursor-pointer text-gray-500"
      >
        <IoAddOutline className="w-3.5 h-3.5" />
        <span>Set</span>
      </button>
    </div>
  );
};
export default NoBudgetRow;
