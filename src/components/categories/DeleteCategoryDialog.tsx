import type { Category } from "../../types/category";

interface DeleteCategoryDialogProps {
  category: Category;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export const DeleteCategoryDialog = ({
  category,
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteCategoryDialogProps) => {
  if (!isOpen) return null;

  const hasTransactions = (category.transaction_count || 0) > 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-md border border-gray-100 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
        <div>
          <h3 className="text-black font-extrabold text-lg">Hapus Category</h3>
          <p className="text-gray-400 text-xs mt-0.5">Konfirmasi penghapusan category</p>
        </div>

        <div className="text-sm font-semibold text-black/80 leading-relaxed py-2">
          {hasTransactions ? (
            <span>
              Category <strong className="text-black">"{category.name}"</strong> dipakai oleh{" "}
              <strong className="text-blue">{category.transaction_count}</strong> transaksi. Semua
              transaksi tersebut akan dipindahkan ke category <strong className="text-black">"Lain-lain"</strong>.
              Yakin ingin menghapus?
            </span>
          ) : (
            <span>
              Hapus category <strong className="text-black">"{category.name}"</strong>? Tindakan ini tidak
              bisa dibatalkan.
            </span>
          )}
        </div>

        <div className="flex gap-3 mt-2">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-black hover:bg-gray-50 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-red-600/10 disabled:opacity-50 flex items-center justify-center gap-1"
          >
            {isDeleting ? (
              <span>Menghapus...</span>
            ) : hasTransactions ? (
              <span>Hapus & Pindahkan</span>
            ) : (
              <span>Hapus</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
export default DeleteCategoryDialog;
