import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";
import MainLayout from "../../layouts/MainLayout";
import { CategoryCard } from "../../components/categories/CategoryCard";
import { CategoryModal } from "../../components/categories/CategoryModal";
import { DeleteCategoryDialog } from "../../components/categories/DeleteCategoryDialog";
import type { Category, CategoryType } from "../../types/category";
import { IoAddOutline, IoInformationCircleOutline } from "react-icons/io5";

export const Categories = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<CategoryType>("expense");

  // Modal / Dialog States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const dbType = activeTab === "expense" ? "outcome" : "income";

      const { data, error } = await supabase
        .from("categories")
        .select(`
          *,
          transaction_count:transactions(count)
        `)
        .or(`user_id.is.null,user_id.eq.${user.id}`)
        .eq("type", dbType)
        .order("is_default", { ascending: false })
        .order("sort_order");

      if (error) throw error;

      const mappedCats: Category[] = (data || []).map((cat) => ({
        id: cat.id,
        user_id: cat.user_id,
        name: cat.name,
        icon: cat.icon || "Gift",
        color: cat.color || "#6B7280",
        type: cat.type === "outcome" ? "expense" : "income",
        is_default: cat.is_default || false,
        sort_order: cat.sort_order || 0,
        created_at: cat.created_at,
        updated_at: cat.updated_at,
        transaction_count: cat.transaction_count?.[0]?.count || 0,
      }));

      setCategories(mappedCats);
    } catch (err) {
      console.error("Error loading categories data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user, activeTab]);

  const handleOpenAddModal = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setSelectedCategory(cat);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleModalSubmit = async (formData: {
    name: string;
    type: CategoryType;
    icon: string;
    color: string;
  }) => {
    if (!user) return;

    try {
      const dbType = formData.type === "expense" ? "outcome" : "income";

      if (selectedCategory) {
        // Edit Mode
        const { error } = await supabase
          .from("categories")
          .update({
            name: formData.name,
            icon: formData.icon,
            color: formData.color,
            updated_at: new Date().toISOString(),
          })
          .eq("id", selectedCategory.id)
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        // Add Mode
        const { error } = await supabase.from("categories").insert({
          user_id: user.id,
          name: formData.name,
          icon: formData.icon,
          color: formData.color,
          type: dbType,
          is_default: false,
          sort_order: 10,
        });

        if (error) throw error;
      }

      handleModalClose();
      await loadData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Gagal menyimpan category.");
    }
  };

  const handleDeleteClick = () => {
    setIsModalOpen(false);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!user || !selectedCategory) return;
    setIsDeleting(true);

    try {
      const dbType = selectedCategory.type === "expense" ? "outcome" : "income";

      const { data: fallbackCat, error: fallbackError } = await supabase
        .from("categories")
        .select("id")
        .or(`user_id.is.null,user_id.eq.${user.id}`)
        .eq("name", "Lain-lain")
        .eq("type", dbType)
        .limit(1)
        .maybeSingle();

      if (fallbackError) throw fallbackError;

      const transactionCount = selectedCategory.transaction_count || 0;
      if (transactionCount > 0 && fallbackCat) {
        const { error: updateError } = await supabase
          .from("transactions")
          .update({ category_id: fallbackCat.id })
          .eq("category_id", selectedCategory.id)
          .eq("user_id", user.id);

        if (updateError) throw updateError;
      }

      const { error: deleteError } = await supabase
        .from("categories")
        .delete()
        .eq("id", selectedCategory.id)
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;

      setIsDeleteOpen(false);
      setSelectedCategory(null);
      await loadData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Gagal menghapus category.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-black font-extrabold text-2xl">Categories</h2>
            <p className="text-gray-400 text-sm mt-0.5">Kelola label untuk transaksi kamu</p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="py-2.5 px-4 bg-[#1A6B3C] hover:bg-[#1A6B3C]/95 text-white rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#1A6B3C]/10 self-start sm:self-auto"
          >
            <IoAddOutline className="w-4.5 h-4.5" /> Tambah category
          </button>
        </div>

        {/* Info Callout */}
        <div className="bg-blue-50/50 border border-blue-100/50 rounded-2xl p-4 flex items-start gap-3 text-blue-800">
          <IoInformationCircleOutline className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs font-semibold leading-relaxed">
            Category adalah label untuk transaksi. Untuk mengatur batas pengeluaran per category, buka{" "}
            <a href="/budget" className="underline font-bold text-blue-700 hover:text-blue-900">
              halaman Budget
            </a>
            .
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-50 border border-gray-200/50 p-1 rounded-xl self-start">
          <button
            onClick={() => setActiveTab("expense")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "expense"
                ? "bg-white text-black shadow-xs"
                : "text-gray-400 hover:text-black"
            }`}
          >
            Pengeluaran
          </button>
          <button
            onClick={() => setActiveTab("income")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "income"
                ? "bg-white text-black shadow-xs"
                : "text-gray-400 hover:text-black"
            }`}
          >
            Pemasukan
          </button>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[250px]">
            <div className="w-8 h-8 border-4 border-[#1A6B3C] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 text-xs font-semibold mt-3 animate-pulse">
              Memuat categories...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} onClick={() => handleOpenEditModal(cat)} />
            ))}

            {/* "+ Tambah Baru" Card */}
            <button
              onClick={handleOpenAddModal}
              className="border border-dashed border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer min-h-[120px] text-gray-400 hover:text-gray-600"
            >
              <IoAddOutline className="w-6 h-6" />
              <span className="font-bold text-[13px]">Tambah baru</span>
            </button>
          </div>
        )}

        {/* Notes */}
        <div className="mt-4 space-y-1 text-gray-400 text-[11px] font-medium leading-relaxed">
          <p>• Category berlabel "Default" tidak bisa dihapus, hanya bisa disembunyikan</p>
          <p>• Menghapus category custom akan memindahkan transaksinya ke "Lain-lain"</p>
          <p>• Untuk mengatur budget per category, buka halaman Budget</p>
        </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        onDelete={handleDeleteClick}
        category={selectedCategory}
        defaultType={activeTab}
        existingCategories={categories}
      />

      {/* Delete Confirmation Dialog */}
      {selectedCategory && (
        <DeleteCategoryDialog
          category={selectedCategory}
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDeleteConfirm}
          isDeleting={isDeleting}
        />
      )}
      </div>
    </MainLayout>
  );
};

export default Categories;
