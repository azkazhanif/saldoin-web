import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";
import MainLayout from "../../layouts/MainLayout";
import { CategoryModal } from "../../components/categories/CategoryModal";
import { DeleteCategoryDialog } from "../../components/categories/DeleteCategoryDialog";
import type { Category, CategoryType } from "../../types/category";
import { IoAddOutline, IoInformationCircleOutline } from "react-icons/io5";
import { iconMap } from "../../components/categories/iconHelper";

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

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

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

  // Pagination calculation
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const safeCurrentPage = Math.min(currentPage, Math.max(totalPages, 1));
  const paginatedCategories = categories.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

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

        {/* Categories List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[250px]">
            <div className="w-8 h-8 border-4 border-[#1A6B3C] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 text-xs font-semibold mt-3 animate-pulse">
              Memuat categories...
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase tracking-wider bg-gray-50/50">
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Tipe</th>
                    <th className="py-4 px-6 text-center">Transaksi</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {paginatedCategories.map((cat) => {
                    const IconComponent = iconMap[cat.icon] || iconMap["Gift"];
                    return (
                      <tr key={cat.id} className="hover:bg-gray-50/30 transition-colors">
                        {/* Column 1: Icon & Name */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{
                                backgroundColor: `${cat.color}15`,
                                color: cat.color,
                              }}
                            >
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <span className="font-extrabold text-black">{cat.name}</span>
                          </div>
                        </td>

                        {/* Column 2: Type badge */}
                        <td className="py-4 px-6">
                          {cat.type === "expense" ? (
                            <span className="text-[10px] bg-red-50 border border-red-100/50 text-red-600 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                              Pengeluaran
                            </span>
                          ) : (
                            <span className="text-[10px] bg-emerald-50 border border-emerald-100/50 text-emerald-600 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                              Pemasukan
                            </span>
                          )}
                        </td>

                        {/* Column 3: Transaction Count */}
                        <td className="py-4 px-6 text-center text-gray-500 font-bold">
                          {cat.transaction_count || 0}
                        </td>

                        {/* Column 4: Status Badge (Default or Custom) */}
                        <td className="py-4 px-6">
                          {cat.is_default ? (
                            <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-500 font-bold px-2 py-0.5 rounded-md">
                              Default
                            </span>
                          ) : (
                            <span className="text-[10px] bg-blue-50 border border-blue-100 text-blue-600 font-bold px-2 py-0.5 rounded-md">
                              Custom
                            </span>
                          )}
                        </td>

                        {/* Column 5: Edit/Delete Actions */}
                        <td className="py-4 px-6 text-right">
                          {cat.is_default ? (
                            <span className="text-gray-400 text-xs font-semibold cursor-not-allowed select-none" title="Category default tidak dapat diubah">
                              Terkunci
                            </span>
                          ) : (
                            <button
                              onClick={() => handleOpenEditModal(cat)}
                              className="text-blue hover:text-blue-600 text-xs font-extrabold cursor-pointer transition-colors"
                            >
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {paginatedCategories.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-400 font-semibold text-sm">
                        Tidak ada category ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 bg-gray-50/20 text-xs">
                <span className="text-gray-400 font-bold">
                  Showing {Math.min((safeCurrentPage - 1) * itemsPerPage + 1, categories.length)} to{" "}
                  {Math.min(safeCurrentPage * itemsPerPage, categories.length)} of {categories.length} entries
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={safeCurrentPage === 1}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-black font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center border ${
                        safeCurrentPage === page
                          ? "bg-[#1A6B3C] border-[#1A6B3C] text-white"
                          : "border-gray-200 hover:bg-gray-50 text-black"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={safeCurrentPage === totalPages}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-black font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
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
