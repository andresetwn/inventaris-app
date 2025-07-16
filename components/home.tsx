import { FiSearch, FiPlus, FiEdit, FiTrash } from "react-icons/fi";
import { FaArrowRight } from "react-icons/fa";

export default function HomeMenu({
  onCari,
  onTambah,
  onEdit,
  onHapus,
  isLoggedIn,
  keyword,
  setKeyword,
  handleSearch,
  onUpdateStok,
}: {
  onCari: () => void;
  onTambah: () => void;
  onEdit: () => void;
  onHapus: () => void;
  onUpdateStok: () => void;
  isLoggedIn: boolean;
  keyword: string;
  setKeyword: (value: string) => void;
  handleSearch: () => void;
}) {
  if (!isLoggedIn) {
    
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-8 text-center mt-20">
          Cari Barang
        </h1>

        <div className="flex w-full max-w-md sm:max-w-xl items-center bg-white rounded-full shadow-lg overflow-hidden">
          <span className="pl-4 text-gray-400 text-xl">
            <FiSearch />
          </span>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Cari kode, kategori, dan nama barang"
            className="flex-grow px-3 py-3 text-sm sm:text-base text-gray-800 bg-transparent focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="bg-black text-white px-4 sm:px-5 py-3 rounded-r-full hover:bg-gray-800"
          >
            <FaArrowRight />
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <div className="flex flex-wrap justify-center gap-4">
        <ActionButton
          color="bg-black"
          icon={<FiSearch size={48} />}
          label="Cari Barang"
          onClick={onCari}
        />
        <ActionButton
          color="bg-gray-800"
          icon={<FiPlus size={48} />}
          label="Tambah Barang"
          onClick={onTambah}
        />
        <ActionButton
          color="bg-gray-600"
          icon={<FiEdit size={48} />}
          label="Edit Barang"
          onClick={onEdit}
        />
        <ActionButton
          color="bg-yellow-600"
          icon={<FiEdit size={48} />}
          label="Update Stok"
          onClick={onUpdateStok}
        />
        <ActionButton
          color="bg-red-700"
          icon={<FiTrash size={48} />}
          label="Hapus Barang"
          onClick={onHapus}
        />
      </div>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  color,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`${color} text-white w-32 h-32 rounded-2xl flex flex-col items-center justify-center shadow-xl hover:scale-105 transition`}
    >
      {icon}
      <span className="mt-3 text-sm font-semibold text-center">{label}</span>
    </button>
  );
}
