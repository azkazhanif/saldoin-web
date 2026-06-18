import MainLayout from "../../layouts/MainLayout";
import { IoAddOutline } from "react-icons/io5";
import { useWallet } from "../../hooks/useWallet";
import { WalletCard } from "../../components/wallet/WalletCard";
import { AddWalletModal } from "../../components/wallet/AddWalletModal";
import { WalletDetailsModal } from "../../components/wallet/WalletDetailsModal";
import { formatRupiah } from "../../lib/formatters";

const Wallet = () => {
  const {
    wallets,
    loading,
    isModalOpen,
    setIsModalOpen,
    selectedWallet,
    setSelectedWallet,
    isDetailOpen,
    setIsDetailOpen,
    isConfirmingDelete,
    setIsConfirmingDelete,
    deleteLoading,
    isEditing,
    setIsEditing,
    newWallet,
    setNewWallet,
    editWallet,
    setEditWallet,
    handleSubmit,
    handleEditSubmit,
    handleDeleteWallet,
  } = useWallet();

  const totalCurrentBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm font-semibold mt-4 animate-pulse">
            Loading wallets...
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <div>
            <h2 className="text-black font-extrabold text-2xl">My Wallet</h2>
            <p className="text-gray-400 text-sm mt-0.5">
              Manage your cards and check balances
            </p>
          </div>
          <div className="flex flex-col sm:items-end">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Balance</span>
            <span className="text-blue font-extrabold text-2xl sm:text-3xl mt-0.5">
              {formatRupiah(totalCurrentBalance)}
            </span>
          </div>
        </div>

        {/* Responsive Grid list of wallets (cols-2 on mobile, cols-3 on desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {wallets.map((wallet) => (
            <WalletCard
              key={wallet.id}
              wallet={wallet}
              onClick={() => {
                setSelectedWallet(wallet);
                setIsConfirmingDelete(false);
                setIsEditing(false);
                setIsDetailOpen(true);
              }}
            />
          ))}

          {/* "+ Add New Wallet" interactive trigger card */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="border-2 border-dashed border-gray-200 hover:border-blue hover:bg-blue/5 rounded-3xl p-6 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer h-44 text-gray-400 hover:text-blue"
          >
            <IoAddOutline className="w-8 h-8" />
            <span className="font-extrabold text-sm">Add New Wallet</span>
          </button>
        </div>
      </div>

      {/* Add Wallet Modal Overlay */}
      <AddWalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        newWallet={newWallet}
        setNewWallet={setNewWallet}
        onSubmit={handleSubmit}
      />

      {/* Wallet Detail Modal Overlay */}
      {selectedWallet && (
        <WalletDetailsModal
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedWallet(null);
          }}
          selectedWallet={selectedWallet}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          editWallet={editWallet}
          setEditWallet={setEditWallet}
          onEditSubmit={handleEditSubmit}
          isConfirmingDelete={isConfirmingDelete}
          setIsConfirmingDelete={setIsConfirmingDelete}
          deleteLoading={deleteLoading}
          onDeleteConfirm={handleDeleteWallet}
        />
      )}
    </MainLayout>
  );
};

export default Wallet;
