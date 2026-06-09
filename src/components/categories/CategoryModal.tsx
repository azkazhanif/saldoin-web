import { useState, useEffect } from "react";
import type { Category, CategoryType } from "../../types/category";
import { iconMap } from "./iconHelper";
import { IoCloseOutline } from "react-icons/io5";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; type: CategoryType; icon: string; color: string }) => void;
  onDelete?: () => void;
  category?: Category | null;
  defaultType: CategoryType;
  existingCategories: Category[];
}

const colorSwatches = [
  "#F59E0B",
  "#3B82F6",
  "#EC4899",
  "#8B5CF6",
  "#EF4444",
  "#10B981",
  "#F97316",
  "#06B6D4",
  "#6B7280",
];

const iconsToDisplay = Object.keys(iconMap);

export const CategoryModal = ({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  category,
  defaultType,
  existingCategories,
}: CategoryModalProps) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<CategoryType>(defaultType);
  const [selectedIcon, setSelectedIcon] = useState("Utensils");
  const [selectedColor, setSelectedColor] = useState("#F59E0B");
  const [isExpanded, setIsExpanded] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isEditMode = !!category;

  useEffect(() => {
    if (isOpen) {
      if (category) {
        setName(category.name);
        setType(category.type);
        setSelectedIcon(category.icon);
        setSelectedColor(category.color);
      } else {
        setName("");
        setType(defaultType);
        setSelectedIcon("Utensils");
        setSelectedColor("#F59E0B");
      }
      setIsExpanded(false);
      setErrorMsg("");
    }
  }, [isOpen, category, defaultType]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMsg("Nama category tidak boleh kosong.");
      return;
    }

    if (trimmedName.length > 30) {
      setErrorMsg("Nama category maksimal 30 karakter.");
      return;
    }

    // Duplicate check
    const isDuplicate = existingCategories.some(
      (c) =>
        c.name.toLowerCase() === trimmedName.toLowerCase() &&
        c.type === type &&
        (!isEditMode || c.id !== category?.id)
    );

    if (isDuplicate) {
      setErrorMsg(
        `Category "${trimmedName}" untuk tipe ${
          type === "expense" ? "Pengeluaran" : "Pemasukan"
        } sudah ada.`
      );
      return;
    }

    onSubmit({
      name: trimmedName,
      type,
      icon: selectedIcon,
      color: selectedColor,
    });
  };

  const visibleIcons = isExpanded ? iconsToDisplay : iconsToDisplay.slice(0, 12);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-md border border-gray-100 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-black font-extrabold text-lg">
              {isEditMode ? "Edit Category" : "Tambah Category"}
            </h3>
            <p className="text-gray-400 text-xs mt-0.5">
              {isEditMode
                ? "Perbarui detail category Anda"
                : "Buat label baru untuk transaksi Anda"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-black cursor-pointer"
          >
            <IoCloseOutline className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {errorMsg && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold px-3 py-2.5 rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* Nama Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500">Nama Category</label>
            <input
              type="text"
              required
              maxLength={30}
              placeholder="cth: Perawatan Hewan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-primary"
            />
          </div>

          {/* Tipe Transaksi */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500">Tipe Transaksi</label>
            <div className="grid grid-cols-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
              <button
                type="button"
                disabled={isEditMode}
                onClick={() => setType("expense")}
                className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  type === "expense"
                    ? "bg-white text-black shadow-xs"
                    : "text-gray-400 hover:text-black"
                } ${isEditMode ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Pengeluaran
              </button>
              <button
                type="button"
                disabled={isEditMode}
                onClick={() => setType("income")}
                className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  type === "income"
                    ? "bg-white text-black shadow-xs"
                    : "text-gray-400 hover:text-black"
                } ${isEditMode ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Pemasukan
              </button>
            </div>
          </div>

          {/* Warna (Swatches) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500">Warna</label>
            <div className="flex flex-wrap gap-2.5">
              {colorSwatches.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className="w-7 h-7 rounded-full cursor-pointer transition-transform hover:scale-110 flex items-center justify-center relative"
                  style={{ backgroundColor: color }}
                >
                  {selectedColor === color && (
                    <div className="absolute inset-0 rounded-full border-2 border-white ring-2 ring-slate-800" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Grid */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500">Icon</label>
            <div className="grid grid-cols-6 gap-2">
              {visibleIcons.map((iconName) => {
                const IconComp = iconMap[iconName];
                const isSelected = selectedIcon === iconName;
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setSelectedIcon(iconName)}
                    className={`aspect-square rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
                      isSelected
                        ? "border-blue bg-gray-50 shadow-xs"
                        : "border-gray-100 hover:border-gray-300 bg-white"
                    }`}
                    style={{ color: isSelected ? selectedColor : "#64748b" }}
                  >
                    <IconComp className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
            {!isExpanded && iconsToDisplay.length > 12 && (
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="text-xs text-blue font-bold mt-1.5 self-start hover:underline cursor-pointer"
              >
                Lihat semua
              </button>
            )}
          </div>

          {/* Footer Modal Actions */}
          <div className="flex justify-between items-center gap-3 mt-4">
            {isEditMode && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-xs"
              >
                Hapus
              </button>
            )}

            <div className="flex gap-2 flex-1 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 hover:bg-gray-100 text-gray-600 rounded-xl font-bold text-xs transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn-primary px-6"
              >
                Simpan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CategoryModal;
