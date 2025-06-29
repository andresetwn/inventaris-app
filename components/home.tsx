import { FiSearch, FiPlus, FiEdit, FiTrash } from "react-icons/fi";

export default function HomeMenu({
  onCari,
  onTambah,
  onEdit,
  onHapus,
}: {
  onCari: () => void;
  onTambah: () => void;
  onEdit: () => void;
  onHapus: () => void;
}) {
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
